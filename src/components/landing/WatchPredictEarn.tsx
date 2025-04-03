'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import '@/styles/fonts.css';

const WatchPredictEarn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Start animation when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Handle video loaded event
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoaded = () => {
        setVideoLoaded(true);
      };
      videoElement.addEventListener('loadeddata', handleLoaded);
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Single title for animation
  const title = 'WATCH, PREDICT & EARN';

  return (
    <section 
      id="watch-predict-earn"
      ref={ref}
      className="relative min-h-[80vh] md:min-h-screen overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/videos/predict-earn.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ 
            filter: 'brightness(0.4) contrast(1.2)',
          }}
        />
        
        {/* Overlay grid pattern */}
        <div 
          className="absolute inset-0 z-10" 
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(150, 255, 0, 0.03) 25%, rgba(150, 255, 0, 0.03) 26%, transparent 27%, transparent 74%, rgba(150, 255, 0, 0.03) 75%, rgba(150, 255, 0, 0.03) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(150, 255, 0, 0.03) 25%, rgba(150, 255, 0, 0.03) 26%, transparent 27%, transparent 74%, rgba(150, 255, 0, 0.03) 75%, rgba(150, 255, 0, 0.03) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[80vh] md:min-h-screen py-16 md:py-0">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Animated title */}
          <motion.div 
            className="mb-6 md:mb-8 px-4 text-center"
            variants={titleVariants}
          >
            <span 
              className="font-pixel text-lg md:text-2xl inline-block"
              style={{ 
                color: '#96ff00',
                textShadow: '0 0 10px rgba(150, 255, 0, 0.7)',
                letterSpacing: '0.05em',
                padding: '6px 12px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(150, 255, 0, 0.3)',
              }}
            >
              {title}
            </span>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="font-syncopate text-white text-xs md:text-sm font-medium tracking-tight max-w-2xl mx-auto px-4 md:px-6"
            style={{ 
              letterSpacing: '0.01em', 
              lineHeight: '1.4',
              background: 'rgba(0,0,0,0.4)', 
              padding: '10px 15px',
              borderRadius: '2px',
              maxWidth: '90%',
              margin: '0 auto',
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.8, duration: 0.6 }
              }
            }}
          >
            Watch live pitches, predict AI investment decisions, and earn rewards for your market insights.
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { delay: 1.2, duration: 0.5, type: 'spring' }
              }
            }}
            className="mt-8 md:mt-12"
          >
            <button 
              className="bg-black border-2 border-[#96ff00] hover:bg-[#96ff00]/20 text-[#96ff00] font-pixel text-xs md:text-sm px-6 md:px-8 py-2 md:py-3 rounded-sm transition-all duration-300"
            >
              JOIN THE AUDIENCE
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Scan line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-[#96ff00]/30"
          animate={{
            y: ['0%', '2000%'],
          }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#96ff00]/50" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#96ff00]/50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#96ff00]/50" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#96ff00]/50" />
      </div>
    </section>
  );
};

export default WatchPredictEarn;
