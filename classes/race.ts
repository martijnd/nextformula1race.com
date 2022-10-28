import { Circuit, Race as RaceType } from '@/api/ergast/types/races';
import { RaceEvent } from './race-event';

export class Race extends RaceEvent {
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
  }: RaceType) {
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
