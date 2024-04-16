import { RacesResponse } from '@/api/ergast/types/races';

export const races: RacesResponse = {
  MRData: {
    xmlns: 'http://ergast.com/mrd/1.5',
    series: 'f1',
    url: 'http://ergast.com/api/f1/2024.json',
    limit: '30',
    offset: '0',
    total: '23',
    RaceTable: {
      season: '2024',
      Races: [
        {
          season: '2024',
          round: '1',
          url: 'https://en.wikipedia.org/wiki/2024_Bahrain_Grand_Prix',
          raceName: 'Bahrain Grand Prix',
          Circuit: {
            circuitId: 'bahrain',
            url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
            circuitName: 'Bahrain International Circuit',
            Location: {
              lat: '26.0325',
              long: '50.5106',
              locality: 'Sakhir',
              country: 'Bahrain',
            },
          },
          date: '2024-03-02',
          time: '15:00:00Z',
          FirstPractice: {
            date: '2024-02-29',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-02-29',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-03-01',
            time: '12:30:00Z',
          },
          Qualifying: {
            date: '2024-03-01',
            time: '16:00:00Z',
          },
        },
        {
          season: '2024',
          round: '2',
          url: 'https://en.wikipedia.org/wiki/2024_Saudi_Arabian_Grand_Prix',
          raceName: 'Saudi Arabian Grand Prix',
          Circuit: {
            circuitId: 'jeddah',
            url: 'http://en.wikipedia.org/wiki/Jeddah_Street_Circuit',
            circuitName: 'Jeddah Corniche Circuit',
            Location: {
              lat: '21.6319',
              long: '39.1044',
              locality: 'Jeddah',
              country: 'Saudi Arabia',
            },
          },
          date: '2024-03-09',
          time: '17:00:00Z',
          FirstPractice: {
            date: '2024-03-07',
            time: '13:30:00Z',
          },
          SecondPractice: {
            date: '2024-03-07',
            time: '17:00:00Z',
          },
          ThirdPractice: {
            date: '2024-03-08',
            time: '13:30:00Z',
          },
          Qualifying: {
            date: '2024-03-08',
            time: '17:00:00Z',
          },
        },
        {
          season: '2024',
          round: '3',
          url: 'https://en.wikipedia.org/wiki/2024_Australian_Grand_Prix',
          raceName: 'Australian Grand Prix',
          Circuit: {
            circuitId: 'albert_park',
            url: 'http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit',
            circuitName: 'Albert Park Grand Prix Circuit',
            Location: {
              lat: '-37.8497',
              long: '144.968',
              locality: 'Melbourne',
              country: 'Australia',
            },
          },
          date: '2024-03-24',
          time: '04:00:00Z',
          FirstPractice: {
            date: '2024-03-22',
            time: '01:30:00Z',
          },
          SecondPractice: {
            date: '2024-03-22',
            time: '05:00:00Z',
          },
          ThirdPractice: {
            date: '2024-03-23',
            time: '01:30:00Z',
          },
          Qualifying: {
            date: '2024-03-23',
            time: '05:00:00Z',
          },
        },
        {
          season: '2024',
          round: '4',
          url: 'https://en.wikipedia.org/wiki/2024_Japanese_Grand_Prix',
          raceName: 'Japanese Grand Prix',
          Circuit: {
            circuitId: 'suzuka',
            url: 'http://en.wikipedia.org/wiki/Suzuka_Circuit',
            circuitName: 'Suzuka Circuit',
            Location: {
              lat: '34.8431',
              long: '136.541',
              locality: 'Suzuka',
              country: 'Japan',
            },
          },
          date: '2024-04-07',
          time: '05:00:00Z',
          FirstPractice: {
            date: '2024-04-05',
            time: '02:30:00Z',
          },
          SecondPractice: {
            date: '2024-04-05',
            time: '06:00:00Z',
          },
          ThirdPractice: {
            date: '2024-04-06',
            time: '02:30:00Z',
          },
          Qualifying: {
            date: '2024-04-06',
            time: '06:00:00Z',
          },
        },
        {
          season: '2024',
          round: '5',
          url: '???',
          raceName: 'China Grand Prix',
          Circuit: {
            circuitId: 'china',
            url: 'https://en.wikipedia.org/wiki/Shanghai_International_Circuit',
            circuitName: 'Shanghai International Circuit',
            Location: {
              country: 'China',
              locality: 'Shanghai',
              lat: '31.3389',
              long: '121.22',
            },
          },
          date: '2024-04-21',
          time: '07:00:00Z',
           FirstPractice: {
            date: '2024-04-19',
            time: '03:30:00Z',
          },
          Qualifying: {
            date: '2024-04-20',
            time: '07:00:00Z',
          },
          SecondPractice: {
            date: '2024-04-19',
            time: '07:30:00Z',
          },
          Sprint: {
            date: '2024-04-20',
            time: '03:00:00Z',
          },
        },
        {
          season: '2024',
          round: '6',
          url: 'https://en.wikipedia.org/wiki/2024_Miami_Grand_Prix',
          raceName: 'Miami Grand Prix',
          Circuit: {
            circuitId: 'miami',
            url: 'http://en.wikipedia.org/wiki/Miami_International_Autodrome',
            circuitName: 'Miami International Autodrome',
            Location: {
              lat: '25.9581',
              long: '-80.2389',
              locality: 'Miami',
              country: 'USA',
            },
          },
          date: '2024-05-05',
          time: '20:00:00Z',
          // TBA
          FirstPractice: {
            date: '2024-05-05',
            time: '17:30:00Z',
          },
          SecondPractice: {
            date: '2024-05-05',
            time: '21:00:00Z',
          },
          ThirdPractice: {
            date: '2024-05-06',
            time: '16:30:00Z',
          },
          Qualifying: {
            date: '2024-05-06',
            time: '20:00:00Z',
          },
        },
        {
          season: '2024',
          round: '7',
          url: 'https://en.wikipedia.org/wiki/2024_Emilia_Romagna_Grand_Prix',
          raceName: 'Emilia Romagna Grand Prix',
          Circuit: {
            circuitId: 'imola',
            url: 'http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari',
            circuitName: 'Autodromo Enzo e Dino Ferrari',
            Location: {
              lat: '44.3439',
              long: '11.7167',
              locality: 'Imola',
              country: 'Italy',
            },
          },
          date: '2024-05-19',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-05-17',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-05-17',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-05-18',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-05-18',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '8',
          url: 'https://en.wikipedia.org/wiki/2024_Monaco_Grand_Prix',
          raceName: 'Monaco Grand Prix',
          Circuit: {
            circuitId: 'monaco',
            url: 'http://en.wikipedia.org/wiki/Circuit_de_Monaco',
            circuitName: 'Circuit de Monaco',
            Location: {
              lat: '43.7347',
              long: '7.42056',
              locality: 'Monte-Carlo',
              country: 'Monaco',
            },
          },
          date: '2024-05-26',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-05-24',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-05-24',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-05-25',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-05-25',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '9',
          url: 'https://en.wikipedia.org/wiki/2024_Canadian_Grand_Prix',
          raceName: 'Canadian Grand Prix',
          Circuit: {
            circuitId: 'villeneuve',
            url: 'http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve',
            circuitName: 'Circuit Gilles Villeneuve',
            Location: {
              lat: '45.5',
              long: '-73.5228',
              locality: 'Montreal',
              country: 'Canada',
            },
          },
          date: '2024-06-09',
          time: '18:00:00Z',
          FirstPractice: {
            date: '2024-06-07',
            time: '17:30:00Z',
          },
          SecondPractice: {
            date: '2024-06-07',
            time: '21:00:00Z',
          },
          ThirdPractice: {
            date: '2024-06-08',
            time: '16:30:00Z',
          },
          Qualifying: {
            date: '2024-06-08',
            time: '20:00:00Z',
          },
        },
        {
          season: '2024',
          round: '10',
          url: 'https://en.wikipedia.org/wiki/2024_Spanish_Grand_Prix',
          raceName: 'Spanish Grand Prix',
          Circuit: {
            circuitId: 'catalunya',
            url: 'http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya',
            circuitName: 'Circuit de Barcelona-Catalunya',
            Location: {
              lat: '41.57',
              long: '2.26111',
              locality: 'Montmeló',
              country: 'Spain',
            },
          },
          date: '2024-06-23',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-06-21',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-06-21',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-06-22',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-06-22',
            time: '14:00:00Z',
          },
        },
        // TBA
        {
          season: '2024',
          round: '11',
          url: 'https://en.wikipedia.org/wiki/2024_Austrian_Grand_Prix',
          raceName: 'Austrian Grand Prix',
          Circuit: {
            circuitId: 'red_bull_ring',
            url: 'http://en.wikipedia.org/wiki/Red_Bull_Ring',
            circuitName: 'Red Bull Ring',
            Location: {
              lat: '47.2197',
              long: '14.7647',
              locality: 'Spielberg',
              country: 'Austria',
            },
          },
          date: '2024-06-30',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-06-28',
            time: '11:30:00Z',
          },
          Qualifying: {
            date: '2024-06-28',
            time: '15:00:00Z',
          },
          SecondPractice: {
            date: '2024-07-29',
            time: '10:30:00Z',
          },
          Sprint: {
            date: '2024-07-29',
            time: '14:30:00Z',
          },
        },
        {
          season: '2024',
          round: '12',
          url: 'https://en.wikipedia.org/wiki/2024_British_Grand_Prix',
          raceName: 'British Grand Prix',
          Circuit: {
            circuitId: 'silverstone',
            url: 'http://en.wikipedia.org/wiki/Silverstone_Circuit',
            circuitName: 'Silverstone Circuit',
            Location: {
              lat: '52.0786',
              long: '-1.01694',
              locality: 'Silverstone',
              country: 'UK',
            },
          },
          date: '2024-07-09',
          time: '14:00:00Z',
          FirstPractice: {
            date: '2024-07-07',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-07-07',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-07-08',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-07-08',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '13',
          url: 'https://en.wikipedia.org/wiki/2024_Hungarian_Grand_Prix',
          raceName: 'Hungarian Grand Prix',
          Circuit: {
            circuitId: 'hungaroring',
            url: 'http://en.wikipedia.org/wiki/Hungaroring',
            circuitName: 'Hungaroring',
            Location: {
              lat: '47.5789',
              long: '19.2486',
              locality: 'Budapest',
              country: 'Hungary',
            },
          },
          date: '2024-07-21',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-07-19',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-07-19',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-07-20',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-07-20',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '14',
          url: 'https://en.wikipedia.org/wiki/2024_Belgian_Grand_Prix',
          raceName: 'Belgian Grand Prix',
          Circuit: {
            circuitId: 'spa',
            url: 'http://en.wikipedia.org/wiki/Circuit_de_Spa-Francorchamps',
            circuitName: 'Circuit de Spa-Francorchamps',
            Location: {
              lat: '50.4372',
              long: '5.97139',
              locality: 'Spa',
              country: 'Belgium',
            },
          },
          date: '2024-07-28',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-07-26',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-07-26',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-07-27',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-07-27',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '15',
          url: 'https://en.wikipedia.org/wiki/2024_Dutch_Grand_Prix',
          raceName: 'Dutch Grand Prix',
          Circuit: {
            circuitId: 'zandvoort',
            url: 'http://en.wikipedia.org/wiki/Circuit_Zandvoort',
            circuitName: 'Circuit Park Zandvoort',
            Location: {
              lat: '52.3888',
              long: '4.54092',
              locality: 'Zandvoort',
              country: 'Netherlands',
            },
          },
          date: '2024-08-25',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-08-23',
            time: '10:30:00Z',
          },
          SecondPractice: {
            date: '2024-08-23',
            time: '14:00:00Z',
          },
          ThirdPractice: {
            date: '2024-08-24',
            time: '09:30:00Z',
          },
          Qualifying: {
            date: '2024-08-24',
            time: '13:00:00Z',
          },
        },
        {
          season: '2024',
          round: '16',
          url: 'https://en.wikipedia.org/wiki/2024_Italian_Grand_Prix',
          raceName: 'Italian Grand Prix',
          Circuit: {
            circuitId: 'monza',
            url: 'http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza',
            circuitName: 'Autodromo Nazionale di Monza',
            Location: {
              lat: '45.6156',
              long: '9.28111',
              locality: 'Monza',
              country: 'Italy',
            },
          },
          date: '2024-09-01',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-09-01',
            time: '11:30:00Z',
          },
          SecondPractice: {
            date: '2024-08-30',
            time: '15:00:00Z',
          },
          ThirdPractice: {
            date: '2024-08-31',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-08-31',
            time: '14:00:00Z',
          },
        },
        {
          season: '2024',
          round: '17',
          url: 'https://en.wikipedia.org/wiki/2024_Azerbaijan_Grand_Prix',
          raceName: 'Azerbaijan Grand Prix',
          Circuit: {
            circuitId: 'baku',
            url: 'http://en.wikipedia.org/wiki/Baku_City_Circuit',
            circuitName: 'Baku City Circuit',
            Location: {
              lat: '40.3725',
              long: '49.8533',
              locality: 'Baku',
              country: 'Azerbaijan',
            },
          },
          date: '2024-09-15',
          time: '11:00:00Z',
          FirstPractice: {
            date: '2024-09-13',
            time: '09:30:00Z',
          },
          SecondPractice: {
            date: '2024-09-13',
            time: '13:00:00Z',
          },
          ThirdPractice: {
            date: '2024-09-14',
            time: '08:30:00Z',
          },
          Qualifying: {
            date: '2024-09-14',
            time: '12:00:00Z',
          },
        },
        {
          season: '2024',
          round: '18',
          url: 'https://en.wikipedia.org/wiki/2024_Singapore_Grand_Prix',
          raceName: 'Singapore Grand Prix',
          Circuit: {
            circuitId: 'marina_bay',
            url: 'http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit',
            circuitName: 'Marina Bay Street Circuit',
            Location: {
              lat: '1.2914',
              long: '103.864',
              locality: 'Marina Bay',
              country: 'Singapore',
            },
          },
          date: '2024-09-22',
          time: '12:00:00Z',
          FirstPractice: {
            date: '2024-09-20',
            time: '09:30:00Z',
          },
          SecondPractice: {
            date: '2024-09-20',
            time: '13:00:00Z',
          },
          ThirdPractice: {
            date: '2024-09-21',
            time: '09:30:00Z',
          },
          Qualifying: {
            date: '2024-09-21',
            time: '13:00:00Z',
          },
        },
        // TBA
        {
          season: '2024',
          round: '19',
          url: 'https://en.wikipedia.org/wiki/2024_United_States_Grand_Prix',
          raceName: 'United States Grand Prix',
          Circuit: {
            circuitId: 'americas',
            url: 'http://en.wikipedia.org/wiki/Circuit_of_the_Americas',
            circuitName: 'Circuit of the Americas',
            Location: {
              lat: '30.1328',
              long: '-97.6411',
              locality: 'Austin',
              country: 'USA',
            },
          },
          date: '2024-10-20',
          time: '19:00:00Z',
          FirstPractice: {
            date: '2024-10-18',
            time: '17:30:00Z',
          },
          SecondPractice: {
            date: '2024-10-18',
            time: '21:00:00Z',
          },
          ThirdPractice: {
            date: '2024-10-19',
            time: '16:30:00Z',
          },
          Qualifying: {
            date: '2024-10-19',
            time: '20:00:00Z',
          },
        },
        {
          season: '2024',
          round: '20',
          url: 'https://en.wikipedia.org/wiki/2024_Mexico_City_Grand_Prix',
          raceName: 'Mexico City Grand Prix',
          Circuit: {
            circuitId: 'rodriguez',
            url: 'http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez',
            circuitName: 'Autódromo Hermanos Rodríguez',
            Location: {
              lat: '19.4042',
              long: '-99.0907',
              locality: 'Mexico City',
              country: 'Mexico',
            },
          },
          date: '2024-10-27',
          time: '20:00:00Z',
          FirstPractice: {
            date: '2024-10-25',
            time: '18:30:00Z',
          },
          SecondPractice: {
            date: '2024-10-25',
            time: '22:00:00Z',
          },
          ThirdPractice: {
            date: '2024-10-26',
            time: '17:30:00Z',
          },
          Qualifying: {
            date: '2024-10-26',
            time: '21:00:00Z',
          },
        },
        {
          season: '2024',
          round: '21',
          url: 'https://en.wikipedia.org/wiki/2024_S%C3%A3o_Paulo_Grand_Prix',
          raceName: 'São Paulo Grand Prix',
          Circuit: {
            circuitId: 'interlagos',
            url: 'http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace',
            circuitName: 'Autódromo José Carlos Pace',
            Location: {
              lat: '-23.7036',
              long: '-46.6997',
              locality: 'São Paulo',
              country: 'Brazil',
            },
          },
          date: '2024-11-03',
          time: '17:00:00Z',
          FirstPractice: {
            date: '2024-11-01',
            time: '14:30:00Z',
          },
          Qualifying: {
            date: '2024-11-01',
            time: '18:00:00Z',
          },
          SecondPractice: {
            date: '2024-11-02',
            time: '14:30:00Z',
          },
          Sprint: {
            date: '2024-11-02',
            time: '18:30:00Z',
          },
        },
        {
          season: '2024',
          round: '22',
          url: 'https://en.wikipedia.org/wiki/2024_Las_Vegas_Grand_Prix',
          raceName: 'Las Vegas Grand Prix',
          Circuit: {
            circuitId: 'vegas',
            url: 'https://en.wikipedia.org/wiki/Las_Vegas_Grand_Prix#Circuit',
            circuitName: 'Las Vegas Strip Street Circuit',
            Location: {
              lat: '36.1147',
              long: '-115.173',
              locality: 'Las Vegas',
              country: 'United States',
            },
          },
          date: '2024-11-23',
          time: '06:00:00Z',
          FirstPractice: {
            date: '2024-11-21',
            time: '04:30:00Z',
          },
          SecondPractice: {
            date: '2024-11-21',
            time: '08:00:00Z',
          },
          ThirdPractice: {
            date: '2024-11-22',
            time: '04:30:00Z',
          },
          Qualifying: {
            date: '2024-11-22',
            time: '08:00:00Z',
          },
        },
        // TBA
        {
          season: '2024',
          round: '23',
          url: 'https://en.wikipedia.org/wiki/2024_Qatar_Grand_Prix',
          raceName: 'Qatar Grand Prix',
          Circuit: {
            circuitId: 'losail',
            url: 'http://en.wikipedia.org/wiki/Losail_International_Circuit',
            circuitName: 'Losail International Circuit',
            Location: {
              lat: '25.49',
              long: '51.4542',
              locality: 'Al Daayen',
              country: 'Qatar',
            },
          },
          date: '2024-12-01',
          time: '17:00:00Z',
          FirstPractice: {
            date: '2024-11-29',
            time: '13:30:00Z',
          },
          SecondPractice: {
            date: '2024-11-29',
            time: '17:00:00Z',
          },
          ThirdPractice: {
            date: '2024-11-30',
            time: '13:30:00Z',
          },
          Qualifying: {
            date: '2024-11-30',
            time: '17:30:00Z',
          },
        },
        {
          season: '2024',
          round: '24',
          url: 'https://en.wikipedia.org/wiki/2024_Abu_Dhabi_Grand_Prix',
          raceName: 'Abu Dhabi Grand Prix',
          Circuit: {
            circuitId: 'yas_marina',
            url: 'http://en.wikipedia.org/wiki/Yas_Marina_Circuit',
            circuitName: 'Yas Marina Circuit',
            Location: {
              lat: '24.4672',
              long: '54.6031',
              locality: 'Abu Dhabi',
              country: 'UAE',
            },
          },
          date: '2024-12-08',
          time: '13:00:00Z',
          FirstPractice: {
            date: '2024-12-06',
            time: '09:30:00Z',
          },
          SecondPractice: {
            date: '2024-12-06',
            time: '13:00:00Z',
          },
          ThirdPractice: {
            date: '2024-12-07',
            time: '10:30:00Z',
          },
          Qualifying: {
            date: '2024-12-07',
            time: '14:00:00Z',
          },
        },
      ],
    },
  },
};
