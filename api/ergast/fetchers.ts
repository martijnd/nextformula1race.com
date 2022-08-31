import { RacesResponse } from '@/api/ergast/types/races';
import { StandingsResponse } from '@/api/ergast/types/standings';

export const CURRENT_YEAR_RACES_URL = 'https://ergast.com/api/f1/current.json';
export const DRIVER_STANDINGS_URL =
  'https://ergast.com/api/f1/current/driverStandings.json';

export async function getCurrentYearRaces() {
  try {
    const res = await fetch(CURRENT_YEAR_RACES_URL);
    const data = (await res.json()) as RacesResponse;

    return { data, error: false };
  } catch (e) {
    return { data: null, error: true };
  }
}

export async function getDriverStandings() {
  try {
    const res = await fetch(DRIVER_STANDINGS_URL);
    const data = (await res.json()) as StandingsResponse;

    return { data, error: false };
  } catch (e) {
    return { data: null, error: true };
  }
}
