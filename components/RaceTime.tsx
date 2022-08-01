import useSWR from "swr";
import {
  format,
  parseISO,
  isAfter,
  intervalToDuration,
  formatDuration,
} from "date-fns";
import { useEffect, useState } from "react";
import useFetcher from "@/utils/useFetcher";
import { Race, RacesResponse } from "@/types/races";

const RACE_TYPES = ["race", "qualy", "FP1", "FP2", "FP3"] as const;
type RaceType = typeof RACE_TYPES[number];

export default function RaceTime() {
  const fetcher = useFetcher();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [raceType, setRaceType] = useState<RaceType>("race");

  const { data, error } = useSWR<RacesResponse>(
    "https://ergast.com/api/f1/current.json",
    fetcher
  );

  useEffect(() => {
    setRaceType(localStorage.raceType ?? "race");
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
  }, []);

  if (error) return <h2>An error occured loading data.</h2>;
  if (!data) return <h2></h2>;

  function getRace(raceType: RaceType, race: Race) {
    return {
      race: race,
      qualy: race.Qualifying,
      FP1: race.FirstPractice,
      FP2: race.SecondPractice,
      FP3: race.ThirdPractice,
    }[raceType];
  }

  const nextF1Race = data?.MRData.RaceTable.Races.find((race) => {
    return isAfter(parseISO(`${race.date}T${race.time}`), new Date());
  });

  if (!nextF1Race)
    return <h1 className="text-6xl font-bold">No more races this season!</h1>;
  const event = getRace(raceType, nextF1Race);

  const nextF1RaceDateTime = parseISO(`${event?.date}T${event?.time}`);

  const duration = formatDuration(
    intervalToDuration({
      start: currentTime,
      end: nextF1RaceDateTime,
    }),
    {
      delimiter: ", ",
    }
  );

  const formattedRaceTime = format(nextF1RaceDateTime, "dd MMMM Y, HH:mm");

  function onClickRaceType(raceType: RaceType) {
    setRaceType(raceType);
    localStorage.raceType = raceType;
  }

  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="text-2xl md:text-6xl font-bold">In {duration}</h2>
      <h3 className="text-xl md:text-4xl font-semibold">{formattedRaceTime}</h3>
      <h3 className="text-lg md:text-2xl">
        <span className="font-bold">{nextF1Race.raceName}</span>, at{" "}
        <a className="hover:underline" target="_blank" href={nextF1Race.Circuit.url}>{nextF1Race.Circuit.circuitName}</a>
      </h3>
      <div className="flex space-x-2 justify-center">
        {RACE_TYPES.map((currRaceType) => (
          <div className="w-16" key={currRaceType}>
            <button
              className={`p-2 rounded text-xl font-bold hover:text-red-200 transition-colors duration-75 ${
                raceType === currRaceType
                  ? "text-red-600 hover:text-red-700"
                  : ""
              }`}
              onClick={() => onClickRaceType(currRaceType)}
            >
              {currRaceType}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
