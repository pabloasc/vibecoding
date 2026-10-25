/**
 * Client-side helpers for the shared <ProfileFields /> form and <ProfileCard /> markup.
 */
import type { Profile } from './profile';
import { lookingFor, locationLabel, initials, isNew, formatDate, profileName, profileHeadline } from './profile';
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
    valid_through:   $('valid-through').value || null,
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
  if (p.valid_through)   $('valid-through').value = p.valid_through;
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

/** Upload an avatar to the public storage bucket and return its public URL */
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
  card.querySelector<HTMLAnchorElement>('.p-link')!.href = p.link;
  const cardLink = card.querySelector<HTMLAnchorElement>('.p-card-link')!;
  cardLink.href = `/profile/${profileSlug(p)}/`;
  cardLink.setAttribute('aria-label', `View ${name}'s profile`);
  card.querySelector('.p-new')!.classList.toggle('hidden', !isNew(p.created_at));
  fillAvatar(card.querySelector<HTMLElement>('.p-avatar')!, p.image_url, name);

  const tags = card.querySelector('.p-tags')!;
  const loc  = locationLabel(p);
  tags.textContent = '';
  if (p.is_remote === true) tags.appendChild(chip('🌍 Open to remote'));
  if (loc)  tags.appendChild(chip(`📍 ${loc}`));
}
