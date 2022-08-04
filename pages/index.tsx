import Footer from "@/components/Footer";
import RaceTime from "@/components/RaceTime";
import Standings from "@/components/Standings";
import type { NextPage } from "next";
import Head from "next/head";
import { RefObject, useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const target = useRef<HTMLElement>(null);
  const [showStandings, setShowStandings] = useState(false);

  useEffect(() => {
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
      behavior: "smooth",
    });
  }

  return (
    <>
      <Head>
        <title>When is the next F1 race?</title>
        <meta name="description" content="When is the next F1 race?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-gray-200">
        <section className="bg-neutral-900 relative">
          <RaceTime />
          <button
            className="absolute bottom-6 font-semibold text-neutral-400"
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
