import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <div className="relative flex justify-center border-t-2 border-f1-red/30 bg-f1-black py-10 font-bold transition-colors">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-f1-red to-transparent"></div>
      <span className="text-gray-400 transition-colors hover:text-f1-red-light">
        {t('common.madeBy')}
        <a
          className="pl-2 hover:underline font-black text-white"
          target="_blank"
          rel="noreferrer"
          href="https://www.martijndorsman.nl"
        >
          Martijn Dorsman
        </a>
      </span>
    </div>
  );
}
