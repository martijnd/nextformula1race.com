export default function Footer() {
  return (
    <div className="flex justify-center border-t border-slate-100 py-8 mt-4 font-semibold">
      <span className="text-gray-500 hover:text-slate-800 transition-colors">
        Made by
        <a
          className="pl-1 hover:underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.martijndorsman.nl"
        >
          Martijn Dorsman
        </a>
      </span>
    </div>
  );
}
