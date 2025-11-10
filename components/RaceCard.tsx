import { useI18n } from '@/lib/i18n';
import { buildRaceDescriptor, type RaceLike } from './schedule-utils';
import { StatusPill } from './StatusPill';
import { TopFinishers } from './TopFinishers';
import { RemainingFinishers } from './RemainingFinishers';
import { RaceEventsList } from './RaceEventsList';

interface RaceCardProps {
  race: RaceLike;
  now: Date;
  isExpanded: boolean;
  onClick: () => void;
  isUpcoming: boolean;
}

export function RaceCard({
  race,
  now,
  isExpanded,
  onClick,
  isUpcoming,
}: RaceCardProps) {
  const { t, dateLocale } = useI18n();
  const descriptor = buildRaceDescriptor(race, now, t, dateLocale);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-f1-gray bg-f1-black/50 backdrop-blur-sm shadow-md transition-all duration-300 hover:border-f1-red hover:shadow-xl relative">
      {/* Mobile chevron in top right corner */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:text-f1-red-light ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div
        className="flex h-full flex-col p-4 md:p-5 cursor-pointer group"
        onClick={onClick}
      >
        {/* Desktop: Stack items vertically, Mobile: Keep current layout */}
        <div className="flex flex-col md:flex-col gap-3 md:gap-4">
          {/* Title and status row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 pr-8 sm:pr-12 md:pr-0">
              <h4 className="text-lg md:text-xl font-black text-white group-hover:text-f1-red-light transition-colors break-words">
                {descriptor.name}
              </h4>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mt-1">
                {t('schedule.roundX', race.round)}
              </p>
            </div>
            {/* Desktop chevron - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <StatusPill tone={descriptor.status.tone}>
                {descriptor.status.label}
              </StatusPill>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:text-f1-red-light ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {/* Mobile status pill - below title */}
            <div className="md:hidden flex items-center justify-center gap-2 sm:mr-12">
              <StatusPill tone={descriptor.status.tone}>
                {descriptor.status.label}
              </StatusPill>
            </div>
          </div>

          {/* Date */}
          {race.officialUrl ? (
            <div>
              <a
                href={race.officialUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-block text-sm md:text-base font-bold text-white transition-colors hover:text-f1-red-light break-words"
              >
                {descriptor.date}
              </a>
            </div>
          ) : (
            <p className="text-sm md:text-base font-bold text-white break-words">
              {descriptor.date}
            </p>
          )}

          {/* Location */}
          <p className="text-xs md:text-sm font-medium text-gray-400 break-words">
            {descriptor.locality} • {descriptor.country}
          </p>

          {/* Circuit and Sprint badges */}
          <div className="flex flex-wrap gap-2 text-xs font-bold justify-center md:justify-center">
            <span className="rounded-lg bg-f1-gray px-2 md:px-3 py-1 md:py-1.5 text-gray-300 uppercase tracking-wide break-words">
              {descriptor.circuit}
            </span>
            {descriptor.isSprint && (
              <span className="rounded-lg bg-f1-red/20 px-2 md:px-3 py-1 md:py-1.5 text-f1-red-light uppercase tracking-wide">
                {t('schedule.event.sprint')}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t-2 border-f1-red/30 px-4 md:px-5 py-4 md:py-5 bg-f1-black/30">
          {!isUpcoming && isExpanded && (
            <>
              <TopFinishers race={race} />
              <RemainingFinishers race={race} />
            </>
          )}
          {isUpcoming && <RaceEventsList race={race} />}
        </div>
      </div>
    </div>
  );
}

