import { notFound } from 'next/navigation';
import { getValidLocale, isValidLocale, type Locale } from '@/lib/i18n';

interface LocaleParams {
  locale: string;
}

export async function resolveLocaleFromParams(
  params: Promise<LocaleParams>
): Promise<Locale> {
  const { locale } = await params;
  return getValidLocale(locale);
}

export async function requireLocaleFromParams(
  params: Promise<LocaleParams>
): Promise<Locale> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return locale;
}

export function getNonDefaultLocaleStaticParams() {
  return [{ locale: 'zh' }];
}
