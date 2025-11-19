'use client';

import React from 'react';
import { useAnimation } from '../contexts/AnimationContext';

type BackgroundType = 'liquidether' | 'darkveil' | 'threads' | 'normal';
type BackgroundColor = 'black' | 'gray' | 'darkblue' | 'cream' | 'white';

const Settings = () => {
  const { 
    backgroundType, 
    setBackgroundType, 
    backgroundColor, 
    setBackgroundColor 
  } = useAnimation();

  const backgroundTypes: BackgroundType[] = ['liquidether', 'darkveil', 'threads'];
  
  // Restrict color options for DarkVeil
  const getAvailableColors = (): BackgroundColor[] => {
    if (backgroundType === 'darkveil') {
      return ['black', 'gray', 'darkblue'];
    }
    return ['black', 'gray', 'darkblue', 'cream', 'white'];
  };

  const getColorDisplay = (color: BackgroundColor) => {
    const colorMap = {
      black: '#1F2937',
      gray: '#57534e', 
      darkblue: '#475569',
      cream: '#8B7355',
      white: '#FFFFFF'
    };
    return colorMap[color];
  };

  const getColorName = (color: BackgroundColor) => {
    const nameMap = {
      black: 'Dark Slate',
      gray: 'Neutral Gray',
      darkblue: 'Gray-Blue',
      cream: 'Warm Cream',
      white: 'Pure White'
    };
    return nameMap[color];
  };

  return (
    <div className="p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Background Settings
      </h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
          Background Type:
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {backgroundTypes.map((type) => (
            <button
              key={type}
              onClick={() => setBackgroundType(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                backgroundType === type
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/20 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50'
              }`}
            >
              {type === 'liquidether' ? 'LiquidEther' : 
               type === 'darkveil' ? 'DarkVeil' :
               type === 'threads' ? 'Threads' : type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
          Background Color for {backgroundType}:
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {getAvailableColors().map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                backgroundColor === color
                  ? 'border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white/10 dark:hover:bg-gray-800/20'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full border border-gray-400 flex-shrink-0"
                style={{ backgroundColor: getColorDisplay(color) }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 text-left">
                {getColorName(color)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;