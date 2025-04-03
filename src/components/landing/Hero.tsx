'use client';

import { useEffect } from 'react';

interface HeroProps {
  onEnterClick: () => void;
}

const Hero = ({ onEnterClick }: HeroProps) => {
  // Auto-trigger the enter click after a delay to start the transition automatically
  useEffect(() => {
    // Auto-trigger the transition after 3 seconds
    const timer = setTimeout(() => {
      onEnterClick();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onEnterClick]);
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Empty section - only halftone dots will be visible */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-pixel text-[#96ff00] opacity-0 animate-pulse">
          AI SHARKTANK
        </h1>
      </div>
    </section>
  );
};

export default Hero;
