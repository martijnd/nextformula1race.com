import { StandingsResponse } from '@/api/ergast/types/standings';
import {
  RacesTransformerResult,
  ResultsTransformerResult,
  StandingsTransformerResult,
} from '@/api/ergast/types/transformers';
import { RacesResponse } from '@/api/ergast/types/races';
import { Race } from '@/classes/race';
import { ResultsResponse } from './types/results';
import { RaceResult } from '@/classes/race-result';

export function raceTransformer(data: RacesResponse): RacesTransformerResult {
  return {
    season: data.MRData.RaceTable.season,
    races: data.MRData.RaceTable.Races.map((race) => new Race(race)),
  };
}

export function resultsTransformer(
  data: ResultsResponse
): ResultsTransformerResult {
  return {
    season: data.MRData.RaceTable.season,
    races: data.MRData.RaceTable.Races.map((race) => new RaceResult(race)),
  };
}

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
