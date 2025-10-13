export default function Footer() {
  return (
    <div className="flex justify-center border-t border-slate-100 bg-white py-8 font-semibold transition-colors dark:border-neutral-800 dark:bg-neutral-950">
      <span className="text-gray-500 transition-colors hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200">
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
