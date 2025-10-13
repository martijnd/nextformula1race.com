import {
  Session,
  Meeting,
  Driver,
  Position,
  CarData,
  Lap,
  Stint,
  TeamRadio,
  Weather,
  Interval,
  Pit,
  RaceControl,
  Location,
  StartingGrid,
  SessionResult,
  Overtake,
  GetSessionsParams,
  GetMeetingsParams,
  GetDriversParams,
  GetPositionsParams,
  GetCarDataParams,
  GetLapsParams,
  GetStintsParams,
  GetTeamRadioParams,
  GetWeatherParams,
  GetIntervalsParams,
  GetPitStopsParams,
  GetRaceControlParams,
  GetLocationParams,
  GetStartingGridParams,
  GetSessionResultsParams,
  GetOvertakesParams,
  RaceName,
  FormattedRaceResult,
  OpenF1QueryParams,
} from './types';

const BASE_URL = 'https://api.openf1.org/v1';

/**
 * Generic fetch function for OpenF1 API
 */
async function fetchFromOpenF1<T>(
  endpoint: string,
  params?: OpenF1QueryParams
): Promise<T[]> {
  const url = new URL(`${BASE_URL}/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `OpenF1 API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get a single session by session_key
 */
export async function getSession(sessionKey: number): Promise<Session | null> {
  const sessions = await fetchFromOpenF1<Session>('sessions', {
    session_key: sessionKey,
  });

  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Get all sessions, optionally filtered by parameters
 */
export async function getSessions(
  params?: GetSessionsParams
): Promise<Session[]> {
  return fetchFromOpenF1<Session>('sessions', params);
}

/**
 * Get the latest or current session
 */
export async function getLatestSession(): Promise<Session | null> {
  const sessions = await fetchFromOpenF1<Session>('sessions', {
    session_key: 'latest',
  });

  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Get all meetings (race weekends), optionally filtered
 */
export async function getMeetings(
  params?: GetMeetingsParams
): Promise<Meeting[]> {
  return fetchFromOpenF1<Meeting>('meetings', params);
}

/**
 * Get the latest or current meeting
 */
export async function getLatestMeeting(): Promise<Meeting | null> {
  const meetings = await fetchFromOpenF1<Meeting>('meetings', {
    meeting_key: 'latest',
  });

  return meetings.length > 0 ? meetings[0] : null;
}

/**
 * Get drivers for a session
 */
export async function getDrivers(params: GetDriversParams): Promise<Driver[]> {
  return fetchFromOpenF1<Driver>('drivers', params);
}

/**
 * Get position data
 */
export async function getPositions(
  params: GetPositionsParams
): Promise<Position[]> {
  return fetchFromOpenF1<Position>('position', params);
}

/**
 * Get car data (telemetry)
 */
export async function getCarData(params: GetCarDataParams): Promise<CarData[]> {
  return fetchFromOpenF1<CarData>('car_data', params);
}

/**
 * Get lap data
 */
export async function getLaps(params: GetLapsParams): Promise<Lap[]> {
  return fetchFromOpenF1<Lap>('laps', params);
}

/**
 * Get stint data (tyre information)
 */
export async function getStints(params: GetStintsParams): Promise<Stint[]> {
  return fetchFromOpenF1<Stint>('stints', params);
}

/**
 * Get team radio messages
 */
export async function getTeamRadio(
  params: GetTeamRadioParams
): Promise<TeamRadio[]> {
  return fetchFromOpenF1<TeamRadio>('team_radio', params);
}

/**
 * Get weather data
 */
export async function getWeather(params: GetWeatherParams): Promise<Weather[]> {
  return fetchFromOpenF1<Weather>('weather', params);
}

/**
 * Get interval data (gaps between drivers)
 */
export async function getIntervals(
  params: GetIntervalsParams
): Promise<Interval[]> {
  return fetchFromOpenF1<Interval>('intervals', params);
}

/**
 * Get pit stop data
 */
export async function getPitStops(params: GetPitStopsParams): Promise<Pit[]> {
  return fetchFromOpenF1<Pit>('pit', params);
}

/**
 * Get race control messages
 */
export async function getRaceControl(
  params: GetRaceControlParams
): Promise<RaceControl[]> {
  return fetchFromOpenF1<RaceControl>('race_control', params);
}

/**
 * Get location data (car position on track)
 */
export async function getLocation(
  params: GetLocationParams
): Promise<Location[]> {
  return fetchFromOpenF1<Location>('location', params);
}

/**
 * Get starting grid positions
 */
export async function getStartingGrid(
  params: GetStartingGridParams
): Promise<StartingGrid[]> {
  return fetchFromOpenF1<StartingGrid>('starting_grid', params);
}

/**
 * Get session results
 */
export async function getSessionResults(
  params: GetSessionResultsParams
): Promise<SessionResult[]> {
  return fetchFromOpenF1<SessionResult>('session_result', params);
}

/**
 * Get overtakes data
 */
export async function getOvertakes(
  params: GetOvertakesParams
): Promise<Overtake[]> {
  return fetchFromOpenF1<Overtake>('overtakes', params);
}

/**
 * Get race results by race name and year
 * Returns top 20 results in a nicely formatted way
 */
export async function getRaceResults(
  raceName: RaceName,
  year: number
): Promise<FormattedRaceResult[]> {
  try {
    // First, find the race session for the given race name and year
    const sessions = await getSessions({
      year,
      session_name: 'Race',
    });
    // console.log(sessions);
    // Find the specific race by matching the meeting name
    const raceSession = sessions.find((session) => {
      // OpenF1 stores meeting names differently, so we need to match flexibly
      // Example: "Monaco Grand Prix" might be stored as just "Monaco"
      const sessionLocation = session.country_name.toLowerCase();
      const raceNameLower = raceName.toLowerCase();

      // Try to match by location name contained in race name
      return (
        raceNameLower.includes(sessionLocation) ||
        sessionLocation.includes(raceNameLower.split(' ')[0].toLowerCase())
      );
    });

    if (!raceSession) {
      throw new Error(`Race "${raceName}" not found for year ${year}`);
    }

    // Get the session results
    const results = await getSessionResults({
      session_key: raceSession.session_key,
    });

    // Get driver information for this session
    const drivers = await getDrivers({
      session_key: raceSession.session_key,
    });

    // Create a driver map for quick lookup
    const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

    // Format the results
    const formattedResults: FormattedRaceResult[] = results
      .sort((a, b) => a.position - b.position)
      .slice(0, 20) // Top 20
      .map((result) => {
        const driver = driverMap.get(result.driver_number);

        return {
          position: result.position,
          driverNumber: result.driver_number,
          driverName: driver?.full_name || `Driver #${result.driver_number}`,
          teamName: driver?.team_name || 'Unknown',
          teamColour: driver?.team_colour || '000000',
          points: result.points,
          timeOrStatus: result.time ? formatTime(result.time) : 'DNF',
        };
      });

    return formattedResults;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching race results:', error);
    throw error;
  }
}

/**
 * Helper function to format time in seconds to readable format
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
  }

  return `${remainingSeconds.toFixed(3)}s`;
}
