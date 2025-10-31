import React from 'react';
import { SparklesIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <SparklesIcon />
        <h1 className="text-2xl sm:text-3xl font-bold text-center ml-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
          AI Merch Mockup Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
