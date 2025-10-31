import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedAspectRatio: AspectRatio;
  onSelectAspectRatio: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const ratios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedAspectRatio, onSelectAspectRatio, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ratios.map((ratio) => (
        <button
          key={ratio}
          onClick={() => onSelectAspectRatio(ratio)}
          disabled={disabled}
          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
            ${selectedAspectRatio === ratio
              ? 'bg-cyan-600 border-cyan-500 text-white'
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-cyan-600 text-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {ratio}
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
