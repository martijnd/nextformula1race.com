import { addHours, isBefore, isWithinInterval } from 'date-fns';

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

  isCurrentlyLive(raceType: RaceTypes, time: Date = new Date()) {
    return isWithinInterval(time, {
      start: this.dateTime,
      end: addHours(this.dateTime, HOURS_TO_ADD[raceType]),
    });
  }
}

export enum RaceTypes {
  FP1 = 'FP1',
  FP2 = 'FP2',
  SprintQualy = 'SPRINT QUALY',
  FP3 = 'FP3',
  Sprint = 'SPRINT',
  Qualy = 'QUALY',
  Race = 'RACE',
}

export const HOURS_TO_ADD: Record<RaceTypes, number> = {
  [RaceTypes.FP1]: 1,
  [RaceTypes.FP2]: 1.5,
  [RaceTypes.FP3]: 1,
  [RaceTypes.Sprint]: 1,
  [RaceTypes.SprintQualy]: 1,
  [RaceTypes.Qualy]: 1,
  [RaceTypes.Race]: 2,
};
