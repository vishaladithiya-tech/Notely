import React, { useEffect, useState } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3800); // Slightly less than the CSS animation total time to transition smoothly

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Main Title - Nolan style: Clean, Wide Spacing, Slow Reveal */}
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-[0.2em] md:tracking-[0.3em] uppercase animate-cinematic-fade">
          Notely
        </h1>
        
        {/* Subtitle - Fades in slightly later */}
        <div className="mt-6 overflow-hidden">
          <p className="text-gray-400 text-sm md:text-base tracking-[0.5em] uppercase opacity-0 animate-[fadeIn_2s_ease-out_1.5s_forwards]">
            The Offline Mind
          </p>
        </div>

        {/* Cinematic light leak / dust effect overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-20">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-pulse"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};