import { Circuit, circuits } from "@/data/circuits";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Circuit: React.FC<{ circuit: Circuit; otherCircuits: Circuit[] }> = ({
  circuit,
  otherCircuits,
}) => {
  return (
    <>
      <Head>
        <title>{circuit.name}</title>
      </Head>
      <main className="min-h-screen bg-neutral-900">
        <div className="max-w-screen-md mx-auto p-4 py-16 text-gray-200 space-y-4">
          <header className="flex flex-col">
            <span>CIRCUIT</span>
            <h1 className="font-bold text-4xl">{circuit.name}</h1>
          </header>
          {circuit.image && (
            <div>
              <Image
                src={circuit.image.url}
                width={circuit.image.width}
                height={circuit.image.height}
                alt={circuit.name}
              ></Image>
            </div>
          )}
          <article>
            {circuit.description && <div>{circuit.description}</div>}
          </article>

          <div>
            <h2 className="font-semibold text-2xl mb-2">Other circuits</h2>
            <ul>
              {otherCircuits.map((otherCircuit) => (
                <li key={otherCircuit.id} className="list-disc list-inside hover:underline">
                  <Link href={`/circuits/${otherCircuit.id}`}>
                    <a>{otherCircuit.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default Circuit;

export const getStaticPaths: GetStaticPaths = () => {
  const paths = circuits.map(({ id }) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
};

function getRandomCircuits(
  circuits: Circuit[],
  except: Circuit,
  length: number = 3
): Circuit[] {
  const randomCircuits = [...circuits]
    .sort(() => 0.5 - Math.random())
    .slice(0, length);

  if (randomCircuits.find((c) => c.id === except.id)) {
    return getRandomCircuits(circuits, except, length);
  }

  return randomCircuits;
}

export const getStaticProps: GetStaticProps = (context) => {
  const circuit = circuits.find(({ id }) => id === context.params?.id);
  return {
    props: {
      circuit: circuit,
      otherCircuits: getRandomCircuits(circuits, circuit!),
    },
  };
};
