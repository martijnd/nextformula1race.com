const Spinner: React.FC = () => {
  return (
    <div
      role="status"
      className="p-4 space-y-4 rounded border border-gray-200 divide-y divide-gray-200 shadow animate-pulse md:p-6"
    >
      {[...Array(20)].map((e, i) => (
        <div key={i} className="flex justify-between items-center">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
