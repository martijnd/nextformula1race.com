import { RaceTypes } from '@/components/RaceTime';
import { StandingsResponse } from '@/api/ergast/types/standings';
import { isAfter, isWithinInterval, addHours } from 'date-fns';
import {
  RacesTransformerResult,
  RaceEvent,
  StandingsTransformerResult,
} from '@/api/ergast/types/transformers';
import { RacesResponse } from '@/api/ergast/types/races';

function hasHappened(raceDateTime: number, currentTime: number) {
  return isAfter(raceDateTime, currentTime);
}

function isCurrentlyLive(
  currentTime: number,
  date: Date,
  raceType: RaceTypes,
  hoursToAdd: Record<RaceTypes, number>
) {
  return isWithinInterval(currentTime, {
    start: date,
    end: addHours(date, hoursToAdd[raceType]),
  });
}

export function raceTransformer(data: RacesResponse): RacesTransformerResult {
  function connect({ date, time }: { date: string; time: string }): RaceEvent {
    return { dateTime: `${date}T${time}` };
  }

  return {
    season: data.MRData.RaceTable.season,
    races: data.MRData.RaceTable.Races.map((race) => ({
      dateTime: connect(race).dateTime,
      name: race.raceName,
      circuitUrl: race.Circuit.url,
      circuitName: race.Circuit.circuitName,
      qualifying: connect(race.Qualifying),
      FP1: connect(race.FirstPractice),
      FP2: connect(race.SecondPractice),
      FP3: connect(race.ThirdPractice ? race.ThirdPractice : race.Sprint),
      hasSprint: Boolean(race.Sprint),
      hasHappened,
      isCurrentlyLive,
    })),
  };
}

export function standingsTransformer(
  data: StandingsResponse
): StandingsTransformerResult {
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
