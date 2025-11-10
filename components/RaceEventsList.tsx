import { format } from 'date-fns/format';
import { SprintRace } from '@/classes/race';
import { RaceEvent } from '@/classes/race-event';
import { useI18n } from '@/lib/i18n';
import { type RaceLike } from './schedule-utils';

interface RaceEventsListProps {
  race: RaceLike;
}

export function RaceEventsList({ race }: RaceEventsListProps) {
  const isSprint = race instanceof SprintRace;
  const { t, dateLocale } = useI18n();

  const events: Array<{ name: string; event: RaceEvent }> = isSprint
    ? [
        { name: t('schedule.event.fp1'), event: race.FirstPractice },
        {
          name: t('schedule.event.sprintQualifying'),
          event: race.SprintQualifying,
        },
        { name: t('schedule.event.sprint'), event: race.Sprint },
        { name: t('schedule.event.qualifying'), event: race.Qualifying },
        { name: t('schedule.event.race'), event: race },
      ]
    : [
        { name: t('schedule.event.fp1'), event: race.FirstPractice },
        { name: t('schedule.event.fp2'), event: race.SecondPractice },
        { name: t('schedule.event.fp3'), event: race.ThirdPractice },
        { name: t('schedule.event.qualifying'), event: race.Qualifying },
        { name: t('schedule.event.race'), event: race },
      ];

  // Sort events chronologically (earliest first)
  const sortedEvents = [...events].sort(
    (a, b) => a.event.dateTime.getTime() - b.event.dateTime.getTime()
  );

  return (
    <div className="w-full">
      <h5 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        <span className="h-0.5 w-6 bg-f1-red-light"></span>
        {t('schedule.weekendScheduleHeading')}
      </h5>
      <div className="space-y-2">
        {sortedEvents.map(({ name, event }) => (
          <div
            key={name}
            className="grid rounded-lg items-center grid-cols-5 border-2 border-f1-gray bg-f1-black/50 px-5 py-3.5 transition-all hover:border-f1-red hover:shadow-md"
          >
            <span className="text-sm col-span-2 font-bold text-white uppercase tracking-wide text-left">
              {name}
            </span>
            <span className="text-sm col-span-2 font-bold text-white">
              {format(event.dateTime, 'EEE d MMM', { locale: dateLocale })}
            </span>
            <span className="text-lg col-span-1 font-black text-f1-red-light">
              {format(event.dateTime, 'HH:mm')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

