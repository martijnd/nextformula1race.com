import {
  RegularRaceType,
  SprintRaceType,
  RaceEvent,
} from '@/classes/race-event';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { RegularRace, SprintRace } from '@/classes/race';

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

  const nextRace = remaining[0] ?? null;
  const upcomingRaces = nextRace ? remaining.slice(1) : remaining;

  const onRaceClick = (raceId: string) => {
    setExpandedRaceId(expandedRaceId === raceId ? null : raceId);
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto p-4 transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative mb-12">
        <h2 className="text-center text-4xl md:text-6xl font-black text-f1-black dark:text-white">
          2025 Season Schedule
        </h2>
        <div className="mx-auto mt-10 w-48 h-1 bg-f1-red dark:bg-f1-red-light rounded"></div>
      </div>

      {nextRace && <NextRaceCard race={nextRace} now={now} />}

      <RaceGrid
        title="Upcoming races"
        emptyLabel="All done for this season."
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
            className="mx-auto flex items-center gap-2 rounded-lg border-2 border-f1-gray bg-white px-5 py-2.5 text-sm font-bold text-f1-gray transition-all hover:border-f1-red hover:text-f1-red hover:shadow-lg dark:border-f1-gray dark:bg-f1-black dark:text-gray-300 dark:hover:border-f1-red dark:hover:text-f1-red-light"
            aria-expanded={showPastRaces}
          >
            {showPastRaces ? 'Hide completed races' : 'Show completed races'}
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
              title="Completed races"
              emptyLabel="No races completed yet."
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
  const descriptor = buildRaceDescriptor(race, now);

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border-2 border-f1-red bg-gradient-to-br from-f1-red/5 via-white to-white p-8 shadow-2xl backdrop-blur-sm dark:border-f1-red dark:bg-gradient-to-br dark:from-f1-red/20 dark:via-f1-black dark:to-f1-gray/30 dark:shadow-f1-red/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/10 dark:bg-f1-red/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-f1-red px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
            Next race
          </span>
          <h3 className="mt-4 text-3xl font-black text-f1-black dark:text-white md:text-4xl">
            {descriptor.name}
          </h3>
          <p className="mt-2 text-sm font-bold uppercase tracking-wider text-f1-gray dark:text-gray-400">
            Round {race.round} • {descriptor.country}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-wider text-f1-red dark:text-f1-red-light">
            {descriptor.status.label}
          </p>
          {race.officialUrl ? (
            <a
              href={race.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-xl font-bold text-f1-black transition-colors hover:text-f1-red dark:text-white dark:hover:text-f1-red-light"
            >
              {descriptor.date}
            </a>
          ) : (
            <p className="mt-2 text-xl font-bold text-f1-black dark:text-white">
              {descriptor.date}
            </p>
          )}
          <p className="text-sm font-medium text-f1-gray dark:text-gray-400 mt-1">
            {descriptor.locality}
          </p>
        </div>
      </div>
      {descriptor.isSprint && (
        <div className="mt-6 pt-6 border-t-2 border-f1-red/20 dark:border-f1-red/30">
          <p className="text-sm font-bold text-f1-red dark:text-f1-red-light uppercase tracking-wide">
            🏁 Sprint weekend • extra action on Saturday!
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
      <div className="mt-10 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="mb-6 text-xl font-black uppercase tracking-widest text-f1-gray dark:text-gray-400 flex items-center gap-3">
        <span className="h-1 w-12 bg-f1-red dark:bg-f1-red-light"></span>
        {title}
        <span className="h-1 flex-1 bg-f1-red dark:bg-f1-red-light"></span>
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
  const descriptor = buildRaceDescriptor(race, now);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-f1-red hover:shadow-xl dark:border-f1-gray dark:bg-f1-black/50 dark:backdrop-blur-sm dark:hover:border-f1-red relative">
      {/* Mobile chevron in top right corner */}
      <div className="md:hidden absolute top-4 right-4 z-10">
        <svg
          className={`h-5 w-5 text-f1-gray dark:text-gray-400 transition-transform duration-300 group-hover:text-f1-red dark:group-hover:text-f1-red-light ${
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
              <h4 className="text-lg md:text-xl font-black text-f1-black dark:text-white group-hover:text-f1-red dark:group-hover:text-f1-red-light transition-colors break-words">
                {descriptor.name}
              </h4>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-f1-gray dark:text-gray-400 mt-1">
                Round {race.round}
              </p>
            </div>
            {/* Desktop chevron - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <StatusPill tone={descriptor.status.tone}>
                {descriptor.status.label}
              </StatusPill>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-f1-gray dark:text-gray-400 transition-transform duration-300 group-hover:text-f1-red dark:group-hover:text-f1-red-light ${
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
              className="block text-sm md:text-base font-bold text-f1-black transition-colors hover:text-f1-red dark:text-white dark:hover:text-f1-red-light break-words"
            >
              {descriptor.date}
            </a>
          ) : (
            <p className="text-sm md:text-base font-bold text-f1-black dark:text-white break-words">
              {descriptor.date}
            </p>
          )}

          {/* Location */}
          <p className="text-xs md:text-sm font-medium text-f1-gray dark:text-gray-400 break-words">
            {descriptor.locality} • {descriptor.country}
          </p>

          {/* Circuit and Sprint badges */}
          <div className="flex flex-wrap gap-2 text-xs font-bold justify-center md:justify-center">
            <span className="rounded-lg bg-gray-100 px-2 md:px-3 py-1 md:py-1.5 text-f1-gray dark:bg-f1-gray dark:text-gray-300 uppercase tracking-wide break-words">
              {descriptor.circuit}
            </span>
            {descriptor.isSprint && (
              <span className="rounded-lg bg-f1-red/10 px-2 md:px-3 py-1 md:py-1.5 text-f1-red dark:bg-f1-red/20 dark:text-f1-red-light uppercase tracking-wide">
                Sprint
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
        <div className="border-t-2 border-f1-red/20 dark:border-f1-red/30 px-4 md:px-5 py-4 md:py-5 bg-gray-50 dark:bg-f1-black/30">
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
      <span
        className={`${base} bg-gray-200 text-f1-gray dark:bg-f1-gray dark:text-gray-300`}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-500/30 dark:text-blue-200`}
    >
      {children}
    </span>
  );
}

function buildRaceDescriptor(race: RaceLike, now: Date) {
  const isSprint = race instanceof SprintRace;
  const mainRaceType = isSprint ? SprintRaceType.Race : RegularRaceType.Race;
  const isLive = race.isCurrentlyLive(mainRaceType, now);
  const hasHappened = race.hasHappened(now);

  const status = isLive
    ? { label: 'Live now', tone: 'live' as const }
    : hasHappened
    ? {
        label: `Finished ${formatDistanceToNow(race.dateTime, {
          addSuffix: true,
        })}`,
        tone: 'completed' as const,
      }
    : {
        label: `Starts ${formatDistanceToNow(race.dateTime, {
          addSuffix: true,
        })}`,
        tone: 'upcoming' as const,
      };

  return {
    name: `${getRaceName(race)} Grand Prix`,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuit: race.Circuit.circuitName,
    date: format(race.dateTime, 'eee d MMM • HH:mm'),
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

  const events: Array<{ name: string; event: RaceEvent }> = isSprint
    ? [
        { name: 'Free Practice 1', event: race.FirstPractice },
        { name: 'Sprint Qualifying', event: race.SprintQualifying },
        { name: 'Sprint', event: race.Sprint },
        { name: 'Qualifying', event: race.Qualifying },
        { name: 'Race', event: race },
      ]
    : [
        { name: 'Free Practice 1', event: race.FirstPractice },
        { name: 'Free Practice 2', event: race.SecondPractice },
        { name: 'Free Practice 3', event: race.ThirdPractice },
        { name: 'Qualifying', event: race.Qualifying },
        { name: 'Race', event: race },
      ];

  // Sort events chronologically (earliest first)
  const sortedEvents = [...events].sort(
    (a, b) => a.event.dateTime.getTime() - b.event.dateTime.getTime()
  );

  return (
    <div className="w-full">
      <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-f1-gray dark:text-gray-400 flex items-center gap-2">
        <span className="h-0.5 w-6 bg-f1-red dark:bg-f1-red-light"></span>
        Weekend Schedule (Your Local Time)
      </h5>
      <div className="space-y-2">
        {sortedEvents.map(({ name, event }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border-2 border-gray-200 bg-white px-5 py-3.5 dark:border-f1-gray dark:bg-f1-black/50 transition-all hover:border-f1-red dark:hover:border-f1-red hover:shadow-md"
          >
            <span className="text-sm font-bold text-f1-black dark:text-white uppercase tracking-wide">
              {name}
            </span>
            <div className="text-right flex items-center gap-3">
              <span className="text-sm font-bold text-f1-black dark:text-white">
                {format(event.dateTime, 'EEE d MMM')}
              </span>
              <span className="text-lg font-black text-f1-red dark:text-f1-red-light">
                {format(event.dateTime, 'HH:mm')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
