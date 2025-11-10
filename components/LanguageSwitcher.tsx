'use client';

import { useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, switchLocale } = useI18n();

  return (
    <div className="absolute top-4 right-4 z-50 rounded-lg border-2 border-f1-gray bg-f1-black/70 backdrop-blur px-2 py-1 text-xs font-bold text-gray-300">
      <div className="flex items-center gap-1">
        <button
          className={`px-2 py-1 rounded ${
            locale === 'en'
              ? 'bg-f1-red text-white shadow'
              : 'hover:text-f1-red-light'
          }`}
          onClick={() => switchLocale('en')}
          aria-pressed={locale === 'en'}
        >
          EN
        </button>
        <span className="opacity-40">|</span>
        <button
          className={`px-2 py-1 rounded ${
            locale === 'nl'
              ? 'bg-f1-red text-white shadow'
              : 'hover:text-f1-red-light'
          }`}
          onClick={() => switchLocale('nl')}
          aria-pressed={locale === 'nl'}
        >
          NL
        </button>
      </div>
    </div>
  );
}


