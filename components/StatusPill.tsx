interface StatusPillProps {
  tone: 'live' | 'upcoming' | 'completed';
  children: string;
}

export function StatusPill({ tone, children }: StatusPillProps) {
  const base =
    'rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap';
  if (tone === 'live') {
    return (
      <span
        className={`${base} bg-f1-red text-white shadow-lg shadow-f1-red/50 animate-pulse-slow`}
      >
        {children}
      </span>
    );
  }
  if (tone === 'completed') {
    return (
      <span className={`${base} bg-f1-gray text-gray-300`}>{children}</span>
    );
  }
  return (
    <span className={`${base} bg-blue-500/30 text-blue-200`}>{children}</span>
  );
}

