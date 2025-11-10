import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  getChampionshipStandings,
  type ChampionshipStandings,
  type DriverStanding,
  type ConstructorStanding,
} from '@/api/openf1';
import { useI18n } from '@/lib/i18n';
import { Position } from './Position';

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

function DriverStandingsTable({ drivers }: { drivers: DriverStanding[] }) {
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
            {drivers.map((driver) => (
              <tr
                key={`${driver.driverName}-${driver.position}`}
                className={`border-b border-f1-gray transition-colors hover:bg-f1-red/10 ${
                  driver.position === 1
                    ? 'bg-gradient-to-r from-yellow-900/10 to-transparent'
                    : ''
                }`}
              >
                <td className="px-6 py-4 w-12">
                  <Position position={driver.position} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {driver.headshotUrl && (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={driver.headshotUrl}
                          alt={driver.driverName}
                          width={32}
                          height={32}
                          className="rounded-full object-cover border-2 border-f1-gray"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="font-bold text-white">
                      {driver.driverName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="text-sm font-bold"
                    style={{ color: `#${driver.teamColour}` }}
                  >
                    {driver.teamName}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-black text-white">
                    {driver.points}
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
  constructors,
}: {
  constructors: ConstructorStanding[];
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
            {constructors.map((constructor) => (
              <tr
                key={constructor.teamName}
                className={`border-b border-f1-gray transition-colors hover:bg-f1-red/10 ${
                  constructor.position === 1
                    ? 'bg-gradient-to-r from-yellow-900/10 to-transparent'
                    : ''
                }`}
              >
                <td className="px-6 py-4 w-12">
                  <Position position={constructor.position} />
                </td>
                <td className="px-6 py-4">
                  <span
                    className="font-bold text-lg"
                    style={{ color: `#${constructor.teamColour}` }}
                  >
                    {constructor.teamName}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-black text-white">
                    {constructor.points}
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
