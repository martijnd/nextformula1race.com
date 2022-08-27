import useFetcher from '@/utils/useFetcher';
import useSWR from 'swr';
import { StandingsResponse } from '@/types/standings';

export default function Standings({ show }: { show: boolean }) {
  const { data, error } = useSWR<StandingsResponse>(
    'https://ergast.com/api/f1/current/driverStandings.json',
    useFetcher()
  );

  if (!data) return <h2>Loading...</h2>;
  if (error) return <h2>An error occured loading data.</h2>;

  return (
    <div
      className={`w-full duration-1000 transition-opacity ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-6xl font-bold my-8 text-gray-800">Standings</h2>

      <table className={`text-left table-auto w-full max-w-screen-md mx-auto`}>
        <thead className="uppercase text-gray-400">
          <tr>
            <th className="px-4"></th>
            <th className="px-4">Name</th>
            <th className="text-right px-4">Points</th>
          </tr>
        </thead>
        <tbody className="text-slate-700 font-semibold">
          {data.MRData.StandingsTable.StandingsLists[0].DriverStandings.slice(
            0,
            20
          ).map(({ Driver, position, points }, index) => (
            <tr
              key={position}
              className={`border-b border-gray-300 hover:bg-slate-200 ${
                index % 2 === 1 ? 'bg-slate-100' : ''
              }`}
            >
              <td className="p-4">{position}</td>
              <td className="p-4 font-bold">
                <a
                  href={Driver.url}
                  target="_blank"
                  rel="noreferrer"
                >{`${Driver.givenName} ${Driver.familyName}`}</a>
              </td>
              <td className="text-right p-4">{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
