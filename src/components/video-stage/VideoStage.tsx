'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/fonts.css';
import '@/styles/grid-pattern.css';
import '@/styles/retro-text.css';

interface VideoStageProps {
  visible: boolean;
  showWelcomeText?: boolean;
  videoPath: string;
}

const VideoStage = ({ visible, showWelcomeText = false, videoPath }: VideoStageProps) => {
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, isMobile ? 500 : 1000); // Faster on mobile
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [visible, isMobile]);
  
  if (!visible) return null;
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video 
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoPath}
        autoPlay
        loop
        muted
        playsInline
        onError={() => setVideoError(true)}
        style={{ filter: 'brightness(0.7) contrast(1.1)' }}
      />
      
      {/* Additional overlay to darken video */}
      <div className="absolute inset-0 bg-black opacity-40 z-5"></div>
      
      {/* Fallback background if video fails to load */}
      {videoError && (
        <div className="absolute top-0 left-0 w-full h-full bg-cyberpunk-gradient z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-bg-pulse"></div>
          <div className="absolute inset-0 overlay-gradient"></div>
        </div>
      )}
      
      {/* Overlay with gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      
      {/* Retro Grid Background */}
      <div className="absolute inset-0 z-10">
        <div className="retro-grid-bg"></div>
        <div className="scanlines" style={{ opacity: 0.3 }}></div>
        <div className="noise-overlay" style={{ opacity: 0.15 }}></div>
        <div className="vhs-effect" style={{ opacity: 0.1 }}></div>
      </div>
      
      {/* SVG Filters for special effects */}
      <svg className="svg-filters">
        <defs>
          <filter id="dot-matrix-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            <feImage href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAALElEQVQYV2NkYGD4z8DAwMiAC/wnVhAExBkZGRlhAvgFQYpwCsIEQYrQBQHlYgvVNPzKnwAAAABJRU5ErkJggg==" x="0" y="0" width="5" height="5" result="pattern" />
            <feTile in="pattern" result="tile" />
            <feComposite in="blur" in2="tile" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="composite" />
          </filter>
          
          {/* 3D depth filter */}
          <filter id="3d-depth">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feOffset in="blur" dx="4" dy="8" result="offsetBlur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#00FFFF" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litPaint" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-50" style={{ pointerEvents: 'none' }}>
        <motion.div 
          className="max-w-4xl px-4 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-4 md:mb-6"
          >
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl tracking-wider font-pixel"
              style={{ 
                color: '#96ff00',
                textShadow: '0 0 20px rgba(150, 255, 0, 0.8)',
                letterSpacing: '0.1em',
                transform: 'perspective(1000px) rotateX(10deg)'
              }}
            >
              AI SHARKTANK
            </h1>
          </motion.div>
          
          {/* Tagline */}
          <motion.p 
            className="text-sm sm:text-base md:text-xl mb-3 md:mb-6 tracking-wide font-syncopate"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{ 
              color: 'white', 
              textShadow: '0 0 15px rgba(150, 255, 0, 0.5)', 
              background: 'rgba(0,0,0,0.5)', 
              padding: '8px 12px',
              borderRadius: '2px',
              borderBottom: '1px solid rgba(150, 255, 0, 0.3)',
              maxWidth: '95%',
              margin: '0 auto 12px auto',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(10px)',
              fontSize: isMobile ? '0.7rem' : '0.8rem'
            }}
          >
            Where founders pitch. AI judges decide. You predict the future.
          </motion.p>
          
          {/* Subheadline - always visible */}
          <motion.div
            className="mb-10 md:mb-16 max-w-3xl w-full"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <p className="text-xs sm:text-sm md:text-lg font-syncopate font-medium" 
              style={{ 
                color: 'white', 
                lineHeight: '1.4',
                background: 'rgba(0,0,0,0.4)', 
                padding: '10px 12px',
                borderRadius: '2px',
                borderLeft: '2px solid rgba(150, 255, 0, 0.5)',
                maxWidth: '95%',
                margin: '0 auto',
                letterSpacing: '0.01em',
                backdropFilter: 'blur(10px)',
                fontSize: isMobile ? '0.65rem' : '0.7rem'
              }}
            >
              A futuristic pitch arena where founders call in to pitch live to a panel of AI VCs.
              <br/><br/>
              <span style={{ color: 'rgba(150, 255, 0, 0.9)', fontWeight: '400' }}>The twist?</span> You, the audience, don't just watch — you predict, vote, and win.
            </p>
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 mt-2 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="#watch" className="pointer-events-auto">
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(150, 255, 0, 0.4)',
                padding: isMobile ? '8px 12px' : '10px 16px',
                color: '#96ff00',
                fontWeight: '400',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                letterSpacing: '0.05em',
                backdropFilter: 'blur(10px)',
                fontFamily: "'Press Start 2P', cursive",
                fontSize: isMobile ? '0.5rem' : '0.6rem'
              }}>
                🎥 Watch EP1 Live & Predict
              </div>
            </Link>
            
            <Link href="#apply" className="pointer-events-auto">
              <div style={{
                background: 'rgba(150, 255, 0, 0.15)',
                border: '1px solid rgba(150, 255, 0, 0.4)',
                padding: isMobile ? '8px 12px' : '10px 16px',
                color: '#96ff00',
                fontWeight: '400',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                letterSpacing: '0.05em',
                backdropFilter: 'blur(10px)',
                fontFamily: "'Press Start 2P', cursive",
                fontSize: isMobile ? '0.5rem' : '0.6rem'
              }}>
                📩 Apply to Pitch
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoStage;
