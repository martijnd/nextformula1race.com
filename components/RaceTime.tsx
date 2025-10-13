import { atcb_action } from 'add-to-calendar-button';
import { RacesTransformerResult } from '@/api/ergast/types/transformers';
import {
  format,
  parseISO,
  intervalToDuration,
  formatDuration,
  isBefore,
  addHours,
} from 'date-fns';
import { useEffect, useState } from 'react';
import {
  HOURS_TO_ADD,
  RaceType,
  RaceEvent,
  RegularRaceType,
  SprintRaceType,
} from '@/classes/race-event';
import { RegularRace, SprintRace } from '@/classes/race';

const ONE_SECOND = 1000;

interface RaceTimeProps {
  data: RacesTransformerResult;
}

export default function RaceTime({ data }: RaceTimeProps) {
  const [currentTime, setCurrentTime] = useState(
    // new Date('31 December 2022 14:59:59')
    new Date()
  );
  const [hydrated, setHydrated] = useState(false);
  const [raceType, setRaceType] = useState<RaceType>(RegularRaceType.Race);
  useEffect(() => {
    setRaceType(
      localStorage.raceType ? localStorage.raceType : RegularRaceType.Race
    );
    setInterval(() => {
      setCurrentTime(new Date());
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
    return (
      !race.hasHappened(currentTime) ||
      race.isCurrentlyLive(raceType, currentTime)
    );
  });

  if (!nextF1Race) {
    return <NoRaceDisplay currentTime={currentTime} season={data.season} />;
  }

  function getRaceEvent(
    raceType: RaceType,
    race: RacesTransformerResult['races'][number]
  ): RaceEvent | undefined {
    if ('Sprint' in race) {
      // Sprint weekend
      const sprintEvents: Partial<Record<SprintRaceType, RaceEvent>> = {
        [SprintRaceType.Race]: race,
        [SprintRaceType.Qualy]: race.Qualifying,
        [SprintRaceType.FP1]: race.FirstPractice,
        [SprintRaceType.SprintQualy]: race.SprintQualifying,
        [SprintRaceType.Sprint]: race.Sprint,
      };
      return sprintEvents[raceType as SprintRaceType];
    } else {
      // Regular weekend
      const regularEvents: Partial<Record<RegularRaceType, RaceEvent>> = {
        [RegularRaceType.Race]: race,
        [RegularRaceType.Qualy]: race.Qualifying,
        [RegularRaceType.FP1]: race.FirstPractice,
        [RegularRaceType.FP2]: race.SecondPractice,
        [RegularRaceType.FP3]: race.ThirdPractice,
      };
      return regularEvents[raceType as RegularRaceType];
    }
  }

  const event = getRaceEvent(raceType, nextF1Race);

  if (!event) {
    // eslint-disable-next-line no-console
    console.error('No event found for race', nextF1Race);
    return <h2>unpossible</h2>;
  }

  const nextF1RaceDateTime = parseISO(event.dateTime.toISOString());
  const isSprintWeekend = 'Sprint' in nextF1Race;

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
    if (event!.isCurrentlyLive(raceType)) {
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
      return (
        <span className="text-red-500 dark:text-red-300">
          Started {duration} ago
        </span>
      );
    }

    return <span>In {duration}</span>;
  }

  const formattedRaceTime = format(nextF1RaceDateTime, 'd MMMM Y, HH:mm');

  function onClickRaceType(raceType: RaceType) {
    setRaceType(raceType);
    localStorage.raceType = raceType;
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {isSprintWeekend && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-700 shadow-sm dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-300"></span>
            Sprint weekend
          </span>
        </div>
      )}
      <h2 className="hover:opacity-[0.8] transition-opacity duration-300 text-2xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100">
        {getDurationString()}
      </h2>
      <h3 className="flex justify-center gap-2 hover:opacity-[0.8] transition-opacity duration-300 text-xl md:text-4xl font-semibold text-neutral-800 dark:text-neutral-200">
        {formattedRaceTime}

        <CalendarButton
          onClick={() =>
            setupCalendarButton(nextF1Race, raceType, nextF1RaceDateTime)
          }
        />
      </h3>
      <h3 className="hover:opacity-[0.8] transition-opacity duration-300 text-lg md:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
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
        {Object.values(
          'Sprint' in nextF1Race ? SprintRaceType : RegularRaceType
        ).map((type) => (
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

function CalendarButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} title="Add to calendar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    </button>
  );
}

function setupCalendarButton(
  nextF1Race: RegularRace | SprintRace,
  raceType: RaceType,
  nextF1RaceDateTime: Date
) {
  atcb_action({
    name: `F1 ${nextF1Race.Circuit.Location.country} GP ${raceType}`,
    startDate: format(nextF1RaceDateTime, 'Y-MM-dd'),
    startTime: format(nextF1RaceDateTime, 'HH:mm'),
    endDate: format(nextF1RaceDateTime, 'Y-MM-dd'),
    endTime: format(
      addHours(nextF1RaceDateTime, HOURS_TO_ADD[raceType]),
      'HH:mm'
    ),
    options: ['Google', 'Apple', 'Microsoft365', 'Outlook.com', 'iCal'],
    timeZone: 'Europe/Amsterdam',
    iCalFileName: `F1 ${nextF1Race.Circuit.Location.country} GP ${raceType}`,
  });
}

function NoRaceDisplay({
  currentTime,
  season,
}: {
  currentTime: Date;
  season: string;
}) {
  const currentYear = currentTime.getFullYear();
  const stillInCurrentSeasonYear = season === currentYear.toString();
  // If we're still in 2022 and referencing 2023 season, add 1 to the current year
  // Otherwise, add nothing
  const nextYearsSeason = stillInCurrentSeasonYear
    ? currentYear + 1
    : currentYear;

  return (
    <>
      <h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-100">
        No more races this season!
      </h1>
      <h2 className="mt-2 italic md:text-2xl text-neutral-800 dark:text-neutral-200">
        See you in {nextYearsSeason}!
      </h2>
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
