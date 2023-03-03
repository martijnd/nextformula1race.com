import { RacesResponse } from '@/api/ergast/types/races';
import { StandingsResponse } from '@/api/ergast/types/standings';
import { ResultsResponse } from '@/api/ergast/types/results';

export const DRIVER_STANDINGS_URL =
  'https://ergast.com/api/f1/current/driverStandings.json';

export async function fetchCurrentYearRaces(year: number) {
  const res = await fetch(`https://ergast.com/api/f1/${year}.json`);
  const data = (await res.json()) as RacesResponse;

  return data;
}

export async function fetchDriverStandings() {
  const res = await fetch(DRIVER_STANDINGS_URL);
  const data = (await res.json()) as StandingsResponse;

  return data;
}

export async function fetchRaceResults(year: number) {
  const res = await fetch(
    `https://ergast.com/api/f1/${year}/results.json?limit=1500`
  );
  const data = (await res.json()) as ResultsResponse;

  return data;
}
