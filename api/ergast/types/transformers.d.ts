import { RaceClass } from '../transformers';

interface FormattedRaceEvent {
  dateTime: `${string}T${string}`;
}

interface Race {
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

export interface RacesTransformerResult {
  season: string;
  races: RaceClass[];
}

export interface StandingsTransformerResult {
  drivers: {
    name: string;
    url: string;
    position: string;
    points: string;
  }[];
}
