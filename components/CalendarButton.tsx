import { useI18n } from '@/lib/i18n';

interface CalendarButtonProps {
  onClick: () => void;
}

export function CalendarButton({ onClick }: CalendarButtonProps) {
  const { t } = useI18n();
  return (
    <button
      onClick={onClick}
      title={t('common.addToCalendar')}
      className="p-2 rounded-lg hover:bg-f1-red/20 transition-colors duration-200 hover:scale-110 transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 md:w-7 md:h-7 text-f1-red-light"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    </button>
  );
}

