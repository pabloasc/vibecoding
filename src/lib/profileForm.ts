/**
 * Client-side helpers for the shared <ProfileFields /> form and <ProfileCard /> markup.
 */
import type { Profile, Project } from './profile';
import { lookingFor, endorsementCount, locationLabel, initials, isNew, formatDate, profileName, profileHeadline } from './profile';
import { profileSlug } from './slug';

const $ = <T extends HTMLElement = HTMLInputElement>(id: string) => document.getElementById(id) as T;

export type ProfileFieldValues = Omit<Profile, 'id' | 'created_at' | 'image_url' | 'user_id'>;

export function readProfileFields(): ProfileFieldValues {
  return {
    name:            $('name').value.trim(),
    title:           $('title').value.trim(),
    description:     $<HTMLTextAreaElement>('description').value.trim(),
    link:            $('link').value.trim(),
    employment_type: document.querySelector<HTMLInputElement>('input[name="employment_type"]:checked')?.value ?? 'FULL_TIME',
    is_remote:       $('is-remote').checked,
    locations:       $('locations').value.split(',').map(s => s.trim()).filter(Boolean),
  };
}

/** Returns an error message, or null when the required fields are filled in */
export function validateProfileFields(v: ProfileFieldValues): string | null {
  if (!v.name)        return 'Add your name so mentors know who they\'re talking to.';
  if (!v.title)       return 'Add a headline — what you build, in a few words.';
  if (!v.description) return 'Tell mentors a bit about yourself.';
  if (!v.link)        return 'Profile URL is required — link your GitHub, portfolio or LinkedIn.';
  try { new URL(v.link); } catch { return 'Profile URL should be a full link, e.g. https://github.com/you'; }
  return null;
}

export function fillProfileFields(p: Profile) {
  $('name').value = profileName(p);
  $('title').value = profileHeadline(p) || p.title;
  $<HTMLTextAreaElement>('description').value = p.description;
  $('link').value = p.link;
  const radio = document.querySelector<HTMLInputElement>(`input[name="employment_type"][value="${p.employment_type ?? 'FULL_TIME'}"]`);
  if (radio) radio.checked = true;
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
      link:        item.querySelector<HTMLInputElement>('.project-link')!.value.trim(),
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
