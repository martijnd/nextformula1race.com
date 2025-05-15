import { ResultsResponse } from '@/api/ergast/types/results';

export async function fetchRaceResults(year: number) {
  const res = await fetch(
    `https://ergast.com/api/f1/${year}/results.json?limit=1500`
  );
  const data = (await res.json()) as ResultsResponse;

  return data;
}
