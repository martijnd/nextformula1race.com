import { AppProps } from 'next/dist/shared/lib/router/router';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
