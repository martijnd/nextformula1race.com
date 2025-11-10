import type { DriverStanding } from '@/api/openf1';
import { useI18n } from '@/lib/i18n';
import { Position } from './Position';
import Image from 'next/image';

interface DriverStandingsTableProps {
  drivers: DriverStanding[];
}

export function DriverStandingsTable({ drivers }: DriverStandingsTableProps) {
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
                    <span className="font-bold text-white">
                      {driver.driverName}
                    </span>
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

