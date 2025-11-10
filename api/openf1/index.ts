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

// Rate limiting: Max 3 requests per second
const RATE_LIMIT = 3;
const RATE_WINDOW = 1000; // 1 second in milliseconds

// Request queue for rate limiting
interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  execute: () => Promise<any>;
}

let requestQueue: QueuedRequest[] = [];
let requestTimestamps: number[] = [];
let isProcessingQueue = false;

/**
 * Process the request queue with rate limiting
 */
async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    // Remove timestamps older than the rate window
    const now = Date.now();
    requestTimestamps = requestTimestamps.filter(
      (timestamp) => now - timestamp < RATE_WINDOW
    );

    // Wait if we've hit the rate limit
    if (requestTimestamps.length >= RATE_LIMIT) {
      const oldestTimestamp = requestTimestamps[0];
      const waitTime = RATE_WINDOW - (now - oldestTimestamp) + 50; // Add 50ms buffer
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      continue;
    }

    // Process the next request and wait for it to complete
    const request = requestQueue.shift();
    if (request) {
      requestTimestamps.push(Date.now());
      try {
        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }
  }

  isProcessingQueue = false;
}

/**
 * Queue a request for rate-limited execution
 */
function queueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    requestQueue.push({ resolve, reject, execute });
    processQueue();
  });
}

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cache key from endpoint and params
 */
function getCacheKey(endpoint: string, params?: OpenF1QueryParams): string {
  const paramsStr = params
    ? JSON.stringify(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .sort(([a], [b]) => a.localeCompare(b))
      )
    : '';
  return `${endpoint}:${paramsStr}`;
}

/**
 * Generic fetch function for OpenF1 API with rate limiting, caching, and retry logic
 */
async function fetchFromOpenF1<T>(
  endpoint: string,
  params?: OpenF1QueryParams,
  retryCount = 0
): Promise<T[]> {
  // Check cache first
  const cacheKey = getCacheKey(endpoint, params);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Execute request through rate-limited queue
  const response = await queueRequest(() => fetch(url.toString()));

  // Handle rate limiting (429) with exponential backoff
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const waitTime = retryAfter
      ? parseInt(retryAfter) * 1000
      : Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds

    if (retryCount < 3) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return fetchFromOpenF1<T>(endpoint, params, retryCount + 1);
    }

    throw new Error(`OpenF1 API rate limit exceeded. Please try again later.`);
  }

  if (!response.ok) {
    throw new Error(
      `OpenF1 API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Cache the response
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
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

// Cache for sessions by year (sessions don't change frequently)
const sessionsCache = new Map<number, Session[]>();

/**
 * Get top 3 finishers for a race by matching date and location
 */
export async function getTop3Finishers(
  raceDate: Date,
  location: string,
  country: string,
  year: number
): Promise<FormattedRaceResult[] | null> {
  try {
    // Get all race sessions for the year (with caching)
    let sessions = sessionsCache.get(year);
    if (!sessions) {
      sessions = await getSessions({
        year,
        session_name: 'Race',
      });
      sessionsCache.set(year, sessions);
    }

    // Find matching session by date and location
    // Use the race date directly (it's already in the correct timezone)
    const raceDateStr = raceDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const matchingSession = sessions.find((session) => {
      const sessionDate = new Date(session.date_start)
        .toISOString()
        .split('T')[0];

      // More flexible location matching
      const locationLower = location.toLowerCase();
      const countryLower = country.toLowerCase();
      const sessionLocationLower = session.location.toLowerCase();
      const sessionCountryLower = session.country_name.toLowerCase();

      const locationMatch =
        sessionLocationLower === locationLower ||
        sessionCountryLower === countryLower ||
        sessionLocationLower.includes(locationLower) ||
        locationLower.includes(sessionLocationLower) ||
        sessionCountryLower.includes(countryLower) ||
        countryLower.includes(sessionCountryLower);

      return sessionDate === raceDateStr && locationMatch;
    });

    if (!matchingSession) {
      return null;
    }

    // Get all session results and filter to top 3
    const allResults = await getSessionResults({
      session_key: matchingSession.session_key,
    });

    if (!allResults || allResults.length === 0) {
      return null;
    }

    // Sort all results by position ascending (1st, 2nd, 3rd, etc.)
    // Position 1 = winner, 2 = second place, 3 = third place
    // Filter out any invalid positions (should be >= 1)
    const validResults = allResults.filter(
      (r) => r.position != null && r.position >= 1
    );
    const sortedResults = [...validResults].sort(
      (a, b) => a.position - b.position
    );

    // Get top 3 positions (positions 1, 2, 3) - these are the winners
    // Make sure we're getting the FIRST 3 positions, not the last
    const top3Results = sortedResults
      .filter((r) => r.position === 1 || r.position === 2 || r.position === 3)
      .sort((a, b) => a.position - b.position)
      .slice(0, 3);

    if (top3Results.length === 0) {
      return null;
    }

    // Get driver information for this session
    const drivers = await getDrivers({
      session_key: matchingSession.session_key,
    });

    // Create a driver map for quick lookup
    const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

    // Format the results (top 3) - already sorted by position
    const formattedResults: FormattedRaceResult[] = top3Results.map(
      (result) => {
        const driver = driverMap.get(result.driver_number);

        return {
          position: result.position,
          driverNumber: result.driver_number,
          driverName: driver?.full_name || `Driver #${result.driver_number}`,
          teamName: driver?.team_name || 'Unknown',
          teamColour: driver?.team_colour || '000000',
          points: result.points,
          timeOrStatus: result.gap_to_leader
            ? result.gap_to_leader === '+1 LAP'
              ? '+1 LAP'
              : `+${formatGap(result.gap_to_leader)}`
            : result.dnf || result.dns || result.dsq
            ? 'DNF'
            : null,
        };
      }
    );

    return formattedResults;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching top 3 finishers:', error);
    return null;
  }
}

/**
 * Get all race results (positions 4-20) for a race by matching date and location
 */
export async function getRemainingFinishers(
  raceDate: Date,
  location: string,
  country: string,
  year: number
): Promise<FormattedRaceResult[] | null> {
  try {
    // Get all race sessions for the year (with caching)
    let sessions = sessionsCache.get(year);
    if (!sessions) {
      sessions = await getSessions({
        year,
        session_name: 'Race',
      });
      sessionsCache.set(year, sessions);
    }

    // Find matching session by date and location
    const raceDateStr = raceDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const matchingSession = sessions.find((session) => {
      const sessionDate = new Date(session.date_start)
        .toISOString()
        .split('T')[0];

      // More flexible location matching
      const locationLower = location.toLowerCase();
      const countryLower = country.toLowerCase();
      const sessionLocationLower = session.location.toLowerCase();
      const sessionCountryLower = session.country_name.toLowerCase();

      const locationMatch =
        sessionLocationLower === locationLower ||
        sessionCountryLower === countryLower ||
        sessionLocationLower.includes(locationLower) ||
        locationLower.includes(sessionLocationLower) ||
        sessionCountryLower.includes(countryLower) ||
        countryLower.includes(sessionCountryLower);

      return sessionDate === raceDateStr && locationMatch;
    });

    if (!matchingSession) {
      return null;
    }

    // Get all session results
    const allResults = await getSessionResults({
      session_key: matchingSession.session_key,
    });

    if (!allResults || allResults.length === 0) {
      return null;
    }

    // Sort all results by position ascending
    // Get all positions >= 4 (remaining finishers after top 3)
    // Don't limit to 20, as there might be more drivers or DNF drivers
    const remainingResults = allResults.slice(3);

    // Get driver information for this session
    const drivers = await getDrivers({
      session_key: matchingSession.session_key,
    });

    // Create a driver map for quick lookup
    const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

    // Format the results
    const formattedResults: FormattedRaceResult[] = remainingResults.map(
      (result) => {
        const driver = driverMap.get(result.driver_number);

        return {
          position: result.position,
          driverNumber: result.driver_number,
          driverName: driver?.full_name || `Driver #${result.driver_number}`,
          teamName: driver?.team_name || 'Unknown',
          teamColour: driver?.team_colour || '000000',
          points: result.points,
          timeOrStatus: result.gap_to_leader
            ? result.gap_to_leader === '+1 LAP'
              ? '+1 LAP'
              : `+${formatGap(result.gap_to_leader)}`
            : result.dnf || result.dns || result.dsq
            ? 'DNF'
            : null,
        };
      }
    );

    return formattedResults;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching remaining finishers:', error);
    return null;
  }
}

/**
 * Helper function to format gap in seconds to readable format
 */
function formatGap(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(3)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
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
 * Championship standings types
 */
export interface DriverStanding {
  position: number;
  driverName: string;
  driverNumber: number;
  teamName: string;
  teamColour: string;
  points: number;
}

export interface ConstructorStanding {
  position: number;
  teamName: string;
  teamColour: string;
  points: number;
}

export interface ChampionshipStandings {
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
}

/**
 * Normalize driver name for matching (uppercase, remove extra spaces)
 */
function normalizeDriverName(name: string): string {
  return name.toUpperCase().trim().replace(/\s+/g, ' ');
}

/**
 * Normalize team name for matching
 * Handles common variations like "Racing Bulls" vs "Racing Bulls F1 Team"
 */
function normalizeTeamName(name: string): string {
  return name
    .replace(/\s+F1\s+TEAM\s*/gi, '')
    .replace(/\s+TEAM\s*/gi, '')
    .trim()
    .toUpperCase();
}

/**
 * Calculate championship standings from all completed races in a season
 * Uses hardcoded standings up to a cutoff date, then calculates points from races after that date
 */
export async function getChampionshipStandings(
  year: number
): Promise<ChampionshipStandings> {
  try {
    // Import hardcoded standings
    const {
      STANDINGS_CUTOFF_DATE,
      HARDCODED_DRIVER_STANDINGS,
      HARDCODED_CONSTRUCTOR_STANDINGS,
    } = await import('@/constants/standings');

    const cutoffDate = new Date(STANDINGS_CUTOFF_DATE);
    cutoffDate.setHours(0, 0, 0, 0);

    // Get all race sessions for the year
    let sessions = sessionsCache.get(year);
    if (!sessions) {
      sessions = await getSessions({
        year,
        session_name: 'Race',
      });
      sessionsCache.set(year, sessions);
    }

    // Sort sessions by date to process in chronological order
    const sortedSessions = [...sessions].sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

    // Initialize with hardcoded standings
    // Use driver name as key for matching (since we don't have driver numbers in hardcoded data)
    const driverPointsMap = new Map<
      string,
      {
        name: string;
        driverNumber?: number;
        teamName: string;
        teamColour: string;
        points: number;
      }
    >();
    const constructorPointsMap = new Map<
      string,
      { colour: string; points: number }
    >();

    // Load hardcoded driver standings
    for (const standing of HARDCODED_DRIVER_STANDINGS) {
      const normalizedName = normalizeDriverName(standing.driverName);
      driverPointsMap.set(normalizedName, {
        name: standing.driverName,
        teamName: standing.teamName,
        teamColour: standing.teamColour,
        points: standing.points,
      });
    }

    // Load hardcoded constructor standings (use normalized name as key)
    for (const standing of HARDCODED_CONSTRUCTOR_STANDINGS) {
      const normalizedTeamName = normalizeTeamName(standing.teamName);
      constructorPointsMap.set(normalizedTeamName, {
        colour: standing.teamColour,
        points: standing.points,
      });
      // Also store original name mapping for lookup
      constructorPointsMap.set(standing.teamName, {
        colour: standing.teamColour,
        points: standing.points,
      });
    }

    // Process each race session (only after cutoff date)
    for (const session of sortedSessions) {
      try {
        const sessionDate = new Date(session.date_start);
        sessionDate.setHours(0, 0, 0, 0);

        // Skip races before the cutoff date (already included in hardcoded standings)
        if (sessionDate <= cutoffDate) {
          continue;
        }

        // Get session results for this race
        const results = await getSessionResults({
          session_key: session.session_key,
        });

        // Skip races that haven't happened yet (no results)
        if (!results || results.length === 0) {
          continue;
        }

        // Get driver information for this session
        const drivers = await getDrivers({
          session_key: session.session_key,
        });

        // Create a driver map for quick lookup
        const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

        // Aggregate points from this race
        for (const result of results) {
          const driver = driverMap.get(result.driver_number);
          if (!driver || result.points === 0) continue;

          const driverName = driver.full_name;
          const normalizedName = normalizeDriverName(driverName);
          const teamName = driver.team_name || 'Unknown';
          const normalizedTeamName = normalizeTeamName(teamName);
          const teamColour = driver.team_colour || '000000';

          // Update driver points (match by normalized name)
          const existingDriver = driverPointsMap.get(normalizedName);
          if (existingDriver) {
            existingDriver.points += result.points;
            // Update driver number if we have it now
            if (!existingDriver.driverNumber) {
              existingDriver.driverNumber = result.driver_number;
            }
          } else {
            // New driver not in hardcoded standings
            driverPointsMap.set(normalizedName, {
              name: driverName,
              driverNumber: result.driver_number,
              teamName,
              teamColour,
              points: result.points,
            });
          }

          // Update constructor points (try normalized name first, then original)
          const existingConstructor =
            constructorPointsMap.get(normalizedTeamName) ||
            constructorPointsMap.get(teamName);
          if (existingConstructor) {
            existingConstructor.points += result.points;
            // Update team colour if we have a better one from API
            if (teamColour !== '000000') {
              existingConstructor.colour = teamColour;
            }
          } else {
            // New constructor not in hardcoded standings
            constructorPointsMap.set(normalizedTeamName, {
              colour: teamColour,
              points: result.points,
            });
            // Also store with original name for consistency
            if (normalizedTeamName !== teamName) {
              constructorPointsMap.set(teamName, {
                colour: teamColour,
                points: result.points,
              });
            }
          }
        }
      } catch (error) {
        // Skip races that haven't happened yet or have errors
        // eslint-disable-next-line no-console
        console.warn(
          `Skipping session ${session.session_key} due to error:`,
          error
        );
        continue;
      }
    }

    // Convert maps to arrays and sort by points (descending)
    const driverStandings: DriverStanding[] = Array.from(
      driverPointsMap.values()
    )
      .map((data) => ({
        position: 0, // Will be set after sorting
        driverName: data.name,
        driverNumber: data.driverNumber || 0, // Use 0 if not available
        teamName: data.teamName,
        teamColour: data.teamColour,
        points: data.points,
      }))
      .sort((a, b) => b.points - a.points)
      .map((standing, index) => ({
        ...standing,
        position: index + 1,
      }));

    // For constructors, we need to deduplicate by normalized name
    // and use the original team name from hardcoded data if available
    const constructorMap = new Map<string, ConstructorStanding>();
    const constructorEntries = Array.from(constructorPointsMap.entries());
    for (const [teamName, data] of constructorEntries) {
      const normalized = normalizeTeamName(teamName);
      const existing = constructorMap.get(normalized);
      if (!existing || existing.points < data.points) {
        // Prefer original team name from hardcoded data if it exists
        const originalName =
          HARDCODED_CONSTRUCTOR_STANDINGS.find(
            (s) => normalizeTeamName(s.teamName) === normalized
          )?.teamName || teamName;
        constructorMap.set(normalized, {
          position: 0,
          teamName: originalName,
          teamColour: data.colour,
          points: data.points,
        });
      }
    }

    const constructorStandings: ConstructorStanding[] = Array.from(
      constructorMap.values()
    )
      .sort((a, b) => b.points - a.points)
      .map((standing, index) => ({
        ...standing,
        position: index + 1,
      }));

    return {
      drivers: driverStandings,
      constructors: constructorStandings,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error calculating championship standings:', error);
    throw error;
  }
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
