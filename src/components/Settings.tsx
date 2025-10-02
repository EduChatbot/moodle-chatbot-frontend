'use client';

import React from 'react';
import { useAnimation } from '../contexts/AnimationContext';

type BackgroundType = 'liquidether' | 'darkveil' | 'lightrays' | 'prism' | 'threads' | 'normal';
type BackgroundColor = 'black' | 'gray' | 'darkblue' | 'cream' | 'white';

const Settings = () => {
  const { 
    backgroundType, 
    setBackgroundType, 
    backgroundColor, 
    setBackgroundColor 
  } = useAnimation();

  const backgroundTypes: BackgroundType[] = ['liquidether', 'darkveil', 'lightrays', 'prism', 'threads'];
  const backgroundColors: BackgroundColor[] = ['black', 'gray', 'darkblue', 'cream', 'white'];

  const getColorDisplay = (color: BackgroundColor) => {
    const colorMap = {
      black: '#000000',
      gray: '#6B7280',
      darkblue: '#1E3A8A',
      cream: '#F5F5DC',
      white: '#FFFFFF'
    };
    return colorMap[color];
  };

  const getColorName = (color: BackgroundColor) => {
    const nameMap = {
      black: 'Black',
      gray: 'Gray',
      darkblue: 'Dark Blue',
      cream: 'Cream',
      white: 'White'
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
               type === 'lightrays' ? 'LightRays' :
               type === 'prism' ? 'Prism' :
               type === 'threads' ? 'Threads' : type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
          Background Color for {backgroundType}:
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => setBackgroundColor(color)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                backgroundColor === color
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-400"
                  style={{ backgroundColor: getColorDisplay(color) }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getColorName(color)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;