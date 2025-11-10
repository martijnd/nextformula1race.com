import { useI18n } from '@/lib/i18n';

interface NoRaceDisplayProps {
  currentTime: Date;
  season: string;
}

export function NoRaceDisplay({ currentTime, season }: NoRaceDisplayProps) {
  const { t } = useI18n();
  const currentYear = currentTime.getFullYear();
  const stillInCurrentSeasonYear = season === currentYear.toString();
  // If we're still in 2022 and referencing 2023 season, add 1 to the current year
  // Otherwise, add nothing
  const nextYearsSeason = stillInCurrentSeasonYear
    ? currentYear + 1
    : currentYear;

  return (
    <>
      <h1 className="text-5xl md:text-7xl font-black text-f1-red-light">
        {t('raceTime.noMoreRaces')}
      </h1>
      <h2 className="mt-4 text-xl md:text-3xl font-semibold text-gray-300">
        {t('raceTime.seeYouInPrefix')}{' '}
        <span className="text-f1-red-light font-black">{nextYearsSeason}</span>
        {t('raceTime.seeYouInSuffix')}
      </h2>
    </>
  );
}
