import RaceTime from "@/components/RaceTime";
import Standings from "@/components/Standings";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>When is the next F1 race?</title>
        <meta name="description" content="When is the next F1 race?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="bg-[#15151E] text-white">
          <RaceTime />
        </section>

        <section className="bg-slate-200 -mt-16">
          <Standings />
        </section>
      </main>
    </div>
  );
};

export default Home;
