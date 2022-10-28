import { AppProps } from 'next/dist/shared/lib/router/router';
import '../styles/globals.css';
export { reportWebVitals } from 'next-axiom';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
