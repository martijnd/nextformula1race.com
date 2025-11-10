import { useState, useEffect } from 'react';
import { getRemainingFinishers } from '@/api/openf1';
import type { FormattedRaceResult } from '@/api/openf1/types';
import { useI18n } from '@/lib/i18n';
import { type RaceLike } from './schedule-utils';

interface RemainingFinishersProps {
  race: RaceLike;
}

// Component-level cache for remaining finishers (per race)
const remainingFinishersCache = new Map<string, FormattedRaceResult[] | null>();

export function RemainingFinishers({ race }: RemainingFinishersProps) {
  const [remainingFinishers, setRemainingFinishers] = useState<
    FormattedRaceResult[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    async function fetchFinishers() {
      // Create a unique cache key for this race
      const cacheKey = `${race.season}-${race.round}-${race.circuit.location.locality}-remaining`;

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
        if (isNaN(year)) {
          throw new Error('Invalid season year');
        }
        const finishers = await getRemainingFinishers(
          race.dateTime,
          race.circuit.location.locality,
          race.circuit.location.country,
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
            key={finisher.driverNumber}
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
            <div className="col-span-5 md:col-span-2 text-xs font-medium text-gray-500 text-right">
              {finisher.timeOrStatus || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

