import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import Standings from '@/components/Standings';
import { useDarkMode } from '@/hooks/dark-mode';
import { useObserver } from '@/hooks/observer';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RefObject, useEffect, useRef, useState } from 'react';
import { ergastApi } from '@/api/ergast';
import { RacesResponse } from '@/types/races';

const { getCurrentYearRaces, transform, getDriverStandings } = ergastApi();

export async function getServerSideProps() {
  const data = await getCurrentYearRaces();
  const standings = await getDriverStandings();

  return {
    props: {
      data,
      standings,
    },
  };
}

const Home: NextPage<{
  standings: any;
  data: {
    data: RacesResponse;
    error: boolean;
  };
}> = ({ data, standings }) => {
  const target = useRef<HTMLElement>(null);
  const [showStandings, setShowStandings] = useState(false);
  const { isDarkMode, toggleDarkMode, initDarkMode } = useDarkMode();
  const observe = useObserver(target, () => {
    setShowStandings(true);
  });

  useEffect(() => {
    // Set dark mode
    initDarkMode();

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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark:text-gray-200 text-neutral-900">
        <section className="relative bg-gray-200 dark:bg-neutral-900">
          <button
            onClick={toggleDarkMode}
            className="absolute flex items-center right-4 top-4"
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            )}
          </button>
          {data && <RaceTime data={transform(data.data)} />}
          <button
            className="absolute font-semibold bottom-6 text-neutral-400"
            onClick={() => scrollToStandings(target)}
          >
            Current standings &darr;
          </button>
        </section>

        <section className="bg-white" ref={target}>
          <Standings show={showStandings} data={standings.data} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
