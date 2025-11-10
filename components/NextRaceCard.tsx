import { RegularRace, SprintRace } from '@/classes/race';
import { useI18n } from '@/lib/i18n';
import { buildRaceDescriptor, type RaceLike } from './schedule-utils';

interface NextRaceCardProps {
  race: RaceLike;
  now: Date;
}

export function NextRaceCard({ race, now }: NextRaceCardProps) {
  const { t, dateLocale } = useI18n();
  const descriptor = buildRaceDescriptor(race, now, t, dateLocale);

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border-2 border-f1-red bg-gradient-to-br from-f1-red/20 via-f1-black to-f1-gray/30 p-8 shadow-2xl shadow-f1-red/20 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-f1-red px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
            {t('schedule.nextRaceBadge')}
          </span>
          <h3 className="mt-4 text-3xl font-black text-white md:text-4xl">
            {descriptor.name}
          </h3>
          <p className="mt-2 text-sm font-bold uppercase tracking-wider text-gray-400">
            {t('schedule.roundX', race.round)} • {descriptor.country}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-f1-red-light">
            {descriptor.status.label}
          </p>
          {race.officialUrl ? (
            <a
              href={race.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-xl font-bold text-white transition-colors hover:text-f1-red-light"
            >
              {descriptor.date}
            </a>
          ) : (
            <p className="mt-2 text-xl font-bold text-white">
              {descriptor.date}
            </p>
          )}
          <p className="text-sm font-medium text-gray-400 mt-1">
            {descriptor.locality}
          </p>
        </div>
      </div>
      {descriptor.isSprint && (
        <div className="mt-6 pt-6 border-t-2 border-f1-red/30">
          <p className="text-sm font-bold text-f1-red-light uppercase tracking-wide">
            {t('schedule.sprintWeekendNote')}
          </p>
        </div>
      )}
    </div>
  );
}

