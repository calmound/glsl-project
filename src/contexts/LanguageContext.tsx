'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type Locale, addLocaleToPathname, removeLocaleFromPathname, getLocaleFromPathname } from '../lib/i18n';
import { getTranslation } from '../lib/translations';

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LanguageProvider 组件

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 从 pathname 解析初始语言
  const { locale: pathLocale } = getLocaleFromPathname(pathname);
  const [language, setLanguageState] = useState<Locale>(pathLocale);

  // 监听路径变化更新语言
  useEffect(() => {
    const { locale } = getLocaleFromPathname(pathname);
    if (locale !== language) {
      setLanguageState(locale);
    }
  }, [pathname, language]);
  
  // 切换语言函数
  const setLanguage = (newLocale: Locale) => {
    const currentPathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(currentPathWithoutLocale, newLocale);
    router.push(newPath);
  };
  
  // 翻译函数
  const t = (key: string, defaultValue?: string): string => {
    return getTranslation(language, key, defaultValue);
  };
  
  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};