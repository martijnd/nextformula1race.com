import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import data from "../data/races.json";
import {
  format,
  parseISO,
  isAfter,
  intervalToDuration,
  formatDuration,
} from "date-fns";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const nextF1Race = data.races.find((race) => {
    return isAfter(parseISO(`${race.date}T${race.time}`), new Date());
  });

  const nextF1RaceDateTime = parseISO(
    `${nextF1Race?.date}T${nextF1Race?.time}`
  );

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
  }, []);

  let duration = formatDuration(
    intervalToDuration({
      start: currentTime,
      end: nextF1RaceDateTime,
    }),
    {
      delimiter: ", ",
    }
  );

  const formattedRaceTime = nextF1RaceDateTime

  return (
    <div className={styles.container}>
      <Head>
        <title>When is the next F1 race?</title>
        <meta name="description" content="When is the next F1 race?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {nextF1Race ? <main className={styles.main}>
        <h1 className={styles.title}>In {duration}</h1>
        <h2>{format(formattedRaceTime, 'dd MMMM Y, HH:mm')}</h2>
        <h3>{nextF1Race?.raceName}</h3>

        
      </main> : 
      <h1 className={styles.title}>No more races this season!</h1>
      }
    </div>
  );
};

export default Home;
