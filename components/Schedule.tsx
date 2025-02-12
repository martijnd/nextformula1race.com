import { ResultsTransformerResult } from '@/api/ergast/types/transformers';

import { RegularRaceType } from '@/classes/race-event';
import { RaceResult } from '@/classes/race-result';
import format from 'date-fns/format';
import { useState } from 'react';
import { Trophy } from './Trophy';
import { RegularRace, SprintRace } from '@/classes/race';

interface ScheduleProps {
  show: boolean;
  data: ResultsTransformerResult;
  remaining: (RegularRace | SprintRace)[];
}

export default function Schedule({ show, data, remaining }: ScheduleProps) {
  const [showAllRaces, setShowAllRaces] = useState(false);
  const nextF1Race = remaining.find((race) => {
    return !race.hasHappened() || race.isCurrentlyLive(RegularRaceType.Race);
  });

  return (
    <div
      className={`w-full duration-1000 transition-opacity p-4 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="mt-8 mb-16 text-6xl font-bold text-gray-800">Schedule</h2>

      <div className={`relative ${!showAllRaces ? 'pt-12' : ''}`}>
        {!showAllRaces && (
          <div className="absolute z-10 w-full h-96 bg-gradient-to-b from-white to-white/0 -top-px">
            <button
              onClick={() => setShowAllRaces(true)}
              className="px-4 py-2 font-semibold text-blue-400 transition rounded text-md hover:text-blue-300"
            >
              Show all races
            </button>
          </div>
        )}
        <div className="max-w-md mx-auto space-y-4">
          {data
            ? [
                ...data.races.filter((_, index) =>
                  showAllRaces ? true : index + 1 >= data.races.length - 1
                ),
                ...remaining.slice(0, showAllRaces ? undefined : 3),
              ].map(
                (
                  race: (RegularRace | SprintRace) | RaceResult,
                  index,
                  races
                ) => (
                  <div key={race.raceName}>
                    <div
                      className={`${
                        nextF1Race?.raceName === race.raceName
                          ? 'bg-gradient-to-tr from-blue-300 to-blue-700 shadow-lg p-24 text-2xl'
                          : 'p-8'
                      } rounded-lg shadow hover:shadow-2xl transition-shadow overflow-hidden relative ${
                        race.hasHappened() ? 'bg-green-600' : 'bg-white'
                      } ${
                        nextF1Race?.raceName === race.raceName ||
                        race.hasHappened()
                          ? 'text-white'
                          : 'text-black'
                      }`}
                    >
                      {nextF1Race?.raceName === race.raceName && (
                        <div className="absolute font-bold text-7xl md:text-8xl -top-6 md:-top-8 -right-3 md:-right-4 text-blue-400/30">
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
                )
              )
            : 'loading...'}
        </div>
      </div>
    </div>
  );
}
