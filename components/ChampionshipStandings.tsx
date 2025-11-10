import { useEffect, useState } from 'react';
import {
  getChampionshipStandings,
  type ChampionshipStandings,
  type DriverStanding,
  type ConstructorStanding,
} from '@/api/openf1';
import { useI18n } from '@/lib/i18n';
import { Trophy } from './Trophy';

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
          <DriverStandingsTable standings={standings.drivers} />
          <ConstructorStandingsTable standings={standings.constructors} />
        </div>
      )}
    </div>
  );
}

function DriverStandingsTable({ standings }: { standings: DriverStanding[] }) {
  const { t } = useI18n();

  return (
    <div>
      <h3 className="mb-6 text-xl font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
        <span className="h-1 w-12 bg-f1-red-light"></span>
        {t('championship.drivers')}
        <span className="h-1 flex-1 bg-f1-red-light"></span>
      </h3>
      <div className="overflow-x-auto">
        <table className="text-left table-auto w-full max-w-screen-md mx-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-f1-red-light">
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400"></th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                {t('championship.driver')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                {t('championship.team')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-f1-red-light">
                {t('championship.points')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-f1-black/50">
            {standings.map((standing) => (
              <tr
                key={`${standing.driverName}-${standing.position}`}
                className={`border-b border-f1-gray transition-colors hover:bg-f1-red/10 ${
                  standing.position === 1
                    ? 'bg-gradient-to-r from-yellow-900/10 to-transparent'
                    : ''
                }`}
              >
                <td className="px-6 py-4 w-12">
                  <span
                    className={`text-lg font-black ${
                      standing.position === 1
                        ? 'text-f1-red-light'
                        : standing.position === 2
                        ? 'text-gray-400'
                        : standing.position === 3
                        ? 'text-orange-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {standing.position}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {standing.position === 1 && (
                      <Trophy color="text-yellow-400" />
                    )}
                    {standing.position === 2 && (
                      <Trophy color="text-gray-500" />
                    )}
                    {standing.position === 3 && (
                      <Trophy color="text-orange-500" />
                    )}
                    <span className="font-bold text-white">
                      {standing.driverName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="text-sm font-bold"
                    style={{ color: `#${standing.teamColour}` }}
                  >
                    {standing.teamName}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-black text-white">
                    {standing.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConstructorStandingsTable({
  standings,
}: {
  standings: ConstructorStanding[];
}) {
  const { t } = useI18n();

  return (
    <div>
      <h3 className="mb-6 text-xl font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
        <span className="h-1 w-12 bg-f1-red-light"></span>
        {t('championship.constructors')}
        <span className="h-1 flex-1 bg-f1-red-light"></span>
      </h3>
      <div className="overflow-x-auto">
        <table className="text-left table-auto w-full max-w-screen-md mx-auto border-collapse">
          <thead>
            <tr className="border-b-2 border-f1-red-light">
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400"></th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                {t('championship.constructor')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-f1-red-light">
                {t('championship.points')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-f1-black/50">
            {standings.map((standing) => (
              <tr
                key={standing.teamName}
                className={`border-b border-f1-gray transition-colors hover:bg-f1-red/10 ${
                  standing.position === 1
                    ? 'bg-gradient-to-r from-yellow-900/10 to-transparent'
                    : ''
                }`}
              >
                <td className="px-6 py-4 w-12">
                  <span
                    className={`text-lg font-black ${
                      standing.position === 1
                        ? 'text-f1-red-light'
                        : standing.position === 2
                        ? 'text-gray-400'
                        : standing.position === 3
                        ? 'text-orange-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {standing.position}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {standing.position === 1 && (
                      <Trophy color="text-yellow-400" />
                    )}
                    {standing.position === 2 && (
                      <Trophy color="text-gray-500" />
                    )}
                    {standing.position === 3 && (
                      <Trophy color="text-orange-500" />
                    )}
                    <span
                      className="font-bold text-lg"
                      style={{ color: `#${standing.teamColour}` }}
                    >
                      {standing.teamName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-black text-white">
                    {standing.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
