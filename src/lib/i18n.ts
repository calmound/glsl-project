// i18n 配置文件
export const defaultLocale = 'zh' as const;
export const locales = ['zh', 'en'] as const;

export type Locale = typeof locales[number];

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

// 检查是否为有效的语言代码
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 获取语言代码，如果无效则返回默认语言
export function getValidLocale(locale: string | undefined): Locale {
  if (!locale) return defaultLocale;
  return isValidLocale(locale) ? locale : defaultLocale;
}

// 从路径中提取语言代码
export function getLocaleFromPathname(pathname: string): {
  locale: Locale;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  
  if (isValidLocale(maybeLocale)) {
    return {
      locale: maybeLocale,
      pathnameWithoutLocale: '/' + segments.slice(2).join('/'),
    };
  }
  
  return {
    locale: defaultLocale,
    pathnameWithoutLocale: pathname,
  };
}

// 为路径添加语言前缀
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname;
  }
  return `/${locale}${pathname}`;
}

// 移除路径中的语言前缀
export function removeLocaleFromPathname(pathname: string): string {
  const { pathnameWithoutLocale } = getLocaleFromPathname(pathname);
  return pathnameWithoutLocale;
}