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

export function LanguageProvider({ children, initialLocale = 'zh' }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Locale>(initialLocale);
  
  // 从路径中获取当前语言
  useEffect(() => {
    const { locale } = getLocaleFromPathname(pathname);
    setLanguageState(locale);
  }, [pathname]);
  
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