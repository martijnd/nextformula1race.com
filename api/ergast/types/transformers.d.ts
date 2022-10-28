import { Race } from '@/classes/race';

export interface RacesTransformerResult {
  season: string;
  races: Race[];
}

export interface StandingsTransformerResult {
  drivers: {
    name: string;
    url: string;
    position: string;
    points: string;
  }[];
}

export interface ResultsTransformerResult {
  season: string;
  races: RaceResult[];
}
