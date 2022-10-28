import { RaceTypes } from '@/components/RaceTime';
import { StandingsResponse } from '@/api/ergast/types/standings';
import { isWithinInterval, addHours, isBefore } from 'date-fns';
import {
  RacesTransformerResult,
  StandingsTransformerResult,
} from '@/api/ergast/types/transformers';
import { Circuit, Race, RacesResponse } from '@/api/ergast/types/races';

export function raceTransformer(data: RacesResponse): RacesTransformerResult {
  return {
    season: data.MRData.RaceTable.season,
    races: data.MRData.RaceTable.Races.map((race) => new RaceClass(race)),
  };
}

export class RaceEvent {
  date: string;
  time: string;
  dateTime: Date;

  constructor({ date, time }: { date: string; time: string }) {
    this.date = date;
    this.time = time;
    this.dateTime = new Date(`${this.date}T${this.time}`);
  }

  hasHappened() {
    const currentTime = new Date();
    return isBefore(this.dateTime, currentTime);
  }

  isCurrentlyLive(raceType: RaceTypes = RaceTypes.Race) {
    const currentTime = new Date();

    return isWithinInterval(currentTime, {
      start: this.dateTime,
      end: addHours(this.dateTime, HOURS_TO_ADD[raceType]),
    });
  }
}

export class RaceClass extends RaceEvent {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  FirstPractice: RaceEvent;
  SecondPractice: RaceEvent;
  SpecialEvent: RaceEvent;
  Qualifying: RaceEvent;
  hasSprint: boolean;

  constructor({
    season,
    round,
    url,
    raceName,
    Circuit,
    date,
    time,
    FirstPractice,
    SecondPractice,
    ThirdPractice,
    Qualifying,
    Sprint,
  }: Race) {
    super({ date, time });
    this.season = season;
    this.round = round;
    this.url = url;
    this.raceName = raceName;
    this.Circuit = Circuit;
    this.date = date;
    this.time = time;
    this.FirstPractice = new RaceEvent(FirstPractice);
    this.SecondPractice = new RaceEvent(SecondPractice);
    this.SpecialEvent = new RaceEvent(ThirdPractice ?? Sprint);
    this.Qualifying = new RaceEvent(Qualifying);
    this.hasSprint = Boolean(Sprint);
  }
}

const HOURS_TO_ADD: Record<RaceTypes, number> = {
  [RaceTypes.FP1]: 1,
  [RaceTypes.FP2]: 1,
  [RaceTypes.FP3]: 1,
  [RaceTypes.Sprint]: 1,
  [RaceTypes.Qualy]: 1,
  [RaceTypes.Race]: 2,
};

export function standingsTransformer(
  data: StandingsResponse | undefined
): StandingsTransformerResult | undefined {
  if (!data) {
    return undefined;
  }
  return {
    drivers: data.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
      (driver) => {
        return {
          name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
          points: driver.points,
          position: driver.position,
          url: driver.Driver.url,
        };
      }
    ),
  };
}
