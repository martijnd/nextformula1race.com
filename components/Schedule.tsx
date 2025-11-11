import { useState } from 'react';
import { RegularRace, SprintRace } from '@/classes/race';
import { useI18n } from '@/lib/i18n';
import { NextRaceCard } from './NextRaceCard';
import { RaceGrid } from './RaceGrid';

interface ScheduleProps {
  show: boolean;
  remaining: (RegularRace | SprintRace)[];
  past: (RegularRace | SprintRace)[];
}

export function Schedule({ show, remaining, past }: ScheduleProps) {
  const [showPastRaces, setShowPastRaces] = useState(false);
  const [now] = useState(() => new Date());
  const { t } = useI18n();

  const nextRace = remaining[0] ?? null;
  const upcomingRaces = nextRace ? remaining.slice(1) : remaining;

  const seasonYear =
    remaining[0]?.season ||
    past[0]?.season ||
    new Date().getFullYear().toString();

  return (
    <div
      className={`w-full max-w-5xl mx-auto p-4 transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative mb-12">
        <h2 className="text-center text-4xl md:text-6xl font-black text-white">
          {t('schedule.seasonTitle', seasonYear)}
        </h2>
        <div className="mx-auto mt-10 w-48 h-1 bg-f1-red-light rounded"></div>
      </div>

      {nextRace && <NextRaceCard race={nextRace} now={now} />}

      <RaceGrid
        title={t('schedule.upcomingTitle')}
        emptyLabel={t('schedule.upcomingEmpty')}
        races={upcomingRaces}
        now={now}
        isUpcoming={true}
      />

      {past.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowPastRaces((value) => !value)}
            className="relative mx-auto flex items-center gap-2 rounded-lg border-2 border-f1-gray bg-f1-black px-5 py-2.5 text-sm font-bold text-gray-300 transition-all hover:border-f1-red hover:text-f1-red-light hover:shadow-lg"
            aria-expanded={showPastRaces}
          >
            {showPastRaces
              ? t('schedule.completedToggleHide')
              : t('schedule.completedToggleShow')}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                showPastRaces ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showPastRaces && (
            <RaceGrid
              title={t('schedule.completedTitle')}
              emptyLabel={t('schedule.completedEmpty')}
              races={[...past].reverse()}
              now={now}
              isUpcoming={false}
            />
          )}
        </div>
      )}
    </div>
  );
}
