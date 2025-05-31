'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from './button';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'zh' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('zh')}
        className="text-xs px-3 py-1"
      >
        {t('language.chinese')}
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs px-3 py-1"
      >
        {t('language.english')}
      </Button>
    </div>
  );
};

export default LanguageSwitcher;