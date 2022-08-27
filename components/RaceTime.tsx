import useSWR from 'swr';
import {
  format,
  parseISO,
  isAfter,
  intervalToDuration,
  formatDuration,
  isBefore,
  isWithinInterval,
  addHours,
} from 'date-fns';
import { useEffect, useState } from 'react';
import useFetcher from '@/utils/useFetcher';
import { Race, RacesResponse } from '@/types/races';
import Link from 'next/link';

type RaceType = typeof RACE_TYPES[number];
const RACE_TYPES = ['FP1', 'FP2', 'FP3', 'qualy', 'race'] as const;
const HOURS_TO_ADD: Record<RaceType, number> = {
  FP1: 1,
  FP2: 1,
  FP3: 1,
  qualy: 1,
  race: 2,
};

export default function RaceTime() {
  const fetcher = useFetcher();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [raceType, setRaceType] = useState<RaceType>('race');

  const { data: raceData, error } = useSWR<RacesResponse>(
    'https://ergast.com/api/f1/current.json',
    fetcher
  );

  useEffect(() => {
    setRaceType(localStorage.raceType ?? 'race');
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
  }, []);

  if (error) return <h2>An error occured loading data.</h2>;
  if (!raceData) return <h2></h2>;

  function getRace(raceType: RaceType, race: Race) {
    return {
      race: race,
      qualy: race.Qualifying,
      FP1: race.FirstPractice,
      FP2: race.SecondPractice,
      FP3: race.ThirdPractice,
    }[raceType];
  }

  const nextF1Race = raceData.MRData.RaceTable.Races.find((race) => {
    return isAfter(parseISO(`${race.date}T${race.time}`), new Date());
  });

  if (!nextF1Race) {
    return <h1 className="text-6xl font-bold">No more races this season!</h1>;
  }

  const event = getRace(raceType, nextF1Race);

  const nextF1RaceDateTime = parseISO(`${event?.date}T${event?.time}`);

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
    const currentlyLive = isWithinInterval(currentTime, {
      start: nextF1RaceDateTime,
      end: addHours(nextF1RaceDateTime, HOURS_TO_ADD[raceType]),
    });

    if (currentlyLive) {
      return (
        <a
          className="hover:underline text-red-600 text-4xl md:text-6xl"
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

    return <span>Starting in {duration}</span>;
  }

  const formattedRaceTime = format(nextF1RaceDateTime, 'dd MMMM Y, HH:mm');

  function onClickRaceType(raceType: RaceType) {
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
      <h3 className="hover:opacity-[0.8] transition-opacity duration-300 text-lg md:text-2xl">
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
      <div className="flex space-x-2 justify-center">
        {RACE_TYPES.map((type) => (
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
  type: RaceType;
  onClick: () => void;
}

function RaceTypeButton({ active, onClick, type }: RaceTypeButtonProps) {
  return (
    <button
      className={`p-2 rounded text-xl font-bold hover:text-red-200 transition-colors duration-75 ${
        active ? 'text-red-600 hover:text-red-700' : ''
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}
