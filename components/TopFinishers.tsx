import { useState, useEffect } from 'react';
import { getTop3Finishers } from '@/api/openf1';
import type { FormattedRaceResult } from '@/api/openf1/types';
import { useI18n } from '@/lib/i18n';
import { type RaceLike } from './schedule-utils';

interface TopFinishersProps {
  race: RaceLike;
}

// Component-level cache for top finishers (per race)
const topFinishersCache = new Map<string, FormattedRaceResult[] | null>();

export function TopFinishers({ race }: TopFinishersProps) {
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
        if (isNaN(year)) {
          throw new Error('Invalid season year');
        }
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

