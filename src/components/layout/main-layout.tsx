'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { addLocaleToPathname } from '@/lib/i18n';
import LanguageSwitcher from '../ui/language-switcher';
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
                  <Link href={addLocaleToPathname('/playground', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.playground')}
                  </Link>
                </li>
                <li>
                  <Link href={addLocaleToPathname('/leaderboard', language)} className="text-gray-600 hover:text-primary transition-colors">
                    {t('nav.leaderboard')}
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
                <li>
                  <Link href={addLocaleToPathname('/pricing', language)} className="text-gray-600 hover:text-primary transition-colors font-medium text-blue-600">
                    {t('nav.pricing', 'Pricing')}
                  </Link>
                </li>
              </ul>
            </nav>
            <LanguageSwitcher />
            <UserProfile />
            <LoginLink />
          </div>
        </div>
      </header >

      <main className="flex-grow  mx-auto w-full">{children}</main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-gray-600">
          <div className="flex flex-wrap gap-4">
            <Link
              href={addLocaleToPathname('/legal/terms', language)}
              className="hover:text-primary transition-colors"
            >
              {t('legal.terms', '服务条款')}
            </Link>
            <Link
              href={addLocaleToPathname('/legal/privacy', language)}
              className="hover:text-primary transition-colors"
            >
              {t('legal.privacy', '隐私政策')}
            </Link>
            <Link
              href={addLocaleToPathname('/legal/refund', language)}
              className="hover:text-primary transition-colors"
            >
              {t('legal.refund', '退款政策')}
            </Link>
          </div>
          <div className="text-gray-500">© {new Date().getFullYear()} Shader Learn. {t('footer.rights')}</div>
        </div>
      </footer>
    </div >
  );
};

export default MainLayout;
