import { addHours, isBefore, isWithinInterval } from 'date-fns';

export type RaceType = RegularRaceType | SprintRaceType;

export class RaceEvent {
  date: string;
  time: string;
  dateTime: Date;

  constructor({ date, time }: { date: string; time: string }) {
    this.date = date;
    this.time = time;
    this.dateTime = new Date(`${this.date}T${this.time}`);
  }

  hasHappened(time: Date = new Date()) {
    return isBefore(this.dateTime, time);
  }

  isCurrentlyLive(raceType: RaceType, time: Date = new Date()) {
    return isWithinInterval(time, {
      start: this.dateTime,
      end: addHours(this.dateTime, HOURS_TO_ADD[raceType]),
    });
  }
}

export enum RegularRaceType {
  FP1 = 'FP1',
  FP2 = 'FP2',
  FP3 = 'FP3',
  Qualy = 'QUALY',
  Race = 'RACE',
}

export enum SprintRaceType {
  FP1 = 'FP1',
  SprintQualy = 'SPRINT QUALY',
  Sprint = 'SPRINT',
  Qualy = 'QUALY',
  Race = 'RACE',
}

export const HOURS_TO_ADD: Record<RegularRaceType | SprintRaceType, number> = {
  [RegularRaceType.FP1]: 1,
  [RegularRaceType.FP2]: 1,
  [RegularRaceType.FP3]: 1,
  [SprintRaceType.Sprint]: 1,
  [SprintRaceType.SprintQualy]: 44 / 60,
  [RegularRaceType.Qualy]: 1,
  [RegularRaceType.Race]: 2,
};
