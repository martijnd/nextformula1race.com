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
    topFinishers: string;
    remainingFinishers: string;
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

// ---- Type-safe translation key utilities ----
type PrimitiveOrFn = string | ((...args: any[]) => string);

type LeafPaths<T, Prev extends string = ''> = T extends PrimitiveOrFn
  ? Prev extends ''
    ? never
    : Prev
  : T extends object
  ? {
      [K in keyof T & string]: LeafPaths<
        T[K],
        Prev extends '' ? K : `${Prev}.${K}`
      >;
    }[keyof T & string]
  : never;

type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type TranslationKey = LeafPaths<TranslationDict>;
export type TranslationKeyValue<K extends TranslationKey> = PathValue<
  TranslationDict,
  K
>;
export type TranslationArgs<K extends TranslationKey> =
  TranslationKeyValue<K> extends (...a: infer A) => any ? A : [];

// The type-safe translator function signature
export type Translator = <K extends TranslationKey>(
  key: K,
  ...args: TranslationArgs<K>
) => string;
