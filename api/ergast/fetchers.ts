import { RacesResponse } from '@/api/ergast/types/races';
import { StandingsResponse } from '@/api/ergast/types/standings';
import { ResultsResponse } from '@/api/ergast/types/results';

export const CURRENT_YEAR_RACES_URL = 'https://ergast.com/api/f1/current.json';
export const CURRENT_YEAR_RACE_RESULTS_URL =
  'https://ergast.com/api/f1/current/results.json?limit=1500';
export const DRIVER_STANDINGS_URL =
  'https://ergast.com/api/f1/current/driverStandings.json';

export async function fetchCurrentYearRaces() {
  const res = await fetch(CURRENT_YEAR_RACES_URL);
  const data = (await res.json()) as RacesResponse;

  return data;
}

export async function fetchDriverStandings() {
  const res = await fetch(DRIVER_STANDINGS_URL);
  const data = (await res.json()) as StandingsResponse;

  return data;
}

export async function fetchRaceResults() {
  const res = await fetch(CURRENT_YEAR_RACE_RESULTS_URL);
  const data = (await res.json()) as ResultsResponse;

  return data;
}
