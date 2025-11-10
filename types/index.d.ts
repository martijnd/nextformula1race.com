export interface Location {
  locality: string;
  country: string;
}

export interface Circuit {
  id: string;
  url?: string;
  circuitName: string;
  location: Location;
}

export interface RaceEvent {
  date: string;
  time: string;
  dateTime?: Date;
}

export type BaseRaceType = {
  season: string;
  round: string;
  raceName: string;
  circuit: Circuit;
  race: {
    date: string;
    time: string;
  };
  qualifying: RaceEvent;
  officialUrl?: string;
};

export type RegularRaceType = BaseRaceType & {
  firstPractice: RaceEvent;
  secondPractice: RaceEvent;
  thirdPractice: RaceEvent;
};

export type SprintRaceType = BaseRaceType & {
  firstPractice: RaceEvent;
  sprintQualifying: RaceEvent;
  sprint: RaceEvent;
};

export type RaceType = RegularRaceType | SprintRaceType;
