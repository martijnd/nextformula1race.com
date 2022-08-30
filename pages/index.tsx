import Footer from '@/components/Footer';
import RaceTime from '@/components/RaceTime';
import Standings from '@/components/Standings';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RefObject, useEffect, useRef, useState } from 'react';

const Home: NextPage = () => {
  const target = useRef<HTMLElement>(null);
  const [showStandings, setShowStandings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  function initDarkMode() {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleDarkMode() {
    localStorage.theme = localStorage.theme === 'light' ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    initDarkMode();
  }

  useEffect(() => {
    // Set dark mode
    initDarkMode();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStandings(true);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (target.current) {
      observer.observe(target.current);
    }
  }, [target]);

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
          <RaceTime />
          <button
            className="absolute font-semibold bottom-6 text-neutral-400"
            onClick={() => scrollToStandings(target)}
          >
            Current standings &darr;
          </button>
        </section>

        <section className="bg-white" ref={target}>
          <Standings show={showStandings} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
