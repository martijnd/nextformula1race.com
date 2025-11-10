export type AppLocale = 'en' | 'nl';

export type TranslationDict = {
  common: {
    madeBy: string;
    addToCalendar: string;
  };
  home: {
    title: string;
    description: string;
    scheduleCta: string;
  };
  schedule: {
    seasonTitle: (year: string) => string;
    upcomingTitle: string;
    upcomingEmpty: string;
    completedToggleShow: string;
    completedToggleHide: string;
    completedTitle: string;
    completedEmpty: string;
    nextRaceBadge: string;
    roundX: (round: number | string) => string;
    sprintWeekendNote: string;
    weekendScheduleHeading: string;
    event: {
      fp1: string;
      fp2: string;
      fp3: string;
      qualifying: string;
      sprintQualifying: string;
      sprint: string;
      race: string;
    };
    status: {
      liveNow: string;
      finished: (distance: string) => string;
      startsIn: (distance: string) => string;
    };
  };
  standings: {
    title: string;
    driver: string;
    points: string;
  };
  raceTime: {
    liveNow: string;
    startedAgo: (duration: string) => string;
    inDuration: (duration: string) => string;
    sprintWeekend: string;
    noMoreRaces: string;
    seeYouInPrefix: string;
    seeYouInSuffix: string;
  };
};


