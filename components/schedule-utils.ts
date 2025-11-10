import {
  RegularRaceType,
  SprintRaceType,
} from '@/classes/race-event';
import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { RegularRace, SprintRace } from '@/classes/race';
import type { Locale } from 'date-fns';
import type { Translator } from '@/lib/i18n/types';

const RACE_NAME_MAP: Record<string, string> = {
  albert_park: 'Melbourne',
  shanghai: 'Shanghai',
  suzuka: 'Suzuka',
  bahrain: 'Sakhir',
  jeddah: 'Jeddah',
  miami: 'Miami',
  imola: 'Imola',
  monaco: 'Monaco',
  catalunya: 'Barcelona',
  villeneuve: 'Montreal',
  red_bull_ring: 'Austria',
  silverstone: 'Silverstone',
  spa: 'Belgium',
  hungaroring: 'Hungary',
  zandvoort: 'Netherlands',
  monza: 'Italy',
  baku: 'Azerbaijan',
  marina_bay: 'Singapore',
  americas: 'COTA, USA',
  rodriguez: 'Mexico City',
  interlagos: 'São Paulo',
  vegas: 'Las Vegas',
  losail: 'Qatar',
  yas_marina: 'Abu Dhabi',
};

export type RaceLike = RegularRace | SprintRace;

export function getRaceName(race: RaceLike) {
  return RACE_NAME_MAP[race.Circuit.circuitId] ?? race.Circuit.Location.country;
}

export function buildRaceDescriptor(
  race: RaceLike,
  now: Date,
  t: Translator,
  dateLocale: Locale
) {
  const isSprint = race instanceof SprintRace;
  const mainRaceType = isSprint ? SprintRaceType.Race : RegularRaceType.Race;
  const isLive = race.isCurrentlyLive(mainRaceType, now);
  const hasHappened = race.hasHappened(now);

  const status = isLive
    ? { label: t('schedule.status.liveNow'), tone: 'live' as const }
    : hasHappened
    ? {
        label: t(
          'schedule.status.finished',
          formatDistanceToNow(race.dateTime, {
            addSuffix: false,
            locale: dateLocale,
          })
        ),
        tone: 'completed' as const,
      }
    : {
        label: t(
          'schedule.status.startsIn',
          formatDistanceToNow(race.dateTime, {
            addSuffix: false,
            locale: dateLocale,
          })
        ),
        tone: 'upcoming' as const,
      };

  return {
    name: `${getRaceName(race)} Grand Prix`,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuit: race.Circuit.circuitName,
    date: format(race.dateTime, 'eeee d MMMM • HH:mm', { locale: dateLocale }),
    status,
    isSprint,
  };
}

