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
import { RacesResponse } from "@/types/races";

export default function RaceTime() {
  const fetcher = useFetcher();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const { data, error } = useSWR<RacesResponse>(
    "https://ergast.com/api/f1/current.json",
    fetcher
  );

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
  }, []);

  if (error) return <h2>An error occured loading data.</h2>;
  if (!data) return <h2></h2>;


  const nextF1Race = data?.MRData.RaceTable.Races.find((race: any) => {
    return isAfter(parseISO(`${race.date}T${race.time}`), new Date());
  });

  if (! nextF1Race) return <h1 className="text-6xl font-bold">No more races this season!</h1>;

  const nextF1RaceDateTime = parseISO(`${nextF1Race?.date}T${nextF1Race?.time}`);

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

  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="text-2xl md:text-6xl font-bold">In {duration}</h2>
      <h3 className="text-xl md:text-4xl font-semibold">{formattedRaceTime}</h3>
      <h3 className="text-lg md:text-2xl">
        <span className="font-bold">{nextF1Race.raceName}</span>, at {nextF1Race.Circuit.circuitName}
      </h3>
    </div>
  );
}
