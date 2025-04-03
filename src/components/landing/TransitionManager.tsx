'use client';

import { useState, useEffect, useCallback } from 'react';
import HalftoneDots from './HalftoneDots';
import VideoStage from '@/components/video-stage/VideoStage';

interface TransitionManagerProps {
  initialState?: 'home' | 'stage';
  onStateChange?: (state: 'home' | 'stage') => void;
}

// Extend window interface to avoid TypeScript errors
declare global {
  interface Window {
    toggleStageView?: () => void;
  }
}

const TransitionManager = ({
  initialState = 'home',
  onStateChange
}: TransitionManagerProps) => {
  const [currentState, setCurrentState] = useState(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation states
  const [showHalftone, setShowHalftone] = useState(true);
  const [showStage, setShowStage] = useState(initialState === 'stage');
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [halftonePattern, setHalftonePattern] = useState<'radial' | 'grid' | 'diagonal' | 'spiral'>('radial');
  const [showTextInDots, setShowTextInDots] = useState(true); // Start with text in dots
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Transition from home to stage - direct transition with no intermediate steps
  const startTransitionToStage = useCallback(() => {
    // Prepare the stage in the background but keep it hidden
    setShowStage(true);
    
    // Fade out the halftone dots directly (no spiral pattern)
    setTimeout(() => {
      setShowHalftone(false);
      
      // Show welcome text with a slight delay for dramatic effect
      setTimeout(() => {
        setShowWelcomeText(true);
      }, isMobile ? 400 : 800); // Faster transition on mobile
      
      // Complete the transition
      setCurrentState('stage');
      setIsTransitioning(false);
      if (onStateChange) onStateChange('stage');
    }, isMobile ? 1000 : 1500); // Faster transition on mobile
  }, [onStateChange, isMobile]);

  // Transition from stage to home
  const startTransitionToHome = useCallback(() => {
    // Step 1: Hide the welcome text
    setShowWelcomeText(false);
    
    // Step 2: Hide the stage
    setShowStage(false);

    // Step 3: Show the halftone dots again with a different pattern
    setHalftonePattern('grid');
    setShowHalftone(true);
    setShowTextInDots(false); // Start without text

    // Step 4: Complete transition after a short delay
    setTimeout(() => {
      setHalftonePattern('radial'); // Reset to default pattern
      setShowTextInDots(true); // Show text in dots again
      setCurrentState('home');
      setIsTransitioning(false);
      if (onStateChange) onStateChange('home');
    }, isMobile ? 700 : 1000); // Faster transition on mobile
  }, [onStateChange, isMobile]);

  // Toggle between home and stage views
  const toggleState = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (currentState === 'home') {
      // Start transition to stage
      startTransitionToStage();
    } else {
      // Start transition to home
      startTransitionToHome();
    }
  }, [currentState, isTransitioning, startTransitionToStage, startTransitionToHome]);

  // Add the toggle function to the window object after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.toggleStageView = toggleState;
    }

    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        window.toggleStageView = undefined;
      }
    };
  }, [toggleState]);

  // Handle halftone animation complete
  const handleHalftoneComplete = () => {
    // This is not used in normal flow, but could be for additional effects
  };

  return (
    <div className="relative">
      {/* HalftoneDots is always rendered but visibility controlled */}
      {showHalftone && (
        <HalftoneDots
          onAnimationComplete={handleHalftoneComplete}
          colorScheme="dark"
          pattern={halftonePattern}
          colorful={halftonePattern === 'spiral'}
          interactive={true}
          showText={showTextInDots}
          text="AI SHARKTANK"
          fontSize={isMobile ? 80 : 120} // Smaller font size on mobile
          fontFamily="'Syncopate', sans-serif"
        />
      )}

      {/* Video stage appears after transition */}
      <VideoStage visible={showStage} showWelcomeText={showWelcomeText} videoPath="/videos/5c9e6835-4760-43a4-800d-3cade5d35fa7-video.mp4" />
    </div>
  );
};

export default TransitionManager;
