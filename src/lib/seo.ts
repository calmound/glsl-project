import { type Locale } from './i18n';
import { getBaseUrl } from './metadata-common';

type AlternatePathMap = {
  en: string;
  zh: string;
};

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export function buildLocaleAlternates(path: string) {
  return buildLocaleAlternatesFor('en', path);
}

export function buildLocaleAlternatesFor(locale: Locale, path: string) {
  const normalizedPath = normalizePath(path);
  const baseUrl = getBaseUrl();
  const localizedPaths: AlternatePathMap = {
    en: normalizedPath === '/' ? baseUrl : `${baseUrl}${normalizedPath}`,
    zh: normalizedPath === '/' ? `${baseUrl}/zh` : `${baseUrl}/zh${normalizedPath}`,
  };

  return {
    canonical: localizedPaths[locale],
    languages: {
      en: localizedPaths.en,
      'zh-CN': localizedPaths.zh,
      'x-default': localizedPaths.en,
    },
  };
}

export function getCanonicalPath(locale: Locale, path: string): string {
  const normalizedPath = normalizePath(path);

  if (locale === 'en') {
    return normalizedPath;
  }

  return normalizedPath === '/' ? '/zh' : `/zh${normalizedPath}`;
}
