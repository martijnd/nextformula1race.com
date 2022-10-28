import { RacesTransformerResult } from '@/api/ergast/types/transformers';
import {
  format,
  parseISO,
  intervalToDuration,
  formatDuration,
  isBefore,
} from 'date-fns';
import { useEffect, useState } from 'react';

export enum RaceTypes {
  FP1 = 'FP1',
  FP2 = 'FP2',
  FP3 = 'FP3',
  Qualy = 'QUALY',
  Sprint = 'SPRINT',
  Race = 'RACE',
}

const ONE_SECOND = 1000;

export default function RaceTime({ data }: { data: RacesTransformerResult }) {
  const [currentTime, setCurrentTime] = useState(
    // new Date('1 January 2023 14:59:59').getTime()
    new Date().getTime()
  );
  const [hydrated, setHydrated] = useState(false);
  const [raceType, setRaceType] = useState<RaceTypes>(RaceTypes.Race);

  useEffect(() => {
    setRaceType(
      localStorage.raceType && localStorage.raceType in Object.values(RaceTypes)
        ? localStorage.raceType
        : RaceTypes.Race
    );
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, ONE_SECOND);
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  if (!data?.races) {
    return <h2></h2>;
  }
  const nextF1Race = data.races.find((race) => {
    return !race.hasHappened() || race.isCurrentlyLive(raceType);
  });

  if (!nextF1Race) {
    return <NoRaceDisplay currentTime={currentTime} season={data.season} />;
  }

  function getRaceEvent(
    raceType: RaceTypes,
    race: RacesTransformerResult['races'][number]
  ) {
    return {
      [RaceTypes.Race]: race,
      [RaceTypes.Qualy]: race.Qualifying,
      [RaceTypes.FP1]: race.FirstPractice,
      [RaceTypes.FP2]: race.SecondPractice,
      [RaceTypes.FP3]: race.SpecialEvent,
      [RaceTypes.Sprint]: race.SpecialEvent,
    }[raceType];
  }

  const event = getRaceEvent(raceType, nextF1Race);

  const nextF1RaceDateTime = parseISO(event.dateTime.toISOString());

  const duration = formatDuration(
    intervalToDuration({
      start: currentTime,
      end: nextF1RaceDateTime,
    }),
    {
      delimiter: ', ',
    }
  );

  function getDurationString() {
    if (event.isCurrentlyLive(raceType)) {
      return (
        <a
          className="text-4xl text-red-600 hover:underline md:text-6xl"
          href="https://f1tv.formula1.com/"
          target="_blank"
          rel="noreferrer"
        >
          🔴 LIVE RIGHT NOW!
        </a>
      );
    }

    if (isBefore(nextF1RaceDateTime, currentTime)) {
      return <span className="text-red-300">Started {duration} ago</span>;
    }

    return <span>In {duration}</span>;
  }

  const formattedRaceTime = format(nextF1RaceDateTime, 'd MMMM Y, HH:mm');

  function onClickRaceType(raceType: RaceTypes) {
    setRaceType(raceType);
    localStorage.raceType = raceType;
  }

  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="hover:opacity-[0.8] transition-opacity duration-300 text-2xl md:text-6xl font-bold">
        {getDurationString()}
      </h2>
      <h3 className="hover:opacity-[0.8] transition-opacity duration-300 text-xl md:text-4xl font-semibold">
        {formattedRaceTime}
      </h3>
      <h3 className="hover:opacity-[0.8] transition-opacity duration-300 text-lg md:text-2xl font-semibold">
        <span className="font-bold">{nextF1Race.raceName}</span>, at{' '}
        <a
          className="hover:underline"
          target="_blank"
          rel="noreferrer"
          href={nextF1Race.Circuit.url}
        >
          {nextF1Race.Circuit.circuitName}
        </a>
        {/* <Link href={`/circuits/${nextF1Race.Circuit.circuitId}`}>
          <a className="hover:underline">{nextF1Race.Circuit.circuitName}</a>
        </Link> */}
      </h3>
      <div className="flex justify-center space-x-2">
        {Object.values(RaceTypes)
          .filter((type) =>
            nextF1Race.hasSprint
              ? type !== RaceTypes.FP3
              : type !== RaceTypes.Sprint
          )
          .map((type) => (
            <RaceTypeButton
              key={type}
              type={type}
              active={raceType === type}
              onClick={() => onClickRaceType(type)}
            />
          ))}
      </div>
    </div>
  );
}

interface RaceTypeButtonProps {
  active: boolean;
  type: RaceTypes;
  onClick: () => void;
}

function NoRaceDisplay({
  currentTime,
  season,
}: {
  currentTime: number;
  season: string;
}) {
  const currentYear = new Date(currentTime).getFullYear();
  const stillInCurrentSeasonYear = season === currentYear.toString();
  // If we're still in 2022 and referencing 2023 season, add 1 to the current year
  // Otherwise, add nothing
  const nextYearsSeason = stillInCurrentSeasonYear
    ? currentYear + 1
    : currentYear;

  return (
    <>
      <h1 className="text-6xl font-bold">No more races this season!</h1>
      <h2 className="mt-2 italic md:text-2xl">See you in {nextYearsSeason}!</h2>
    </>
  );
}

function RaceTypeButton({ active, onClick, type }: RaceTypeButtonProps) {
  return (
    <button
      className={`p-2 rounded text-xl font-bold hover:text-red-900 dark:hover:text-red-200 transition-colors duration-75 ${
        active ? 'text-red-600 hover:text-red-900 dark:hover:text-red-700' : ''
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}
