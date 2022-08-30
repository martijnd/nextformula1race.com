import { RaceTypes } from '@/components/RaceTime';
import { RacesResponse } from '@/types/races';
import addHours from 'date-fns/addHours';
import isAfter from 'date-fns/isAfter';
import isWithinInterval from 'date-fns/isWithinInterval';

export const CURRENT_YEAR_RACES_URL = 'https://ergast.com/api/f1/current.json';

export async function getCurrentYearRaces() {
  try {
    const res = await fetch(CURRENT_YEAR_RACES_URL);
    const data = (await res.json()) as RacesResponse;

    return { data, error: false };
  } catch (e) {
    return { data: null, error: true };
  }
}

export interface Race {
  dateTime: `${string}T${string}`;
  name: string;
  circuitName: string;
  circuitUrl: string;
  qualifying: Event;
  FP1: Event;
  FP2: Event;
  FP3: Event;
  hasSprint: boolean;
  isCurrentlyLive: (
    currentTime: number,
    date: Date,
    raceType: RaceTypes,
    hoursToAdd: Record<RaceTypes, number>
  ) => boolean;
  hasHappened: (raceDateTime: number, currentTime: number) => boolean;
}

interface Event {
  dateTime: string;
}

export interface Payload {
  season: string;
  races: Race[];
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

export function transform(data: RacesResponse): Payload {
  function connect({ date, time }: { date: string; time: string }): Event {
    return { dateTime: `${date}T${time}` };
  }

  return {
    season: data.MRData.RaceTable.season,
    races: data.MRData.RaceTable.Races.map((race) => ({
      dateTime: `${race.date}T${race.time}`,
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
