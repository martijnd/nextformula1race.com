import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import { useObserver } from '@/hooks/observer';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RefObject, useEffect, useRef, useState, useCallback } from 'react';
import { raceTransformer } from '@/api/ergast/transformers';

import { Schedule } from '@/components/Schedule';
import ChampionshipStandings from '@/components/ChampionshipStandings';
import { RacesResponse } from '@/api/ergast/types/races';
import { races } from '@/data/current';
import { useI18n } from '@/lib/i18n';

const Home: NextPage = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showChampionship, setShowChampionship] = useState(false);
  const [raceData, setRaceData] = useState<RacesResponse | null>(null);
  const target = useRef<HTMLElement>(null);
  const championshipTarget = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const handleIntersection = useCallback(() => {
    setShowSchedule(true);
  }, []);
  const handleChampionshipIntersection = useCallback(() => {
    setShowChampionship(true);
  }, []);

  useObserver(target, handleIntersection);
  useObserver(championshipTarget, handleChampionshipIntersection);

  useEffect(() => {
    setRaceData(races);
  }, []);

  function scrollToStandings(target: RefObject<HTMLElement>) {
    target.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <>
      <Head>
        <title>{t('home.title')}</title>
        <meta name="description" content={t('home.description')} />
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
        <meta name="msapplication-TileColor" content="#15151E" />
        <meta name="theme-color" content="#15151E" />
      </Head>
      <main className="text-gray-200">
        <section className="relative bg-f1-black f1-stripe px-4 md:px-6 lg:px-8">
          <div className="relative z-10">
            {raceData && <RaceTime data={raceTransformer(raceData)} />}
          </div>
          <button
            className="absolute bottom-8 z-20 font-bold transition-all duration-300 text-f1-red-light hover:text-f1-red transform hover:scale-110 flex items-center gap-2 group"
            onClick={() => scrollToStandings(target)}
          >
            <span className="text-lg md:text-xl">{t('home.scheduleCta')}</span>
            <svg
              className="w-5 h-5 md:w-6 md:h-6 animate-bounce group-hover:animate-none transition-transform group-hover:translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </section>

        <section
          className="bg-f1-black f1-stripe px-4 md:px-6 lg:px-8"
          ref={target}
        >
          {raceData && (
            <Schedule
              show={showSchedule}
              remaining={raceTransformer(raceData).races.filter(
                (race) => !race.hasHappened()
              )}
              past={raceTransformer(raceData).races.filter((race) =>
                race.hasHappened()
              )}
            />
          )}
        </section>

        <section
          className="bg-f1-black f1-stripe px-4 md:px-6 lg:px-8 py-12"
          ref={championshipTarget}
        >
          {raceData && (
            <ChampionshipStandings
              show={showChampionship}
              year={parseInt(raceTransformer(raceData).season)}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
