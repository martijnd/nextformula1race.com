import { Trophy } from './Trophy';

interface PositionProps {
  position: number;
}

export function Position({ position }: PositionProps) {
  if (position === 1) {
    return <Trophy color="text-yellow-400" />;
  }
  if (position === 2) {
    return <Trophy color="text-gray-500" />;
  }
  if (position === 3) {
    return <Trophy color="text-orange-500" />;
  }
  return <span className="text-lg font-black text-gray-500">{position}</span>;
}
