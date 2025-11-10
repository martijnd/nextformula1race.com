import { useEffect, useState } from 'react';
import {
  getChampionshipStandings,
  type ChampionshipStandings,
} from '@/api/openf1';
import { useI18n } from '@/lib/i18n';
import { DriverStandingsTable } from './DriverStandingsTable';
import { ConstructorStandingsTable } from './ConstructorStandingsTable';

interface ChampionshipStandingsProps {
  show: boolean;
  year: number;
}

export default function ChampionshipStandings({
  show,
  year,
}: ChampionshipStandingsProps) {
  const [standings, setStandings] = useState<ChampionshipStandings | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!show) return;

    async function fetchStandings() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChampionshipStandings(year);
        setStandings(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching championship standings:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load standings'
        );
      } finally {
        setLoading(false);
      }
    }

    // Small delay to avoid rate limiting
    const timeoutId = setTimeout(() => {
      fetchStandings();
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [show, year]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-5xl mx-auto p-4 transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative mb-12">
        <h2 className="text-center text-4xl md:text-6xl font-black text-white">
          {t('championship.title')}
        </h2>
        <div className="mx-auto mt-10 w-48 h-1 bg-f1-red-light rounded"></div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-f1-red-light"></div>
          <p className="mt-4 text-gray-400">{t('championship.loading')}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-f1-red-light">{error}</p>
        </div>
      )}

      {standings && !loading && !error && (
        <div className="space-y-12">
          <DriverStandingsTable drivers={standings.drivers} />
          <ConstructorStandingsTable constructors={standings.constructors} />
        </div>
      )}
    </div>
  );
}
