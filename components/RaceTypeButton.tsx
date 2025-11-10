import { RaceType } from '@/classes/race-event';

interface RaceTypeButtonProps {
  active: boolean;
  type: RaceType;
  onClick: () => void;
}

export function RaceTypeButton({
  active,
  onClick,
  type,
}: RaceTypeButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm md:text-base font-bold transition-all duration-200 ${
        active
          ? 'bg-f1-red text-white shadow-lg shadow-f1-red-light/50 scale-105'
          : 'bg-f1-gray text-gray-300 hover:bg-f1-gray/80 hover:text-f1-red-light'
      }`}
      onClick={onClick}
    >
      {type}
    </button>
  );
}

