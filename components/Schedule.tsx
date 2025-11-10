import {
  RegularRaceType,
  SprintRaceType,
  RaceEvent,
} from '@/classes/race-event';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState, useEffect } from 'react';
import { RegularRace, SprintRace } from '@/classes/race';
import { useI18n } from '@/lib/i18n';
import type { Locale } from 'date-fns';
import type { Translator } from '@/lib/i18n/types';
import { getTop3Finishers, getRemainingFinishers } from '@/api/openf1';
import type { FormattedRaceResult } from '@/api/openf1/types';

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
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);
  const [now] = useState(() => new Date());
  const { t, dateLocale } = useI18n();

  const nextRace = remaining[0] ?? null;
  const upcomingRaces = nextRace ? remaining.slice(1) : remaining;

  // Auto-expand the most recent past race when past races are shown
  const mostRecentPastRace = past.length > 0 ? past[past.length - 1] : null;
  const mostRecentRaceId = mostRecentPastRace
    ? `${mostRecentPastRace.round}-${mostRecentPastRace.raceName}`
    : null;

  // Auto-expand most recent race only once when past races are first shown
  useEffect(() => {
    if (showPastRaces && mostRecentRaceId && !hasAutoExpanded) {
      setExpandedRaceId(mostRecentRaceId);
      setHasAutoExpanded(true);
    }
    // Reset auto-expand flag when past races are hidden
    if (!showPastRaces) {
      setHasAutoExpanded(false);
    }
  }, [showPastRaces, mostRecentRaceId, hasAutoExpanded]);

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
  shouldPreload?: boolean;
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
  t: Translator,
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

interface TopFinishersProps {
  race: RaceLike;
}

// Component-level cache for top finishers (per race)
const topFinishersCache = new Map<string, FormattedRaceResult[] | null>();

function TopFinishers({ race }: TopFinishersProps) {
  const [topFinishers, setTopFinishers] = useState<
    FormattedRaceResult[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    async function fetchFinishers() {
      // Create a unique cache key for this race
      const cacheKey = `${race.season}-${race.round}-${race.Circuit.Location.locality}`;

      // Check cache first
      if (topFinishersCache.has(cacheKey)) {
        setTopFinishers(topFinishersCache.get(cacheKey) || null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const year = parseInt(race.season);
        const finishers = await getTop3Finishers(
          race.dateTime,
          race.Circuit.Location.locality,
          race.Circuit.Location.country,
          year
        );

        // Cache the result (even if null)
        topFinishersCache.set(cacheKey, finishers);
        setTopFinishers(finishers);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching top finishers:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load results';
        setError(errorMessage);
        setTopFinishers(null);
        // Don't cache errors
      } finally {
        setLoading(false);
      }
    }

    // Small delay to avoid rate limiting when user expands multiple cards quickly
    const timeoutId = setTimeout(() => {
      fetchFinishers();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [race]);

  return (
    <div className="mb-6">
      <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <span className="h-0.5 w-6 bg-f1-red-light"></span>
        {t('schedule.topFinishers')}
      </h5>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((position) => {
          const finisher = topFinishers?.find((f) => f.position === position);
          const isLoading = loading && !finisher;
          const hasError = error && !finisher;
          const isEmpty = !loading && !error && !topFinishers;

          return (
            <div
              key={position}
              className={`rounded-lg border-2 p-3 transition-all ${
                position === 1
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : position === 2
                  ? 'border-gray-400 bg-gray-400/10'
                  : 'border-amber-600 bg-amber-600/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-lg font-black ${
                    position === 1
                      ? 'text-yellow-500'
                      : position === 2
                      ? 'text-gray-400'
                      : 'text-amber-600'
                  }`}
                >
                  {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  P{position}
                </span>
              </div>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <svg
                    className="animate-spin h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              {hasError && (
                <div className="text-xs text-gray-500 py-4 text-center">
                  Error
                </div>
              )}
              {isEmpty && (
                <div className="text-xs text-gray-500 py-4 text-center">—</div>
              )}
              {finisher && (
                <>
                  <div className="text-sm font-bold text-white truncate">
                    {finisher.driverName.split(' ')[0]}
                  </div>
                  <div className="text-xs font-medium text-gray-400 truncate">
                    {finisher.driverName.split(' ').slice(1).join(' ')}
                  </div>
                  <div
                    className="text-xs font-bold mt-1 truncate"
                    style={{ color: `#${finisher.teamColour}` }}
                  >
                    {finisher.teamName}
                  </div>
                  {finisher.timeOrStatus && (
                    <div className="text-xs font-medium text-gray-500 mt-1">
                      {finisher.timeOrStatus}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface RemainingFinishersProps {
  race: RaceLike;
}

// Component-level cache for remaining finishers (per race)
const remainingFinishersCache = new Map<string, FormattedRaceResult[] | null>();

function RemainingFinishers({ race }: RemainingFinishersProps) {
  const [remainingFinishers, setRemainingFinishers] = useState<
    FormattedRaceResult[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    async function fetchFinishers() {
      // Create a unique cache key for this race
      const cacheKey = `${race.season}-${race.round}-${race.Circuit.Location.locality}-remaining`;

      // Check cache first
      if (remainingFinishersCache.has(cacheKey)) {
        setRemainingFinishers(remainingFinishersCache.get(cacheKey) || null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const year = parseInt(race.season);
        const finishers = await getRemainingFinishers(
          race.dateTime,
          race.Circuit.Location.locality,
          race.Circuit.Location.country,
          year
        );

        // Cache the result (even if null)
        remainingFinishersCache.set(cacheKey, finishers);
        setRemainingFinishers(finishers);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching remaining finishers:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load results';
        setError(errorMessage);
        setRemainingFinishers(null);
        // Don't cache errors
      } finally {
        setLoading(false);
      }
    }

    // Small delay to avoid rate limiting when user expands multiple cards quickly
    const timeoutId = setTimeout(() => {
      fetchFinishers();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [race]);

  if (loading) {
    return (
      <div className="mt-6">
        <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <span className="h-0.5 w-6 bg-f1-red-light"></span>
          {t('schedule.remainingFinishers')}
        </h5>
        <div className="text-sm text-gray-500 text-center py-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <span className="h-0.5 w-6 bg-f1-red-light"></span>
          {t('schedule.remainingFinishers')}
        </h5>
        <div className="text-xs text-gray-500 text-center py-4">{error}</div>
      </div>
    );
  }

  if (!remainingFinishers || remainingFinishers.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <span className="h-0.5 w-6 bg-f1-red-light"></span>
        {t('schedule.remainingFinishers')}
      </h5>
      <div className="space-y-2">
        {remainingFinishers.map((finisher) => (
          <div
            key={finisher.position}
            className="grid grid-cols-12 gap-3 items-center rounded-lg border-2 border-f1-gray bg-f1-black/50 px-4 py-3 transition-all hover:border-f1-red hover:shadow-md"
          >
            <div className="col-span-2 row-span-2 md:row-span-1 md:col-span-1 text-sm font-black text-gray-400 flex items-center justify-center">
              {finisher.position}
            </div>
            <div className="col-span-10 text-left md:col-span-5 text-sm font-bold text-white truncate">
              {finisher.driverName}
            </div>
            <div className="col-span-5 text-left md:col-span-4 text-xs font-bold truncate">
              <span style={{ color: `#${finisher.teamColour}` }}>
                {finisher.teamName}
              </span>
            </div>
            <div className="col-span-5 md:col-span-1 text-xs font-medium text-gray-500 text-right">
              {finisher.timeOrStatus || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
            className="grid rounded-lg items-center grid-cols-5 border-2 border-f1-gray bg-f1-black/50 px-5 py-3.5 transition-all hover:border-f1-red hover:shadow-md"
          >
            <span className="text-sm col-span-2 font-bold text-white uppercase tracking-wide text-left">
              {name}
            </span>
            <span className="text-sm col-span-2 font-bold text-white">
              {format(event.dateTime, 'EEE d MMM', { locale: dateLocale })}
            </span>
            <span className="text-lg col-span-1 font-black text-f1-red-light">
              {format(event.dateTime, 'HH:mm')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
