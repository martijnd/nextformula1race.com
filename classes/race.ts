import {
  BaseRaceType,
  Circuit,
  RegularRaceType,
  SprintRaceType,
} from '@/api/ergast/types/races';
import { RaceEvent } from './race-event';

export class BaseRace extends RaceEvent {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  Qualifying: RaceEvent;

  constructor({
    season,
    round,
    url,
    raceName,
    Circuit,
    date,
    time,
    Qualifying,
  }: BaseRaceType) {
    super({ date, time });
    this.season = season;
    this.round = round;
    this.url = url;
    this.raceName = raceName;
    this.Circuit = Circuit;
    this.date = date;
    this.time = time;
    this.Qualifying = new RaceEvent(Qualifying);
  }
}

// Regular Race (3 practice sessions)
export class RegularRace extends BaseRace {
  FirstPractice: RaceEvent;
  SecondPractice: RaceEvent;
  ThirdPractice: RaceEvent;

  constructor({
    FirstPractice,
    SecondPractice,
    ThirdPractice,
    ...baseProps
  }: RegularRaceType) {
    super(baseProps);
    this.FirstPractice = new RaceEvent(FirstPractice);
    this.SecondPractice = new RaceEvent(SecondPractice);
    this.ThirdPractice = new RaceEvent(ThirdPractice);
  }
}

// Sprint Race (1 practice session, sprint qualifying, sprint)
export class SprintRace extends BaseRace {
  FirstPractice: RaceEvent;
  SprintQualifying: RaceEvent;
  Sprint: RaceEvent;

  constructor({
    FirstPractice,
    SprintQualifying,
    Sprint,
    ...baseProps
  }: SprintRaceType) {
    super(baseProps);
    this.FirstPractice = new RaceEvent(FirstPractice);
    this.SprintQualifying = new RaceEvent(SprintQualifying);
    this.Sprint = new RaceEvent(Sprint);
  }
}
