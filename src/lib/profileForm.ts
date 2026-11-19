/**
 * Client-side helpers for the shared <ProfileFields /> form and <ProfileCard /> markup.
 */
import type { Profile, Project } from './profile';
import { lookingFor, endorsementCount, locationLabel, initials, isNew, formatDate, profileName, profileHeadline } from './profile';
import { profileSlug } from './slug';

const $ = <T extends HTMLElement = HTMLInputElement>(id: string) => document.getElementById(id) as T;

export type ProfileFieldValues = Omit<Profile, 'id' | 'created_at' | 'image_url' | 'user_id'>;

/** "linkedin.com/in/you" → "https://linkedin.com/in/you" — nobody should have to type https:// */
export function normalizeUrl(raw: string) {
  const v = raw.trim();
  if (!v || /^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  return `https://${v}`;
}

export function readProfileFields(): ProfileFieldValues {
  return {
    name:            $('name').value.trim(),
    title:           $('title').value.trim(),
    description:     $<HTMLTextAreaElement>('description').value.trim(),
    link:            normalizeUrl($('link').value),
    employment_type: document.querySelector<HTMLInputElement>('input[name="employment_type"]:checked')?.value ?? 'FULL_TIME',
    is_remote:       $('is-remote').checked,
    locations:       $('locations').value.split(',').map(s => s.trim()).filter(Boolean),
  };
}

/** The 4 fields needed to publish, in form order (ids match <ProfileFields />) */
export const REQUIRED_FIELDS = [
  { id: 'name',        label: 'Your name' },
  { id: 'title',       label: 'Headline' },
  { id: 'description', label: 'About you' },
  { id: 'link',        label: 'Profile URL' },
] as const;

/** First problem with the required fields ({ field id, message }), or null when ready to publish */
export function profileFieldError(v: ProfileFieldValues): { field: string; message: string } | null {
  if (!v.name)        return { field: 'name',        message: 'Add your name so people know who they\'re talking to.' };
  if (!v.title)       return { field: 'title',       message: 'Add a headline — what you build, in a few words.' };
  if (!v.description) return { field: 'description', message: 'Tell the community a bit about yourself — the template button helps.' };
  if (!v.link)        return { field: 'link',        message: 'Add your LinkedIn or GitHub link so people can connect with you.' };
  try { new URL(v.link); } catch { return { field: 'link', message: 'That profile link doesn\'t look right — e.g. linkedin.com/in/you' }; }
  return null;
}

/** Returns an error message, or null when the required fields are filled in */
export function validateProfileFields(v: ProfileFieldValues): string | null {
  return profileFieldError(v)?.message ?? null;
}

/** Highlight a field that needs attention and bring it into view; cleared as soon as they type */
export function flagField(id: string) {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!el) return;
  el.setAttribute('aria-invalid', 'true');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus({ preventScroll: true });
  el.addEventListener('input', () => el.removeAttribute('aria-invalid'), { once: true });
}

/**
 * Live "To publish" checklist (#publish-checklist li[data-field]) and the status line by the
 * publish button (#publish-status). Returns how many required fields are still empty.
 */
export function updatePublishChecklist() {
  const missing: string[] = [];
  for (const f of REQUIRED_FIELDS) {
    const done = !!(document.getElementById(f.id) as HTMLInputElement | null)?.value.trim();
    if (!done) missing.push(f.label);
    const li = document.querySelector<HTMLElement>(`#publish-checklist [data-field="${f.id}"]`);
    if (li) li.dataset.done = String(done);
  }
  const status = document.getElementById('publish-status');
  if (status) {
    status.textContent = missing.length
      ? `${missing.length} to go: ${missing.join(', ')}`
      : '✓ All set — you can publish now';
    status.classList.toggle('text-acid', missing.length === 0);
    status.classList.toggle('text-fog', missing.length > 0);
  }
  return missing.length;
}

export function fillProfileFields(p: Profile) {
  $('name').value = profileName(p);
  $('title').value = profileHeadline(p) || p.title;
  $<HTMLTextAreaElement>('description').value = p.description;
  $('link').value = p.link;
  const radio = document.querySelector<HTMLInputElement>(`input[name="employment_type"][value="${p.employment_type ?? 'FULL_TIME'}"]`);
  if (radio) {
    radio.checked = true;
    radio.closest('label')?.classList.remove('hidden');   // reveal a legacy option (e.g. Mentor) this profile uses
  }
  $('is-remote').checked = p.is_remote !== false;
  $('locations').value = (p.locations ?? []).join(', ');
}

/** The signed-in builder's own profile, if they have one */
export async function fetchOwnProfile(userId: string, supabaseUrl: string, anonKey: string): Promise<Profile | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/jobs?user_id=eq.${encodeURIComponent(userId)}&select=*&order=created_at.desc&limit=1`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    if (!res.ok) return null;
    const rows: Profile[] = await res.json();
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Upload an image (avatar or project logo) to the public storage bucket and return its public URL */
export async function uploadAvatar(file: File, supabaseUrl: string, anonKey: string, token: string) {
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be smaller than 5 MB.');
  const ext = file.name.split('.').pop();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const res = await fetch(`${supabaseUrl}/storage/v1/object/job-images/${filename}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type,
      'x-upsert': 'false',
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || 'Image upload failed.');
  }
  return `${supabaseUrl}/storage/v1/object/public/job-images/${filename}`;
}

/**
 * Copy a remote image (e.g. a LinkedIn/Google profile photo) into our storage bucket.
 * LinkedIn photo URLs expire, so a copy keeps profiles from showing broken images later.
 * Falls back to the original URL if the provider doesn't allow the download.
 */
export async function persistRemoteImage(url: string, supabaseUrl: string, anonKey: string, token: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;
    const blob = await res.blob();
    if (!blob.type.startsWith('image/')) return url;
    const ext = blob.type.split('/')[1]?.split('+')[0] || 'jpg';
    return await uploadAvatar(new File([blob], `photo.${ext}`, { type: blob.type }), supabaseUrl, anonKey, token);
  } catch {
    return url;
  }
}

// ── Import from LinkedIn / Google (top of <ProfileFields />) ──

type ImportedFields = { provider: string; name: string | null; avatarUrl: string | null };

/**
 * Fill name + photo from an imported LinkedIn/Google profile.
 * `overwrite` replaces what's already typed (used when the member clicks "Import").
 * `setAvatar` is page-specific (submit and edit manage the avatar differently).
 * Returns what was filled, e.g. ['name', 'photo'].
 */
export function applyImportedProfile(
  imp: ImportedFields,
  opts: { overwrite: boolean; setAvatar: (url: string, overwrite: boolean) => boolean },
) {
  const filled: string[] = [];
  const nameInput = $('name');
  if (imp.name && (opts.overwrite || !nameInput.value.trim())) {
    nameInput.value = imp.name;
    filled.push('name');
  }
  if (imp.avatarUrl && opts.setAvatar(imp.avatarUrl, opts.overwrite)) filled.push('photo');
  if (filled.length) nameInput.form?.dispatchEvent(new Event('input', { bubbles: true }));
  return filled;
}

/** Friendly status line under the import buttons */
export function showImportStatus(message: string, tone: 'success' | 'error' = 'success') {
  const el = $('import-status');
  el.textContent = message;
  el.classList.remove('hidden', 'text-acid', 'text-pink');
  el.classList.add(tone === 'success' ? 'text-acid' : 'text-pink');
}

/** "✨ We filled in your name and photo from LinkedIn" */
export function importedMessage(filled: string[], providerLabel: string) {
  const what = filled.map(f => (f === 'photo' ? 'photo' : 'name')).join(' and ');
  return `✨ We filled in your ${what} from ${providerLabel}. Now add a headline and what you've built.`;
}

/** Wire the "Import from …" buttons; the page decides what importing means */
export function onImportClick(handler: (provider: string, button: HTMLButtonElement) => void) {
  document.querySelectorAll<HTMLButtonElement>('[data-import-provider]').forEach(btn => {
    btn.addEventListener('click', () => handler(btn.dataset.importProvider!, btn));
  });
}

/** "✨ Start from a template" for the About field — LinkedIn/Google don't share profile text */
export function initAboutTemplate() {
  const btn = document.getElementById('about-template');
  const about = $<HTMLTextAreaElement>('description');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (about.value.trim() && !confirm('Replace what you wrote with the template?')) return;
    const first = $('name').value.trim().split(/\s+/)[0];
    about.value = [
      `Hi, I'm ${first || '…'}! 👋 I build with [your tools, e.g. Cursor, Claude Code, React, Supabase].`,
      '',
      'Recently I shipped [a project you are proud of] — [what it does and who uses it].',
      '',
      "I'm looking for [a first job / freelance work / an internship] where I can [what you want to learn or do next].",
    ].join('\n');
    about.focus();
    about.setSelectionRange(about.value.indexOf('['), about.value.indexOf(']') + 1);   // select the first blank to fill in
    about.form?.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

// ── Projects editor (section 03 of <ProfileFields />) ─────────

type ProjectDraft = {
  id: string | null;          // null for projects not saved yet
  title: string;
  description: string;
  link: string;
  image_url: string | null;   // current logo
  file: File | null;          // new logo picked in this session
};

const projectFiles = new WeakMap<HTMLElement, File>();
const projectImages = new WeakMap<HTMLElement, string | null>();
let removedProjectIds: string[] = [];

function setProjectLogo(item: HTMLElement, src: string | null) {
  const logo = item.querySelector<HTMLElement>('.project-logo')!;
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = 'w-full h-full object-cover';
    logo.replaceChildren(img);
  } else {
    logo.textContent = '+ logo';
  }
}

/** Append a project editor, optionally prefilled with a saved project */
export function addProjectItem(project?: Project) {
  const list = $<HTMLElement>('projects-list');
  const frag = ($<HTMLTemplateElement>('tpl-project')).content.cloneNode(true) as DocumentFragment;
  const item = frag.querySelector<HTMLElement>('.project-item')!;

  if (project) {
    item.dataset.projectId = project.id;
    item.querySelector<HTMLInputElement>('.project-title')!.value = project.title;
    item.querySelector<HTMLInputElement>('.project-link')!.value = project.link ?? '';
    item.querySelector<HTMLTextAreaElement>('.project-description')!.value = project.description ?? '';
    projectImages.set(item, project.image_url);
    setProjectLogo(item, project.image_url);
  }

  item.querySelector<HTMLInputElement>('.project-file')!.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    projectFiles.set(item, file);
    const reader = new FileReader();
    reader.onload = () => setProjectLogo(item, reader.result as string);
    reader.readAsDataURL(file);
  });

  item.querySelector('.project-remove')!.addEventListener('click', () => {
    if (item.dataset.projectId) removedProjectIds.push(item.dataset.projectId);
    item.remove();
    if (!list.querySelector('.project-item')) addProjectItem();
  });

  list.appendChild(frag);
  return item;
}

/** Wire up "+ Add a project" and render saved projects (or one empty editor) */
export function initProjectEditor(projects: Project[] = []) {
  const list = $<HTMLElement>('projects-list');
  list.textContent = '';
  removedProjectIds = [];
  if (projects.length) projects.forEach(p => addProjectItem(p));
  else addProjectItem();

  const addBtn = $<HTMLButtonElement>('add-project');
  if (!addBtn.dataset.wired) {
    addBtn.dataset.wired = 'true';
    addBtn.addEventListener('click', () => {
      addProjectItem().querySelector<HTMLInputElement>('.project-title')!.focus();
    });
  }
}

/** Project editors in order, skipping ones left completely empty */
export function readProjects(): ProjectDraft[] {
  return Array.from(document.querySelectorAll<HTMLElement>('#projects-list .project-item'))
    .map(item => ({
      id:          item.dataset.projectId ?? null,
      title:       item.querySelector<HTMLInputElement>('.project-title')!.value.trim(),
      description: item.querySelector<HTMLTextAreaElement>('.project-description')!.value.trim(),
      link:        normalizeUrl(item.querySelector<HTMLInputElement>('.project-link')!.value),
      image_url:   projectImages.get(item) ?? null,
      file:        projectFiles.get(item) ?? null,
    }))
    .filter(d => d.id || d.title || d.description || d.link || d.file);
}

export function validateProjects(drafts: ProjectDraft[]): string | null {
  for (const [i, d] of drafts.entries()) {
    if (!d.title) return `Project ${i + 1} needs a name.`;
    if (d.link) {
      try { new URL(d.link); } catch { return `The link for "${d.title}" should be a full URL, e.g. https://myproject.app`; }
    }
    if (d.file && d.file.size > 5 * 1024 * 1024) return `The logo for "${d.title}" must be smaller than 5 MB.`;
  }
  return null;
}

/** Create, update and delete a profile's projects to match the editor */
export async function saveProjects(profileId: string, drafts: ProjectDraft[], supabaseUrl: string, anonKey: string, token: string) {
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  };
  const check = async (res: Response, what: string) => {
    if (res.ok) return;
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Couldn't ${what} your projects.`);
  };

  if (removedProjectIds.length) {
    const ids = removedProjectIds.map(encodeURIComponent).join(',');
    await check(await fetch(`${supabaseUrl}/rest/v1/projects?id=in.(${ids})`, { method: 'DELETE', headers }), 'remove');
    removedProjectIds = [];
  }

  const rows = await Promise.all(drafts.map(async (d, position) => ({
    id: d.id,
    title: d.title,
    description: d.description || null,
    link: d.link || null,
    image_url: d.file ? await uploadAvatar(d.file, supabaseUrl, anonKey, token) : d.image_url,
    position,
  })));

  for (const { id, ...row } of rows.filter(r => r.id)) {
    await check(await fetch(`${supabaseUrl}/rest/v1/projects?id=eq.${encodeURIComponent(id!)}`, {
      method: 'PATCH', headers, body: JSON.stringify(row),
    }), 'update');
  }

  const created = rows.filter(r => !r.id).map(({ id: _id, ...row }) => ({ ...row, profile_id: profileId }));
  if (created.length) {
    await check(await fetch(`${supabaseUrl}/rest/v1/projects`, {
      method: 'POST', headers, body: JSON.stringify(created),
    }), 'save');
  }
}

/** Saved projects for a profile, in display order (empty if the projects table doesn't exist yet) */
export async function fetchProjects(profileId: string, supabaseUrl: string, anonKey: string): Promise<Project[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/projects?profile_id=eq.${encodeURIComponent(profileId)}&select=*&order=position`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

// ── <ProfileCard /> filling ──────────────────────────────────

function chip(text: string, extra = '') {
  const el = document.createElement('span');
  el.className = `chip ${extra}`.trim();
  el.textContent = text;
  return el;
}

function fillAvatar(wrap: HTMLElement, imageUrl: string | null, name: string) {
  wrap.textContent = '';
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover';
    img.onerror = () => { wrap.textContent = initials(name); };
    wrap.appendChild(img);
  } else {
    wrap.textContent = initials(name);
  }
}

/** Fill an (empty or previously filled) .p-card element with a profile */
export function fillCard(card: HTMLElement, p: Profile) {
  const want = lookingFor(p.employment_type);
  const name = profileName(p);
  const headline = profileHeadline(p);

  card.dataset.createdAt = p.created_at;
  card.querySelector('.p-name')!.textContent = name;
  const titleEl = card.querySelector('.p-title')!;
  titleEl.textContent = headline;
  titleEl.classList.toggle('hidden', !headline);
  card.querySelector('.p-want')!.textContent = `${want.emoji} ${want.label}`;
  card.querySelector('.p-desc')!.textContent = p.description;
  card.querySelector('.p-date')!.textContent = `Joined ${formatDate(p.created_at)}`;
  const cardLink = card.querySelector<HTMLAnchorElement>('.p-card-link')!;
  cardLink.href = `/profile/${profileSlug(p)}/`;
  cardLink.setAttribute('aria-label', `View ${name}'s profile`);
  card.querySelector('.p-new')!.classList.toggle('hidden', !isNew(p.created_at));
  fillAvatar(card.querySelector<HTMLElement>('.p-avatar')!, p.image_url, name);

  const tags = card.querySelector('.p-tags')!;
  const loc  = locationLabel(p);
  tags.textContent = '';
  const endorsed = endorsementCount(p);
  if (endorsed > 0) tags.appendChild(chip(`⭐ ${endorsed} endorsement${endorsed !== 1 ? 's' : ''}`, 'chip-acid'));
  if (p.is_remote === true) tags.appendChild(chip('🌍 Open to remote'));
  if (loc)  tags.appendChild(chip(`📍 ${loc}`));
}
