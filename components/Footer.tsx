const Footer: React.FC = () => {
  return (
    <div className="flex justify-center border-t border-slate-100 py-8 mt-4 font-semibold">
      <span className="text-gray-500 hover:text-slate-800 transition-colors">

      Created by
      <a
        className="pl-1 hover:underline"
        target="_blank"
        href="https://www.martijndorsman.nl"
        >
        Martijn Dorsman
      </a>
        </span>
    </div>
  );
};

export default Footer;
