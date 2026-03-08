import './globals.css';

import { Metadata } from 'next';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider } from '../contexts/AuthContext';
import StructuredData from '../components/seo/structured-data';
import Script from 'next/script';
import { getSiteUrl, siteConfig } from '../lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) 使用 next/script，放置在 head 以便验证 */}
        <Script
          strategy="beforeInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`}
        />
        <Script
          id="gtag-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.googleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <StructuredData
              type="website"
              data={{
                name: siteConfig.legacyLocalizedName,
                description: siteConfig.descriptionZh,
                url: getSiteUrl(),
              }}
            />
            <StructuredData
              type="organization"
              data={{
                name: siteConfig.legacyEnglishName,
              }}
            />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
