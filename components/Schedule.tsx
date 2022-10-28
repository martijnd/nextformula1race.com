import { ResultsTransformerResult } from '@/api/ergast/types/transformers';
import { Race } from '@/classes/race';
import { RaceResult } from '@/classes/race-result';
import format from 'date-fns/format';

export default function Schedule({
  show,
  data,
  remaining,
}: {
  show: boolean;
  data?: ResultsTransformerResult;
  remaining: Race[];
}) {
  return (
    <div
      className={`w-full duration-1000 transition-opacity p-4 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-6xl font-bold my-8 text-gray-800">Schedule</h2>

      <div className="mx-auto max-w-md space-y-4">
        {data
          ? [...data.races, ...remaining].map(
              (race: Race | RaceResult, index, races) => (
                <div key={race.raceName}>
                  <div
                    className={`text-black rounded-lg shadow hover:shadow-2xl transition-shadow p-8 overflow-hidden relative ${
                      race.hasHappened() ? 'bg-green-600 text-white' : ''
                    }`}
                  >
                    {race.hasHappened() && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-32 h-32 -top-10 -right-10 absolute text-green-500/30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}

                    <h2 className="font-bold">{race.Circuit.circuitName}</h2>

                    <h3>
                      {format(new Date(race.dateTime), 'd MMMM Y, HH:mm')}
                    </h3>
                    {race.hasHappened() && race instanceof RaceResult && (
                      <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-4 max-w-xs mx-auto">
                        <div className="col-start-2 col-span-2 flex justify-center gap-1 items-center font-semibold">
                          <Trophy color="text-orange-400" />
                          {race.getDriverAtPosition(1)?.familyName}
                        </div>
                        <div className="row-start-2 col-start-1 col-span-2 flex justify-center gap-1 items-center">
                          <Trophy color="text-gray-200" />
                          {race.getDriverAtPosition(2)?.familyName}
                        </div>
                        <div className="row-start-2 col-start-3 col-span-2 flex justify-center gap-1 items-center">
                          <Trophy color="text-yellow-800" />
                          {race.getDriverAtPosition(3)?.familyName}
                        </div>
                      </div>
                    )}
                  </div>
                  {index !== races.length - 1 && (
                    <div
                      className={`${
                        race.hasHappened() ? 'text-green-600' : 'text-black'
                      } mt-4 flex justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )
            )
          : 'loading...'}
      </div>
    </div>
  );
}

function Trophy({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-5 h-5 ${color}`}
    >
      <path
        fillRule="evenodd"
        d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332z"
        clipRule="evenodd"
      />
    </svg>
  );
}
