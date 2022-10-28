export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
}

export interface RaceEvent {
  date: string;
  time: string;
  dateTime: Date;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  FirstPractice: RaceEvent;
  SecondPractice: RaceEvent;
  ThirdPractice: RaceEvent;
  Qualifying: RaceEvent;
  Sprint: RaceEvent;
}

export interface RaceTable {
  season: string;
  Races: Race[];
}

export interface MRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: RaceTable;
}

export interface RacesResponse {
  MRData: MRData;
}
