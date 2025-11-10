import { NextPageContext } from 'next';
import { useI18n } from '@/lib/i18n';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode }: ErrorProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const is404 = statusCode === 404;
  const errorKey = is404 ? '404' : statusCode === 500 ? '500' : 'generic';

  return (
    <>
      <Head>
        <title>{t(`error.${errorKey}.title`)}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className="min-h-screen bg-f1-black f1-stripe flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-9xl font-black text-f1-red-light mb-4">
            {statusCode || '?'}
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t(`error.${errorKey}.heading`)}
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            {t(`error.${errorKey}.message`)}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-f1-red hover:bg-f1-red-light text-white font-bold rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t(`error.${errorKey}.backHome`)}
          </Link>
        </div>
      </main>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
