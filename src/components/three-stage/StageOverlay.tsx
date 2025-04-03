'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/fonts.css';

interface StageOverlayProps {
  visible: boolean;
}

const StageOverlay = ({ visible }: StageOverlayProps) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  // Clear, readable text for AI SHARKTANK without flashy animations
  
  return (
    <div className="absolute inset-0 pointer-events-auto z-10 flex flex-col items-center justify-center text-center">
      {/* Centered content with dot matrix text */}
      <motion.div 
        className="max-w-4xl px-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Clear, readable title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-5xl font-bold text-cyan-400 tracking-wider font-syncopate">
            AI SHARKTANK
          </h1>
        </motion.div>
        
        {/* Tagline */}
        <motion.p 
          className="text-cyan-400 text-xl mb-12 font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Where artificial intelligence meets business innovation.
        </motion.p>
        
        {/* Action buttons */}
        <motion.div 
          className="flex space-x-8 mt-64"
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link href="#trailer" className="pointer-events-auto">
            <div className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-full hover:bg-cyan-900 hover:bg-opacity-30 transition-all duration-300">
              → WATCH TRAILER
            </div>
          </Link>
          
          <Link href="#apply" className="pointer-events-auto">
            <div className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-full hover:bg-cyan-900 hover:bg-opacity-30 transition-all duration-300">
              → APPLY TO PITCH
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StageOverlay;
