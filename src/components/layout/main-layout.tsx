'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { addLocaleToPathname } from '@/lib/i18n';
import LanguageSwitcher from '../ui/language-switcher';
import LogoutLink from '@/components/auth/logout-link';
import LoginLink from '@/components/auth/login-link';
import UserProfile from '@/components/auth/user-profile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link href={addLocaleToPathname('/', language)} className="text-xl font-bold text-gray-800 hover:text-primary transition-colors">
            {t('header.title')}
          </Link>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href={addLocaleToPathname('/', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link href={addLocaleToPathname('/learn', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.learn')}
                  </Link>
                </li>
                <li>
                  <Link href={addLocaleToPathname('/feedback', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.feedback')}
                  </Link>
                </li>
                <li>
                  <Link href={addLocaleToPathname('/contact', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.contact', 'Contact')}
                  </Link>
                </li>
              </ul>
            </nav>
            <LanguageSwitcher />
            <UserProfile />
            <LoginLink />
            <LogoutLink />
          </div>
        </div>
      </header>

      <main className="flex-grow  mx-auto w-full">{children}</main>

      {/* <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-lg font-semibold mb-4">GLSL 项目</h2>
              <p className="text-gray-300">一个基于 WebGL 和 GLSL 的图形渲染项目</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-3">链接</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="/docs" className="text-gray-300 hover:text-white transition-colors">
                    文档
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GLSL 项目. 保留所有权利。</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default MainLayout;
