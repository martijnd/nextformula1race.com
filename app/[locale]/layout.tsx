import { Analytics } from '@vercel/analytics/react';
import { I18nProvider } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { AppLocale } from '@/lib/i18n/types';
import type { Metadata } from 'next';
import { en } from '@/lib/i18n/dictionaries/en';
import { nl } from '@/lib/i18n/dictionaries/nl';

const dictionaries = { en, nl };

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = (locale as AppLocale) || 'en';
  const dict = dictionaries[appLocale] || en;
  const siteUrl = 'https://f1.lekkerklooien.nl';
  const ogLocale = appLocale === 'nl' ? 'nl_NL' : 'en_US';
  const alternateLocale = appLocale === 'nl' ? 'en_US' : 'nl_NL';

  return {
    title: dict.home.title,
    description: dict.home.description,
    keywords: [
      'Formula 1',
      'F1',
      'Formula One',
      'F1 race',
      'F1 schedule',
      'F1 calendar',
      'F1 standings',
      'Formula 1 championship',
      'next F1 race',
      'F1 race times',
      'F1 results',
    ],
    authors: [{ name: 'Next Formula 1 Race' }],
    creator: 'Next Formula 1 Race',
    publisher: 'Next Formula 1 Race',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${appLocale}`,
      languages: {
        en: `${siteUrl}/en`,
        nl: `${siteUrl}/nl`,
        'x-default': `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${appLocale}`,
      title: dict.home.title,
      description: dict.home.description,
      siteName: 'Next Formula 1 Race',
      locale: ogLocale,
      alternateLocale: alternateLocale,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Next Formula 1 Race',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.home.title,
      description: dict.home.description,
      images: [`${siteUrl}/og-image.png`],
    },
    icons: {
      icon: [
        {
          url: '/favicons/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicons/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
      ],
      apple: '/favicons/apple-touch-icon.png',
      other: [
        {
          rel: 'mask-icon',
          url: '/favicons/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      ],
    },
    manifest: '/favicons/site.webmanifest',
    other: {
      'msapplication-TileColor': '#15151E',
      'theme-color': '#15151E',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const appLocale = (locale as AppLocale) || 'en';

  return (
    <>
      <I18nProvider locale={appLocale}>
        <LanguageSwitcher />
        {children}
        <Analytics />
      </I18nProvider>
    </>
  );
}
