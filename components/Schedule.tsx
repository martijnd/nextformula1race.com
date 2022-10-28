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
      className={`w-full duration-1000 transition-opacity ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-6xl font-bold my-8 text-gray-800">Schedule</h2>

      <div className="mx-auto max-w-md space-y-8">
        {data
          ? data.races.map((race, index) => (
              <div
                key={race.raceName}
                className="text-black rounded shadow p-4"
              >
                <div className="flex justify-center items-center gap-4">
                  <h2 className="font-bold">{race.Circuit.circuitName}</h2>{' '}
                </div>
                <h3>{format(new Date(race.dateTime), 'd MMMM Y, HH:mm')}</h3>
              </div>
            ))
          : 'loading...'}
      </div>
    </div>
  );
}
