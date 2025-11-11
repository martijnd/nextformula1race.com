import { type RaceLike } from './schedule-utils';
import { RaceCard } from './RaceCard';

interface RaceGridProps {
  title: string;
  emptyLabel: string;
  races: RaceLike[];
  now: Date;
  isUpcoming: boolean;
}

export function RaceGrid({
  title,
  emptyLabel,
  races,
  now,
  isUpcoming,
}: RaceGridProps) {
  if (races.length === 0) {
    return (
      <div className="mt-10 text-center text-sm font-medium text-neutral-400">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="mb-6 text-xl font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
        <span className="h-1 w-12 bg-f1-red-light"></span>
        {title}
        <span className="h-1 flex-1 bg-f1-red-light"></span>
      </h3>
      <ul className="grid gap-4 max-w-screen-sm mx-auto">
        {races.map((race) => {
          const raceId = `${race.round}-${race.raceName}`;
          return (
            <li key={raceId}>
              <RaceCard race={race} now={now} isUpcoming={isUpcoming} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
