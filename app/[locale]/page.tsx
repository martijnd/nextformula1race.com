'use client';

import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import { useObserver } from '@/hooks/observer';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useRef, useState, useCallback } from 'react';
import { raceTransformer } from '@/api/ergast/transformers';
import { Schedule } from '@/components/Schedule';
import ChampionshipStandings from '@/components/ChampionshipStandings';
import { RacesResponse } from '@/api/ergast/types/races';
import { races } from '@/data/current';
import { useI18n } from '@/lib/i18n';
import Script from 'next/script';

export default function HomePage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showChampionship, setShowChampionship] = useState(false);
  const [raceData, setRaceData] = useState<RacesResponse | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const championshipTarget = useRef<HTMLElement | null>(null);
  const { t, locale } = useI18n();
  const pathname = usePathname();
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

  function scrollToStandings(target: RefObject<HTMLElement | null>) {
    target.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  // Build canonical URL
  const siteUrl = 'https://nextformula1race.com';
  const canonicalUrl = `${siteUrl}${pathname}`;
  const currentLocale = locale || 'en';

  // Get next race info for structured data
  const nextRace = raceData
    ? raceTransformer(raceData).races.find((race) => !race.hasHappened())
    : null;

  return (
    <>
      {/* Metadata via head.tsx or handled in layout */}
      <main className="text-gray-200">
        <section className="relative bg-f1-black f1-stripe px-4 md:px-6 lg:px-8 min-h-screen flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
            {raceData && <RaceTime data={raceTransformer(raceData)} />}
          </div>
          <button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 font-bold transition-all duration-300 text-f1-red-light hover:text-f1-red hover:scale-110 flex items-center gap-2 group"
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
      {nextRace && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Next Formula 1 Race',
              description: t('home.description'),
              url: siteUrl,
              inLanguage: currentLocale,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
              mainEntity: {
                '@type': 'SportsEvent',
                name: nextRace.raceName,
                startDate: nextRace.dateTime.toISOString(),
                location: {
                  '@type': 'Place',
                  name: nextRace.Circuit.circuitName,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: nextRace.Circuit.Location.locality,
                    addressCountry: nextRace.Circuit.Location.country,
                  },
                },
              },
            }),
          }}
        />
      )}
    </>
  );
}

