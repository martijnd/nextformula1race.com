import { RaceTypes } from '@/components/RaceTime';
import { RacesResponse } from '@/types/races';
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isWithinInterval from 'date-fns/isWithinInterval';

export const CURRENT_YEAR_RACES_URL = 'https://ergast.com/api/f1/current.json';

interface RaceEvent {
  dateTime: `${string}T${string}`;
}

export interface Race {
  dateTime: `${string}T${string}`;
  name: string;
  circuitName: string;
  circuitUrl: string;
  qualifying: RaceEvent;
  FP1: RaceEvent;
  FP2: RaceEvent;
  FP3: RaceEvent;
  hasSprint: boolean;
  isCurrentlyLive: (
    currentTime: number,
    date: Date,
    raceType: RaceTypes,
    hoursToAdd: Record<RaceTypes, number>
  ) => boolean;
  hasHappened: (raceDateTime: number, currentTime: number) => boolean;
}

export interface Payload {
  season: string;
  races: Race[];
}

export function ergastApi() {
  async function getCurrentYearRaces() {
    try {
      const res = await fetch(CURRENT_YEAR_RACES_URL);
      const data = (await res.json()) as RacesResponse;

      return { data, error: false };
    } catch (e) {
      return { data: null, error: true };
    }
  }

  function hasHappened(raceDateTime: number, currentTime: number) {
    return isAfter(raceDateTime, currentTime);
  }

  function isCurrentlyLive(
    currentTime: number,
    date: Date,
    raceType: RaceTypes,
    hoursToAdd: Record<RaceTypes, number>
  ) {
    return isWithinInterval(currentTime, {
      start: date,
      end: addHours(date, hoursToAdd[raceType]),
    });
  }

  function transform(data: RacesResponse): Payload {
    function connect({
      date,
      time,
    }: {
      date: string;
      time: string;
    }): RaceEvent {
      return { dateTime: `${date}T${time}` };
    }

    return {
      season: data.MRData.RaceTable.season,
      races: data.MRData.RaceTable.Races.map((race) => ({
        dateTime: connect(race).dateTime,
        name: race.raceName,
        circuitUrl: race.Circuit.url,
        circuitName: race.Circuit.circuitName,
        qualifying: connect(race.Qualifying),
        FP1: connect(race.FirstPractice),
        FP2: connect(race.SecondPractice),
        FP3: connect(race.ThirdPractice ? race.ThirdPractice : race.Sprint),
        hasSprint: Boolean(race.Sprint),
        hasHappened,
        isCurrentlyLive,
      })),
    };
  }

  return {
    getCurrentYearRaces,
    transform,
  };
}
