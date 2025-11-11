'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { en } from './dictionaries/en';
import { nl } from './dictionaries/nl';
import { AppLocale, TranslationDict, Translator } from './types';
import type { Locale } from 'date-fns';
import { enGB as dfEn, nl as dfNl } from 'date-fns/locale';

type I18nContextValue = {
  locale: AppLocale;
  t: Translator;
  dateLocale: Locale;
  switchLocale: (locale: AppLocale) => void;
  dict: TranslationDict;
};

const I18N_DICTIONARIES: Record<AppLocale, TranslationDict> = {
  en,
  nl,
};

const DATEFNS_LOCALES: Record<AppLocale, Locale> = {
  en: dfEn,
  nl: dfNl,
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: AppLocale;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const value = useMemo<I18nContextValue>(() => {
    const dict = I18N_DICTIONARIES[locale] ?? en;
    const dateLocale = DATEFNS_LOCALES[locale] ?? dfEn;

    function t(key: string, ...args: any[]): string {
      const segments = key.split('.');
      let node: any = dict;
      for (const seg of segments) {
        if (node == null) break;
        node = node[seg];
      }
      if (node == null) {
        // fallback to key to make missing keys visible
        return key;
      }
      if (typeof node === 'function') {
        return node(...args);
      }
      return String(node);
    }

    function switchLocale(nextLocale: AppLocale) {
      // Replace the locale in the pathname
      const pathWithoutLocale = pathname?.replace(/^\/[^/]+/, '') || '/';
      const newPath = `/${nextLocale}${pathWithoutLocale}`;
      router.push(newPath);
    }

    return {
      locale,
      t: t as Translator,
      dateLocale,
      switchLocale,
      dict,
    };
  }, [locale, router, pathname]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
