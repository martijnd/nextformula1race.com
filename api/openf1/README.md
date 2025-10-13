# OpenF1 API Integration

This directory contains a comprehensive integration with the [OpenF1 API](https://openf1.org/), providing access to real-time and historical Formula 1 data.

## Quick Start: Get Race Results

The easiest way to get race results is using the `getRaceResults` function:

```typescript
import { getRaceResults, type RaceName } from '@/api/openf1';

// Get Monaco Grand Prix 2023 results
const results = await getRaceResults('Monaco Grand Prix', 2023);

// Results are formatted and ready to display
results.forEach((result) => {
  console.log(
    `${result.position}. ${result.driverName} (${result.teamName}) - ${result.points} pts`
  );
});
```

## Type-Safe Parameters

All function parameters are fully typed for better IDE support and type safety:

```typescript
import {
  getDrivers,
  getLaps,
  type GetDriversParams,
  type GetLapsParams,
} from '@/api/openf1';

// Parameters are type-checked
const driversParams: GetDriversParams = {
  session_key: 9159,
  driver_number: 1, // optional
};

const drivers = await getDrivers(driversParams);

// Or use inline
const laps = await getLaps({
  session_key: 9159,
  driver_number: 44,
  lap_number: 10, // optional
});
```

### Output Example:

```
1. Max VERSTAPPEN (Red Bull Racing) - 25 pts
2. Fernando ALONSO (Aston Martin) - 18 pts
3. Esteban OCON (Alpine) - 15 pts
...
```

## Race Names (Type-Safe)

The `getRaceResults` function accepts these race names:

- `'Australian Grand Prix'`
- `'Bahrain Grand Prix'`
- `'Saudi Arabian Grand Prix'`
- `'Japanese Grand Prix'`
- `'Chinese Grand Prix'`
- `'Miami Grand Prix'`
- `'Emilia Romagna Grand Prix'`
- `'Monaco Grand Prix'`
- `'Spanish Grand Prix'`
- `'Canadian Grand Prix'`
- `'Austrian Grand Prix'`
- `'British Grand Prix'`
- `'Belgian Grand Prix'`
- `'Hungarian Grand Prix'`
- `'Dutch Grand Prix'`
- `'Italian Grand Prix'`
- `'Azerbaijan Grand Prix'`
- `'Singapore Grand Prix'`
- `'United States Grand Prix'`
- `'Mexico City Grand Prix'`
- `'São Paulo Grand Prix'`
- `'Las Vegas Grand Prix'`
- `'Qatar Grand Prix'`
- `'Abu Dhabi Grand Prix'`

## Formatted Race Result Structure

```typescript
interface FormattedRaceResult {
  position: number; // Final position (1-20)
  driverNumber: number; // Driver's race number
  driverName: string; // Full name (e.g., "Max VERSTAPPEN")
  teamName: string; // Team name
  teamColour: string; // Team color hex code (without #)
  points: number; // Points earned
  timeOrStatus: string | null; // Formatted time or status (see below)
}
```

### Time/Status Format

The `timeOrStatus` field shows different information based on the driver's finish:

- **Winner**: Total race time (e.g., `"1:32:15.123"`)
- **Finished on same lap**: Gap to winner (e.g., `"+5.432s"`)
- **Lapped**: Laps behind (e.g., `"+1 lap"` or `"+2 laps"`)
- **DNF/DNS**: `"DNF"` (Did Not Finish)

## Other Available Functions

### Sessions & Meetings

```typescript
// Get a specific session
const session = await getSession(9159);

// Get all sessions for a year
const sessions = await getSessions({ year: 2023 });

// Get latest/current session
const latest = await getLatestSession();

// Get all meetings (race weekends)
const meetings = await getMeetings({ year: 2023 });
```

### Driver Data

```typescript
// Get drivers in a session
const drivers = await getDrivers({ session_key: 9159 });

// Get driver positions during race
const positions = await getPositions({
  session_key: 9159,
  driver_number: 1,
});
```

### Telemetry & Performance

```typescript
// Get car telemetry data
const carData = await getCarData({
  session_key: 9159,
  driver_number: 1,
});

// Get lap times
const laps = await getLaps({
  session_key: 9159,
  driver_number: 44,
});

// Get tyre stints
const stints = await getStints({ session_key: 9159 });
```

### Race Information

```typescript
// Get pit stops
const pitStops = await getPitStops({ session_key: 9159 });

// Get starting grid
const grid = await getStartingGrid({ session_key: 9159 });

// Get race control messages (flags, penalties)
const messages = await getRaceControl({ session_key: 9159 });

// Get weather data
const weather = await getWeather({ session_key: 9159 });

// Get team radio
const radio = await getTeamRadio({
  session_key: 9159,
  driver_number: 1,
});
```

## API Reference

All functions are fully typed with TypeScript. See `types.ts` for complete type definitions.

### Base URL

```
https://api.openf1.org/v1
```

### Authentication

Historical data is freely accessible with no authentication required. Real-time data requires a paid account.

## Available Parameter Types

All exported parameter types from `types.ts`:

### Individual Parameter Types

- `GetSessionsParams` - For filtering sessions
- `GetMeetingsParams` - For filtering meetings
- `GetDriversParams` - Driver data filters
- `GetPositionsParams` - Position data filters
- `GetCarDataParams` - Car telemetry filters
- `GetLapsParams` - Lap data filters
- `GetStintsParams` - Stint data filters
- `GetTeamRadioParams` - Team radio filters
- `GetWeatherParams` - Weather data filters
- `GetIntervalsParams` - Interval data filters
- `GetPitStopsParams` - Pit stop filters
- `GetRaceControlParams` - Race control message filters
- `GetLocationParams` - Location data filters
- `GetStartingGridParams` - Starting grid filters
- `GetSessionResultsParams` - Session results filters
- `GetOvertakesParams` - Overtakes data filters

### Utility Types

- `OpenF1QueryParams` - Union of all parameter types (for strict typing)
- `SessionKey` - `number | 'latest'`
- `MeetingKey` - `number | 'latest'`
- `RaceName` - Type-safe race names
- `FormattedRaceResult` - Formatted race result interface

Import them using:

```typescript
import type {
  GetSessionsParams,
  OpenF1QueryParams,
  RaceName,
  FormattedRaceResult,
} from '@/api/openf1';
```

## Links

- [OpenF1 Documentation](https://openf1.org/)
- [API Endpoints](https://openf1.org/#api-endpoints)
- [Data Filtering](https://openf1.org/#data-filtering)
