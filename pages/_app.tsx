import type { AppProps } from 'next/app';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import { I18nProvider } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <LanguageSwitcher />
      <Component {...pageProps} />
      {/* Vercel Analytics uses optimized script loading internally */}
      <Analytics />
      {/* For additional third-party scripts, use next/script with appropriate strategy */}
    </I18nProvider>
  );
}

export default MyApp;
