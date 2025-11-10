import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerLocale = (router.locale as AppLocale) || 'en';

  const value = useMemo<I18nContextValue>(() => {
    const dict = I18N_DICTIONARIES[routerLocale] ?? en;
    const dateLocale = DATEFNS_LOCALES[routerLocale] ?? dfEn;

    const t: Translator = (key, ...args) => {
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
    };

    const switchLocale = (nextLocale: AppLocale) => {
      router.push(router.asPath, router.asPath, { locale: nextLocale });
    };

    return {
      locale: routerLocale,
      t,
      dateLocale,
      switchLocale,
      dict,
    };
  }, [router, routerLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
