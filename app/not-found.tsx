import { NotFoundClient } from './not-found-client';
import { I18nProvider } from '@/lib/i18n';
import { headers } from 'next/headers';
import { AppLocale } from '@/lib/i18n/types';
import type { Metadata } from 'next';
import { en } from '@/lib/i18n/dictionaries/en';
import { nl } from '@/lib/i18n/dictionaries/nl';

const dictionaries = { en, nl };

async function getLocaleFromHeaders(): Promise<AppLocale> {
  const headersList = await headers();
  let pathname = headersList.get('x-pathname') || '';
  
  // If not in header, try to extract from referer
  if (!pathname) {
    const referer = headersList.get('referer') || '';
    if (referer) {
      try {
        const url = new URL(referer);
        pathname = url.pathname;
      } catch {
        // Invalid URL, ignore
      }
    }
  }
  
  // Extract locale from pathname (e.g., /en/... or /nl/...)
  const localeMatch = pathname.match(/^\/(en|nl)(\/|$)/);
  return (localeMatch?.[1] as AppLocale) || 'en';
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromHeaders();
  const appLocale = locale || 'en';
  const dict = dictionaries[appLocale] || en;
  const siteUrl = 'https://f1.lekkerklooien.nl';

  return {
    title: dict.error['404'].title,
    description: dict.error['404'].message,
    robots: {
      index: false,
      follow: true,
    },
    metadataBase: new URL(siteUrl),
  };
}

export default async function NotFound() {
  const locale = await getLocaleFromHeaders();
  
  return (
    <I18nProvider locale={locale}>
      <NotFoundClient />
    </I18nProvider>
  );
}

