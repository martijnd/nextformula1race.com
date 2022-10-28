import { RaceTypes } from '@/components/RaceTime';
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

  hasHappened() {
    const currentTime = new Date();
    return isBefore(this.dateTime, currentTime);
  }

  isCurrentlyLive(raceType: RaceTypes) {
    const currentTime = new Date();

    return isWithinInterval(currentTime, {
      start: this.dateTime,
      end: addHours(this.dateTime, HOURS_TO_ADD[raceType]),
    });
  }
}

const HOURS_TO_ADD: Record<RaceTypes, number> = {
  [RaceTypes.FP1]: 1,
  [RaceTypes.FP2]: 1.5,
  [RaceTypes.FP3]: 1,
  [RaceTypes.Sprint]: 1,
  [RaceTypes.Qualy]: 1,
  [RaceTypes.Race]: 2,
};
