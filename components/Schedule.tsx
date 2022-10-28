import { RacesTransformerResult } from '@/api/ergast/types/transformers';
import format from 'date-fns/format';

export default function Schedule({
  show,
  data,
}: {
  show: boolean;
  data?: RacesTransformerResult;
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
          ? data.races.map((race, index) => (
              <>
                <div
                  key={race.raceName}
                  className={`text-black rounded-lg shadow hover:shadow-2xl transition-shadow p-4 overflow-hidden relative ${
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
                  <div className="flex justify-center items-center gap-4">
                    <h2 className="font-bold">{race.Circuit.circuitName}</h2>{' '}
                  </div>
                  <h3>{format(new Date(race.dateTime), 'd MMMM Y, HH:mm')}</h3>
                </div>
                {index !== data.races.length - 1 && (
                  <div className="text-black mt-2 flex justify-center">
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
              </>
            ))
          : 'loading...'}
      </div>
    </div>
  );
}
