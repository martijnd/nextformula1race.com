import {
  BaseRaceType,
  Circuit,
  RegularRaceType,
  SprintRaceType,
} from '@/types';
import { RaceEvent } from './race-event';

export class BaseRace extends RaceEvent {
  season: string;
  round: string;
  raceName: string;
  circuit: Circuit;
  date: string;
  time: string;
  qualifying: RaceEvent;
  officialUrl?: string;

  constructor({
    season,
    round,
    raceName,
    circuit,
    race,
    qualifying,
    officialUrl,
  }: BaseRaceType) {
    super({ date: race.date, time: race.time });
    this.season = season;
    this.round = round;
    this.raceName = raceName;
    this.circuit = circuit;
    this.date = race.date;
    this.time = race.time;
    this.qualifying = new RaceEvent(qualifying);
    this.officialUrl = officialUrl;
  }
}

// Regular Race (3 practice sessions)
export class RegularRace extends BaseRace {
  firstPractice: RaceEvent;
  secondPractice: RaceEvent;
  thirdPractice: RaceEvent;

  constructor({
    firstPractice,
    secondPractice,
    thirdPractice,
    ...baseProps
  }: RegularRaceType) {
    super(baseProps);
    this.firstPractice = new RaceEvent(firstPractice);
    this.secondPractice = new RaceEvent(secondPractice);
    this.thirdPractice = new RaceEvent(thirdPractice);
  }
}

// Sprint Race (1 practice session, sprint qualifying, sprint)
export class SprintRace extends BaseRace {
  firstPractice: RaceEvent;
  sprintQualifying: RaceEvent;
  sprint: RaceEvent;

  constructor({
    firstPractice,
    sprintQualifying,
    sprint,
    ...baseProps
  }: SprintRaceType) {
    super(baseProps);
    this.firstPractice = new RaceEvent(firstPractice);
    this.sprintQualifying = new RaceEvent(sprintQualifying);
    this.sprint = new RaceEvent(sprint);
  }
}
