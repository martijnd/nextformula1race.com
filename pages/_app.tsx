import { AppProps } from 'next/dist/shared/lib/router/router';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import '../styles/globals.css';
import { I18nProvider } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <LanguageSwitcher />
      <>
        <Component {...pageProps} />
        <Analytics />
      </>
    </I18nProvider>
  );
}

export default MyApp;
