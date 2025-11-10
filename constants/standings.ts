/**
 * Hardcoded championship standings as of a specific date
 * This reduces API calls by only calculating points from races after this date
 */

import { type DriverStanding, type ConstructorStanding } from '@/api/openf1';

/**
 * Cutoff date: Only races after this date will be calculated
 * Format: YYYY-MM-DD
 * Update this when you update the hardcoded standings below
 */
export const STANDINGS_CUTOFF_DATE = '2025-11-10';

/**
 * Hardcoded driver standings as of the cutoff date
 * These points are already included and won't be recalculated
 */
export const HARDCODED_DRIVER_STANDINGS: Omit<
  DriverStanding,
  'driverNumber'
>[] = [
  {
    position: 1,
    driverName: 'Lando NORRIS',
    teamName: 'McLaren',
    teamColour: 'FF8700', // Papaya Orange
    points: 367,
  },
  {
    position: 2,
    driverName: 'Oscar PIASTRI',
    teamName: 'McLaren',
    teamColour: 'FF8700',
    points: 345,
  },
  {
    position: 3,
    driverName: 'Max VERSTAPPEN',
    teamName: 'Red Bull Racing',
    teamColour: '1E41FF', // Dark Blue
    points: 314,
  },
  {
    position: 4,
    driverName: 'George RUSSELL',
    teamName: 'Mercedes',
    teamColour: '00D2BE', // Teal/Turquoise
    points: 253,
  },
  {
    position: 5,
    driverName: 'Charles LECLERC',
    teamName: 'Ferrari',
    teamColour: 'DC0000', // Red
    points: 197,
  },
  {
    position: 6,
    driverName: 'Lewis HAMILTON',
    teamName: 'Ferrari',
    teamColour: 'DC0000',
    points: 127,
  },
  {
    position: 7,
    driverName: 'Andrea Kimi ANTONELLI',
    teamName: 'Mercedes',
    teamColour: '00D2BE',
    points: 110,
  },
  {
    position: 8,
    driverName: 'Alexander ALBON',
    teamName: 'Williams',
    teamColour: '005AFF', // Blue
    points: 70,
  },
  {
    position: 9,
    driverName: 'Nico HULKENBERG',
    teamName: 'Kick Sauber',
    teamColour: '00A550', // Matt Green
    points: 43,
  },
  {
    position: 10,
    driverName: 'Isack HADJAR',
    teamName: 'Racing Bulls',
    teamColour: 'EC0374', // Magenta/Pink
    points: 42,
  },
  {
    position: 11,
    driverName: 'Oliver BEARMAN',
    teamName: 'Haas F1 Team',
    teamColour: 'FFFFFF', // White
    points: 38,
  },
  {
    position: 12,
    driverName: 'Fernando ALONSO',
    teamName: 'Aston Martin',
    teamColour: '00665E', // Dark Green
    points: 37,
  },
  {
    position: 13,
    driverName: 'Liam LAWSON',
    teamName: 'Racing Bulls',
    teamColour: 'EC0374',
    points: 36,
  },
  {
    position: 14,
    driverName: 'Carlos SAINZ',
    teamName: 'Williams',
    teamColour: '005AFF',
    points: 29,
  },
  {
    position: 15,
    driverName: 'Lance STROLL',
    teamName: 'Aston Martin',
    teamColour: '00665E',
    points: 28,
  },
  {
    position: 16,
    driverName: 'Esteban OCON',
    teamName: 'Haas F1 Team',
    teamColour: 'FFFFFF',
    points: 26,
  },
  {
    position: 17,
    driverName: 'Pierre GASLY',
    teamName: 'Alpine',
    teamColour: '0090FF', // Light Blue (more visible on black)
    points: 20,
  },
  {
    position: 18,
    driverName: 'Yuki TSUNODA',
    teamName: 'Red Bull Racing',
    teamColour: '1E41FF',
    points: 20,
  },
  {
    position: 19,
    driverName: 'Gabriel BORTOLETO',
    teamName: 'Kick Sauber',
    teamColour: '00A550',
    points: 19,
  },
  {
    position: 20,
    driverName: 'Franco COLAPINTO',
    teamName: 'Alpine',
    teamColour: '0090FF', // Light Blue (more visible on black)
    points: 0,
  },
];

/**
 * Hardcoded constructor standings as of the cutoff date
 * These points are already included and won't be recalculated
 */
export const HARDCODED_CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  {
    position: 1,
    teamName: 'McLaren',
    teamColour: 'FF8700',
    points: 712,
  },
  {
    position: 2,
    teamName: 'Mercedes',
    teamColour: '00D2BE',
    points: 363,
  },
  {
    position: 3,
    teamName: 'Red Bull Racing',
    teamColour: '1E41FF',
    points: 334,
  },
  {
    position: 4,
    teamName: 'Ferrari',
    teamColour: 'DC0000',
    points: 324,
  },
  {
    position: 5,
    teamName: 'Williams',
    teamColour: '005AFF',
    points: 99,
  },
  {
    position: 6,
    teamName: 'Racing Bulls',
    teamColour: 'EC0374',
    points: 78,
  },
  {
    position: 7,
    teamName: 'Aston Martin',
    teamColour: '00665E',
    points: 65,
  },
  {
    position: 8,
    teamName: 'Haas F1 Team',
    teamColour: 'FFFFFF',
    points: 64,
  },
  {
    position: 9,
    teamName: 'Kick Sauber',
    teamColour: '00A550',
    points: 62,
  },
  {
    position: 10,
    teamName: 'Alpine',
    teamColour: '0090FF', // Light Blue (more visible on black)
    points: 20,
  },
];
