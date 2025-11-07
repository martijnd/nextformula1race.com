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
    setRaceType(RegularRaceType.Race);
    localStorage.raceType = RegularRaceType.Race;
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
          className="relative inline-block text-f1-red-light hover:scale-105 transition-transform duration-200"
          href="https://f1tv.formula1.com/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="h-4 w-4 md:h-6 md:w-6 rounded-full bg-f1-red-light animate-pulse"></span>
            LIVE RIGHT NOW!
          </span>
        </a>
      );
    }

    if (isBefore(nextF1RaceDateTime, currentTime)) {
      return <span className="text-f1-red-light">Started {duration} ago</span>;
    }

    return <span>In {duration}</span>;
  }

  const formattedRaceTime = format(nextF1RaceDateTime, 'd MMMM Y, HH:mm');

  function onClickRaceType(raceType: RaceType) {
    setRaceType(raceType);
    localStorage.raceType = raceType;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {isSprintWeekend && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-f1-red bg-f1-red/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-f1-red-light shadow-lg backdrop-blur-sm animate-pulse-slow">
            <span className="h-2 w-2 rounded-full bg-f1-red-light animate-pulse"></span>
            Sprint weekend
          </span>
        </div>
      )}
      <div className="relative">
        <h2 className="relative z-10 hover:opacity-90 transition-opacity duration-300 text-2xl md:text-5xl lg:text-6xl font-black text-f1-red-light drop-shadow-lg">
          {getDurationString()}
        </h2>
        <div className="absolute inset-0 blur-2xl bg-f1-red-light/20 animate-pulse-slow"></div>
      </div>
      <h3 className="flex justify-center items-center gap-3 hover:opacity-90 transition-opacity duration-300 text-xl md:text-4xl lg:text-5xl font-bold text-gray-100">
        {nextF1Race.officialUrl ? (
          <a
            href={nextF1Race.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-f1-red-light transition-colors duration-200"
          >
            {formattedRaceTime}
          </a>
        ) : (
          formattedRaceTime
        )}

        <CalendarButton
          onClick={() =>
            setupCalendarButton(nextF1Race, raceType, nextF1RaceDateTime)
          }
        />
      </h3>
      <h3 className="hover:opacity-90 transition-opacity duration-300 text-lg md:text-2xl lg:text-3xl font-semibold text-gray-300">
        <span className="font-black text-white">{nextF1Race.raceName}</span>
        <span className="mx-2">•</span>
        <a
          className="hover:text-f1-red-light transition-colors duration-200 font-medium"
          target="_blank"
          rel="noreferrer"
          href={nextF1Race.Circuit.url}
        >
          {nextF1Race.Circuit.circuitName}
        </a>
      </h3>
      <div className="flex justify-center items-center gap-2 flex-wrap pt-4">
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
    <button
      onClick={onClick}
      title="Add to calendar"
      className="p-2 rounded-lg hover:bg-f1-red/20 transition-colors duration-200 hover:scale-110 transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 md:w-7 md:h-7 text-f1-red-light"
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
      <h1 className="text-5xl md:text-7xl font-black text-f1-red-light">
        No more races this season!
      </h1>
      <h2 className="mt-4 text-xl md:text-3xl font-semibold text-gray-300">
        See you in{' '}
        <span className="text-f1-red-light font-black">{nextYearsSeason}</span>!
      </h2>
    </>
  );
}

function RaceTypeButton({ active, onClick, type }: RaceTypeButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-all duration-200 ${
        active
          ? 'bg-f1-red text-white shadow-lg shadow-f1-red-light/50 scale-105'
          : 'bg-f1-gray text-gray-300 hover:bg-f1-gray/80 hover:text-f1-red-light'
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}
