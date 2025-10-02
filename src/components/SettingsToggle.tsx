'use client';

import React, { useState } from 'react';
import Settings from './Settings';

const SettingsToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 right-36 z-30 p-3 rounded-xl bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-200 shadow-lg"
        title="Background Settings"
      >
        <span className="text-xl">⚙️</span>
      </button>

      {isOpen && (
        <div className="fixed top-16 right-4 z-30 w-80">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-40 w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 flex items-center justify-center text-sm font-bold"
            >
              ×
            </button>
            <Settings />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsToggle;