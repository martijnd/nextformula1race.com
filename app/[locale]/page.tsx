'use client';

import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import { useObserver } from '@/hooks/observer';
import { usePathname } from 'next/navigation';
import { RefObject, useRef, useState, useCallback } from 'react';
import { Schedule } from '@/components/Schedule';
import ChampionshipStandings from '@/components/ChampionshipStandings';
import { CURRENT_SEASON, races as raceData } from '@/data/current';
import { useI18n } from '@/lib/i18n';
import Script from 'next/script';
import { RegularRace, SprintRace } from '@/classes/race';

export default function HomePage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showChampionship, setShowChampionship] = useState(false);
  const target = useRef<HTMLElement | null>(null);
  const championshipTarget = useRef<HTMLElement | null>(null);
  const { t, locale } = useI18n();
  const pathname = usePathname();
  function onIntersection() {
    setShowSchedule(true);
  }
  function onChampionshipIntersection() {
    setShowChampionship(true);
  }

  const onIntersectionCallback = useCallback(onIntersection, []);
  const onChampionshipIntersectionCallback = useCallback(
    onChampionshipIntersection,
    []
  );

  useObserver(target, onIntersectionCallback);
  useObserver(championshipTarget, onChampionshipIntersectionCallback);

  function scrollToStandings(target: RefObject<HTMLElement | null>) {
    target.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  // Build canonical URL
  const siteUrl = 'https://f1.lekkerklooien.nl';
  const currentLocale = locale || 'en';

  // Get next race info for structured data
  const races = raceData.map((race) =>
    'sprint' in race ? new SprintRace(race) : new RegularRace(race)
  );
  const nextRace = races.find((race) => !race.hasHappened()) || null;

  return (
    <>
      {/* Metadata via head.tsx or handled in layout */}
      <main className="text-gray-200">
        <section className="relative bg-f1-black f1-stripe px-4 md:px-6 lg:px-8 min-h-screen flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
            <RaceTime season={CURRENT_SEASON} races={races} />
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
          <Schedule
            show={showSchedule}
            remaining={races.filter((race) => !race.hasHappened())}
            past={races.filter((race) => race.hasHappened())}
          />
        </section>

        <section
          className="bg-f1-black f1-stripe px-4 md:px-6 lg:px-8 py-12"
          ref={championshipTarget}
        >
          {(() => {
            const season = parseInt(CURRENT_SEASON);
            if (isNaN(season)) return null;
            return (
              <ChampionshipStandings show={showChampionship} year={season} />
            );
          })()}
        </section>
      </main>
      <Footer />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            (() => {
              const structuredData: Array<Record<string, unknown>> = [
                {
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
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Next Formula 1 Race',
                  url: siteUrl,
                  description: t('home.description'),
                },
              ];

              if (nextRace) {
                structuredData.push({
                  '@context': 'https://schema.org',
                  '@type': 'SportsEvent',
                  name: nextRace.raceName,
                  startDate: nextRace.dateTime.toISOString(),
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode:
                    'https://schema.org/OfflineEventAttendanceMode',
                  location: {
                    '@type': 'Place',
                    name: nextRace.circuit.circuitName,
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: nextRace.circuit.location.locality,
                      addressCountry: nextRace.circuit.location.country,
                    },
                  },
                  sport: 'Formula One',
                  organizer: {
                    '@type': 'Organization',
                    name: 'Formula One',
                  },
                });
              }

              return structuredData;
            })()
          ),
        }}
      />
    </>
  );
}
