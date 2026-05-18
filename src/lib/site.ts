const rawSiteUrl = import.meta.env.VITE_SITE_URL ?? import.meta.env.VITE_APP_URL ?? 'https://mwezicup.com';

export const SITE_NAME = 'Mwezi Cup';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');
export const SITE_DESCRIPTION =
  'Mwezi Cup is a premium reusable menstrual cup brand built for comfort, sustainability, and everyday confidence.';
export const SITE_DEFAULT_OG_IMAGE = '/img/Mwezi hero image.png';

export function getSiteUrl(path: string = '/') {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${encodeURI(normalizedPath)}`;
}
