// OpenF1 API Type Definitions

export interface Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export interface Meeting {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

export interface Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export interface Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface CarData {
  brake: number;
  date: string;
  driver_number: number;
  drs: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;
}

export interface Lap {
  date_start: string;
  driver_number: number;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed: number | null;
  i2_speed: number | null;
  is_pit_out_lap: boolean;
  lap_duration: number | null;
  lap_number: number;
  meeting_key: number;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  session_key: number;
  st_speed: number | null;
}

export interface Stint {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age_at_start: number;
}

export interface TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  recording_url: string;
  session_key: number;
}

export interface Weather {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

export interface Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number;
  interval: number;
  meeting_key: number;
  session_key: number;
}

export interface Pit {
  date: string;
  driver_number: number;
  lap_number: number;
  meeting_key: number;
  pit_duration: number;
  session_key: number;
}

export interface RaceControl {
  category: string;
  date: string;
  driver_number: number | null;
  flag: string | null;
  lap_number: number | null;
  meeting_key: number;
  message: string;
  scope: string;
  sector: number | null;
  session_key: number;
}

export interface Location {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;
}

export interface StartingGrid {
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface SessionResult {
  driver_number: number;
  meeting_key: number;
  position: number;
  points: number;
  session_key: number;
  time: number | null;
  number_of_laps?: number;
  dnf?: boolean;
  dns?: boolean;
  dsq?: boolean;
  duration?: number;
  gap_to_leader?: number | string;
}

export interface Overtake {
  date: string;
  driver_number: number;
  meeting_key: number;
  overtaking_driver_number: number;
  session_key: number;
}

// API Query Parameter Types

export type SessionKey = number | 'latest';
export type MeetingKey = number | 'latest';

export interface GetSessionsParams {
  year?: number;
  country_name?: string;
  circuit_short_name?: string;
  session_name?: string;
  session_type?: string;
  meeting_key?: number;
  date_start?: string;
  date_end?: string;
}

export interface GetMeetingsParams {
  year?: number;
  country_name?: string;
  circuit_short_name?: string;
  meeting_key?: number;
}

export interface GetDriversParams {
  session_key: SessionKey;
  driver_number?: number;
}

export interface GetPositionsParams {
  session_key: SessionKey;
  driver_number?: number;
  position?: number;
  date?: string;
}

export interface GetCarDataParams {
  session_key: SessionKey;
  driver_number?: number;
  speed?: number;
  rpm?: number;
}

export interface GetLapsParams {
  session_key: SessionKey;
  driver_number?: number;
  lap_number?: number;
}

export interface GetStintsParams {
  session_key: SessionKey;
  driver_number?: number;
  stint_number?: number;
}

export interface GetTeamRadioParams {
  session_key: SessionKey;
  driver_number?: number;
}

export interface GetWeatherParams {
  session_key?: SessionKey;
  meeting_key?: MeetingKey;
}

export interface GetIntervalsParams {
  session_key: SessionKey;
  driver_number?: number;
}

export interface GetPitStopsParams {
  session_key: SessionKey;
  driver_number?: number;
}

export interface GetRaceControlParams {
  session_key: SessionKey;
  driver_number?: number;
  flag?: string;
  category?: string;
}

export interface GetLocationParams {
  session_key: SessionKey;
  driver_number?: number;
}

export interface GetStartingGridParams {
  session_key: SessionKey;
}

export interface GetSessionResultsParams {
  session_key: SessionKey;
}

export interface GetOvertakesParams {
  session_key: SessionKey;
  driver_number?: number;
}

// Race Results Types

export type RaceName =
  | 'Australian Grand Prix'
  | 'Bahrain Grand Prix'
  | 'Saudi Arabian Grand Prix'
  | 'Japanese Grand Prix'
  | 'Chinese Grand Prix'
  | 'Miami Grand Prix'
  | 'Emilia Romagna Grand Prix'
  | 'Monaco Grand Prix'
  | 'Spanish Grand Prix'
  | 'Canadian Grand Prix'
  | 'Austrian Grand Prix'
  | 'British Grand Prix'
  | 'Belgian Grand Prix'
  | 'Hungarian Grand Prix'
  | 'Dutch Grand Prix'
  | 'Italian Grand Prix'
  | 'Azerbaijan Grand Prix'
  | 'Singapore Grand Prix'
  | 'United States Grand Prix'
  | 'Mexico City Grand Prix'
  | 'São Paulo Grand Prix'
  | 'Las Vegas Grand Prix'
  | 'Qatar Grand Prix'
  | 'Abu Dhabi Grand Prix';

export interface FormattedRaceResult {
  position: number;
  driverNumber: number;
  driverName: string;
  teamName: string;
  teamColour: string;
  points: number;
  timeOrStatus: string | null;
}

// Union type of all API query parameter types
export type OpenF1QueryParams =
  | GetSessionsParams
  | GetMeetingsParams
  | GetDriversParams
  | GetPositionsParams
  | GetCarDataParams
  | GetLapsParams
  | GetStintsParams
  | GetTeamRadioParams
  | GetWeatherParams
  | GetIntervalsParams
  | GetPitStopsParams
  | GetRaceControlParams
  | GetLocationParams
  | GetStartingGridParams
  | GetSessionResultsParams
  | GetOvertakesParams;
