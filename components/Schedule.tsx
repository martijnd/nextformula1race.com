import { ResultsTransformerResult } from '@/api/ergast/types/transformers';
import { Race } from '@/classes/race';
import { RaceResult } from '@/classes/race-result';
import format from 'date-fns/format';
import { useState } from 'react';
import { RaceTypes } from './RaceTime';

export default function Schedule({
  show,
  data,
  remaining,
}: {
  show: boolean;
  data: ResultsTransformerResult;
  remaining: Race[];
}) {
  const [showAllRaces, setShowAllRaces] = useState(false);
  const nextF1Race = remaining.find((race) => {
    return !race.hasHappened() || race.isCurrentlyLive(RaceTypes.Race);
  });

  return (
    <div
      className={`w-full duration-1000 transition-opacity p-4 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="my-8 text-6xl font-bold text-gray-800">Schedule</h2>

      <div className={`relative ${!showAllRaces ? 'pt-12' : ''}`}>
        {!showAllRaces && (
          <div className="absolute z-10 w-full h-96 bg-gradient-to-b from-white to-white/0 -top-px">
            <button
              onClick={() => setShowAllRaces(true)}
              className="px-4 py-2 font-semibold text-blue-400 transition rounded text-md hover:text-blue-300"
            >
              &uarr; Show all races
            </button>
          </div>
        )}
        <div className="max-w-md mx-auto space-y-4">
          {data
            ? [
                ...data.races.filter((_, index) =>
                  showAllRaces ? true : index + 1 >= data.races.length - 1
                ),
                ...remaining,
              ].map((race: Race | RaceResult, index, races) => (
                <div key={race.raceName}>
                  <div
                    className={`${
                      nextF1Race?.raceName === race.raceName
                        ? 'bg-gradient-to-tr from-blue-300 to-blue-700 text-white shadow-lg p-24 text-2xl'
                        : 'bg-white'
                    } text-black rounded-lg shadow hover:shadow-2xl transition-shadow p-8 overflow-hidden relative ${
                      race.hasHappened() ? 'bg-green-600 text-white' : ''
                    }`}
                  >
                    {nextF1Race?.raceName === race.raceName && (
                      <div className="absolute text-8xl font-bold -top-8 -right-4 text-blue-400/30">
                        Next race
                      </div>
                    )}

                    {race.hasHappened() && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute w-32 h-32 -top-10 -right-10 text-green-500/30"
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
                      <div className="grid max-w-xs grid-cols-4 grid-rows-2 gap-2 mx-auto mt-4">
                        <div className="flex items-center justify-center col-span-2 col-start-2 gap-1 font-semibold">
                          <Trophy color="text-orange-400" />
                          {race.getDriverAtPosition(1)?.familyName}
                        </div>
                        <div className="flex items-center justify-center col-span-2 col-start-1 row-start-2 gap-1">
                          <Trophy color="text-gray-200" />
                          {race.getDriverAtPosition(2)?.familyName}
                        </div>
                        <div className="flex items-center justify-center col-span-2 col-start-3 row-start-2 gap-1">
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
              ))
            : 'loading...'}
        </div>
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
