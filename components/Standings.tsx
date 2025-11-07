import { StandingsTransformerResult } from '@/api/ergast/types/transformers';
import { Trophy } from './Trophy';

interface StandingsProps {
  show: boolean;
  data?: StandingsTransformerResult;
}

export default function Standings({ show, data }: StandingsProps) {
  function getWidthClass() {
    const items = ['w-28', 'w-32', 'w-36'];
    return items[Math.floor(Math.random() * items.length)];
  }

  return (
    <div
      className={`w-full duration-1000 transition-opacity ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative mb-12">
        <h2 className="text-5xl md:text-7xl font-black mt-8 mb-4 text-white">
          Standings
        </h2>
        <div className="mx-auto mt-10 w-48 h-1 bg-f1-red-light rounded"></div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`text-left table-auto w-full max-w-screen-md mx-auto border-collapse`}
        >
          <thead>
            <tr className="border-b-2 border-f1-red-light">
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400"></th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                Driver
              </th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-f1-red-light">
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-f1-black/50">
            {data
              ? data.drivers
                  .slice(0, 20)
                  .map(({ name, position, points, url }, index) => (
                    <tr
                      key={position}
                      className={`border-b border-f1-gray transition-colors hover:bg-f1-red/10 ${
                        position === '1'
                          ? 'bg-gradient-to-r from-yellow-900/10 to-transparent'
                          : ''
                      }`}
                    >
                      <td className="px-6 py-4 w-12">
                        <span
                          className={`text-lg font-black ${
                            position === '1'
                              ? 'text-f1-red-light'
                              : position === '2'
                              ? 'text-gray-400'
                              : position === '3'
                              ? 'text-orange-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-f1-red-light transition-colors flex items-center gap-3 group"
                        >
                          {position === '1' && (
                            <Trophy color="text-yellow-400" />
                          )}
                          {position === '2' && <Trophy color="text-gray-500" />}
                          {position === '3' && (
                            <Trophy color="text-orange-500" />
                          )}
                          <span className="font-bold text-white group-hover:underline">
                            {name}
                          </span>
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-black text-white">
                          {points}
                        </span>
                      </td>
                    </tr>
                  ))
              : [...Array(20)].map((e, i) => (
                  <tr
                    key={i}
                    className={`border-b border-f1-gray animate-pulse ${
                      i % 2 === 1 ? 'bg-f1-black/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="h-5 bg-f1-gray rounded w-6"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`h-5 bg-f1-gray rounded ${getWidthClass()}`}
                      ></div>
                    </td>
                    <td className="px-6 py-4 flex justify-end">
                      <div
                        className={`h-5 bg-f1-gray rounded ${
                          i > 7 ? 'w-10' : 'w-12'
                        }`}
                      ></div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
