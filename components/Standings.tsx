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
      <h2 className="text-6xl font-bold mt-8 mb-16 text-gray-800">Standings</h2>

      <table className={`text-left table-auto w-full max-w-screen-md mx-auto`}>
        <thead className="uppercase text-gray-400">
          <tr>
            <th className="px-4"></th>
            <th className="px-4">Name</th>
            <th className="text-right px-4">Points</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {data
            ? data.drivers
                .slice(0, 20)
                .map(({ name, position, points, url }, index) => (
                  <tr key={position} className="hover:bg-gray-100/40">
                    <td className="p-4 w-5">{position}</td>
                    <td className="p-4 font-semibold">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-2"
                      >
                        {position === '1' && <Trophy color="text-orange-400" />}
                        {position === '2' && <Trophy color="text-gray-300" />}
                        {position === '3' && <Trophy color="text-yellow-800" />}
                        {name}
                      </a>
                    </td>
                    <td className="text-right p-4">{points}</td>
                  </tr>
                ))
            : [...Array(20)].map((e, i) => (
                <tr
                  key={i}
                  className={`hover:bg-slate-100 animate-pulse ${
                    i % 2 === 1 ? 'bg-slate-100' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded-full w-4"></div>
                  </td>
                  <td className="p-4">
                    <div
                      className={`h-4 bg-gray-200 rounded-full ${getWidthClass()}`}
                    ></div>
                  </td>
                  <td className="p-4 flex justify-end">
                    <div
                      className={`h-4 bg-gray-300 rounded-full ${
                        i > 7 ? 'w-10' : 'w-12'
                      }`}
                    ></div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
