import useFetcher from "@/utils/useFetcher";
import useSWR from "swr";
import { StandingsResponse } from "@/types/standings";
import Link from "next/link";

export default function Standings() {
  const { data, error } = useSWR<StandingsResponse>(
    "https://ergast.com/api/f1/current/driverStandings.json",
    useFetcher()
  );

  if (!data) return <h2>Loading...</h2>;
  if (error) return <h2>An error occured loading data.</h2>;

  return (
    <>
      <h2 className="text-6xl font-bold my-8">Standings</h2>

      <table className="text-left table-auto w-full max-w-screen-md">
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
            <tr key={position} className={`${index % 2 === 1 ? "bg-slate-300" : ""}`}>
              <td className="p-4">{position}</td>
              <td className="p-4 font-bold"><Link href={Driver.url} target="_blank">{`${Driver.givenName} ${Driver.familyName}`}</Link></td>
              <td className="text-right p-4">{points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
