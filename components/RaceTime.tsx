import { atcb_action } from 'add-to-calendar-button';
import {
  format,
  parseISO,
  intervalToDuration,
  formatDuration,
  isBefore,
  addHours,
} from 'date-fns';
import { useEffect, useState, useCallback } from 'react';
import {
  HOURS_TO_ADD,
  RaceType,
  RaceEvent,
  RegularRaceType,
  SprintRaceType,
} from '@/classes/race-event';
import { RegularRace, SprintRace } from '@/classes/race';
import {
  ONE_SECOND,
  STORAGE_KEYS,
  EXTERNAL_URLS,
  DEFAULT_TIMEZONE,
} from '@/constants';
import { useI18n } from '@/lib/i18n';
import { CalendarButton } from './CalendarButton';
import { NoRaceDisplay } from './NoRaceDisplay';
import { RaceTypeButton } from './RaceTypeButton';

interface RaceTimeProps {
  season: string;
  races: (RegularRace | SprintRace)[];
}

export default function RaceTime({ season, races }: RaceTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hydrated, setHydrated] = useState(false);
  const [raceType, setRaceType] = useState<RaceType>(RegularRaceType.Race);
  const { t, dateLocale } = useI18n();

  useEffect(() => {
    // Safely read from localStorage (SSR-safe)
    try {
      const storedRaceType = localStorage.getItem(STORAGE_KEYS.RACE_TYPE);
      if (
        storedRaceType &&
        (Object.values(RegularRaceType).includes(
          storedRaceType as RegularRaceType
        ) ||
          Object.values(SprintRaceType).includes(
            storedRaceType as SprintRaceType
          ))
      ) {
        setRaceType(storedRaceType as RaceType);
      }
    } catch (error) {
      // localStorage not available (SSR or private browsing) - silently fail
    }

    // Set up interval for countdown updates
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, ONE_SECOND);

    setHydrated(true);

    // Cleanup interval on unmount
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  function onClickRaceType(newRaceType: RaceType) {
    setRaceType(newRaceType);
    try {
      localStorage.setItem(STORAGE_KEYS.RACE_TYPE, newRaceType);
    } catch (error) {
      // localStorage not available - silently fail
    }
  }

  const onClickRaceTypeCallback = useCallback(onClickRaceType, []);

  // Compute next race and event early (before early returns)
  const nextF1Race = races.find((race) => {
    return (
      !race.hasHappened(currentTime) ||
      race.isCurrentlyLive(raceType, currentTime)
    );
  });

  function getRaceEvent(
    raceType: RaceType,
    race: RegularRace | SprintRace | undefined
  ): RaceEvent | undefined {
    if (!race) return undefined;

    if ('sprint' in race) {
      // Sprint weekend
      const sprintEvents: Partial<Record<SprintRaceType, RaceEvent>> = {
        [SprintRaceType.Race]: race,
        [SprintRaceType.Qualy]: race.qualifying,
        [SprintRaceType.FP1]: race.firstPractice,
        [SprintRaceType.SprintQualy]: race.sprintQualifying,
        [SprintRaceType.Sprint]: race.sprint,
      };
      return sprintEvents[raceType as SprintRaceType];
    } else {
      // Regular weekend
      const regularEvents: Partial<Record<RegularRaceType, RaceEvent>> = {
        [RegularRaceType.Race]: race,
        [RegularRaceType.Qualy]: race.qualifying,
        [RegularRaceType.FP1]: race.firstPractice,
        [RegularRaceType.FP2]: race.secondPractice,
        [RegularRaceType.FP3]: race.thirdPractice,
      };
      return regularEvents[raceType as RegularRaceType];
    }
  }

  const event = getRaceEvent(raceType, nextF1Race);

  // Handle invalid race type by falling back to Race
  useEffect(() => {
    if (!event && nextF1Race && raceType !== RegularRaceType.Race) {
      setRaceType(RegularRaceType.Race);
      try {
        localStorage.setItem(STORAGE_KEYS.RACE_TYPE, RegularRaceType.Race);
      } catch (error) {
        // localStorage not available - silently fail
      }
    }
  }, [event, nextF1Race, raceType]);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  if (!races.length) {
    return <h2></h2>;
  }

  if (!nextF1Race) {
    return <NoRaceDisplay currentTime={currentTime} season={season} />;
  }

  if (!event) {
    // Return null while fixing race type to prevent flash of incorrect content
    return null;
  }

  const nextF1RaceDateTime = parseISO(event.dateTime.toISOString());
  const isSprintWeekend = 'sprint' in nextF1Race;

  const duration = formatDuration(
    intervalToDuration({
      start: currentTime,
      end: nextF1RaceDateTime,
    }),
    {
      delimiter: ', ',
      locale: dateLocale,
    }
  );

  function getDurationString() {
    if (!event) return null;
    if (event.isCurrentlyLive(raceType)) {
      return (
        <a
          className="relative inline-block text-f1-red-light hover:scale-105 transition-transform duration-200"
          href={EXTERNAL_URLS.F1_TV}
          target="_blank"
          rel="noreferrer"
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="h-4 w-4 md:h-6 md:w-6 rounded-full bg-f1-red-light animate-pulse"></span>
            {t('raceTime.liveNow')}
          </span>
        </a>
      );
    }

    if (isBefore(nextF1RaceDateTime, currentTime)) {
      return (
        <span className="text-f1-red-light opacity-40">
          {t('raceTime.startedAgo', duration)}
        </span>
      );
    }

    return <span>{t('raceTime.inDuration', duration)}</span>;
  }

  const formattedRaceTime = format(nextF1RaceDateTime, 'd MMMM y, HH:mm', {
    locale: dateLocale,
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {isSprintWeekend && (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-f1-red bg-f1-red/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-f1-red-light shadow-lg backdrop-blur-sm animate-pulse-slow">
            <span className="h-2 w-2 rounded-full bg-f1-red-light animate-pulse"></span>
            {t('raceTime.sprintWeekend')}
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
        {nextF1Race.circuit.url ? (
          <a
            className="hover:text-f1-red-light transition-colors duration-200 font-medium"
            target="_blank"
            rel="noreferrer"
            href={nextF1Race.circuit.url}
          >
            {nextF1Race.circuit.circuitName}
          </a>
        ) : (
          <span className="font-medium">{nextF1Race.circuit.circuitName}</span>
        )}
      </h3>
      <div className="flex justify-center items-center gap-2 flex-wrap pt-4">
        {Object.values(
          'sprint' in nextF1Race ? SprintRaceType : RegularRaceType
        ).map((type) => (
          <RaceTypeButton
            key={type}
            type={type}
            active={raceType === type}
            onClick={() => onClickRaceTypeCallback(type)}
          />
        ))}
      </div>
    </div>
  );
}

function setupCalendarButton(
  nextF1Race: RegularRace | SprintRace,
  raceType: RaceType,
  nextF1RaceDateTime: Date
) {
  atcb_action({
    name: `F1 ${nextF1Race.circuit.location.country} GP ${raceType}`,
    startDate: format(nextF1RaceDateTime, 'Y-MM-dd'),
    startTime: format(nextF1RaceDateTime, 'HH:mm'),
    endDate: format(nextF1RaceDateTime, 'Y-MM-dd'),
    endTime: format(
      addHours(nextF1RaceDateTime, HOURS_TO_ADD[raceType]),
      'HH:mm'
    ),
    options: ['Google', 'Apple', 'Microsoft365', 'Outlook.com', 'iCal'],
    timeZone: DEFAULT_TIMEZONE,
    iCalFileName: `F1 ${nextF1Race.circuit.location.country} GP ${raceType}`,
  });
}
