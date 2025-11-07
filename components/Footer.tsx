export default function Footer() {
  return (
    <div className="relative flex justify-center border-t-2 border-f1-red/20 bg-white py-10 font-bold transition-colors dark:border-f1-red/30 dark:bg-f1-black">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-f1-red to-transparent"></div>
      <span className="text-f1-gray transition-colors hover:text-f1-red dark:text-gray-400 dark:hover:text-f1-red-light">
        Made by
        <a
          className="pl-2 hover:underline font-black text-f1-black dark:text-white"
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
