import { AppProps } from 'next/dist/shared/lib/router/router';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
export { reportWebVitals } from 'next-axiom';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
