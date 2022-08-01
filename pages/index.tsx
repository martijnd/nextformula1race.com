import Footer from "@/components/Footer";
import RaceTime from "@/components/RaceTime";
import Standings from "@/components/Standings";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const target = useRef(null);
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

  return (
    <>
      <Head>
        <title>When is the next F1 race?</title>
        <meta name="description" content="When is the next F1 race?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="bg-[#15151E] text-white">
          <RaceTime />
        </section>

        <section className="bg-white -mt-16" ref={target}>
          <Standings show={showStandings} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
