'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import TransitionManager from '@/components/landing/TransitionManager';
import UpcomingEpisodes from '@/components/landing/UpcomingEpisodes';
import HowItWorks from '@/components/landing/HowItWorks';
import WatchPredictEarn from '@/components/landing/WatchPredictEarn';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const [currentState, setCurrentState] = useState<'home' | 'stage'>('home');
  const [showEpisodes, setShowEpisodes] = useState(false);

  // Handle the "Enter the Tank" button click
  const handleEnterClick = () => {
    // Access the global toggle function added by TransitionManager
    if (typeof window !== 'undefined' && window.toggleStageView) {
      window.toggleStageView();
    }
  };

  // Handle state change from TransitionManager
  const handleStateChange = (newState: 'home' | 'stage') => {
    setCurrentState(newState);
    
    // Show episodes section after a delay when entering stage view
    if (newState === 'stage') {
      setTimeout(() => {
        setShowEpisodes(true);
      }, 2000); // Delay to allow stage animation to complete
    } else {
      setShowEpisodes(false);
    }
  };

  return (
    <main className="bg-black text-white overflow-x-hidden">
      <div className="relative min-h-screen">
        {/* Header only appears after entering the homepage, with a key to force remount */}
        <Header key="header-component" stageVisible={currentState === 'stage'} onEnterClick={handleEnterClick} />

        {/* Show hero section when stage is not visible */}
        {currentState === 'home' && <Hero onEnterClick={handleEnterClick} />}

        {/* Transitions and animations are handled by TransitionManager */}
        <TransitionManager
          initialState="home"
          onStateChange={handleStateChange}
        />
      </div>
      
      {/* How It Works Section - shown after stage transition */}
      <div 
        id="how-it-works"
        className={`transition-opacity duration-1000 ${showEpisodes ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        {showEpisodes && <HowItWorks />}
      </div>

      {/* Watch Predict & Earn Section - shown after stage transition */}
      <div 
        id="watch-predict"
        className={`transition-opacity duration-1000 ${showEpisodes ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        {showEpisodes && <WatchPredictEarn />}
      </div>

      {/* Upcoming Episodes Section - shown after stage transition */}
      <div 
        id="upcoming-episodes"
        className={`transition-opacity duration-1000 ${showEpisodes ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        {showEpisodes && <UpcomingEpisodes />}
      </div>
      
      {/* Apply to Pitch Section */}
      <div 
        id="apply"
        className={`transition-opacity duration-1000 ${showEpisodes ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        {showEpisodes && (
          <section className="py-12 md:py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-pixel text-[#96ff00] mb-4 md:mb-6 tracking-wider sci-fi-title">APPLY TO PITCH</h2>
                <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-[#96ff00] to-transparent mx-auto mb-6 md:mb-8"></div>
                <p className="text-gray-300 mb-8 md:mb-10 font-syncopate text-xs md:text-sm px-4">
                  Have a groundbreaking startup idea? Apply now to pitch to our panel of AI judges and potentially secure investment for your venture.
                </p>
                <button className="bg-black border-2 border-[#96ff00] hover:bg-[#96ff00]/20 text-[#96ff00] font-pixel text-xs md:text-sm px-6 md:px-8 py-2 md:py-3 rounded-sm transition-all duration-300">
                  SUBMIT YOUR PITCH
                </button>
              </div>
              
              {/* HUD elements */}
              <div className="hud-background"></div>
              <div className="hud-corner hud-corner-top-left"></div>
              <div className="hud-corner hud-corner-top-right"></div>
              <div className="hud-corner hud-corner-bottom-left"></div>
              <div className="hud-corner hud-corner-bottom-right"></div>
            </div>
          </section>
        )}
      </div>
      
      {/* Footer - always visible */}
      <Footer />
    </main>
  );
}
