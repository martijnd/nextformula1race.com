import {
  RegularRaceType,
  SprintRaceType,
  RaceEvent,
} from '@/classes/race-event';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { RegularRace, SprintRace } from '@/classes/race';
import { useI18n } from '@/lib/i18n';

const RACE_NAME_MAP: Record<string, string> = {
  albert_park: 'Melbourne',
  shanghai: 'Shanghai',
  suzuka: 'Suzuka',
  bahrain: 'Sakhir',
  jeddah: 'Jeddah',
  miami: 'Miami',
  imola: 'Imola',
  monaco: 'Monaco',
  catalunya: 'Barcelona',
  villeneuve: 'Montreal',
  red_bull_ring: 'Austria',
  silverstone: 'Silverstone',
  spa: 'Belgium',
  hungaroring: 'Hungary',
  zandvoort: 'Netherlands',
  monza: 'Italy',
  baku: 'Azerbaijan',
  marina_bay: 'Singapore',
  americas: 'COTA, USA',
  rodriguez: 'Mexico City',
  interlagos: 'São Paulo',
  vegas: 'Las Vegas',
  losail: 'Qatar',
  yas_marina: 'Abu Dhabi',
};

interface ScheduleProps {
  show: boolean;
  remaining: (RegularRace | SprintRace)[];
  past: (RegularRace | SprintRace)[];
}

export function Schedule({ show, remaining, past }: ScheduleProps) {
  const [showPastRaces, setShowPastRaces] = useState(false);
  const [expandedRaceId, setExpandedRaceId] = useState<string | null>(null);
  const [now] = useState(() => new Date());
  const { t, dateLocale } = useI18n();

  const nextRace = remaining[0] ?? null;
  const upcomingRaces = nextRace ? remaining.slice(1) : remaining;

  const onRaceClick = (raceId: string) => {
    setExpandedRaceId(expandedRaceId === raceId ? null : raceId);
  };

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
        expandedRaceId={expandedRaceId}
        onRaceClick={onRaceClick}
        isUpcoming={true}
      />

      {past.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowPastRaces((value) => !value)}
            className="mx-auto flex items-center gap-2 rounded-lg border-2 border-f1-gray bg-f1-black px-5 py-2.5 text-sm font-bold text-gray-300 transition-all hover:border-f1-red hover:text-f1-red-light hover:shadow-lg"
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
              expandedRaceId={expandedRaceId}
              onRaceClick={onRaceClick}
              isUpcoming={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

type RaceLike = RegularRace | SprintRace;

function NextRaceCard({ race, now }: { race: RaceLike; now: Date }) {
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

interface RaceGridProps {
  title: string;
  emptyLabel: string;
  races: RaceLike[];
  now: Date;
  expandedRaceId: string | null;
  onRaceClick?: (raceId: string) => void;
  isUpcoming: boolean;
}

function RaceGrid({
  title,
  emptyLabel,
  races,
  now,
  expandedRaceId,
  onRaceClick,
  isUpcoming,
}: RaceGridProps) {
  if (races.length === 0) {
    return (
      <div className="mt-10 text-center text-sm font-medium text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="mb-6 text-xl font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
        <span className="h-1 w-12 bg-f1-red-light"></span>
        {title}
        <span className="h-1 flex-1 bg-f1-red-light"></span>
      </h3>
      <ul className="grid gap-4 max-w-screen-sm mx-auto">
        {races.map((race) => {
          const raceId = `${race.round}-${race.raceName}`;
          return (
            <li key={raceId}>
              <RaceCard
                race={race}
                now={now}
                isExpanded={expandedRaceId === raceId}
                onClick={() => onRaceClick?.(raceId)}
                isUpcoming={isUpcoming}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface RaceCardProps {
  race: RaceLike;
  now: Date;
  isExpanded: boolean;
  onClick: () => void;
  isUpcoming: boolean;
}

function RaceCard({
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
            <div className="flex-1 min-w-0 pr-8 md:pr-0">
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
            <div className="md:hidden flex items-center justify-center gap-2">
              <StatusPill tone={descriptor.status.tone}>
                {descriptor.status.label}
              </StatusPill>
            </div>
          </div>

          {/* Date */}
          {race.officialUrl ? (
            <a
              href={race.officialUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="block text-sm md:text-base font-bold text-white transition-colors hover:text-f1-red-light break-words"
            >
              {descriptor.date}
            </a>
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
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t-2 border-f1-red/30 px-4 md:px-5 py-4 md:py-5 bg-f1-black/30">
          <RaceEventsList race={race} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: 'live' | 'upcoming' | 'completed';
  children: string;
}) {
  const base =
    'rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap';
  if (tone === 'live') {
    return (
      <span
        className={`${base} bg-f1-red text-white shadow-lg shadow-f1-red/50 animate-pulse-slow`}
      >
        {children}
      </span>
    );
  }
  if (tone === 'completed') {
    return (
      <span className={`${base} bg-f1-gray text-gray-300`}>{children}</span>
    );
  }
  return (
    <span className={`${base} bg-blue-500/30 text-blue-200`}>{children}</span>
  );
}

function buildRaceDescriptor(
  race: RaceLike,
  now: Date,
  t: (key: string, ...args: any[]) => string,
  dateLocale: Locale
) {
  const isSprint = race instanceof SprintRace;
  const mainRaceType = isSprint ? SprintRaceType.Race : RegularRaceType.Race;
  const isLive = race.isCurrentlyLive(mainRaceType, now);
  const hasHappened = race.hasHappened(now);

  const status = isLive
    ? { label: t('schedule.status.liveNow'), tone: 'live' as const }
    : hasHappened
    ? {
        label: t(
          'schedule.status.finished',
          formatDistanceToNow(race.dateTime, {
            addSuffix: false,
            locale: dateLocale,
          })
        ),
        tone: 'completed' as const,
      }
    : {
        label: t(
          'schedule.status.startsIn',
          formatDistanceToNow(race.dateTime, {
            addSuffix: false,
            locale: dateLocale,
          })
        ),
        tone: 'upcoming' as const,
      };

  return {
    name: `${getRaceName(race)} Grand Prix`,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuit: race.Circuit.circuitName,
    date: format(race.dateTime, 'eeee d MMMM • HH:mm', { locale: dateLocale }),
    status,
    isSprint,
  };
}

function getRaceName(race: RaceLike) {
  return RACE_NAME_MAP[race.Circuit.circuitId] ?? race.Circuit.Location.country;
}

interface RaceEventsListProps {
  race: RaceLike;
}

function RaceEventsList({ race }: RaceEventsListProps) {
  const isSprint = race instanceof SprintRace;
  const { t, dateLocale } = useI18n();

  const events: Array<{ name: string; event: RaceEvent }> = isSprint
    ? [
        { name: t('schedule.event.fp1'), event: race.FirstPractice },
        {
          name: t('schedule.event.sprintQualifying'),
          event: race.SprintQualifying,
        },
        { name: t('schedule.event.sprint'), event: race.Sprint },
        { name: t('schedule.event.qualifying'), event: race.Qualifying },
        { name: t('schedule.event.race'), event: race },
      ]
    : [
        { name: t('schedule.event.fp1'), event: race.FirstPractice },
        { name: t('schedule.event.fp2'), event: race.SecondPractice },
        { name: t('schedule.event.fp3'), event: race.ThirdPractice },
        { name: t('schedule.event.qualifying'), event: race.Qualifying },
        { name: t('schedule.event.race'), event: race },
      ];

  // Sort events chronologically (earliest first)
  const sortedEvents = [...events].sort(
    (a, b) => a.event.dateTime.getTime() - b.event.dateTime.getTime()
  );

  return (
    <div className="w-full">
      <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <span className="h-0.5 w-6 bg-f1-red-light"></span>
        {t('schedule.weekendScheduleHeading')}
      </h5>
      <div className="space-y-2">
        {sortedEvents.map(({ name, event }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border-2 border-f1-gray bg-f1-black/50 px-5 py-3.5 transition-all hover:border-f1-red hover:shadow-md"
          >
            <span className="text-sm font-bold text-white uppercase tracking-wide">
              {name}
            </span>
            <div className="text-right flex items-center gap-3">
              <span className="text-sm font-bold text-white">
                {format(event.dateTime, 'EEE d MMM', { locale: dateLocale })}
              </span>
              <span className="text-lg font-black text-f1-red-light">
                {format(event.dateTime, 'HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
