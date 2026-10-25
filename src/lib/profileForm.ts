/**
 * Client-side helpers for the shared <ProfileFields /> form and <ProfileCard /> markup.
 */
import type { Profile } from './profile';
import { lookingFor, formatRate, locationLabel, initials, isNew, formatDate } from './profile';
import { profileSlug } from './slug';

const $ = <T extends HTMLElement = HTMLInputElement>(id: string) => document.getElementById(id) as T;

export type ProfileFieldValues = Omit<Profile, 'id' | 'created_at' | 'image_url'>;

export function readProfileFields(): ProfileFieldValues {
  const salaryMinRaw = $('salary-min').value.trim();
  const salaryMaxRaw = $('salary-max').value.trim();
  const salary_min = salaryMinRaw ? parseInt(salaryMinRaw, 10) : null;
  const salary_max = salaryMaxRaw ? parseInt(salaryMaxRaw, 10) : null;
  const hasRate = salary_min != null || salary_max != null;

  return {
    title:           $('title').value.trim(),
    description:     $<HTMLTextAreaElement>('description').value.trim(),
    link:            $('link').value.trim(),
    employment_type: document.querySelector<HTMLInputElement>('input[name="employment_type"]:checked')?.value ?? 'FULL_TIME',
    is_remote:       $('is-remote').checked,
    locations:       $('locations').value.split(',').map(s => s.trim()).filter(Boolean),
    salary_min,
    salary_max,
    salary_currency: hasRate ? $<HTMLSelectElement>('salary-currency').value : null,
    salary_period:   hasRate ? $<HTMLSelectElement>('salary-period').value : null,
    valid_through:   $('valid-through').value || null,
  };
}

/** Returns an error message, or null when the required fields are filled in */
export function validateProfileFields(v: ProfileFieldValues): string | null {
  if (!v.title)       return 'Add a headline — your name and what you build.';
  if (!v.description) return 'Tell mentors a bit about yourself.';
  if (!v.link)        return 'Profile URL is required — link your GitHub, portfolio or LinkedIn.';
  try { new URL(v.link); } catch { return 'Profile URL should be a full link, e.g. https://github.com/you'; }
  return null;
}

export function fillProfileFields(p: Profile) {
  $('title').value = p.title;
  $<HTMLTextAreaElement>('description').value = p.description;
  $('link').value = p.link;
  const radio = document.querySelector<HTMLInputElement>(`input[name="employment_type"][value="${p.employment_type ?? 'FULL_TIME'}"]`);
  if (radio) radio.checked = true;
  $('is-remote').checked = p.is_remote !== false;
  $('locations').value = (p.locations ?? []).join(', ');
  if (p.salary_min != null) $('salary-min').value = String(p.salary_min);
  if (p.salary_max != null) $('salary-max').value = String(p.salary_max);
  if (p.salary_currency) $<HTMLSelectElement>('salary-currency').value = p.salary_currency;
  if (p.salary_period)   $<HTMLSelectElement>('salary-period').value = p.salary_period;
  if (p.valid_through)   $('valid-through').value = p.valid_through;
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

function fillAvatar(wrap: HTMLElement, p: Pick<Profile, 'image_url' | 'title'>) {
  wrap.textContent = '';
  if (p.image_url) {
    const img = document.createElement('img');
    img.src = p.image_url;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover';
    img.onerror = () => { wrap.textContent = initials(p.title); };
    wrap.appendChild(img);
  } else {
    wrap.textContent = initials(p.title);
  }
}

/** Fill an (empty or previously filled) .p-card element with a profile */
export function fillCard(card: HTMLElement, p: Profile) {
  const want = lookingFor(p.employment_type);

  card.dataset.createdAt = p.created_at;
  card.querySelector('.p-title')!.textContent = p.title;
  card.querySelector('.p-want')!.textContent = `${want.emoji} ${want.label}`;
  card.querySelector('.p-desc')!.textContent = p.description;
  card.querySelector('.p-date')!.textContent = `Joined ${formatDate(p.created_at)}`;
  card.querySelector<HTMLAnchorElement>('.p-link')!.href = p.link;
  const cardLink = card.querySelector<HTMLAnchorElement>('.p-card-link')!;
  cardLink.href = `/profile/${profileSlug(p.id, p.title)}/`;
  cardLink.setAttribute('aria-label', `View ${p.title}`);
  card.querySelector('.p-new')!.classList.toggle('hidden', !isNew(p.created_at));
  fillAvatar(card.querySelector<HTMLElement>('.p-avatar')!, p);

  const tags = card.querySelector('.p-tags')!;
  const loc  = locationLabel(p);
  const rate = formatRate(p);
  tags.textContent = '';
  if (p.is_remote === true) tags.appendChild(chip('🌍 Open to remote'));
  if (loc)  tags.appendChild(chip(`📍 ${loc}`));
  if (rate) tags.appendChild(chip(rate, 'chip-violet'));
}
