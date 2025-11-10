import { Circuit, Race, Result } from '@/api/ergast/types/results';
import { RaceEvent } from './race-event';

export class RaceResult extends RaceEvent {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  Results: Result[];

  constructor({
    season,
    round,
    url,
    raceName,
    Circuit,
    date,
    time,
    Results,
  }: Race) {
    super({ date, time });
    this.season = season;
    this.round = round;
    this.url = url;
    this.raceName = raceName;
    this.Circuit = Circuit;
    this.date = date;
    this.time = time;
    this.Results = Results;
  }

  getPosition(position: number) {
    return this.Results.find((result) => {
      const resultPosition = parseInt(result.position);
      return !isNaN(resultPosition) && resultPosition === position;
    });
  }

  getDriverAtPosition(position: number) {
    return this.getPosition(position)?.Driver;
  }
}
