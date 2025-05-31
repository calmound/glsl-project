'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from './button';
import { addLocaleToPathname, removeLocaleFromPathname } from '../../lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLanguage: 'zh' | 'en') => {
    if (newLanguage === language) return;
    
    // 移除当前语言前缀，然后添加新的语言前缀
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(pathWithoutLocale, newLanguage);
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'zh' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('zh')}
        className="text-xs px-3 py-1"
      >
        {t('language.chinese')}
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        className="text-xs px-3 py-1"
      >
        {t('language.english')}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;