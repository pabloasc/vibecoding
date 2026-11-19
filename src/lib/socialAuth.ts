/**
 * Sign in with LinkedIn / Google (Supabase OAuth) and import name + photo from them.
 *
 * What the providers share: name, profile photo and email. LinkedIn does not expose
 * headline, "About" or work history to regular apps, and Google has no profile text.
 *
 * Setup (Supabase dashboard): enable the "LinkedIn (OIDC)" and "Google" providers,
 * add the site to Authentication → URL Configuration → Redirect URLs, and turn on
 * "Allow manual linking" so email users can connect LinkedIn/Google to import.
 */
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type SocialProvider = 'linkedin_oidc' | 'google';

export const SOCIAL_PROVIDERS: Record<SocialProvider, { label: string }> = {
  linkedin_oidc: { label: 'LinkedIn' },
  google:        { label: 'Google' },
};

export function isSocialProvider(value: string | null | undefined): value is SocialProvider {
  return !!value && value in SOCIAL_PROVIDERS;
}

/** The current page (keeping ?next=…), optionally with extra query params, for the OAuth redirect */
function returnUrl(extra: Record<string, string> = {}) {
  const url = new URL(window.location.href);
  url.hash = '';
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);
  return url.toString();
}

/** Sign up / sign in in one click. Comes back to this page signed in. */
export function signInWith(provider: SocialProvider) {
  return supabase.auth.signInWithOAuth({ provider, options: { redirectTo: returnUrl() } });
}

/**
 * Connect LinkedIn/Google to the signed-in account, then come back with ?import=<provider>
 * so the page can fill in name + photo. Requires "Allow manual linking" in Supabase.
 */
export function connectToImport(provider: SocialProvider) {
  return supabase.auth.linkIdentity({ provider, options: { redirectTo: returnUrl({ import: provider }) } });
}

export type ImportedProfile = {
  provider: SocialProvider;
  name: string | null;
  avatarUrl: string | null;
};

/** Name + photo from the user's LinkedIn/Google identity (a specific one, or the first found) */
export function importedProfile(user: User, provider?: SocialProvider): ImportedProfile | null {
  const identity = (user.identities ?? []).find(i =>
    provider ? i.provider === provider : isSocialProvider(i.provider)
  );
  if (!identity || !isSocialProvider(identity.provider)) return null;

  const d = (identity.identity_data ?? {}) as Record<string, string | undefined>;
  const name = d.full_name || d.name || [d.given_name, d.family_name].filter(Boolean).join(' ') || null;
  return {
    provider: identity.provider,
    name: name?.trim() || null,
    avatarUrl: d.avatar_url || d.picture || null,
  };
}

/** Remove ?import=… from the address bar once it has been handled */
export function clearImportParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('import')) return;
  url.searchParams.delete('import');
  history.replaceState(null, '', url.toString());
}
