'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { addLocaleToPathname, removeLocaleFromPathname } from '../../lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'zh' | 'en';
    if (newLanguage === language) return;

    // 移除当前语言前缀，然后添加新的语言前缀
    const pathWithoutLocale = removeLocaleFromPathname(pathname);
    const newPath = addLocaleToPathname(pathWithoutLocale, newLanguage);

    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <select
        value={language}
        onChange={handleLanguageChange}
        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-label="Select language"
      >
        <option value="zh">🇨🇳 中文</option>
        <option value="en">🇺🇸 English</option>
      </select>
      {/* 自定义下拉箭头 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;