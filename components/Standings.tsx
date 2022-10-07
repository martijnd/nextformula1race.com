import { StandingsTransformerResult } from '@/api/ergast/types/transformers';

export default function Standings({
  show,
  data,
}: {
  show: boolean;
  data?: StandingsTransformerResult;
}) {
  // if (!data)
  //   return (
  //     <div className="w-full">
  //       <div className="max-w-screen-md mx-auto rounded divide-y divide-gray-200 animate-pulse md:p-6">
  //         {[...Array(20)].map((e, i) => (
  //           <div
  //             key={i}
  //             className="flex justify-between items-center py-8 gap-4 w-full"
  //           >
  //             <div className="h-4 bg-gray-300 rounded-full w-4"></div>
  //             <div className="flex-grow h-4 bg-gray-200 rounded-full"></div>
  //             <div className="h-4 bg-gray-300 rounded-full w-12"></div>
  //           </div>
  //         ))}
  //         <span className="sr-only">Loading...</span>
  //       </div>
  //     </div>
  //   );

  function getWidthClass() {
    const items = ['w-28', 'w-32', 'w-36'];
    return items[Math.floor(Math.random() * items.length)];
  }

  return (
    <div
      className={`w-full duration-1000 transition-opacity ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h2 className="text-6xl font-bold my-8 text-gray-800">Standings</h2>

      <table className={`text-left table-auto w-full max-w-screen-md mx-auto`}>
        <thead className="uppercase text-gray-400">
          <tr>
            <th className="px-4"></th>
            <th className="px-4">Name</th>
            <th className="text-right px-4">Points</th>
          </tr>
        </thead>
        <tbody className="text-slate-700 font-semibold">
          {data
            ? data.drivers
                .slice(0, 20)
                .map(({ name, position, points, url }, index) => (
                  <tr
                    key={position}
                    className={`border-b border-gray-300 hover:bg-slate-200 ${
                      index % 2 === 1 ? 'bg-slate-100' : ''
                    }`}
                  >
                    <td className="p-4 w-5">{position}</td>
                    <td className="p-4 font-bold">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {name}
                      </a>
                    </td>
                    <td className="text-right p-4">{points}</td>
                  </tr>
                ))
            : [...Array(20)].map((e, i) => (
                <tr
                  key={i}
                  className={`hover:bg-slate-200 animate-pulse ${
                    i % 2 === 1 ? 'bg-slate-100' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded-full w-4"></div>
                  </td>
                  <td className="p-4">
                    <div
                      className={`h-4 bg-gray-200 rounded-full ${getWidthClass()}`}
                    ></div>
                  </td>
                  <td className="p-4 flex justify-end">
                    <div
                      className={`h-4 bg-gray-300 rounded-full ${
                        i > 7 ? 'w-10' : 'w-12'
                      }`}
                    ></div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
