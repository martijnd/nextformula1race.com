import useSWR from 'swr';

import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import Standings from '@/components/Standings';
import { useDarkMode } from '@/hooks/dark-mode';
import { useObserver } from '@/hooks/observer';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RefObject, useEffect, useRef, useState } from 'react';
import { raceTransformer, resultsTransformer } from '@/api/ergast/transformers';

import Schedule from '@/components/Schedule';
import { RacesResponse } from '@/api/ergast/types/races';
import { races } from '@/data/current';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { fetchRaceResults } from '@/api/ergast/fetchers';

const Home: NextPage = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [raceData, setRaceData] = useState<RacesResponse | null>(null);
  const { data: resultsData } = useSWR('results', () =>
    fetchRaceResults(new Date().getFullYear())
  );
  const target = useRef<HTMLElement>(null);
  const observe = useObserver(target, () => {
    setShowSchedule(true);
  });
  const { initDarkMode } = useDarkMode();

  useEffect(() => {
    // Set dark mode
    initDarkMode();
    setRaceData(races);
    observe();
  }, [target, initDarkMode, observe]);

  function scrollToStandings(target: RefObject<HTMLElement>) {
    target.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <>
      <Head>
        <title>When is the next F1 race?</title>
        <meta name="description" content="When is the next F1 race?" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <main className="dark:text-gray-200 text-neutral-900">
        <section className="relative bg-gray-100 dark:bg-neutral-900">
          <DarkModeToggle />
          {raceData && <RaceTime data={raceTransformer(raceData)} />}
          <button
            className="absolute font-semibold transition-colors bottom-6 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100"
            onClick={() => scrollToStandings(target)}
          >
            Schedule &darr;
          </button>
        </section>

        <section className="bg-white" ref={target}>
          {resultsData && raceData && (
            <Schedule
              show={showSchedule}
              data={resultsTransformer(resultsData)}
              remaining={raceTransformer(raceData).races.filter(
                (race) => !race.hasHappened()
              )}
              past={raceTransformer(raceData).races.filter((race) =>
                race.hasHappened()
              )}
            />
          )}
        </section>
        {/* <hr /> */}
        {/* <section className="bg-white">
          <Standings
            show={showSchedule}
            data={standingsTransformer(standingsData)}
          />
        </section> */}
      </main>
      <Footer />
    </>
  );
};

export default Home;
