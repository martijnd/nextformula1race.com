import { RegularRaceType, SprintRaceType } from '@/classes/race-event';
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
  const [now] = useState(() => new Date());

  const nextRace = remaining[0] ?? null;
  const upcomingRaces = nextRace ? remaining.slice(1) : remaining;

  return (
    <div
      className={`w-full max-w-5xl mx-auto p-4 transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="mt-8 text-center text-4xl font-bold text-neutral-900 dark:text-neutral-50 md:text-5xl">
        2025 Season Schedule
      </h2>

      {nextRace && <NextRaceCard race={nextRace} now={now} />}

      <RaceGrid
        title="Upcoming races"
        emptyLabel="All done for this season."
        races={upcomingRaces}
        now={now}
      />

      {past.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setShowPastRaces((value) => !value)}
            className="mx-auto flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:text-neutral-100 dark:hover:shadow-md"
            aria-expanded={showPastRaces}
          >
            {showPastRaces ? 'Hide completed races' : 'Show completed races'}
          </button>
          {showPastRaces && (
            <RaceGrid
              title="Completed races"
              emptyLabel="No races completed yet."
              races={past}
              now={now}
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
    <div className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-white p-6 shadow-lg backdrop-blur dark:border-red-500/30 dark:bg-gradient-to-br dark:from-red-500/20 dark:via-neutral-900/90 dark:to-neutral-950 dark:shadow-red-900/30 dark:backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700 dark:bg-red-500/35 dark:text-red-100">
            Next race
          </span>
          <h3 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-50 md:text-3xl">
            {descriptor.name}
          </h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Round {race.round} • {descriptor.country}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-200">
            {descriptor.status.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-neutral-800 dark:text-neutral-50">
            {descriptor.date}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {descriptor.locality}
          </p>
        </div>
      </div>
      {descriptor.isSprint && (
        <p className="mt-4 text-sm font-medium text-red-700 dark:text-red-200">
          Sprint weekend • extra action on Saturday!
        </p>
      )}
    </div>
  );
}

interface RaceGridProps {
  title: string;
  emptyLabel: string;
  races: RaceLike[];
  now: Date;
}

function RaceGrid({ title, emptyLabel, races, now }: RaceGridProps) {
  if (races.length === 0) {
    return (
      <div className="mt-10 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <ul className="grid gap-4 max-w-screen-sm mx-auto">
        {races.map((race) => (
          <li key={`${race.round}-${race.raceName}`}>
            <RaceCard race={race} now={now} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RaceCard({ race, now }: { race: RaceLike; now: Date }) {
  const descriptor = buildRaceDescriptor(race, now);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white/80 p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:backdrop-blur-sm dark:hover:border-neutral-500 dark:hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {descriptor.name}
            </h4>
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Round {race.round}
            </p>
          </div>
          <StatusPill tone={descriptor.status.tone}>
            {descriptor.status.label}
          </StatusPill>
        </div>
        <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
          {descriptor.date}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {descriptor.locality} • {descriptor.country}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800/80">
          {descriptor.circuit}
        </span>
        {descriptor.isSprint && (
          <span className="rounded-full bg-red-100 px-2 py-1 text-red-700 dark:bg-red-500/30 dark:text-red-100">
            Sprint
          </span>
        )}
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
    'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors';
  if (tone === 'live') {
    return (
      <span
        className={`${base} bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-100`}
      >
        {children}
      </span>
    );
  }
  if (tone === 'completed') {
    return (
      <span
        className={`${base} bg-neutral-100 text-neutral-600 dark:bg-neutral-800/80 dark:text-neutral-200`}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-100`}
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
