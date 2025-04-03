'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import '@/styles/how-it-works.css';

const HowItWorks = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const steps = [
    {
      number: 1,
      title: "The Pitch Begins",
      description: "Founders from around the world beam in live to pitch their startups to a panel of AI-powered VC judges — each trained on years of deal flow, founder data, and investment frameworks.",
      icon: "🚀"
    },
    {
      number: 2,
      title: "Real-Time AI Feedback",
      description: "The AI judges evaluate each pitch in real-time, offering live reactions, scorecards, and investment decisions. Each one is backed by a human with a unique thesis — their digital twins reflect distinct philosophies, risk profiles, and preferences.",
      icon: "🧠"
    },
    {
      number: 3,
      title: "You Make the Call",
      description: "Before the AI casts its vote, you get to predict the outcome: Will the AI invest or pass? Stake your call. Win big if you're right.",
      icon: "🔮"
    },
    {
      number: 4,
      title: "Vote for the Audience Favorite",
      description: "Even if the AI says no, your voice matters. Vote for your favorite founder — the community pick gets boosts, prizes, and a signal that investors are watching.",
      icon: "🏆"
    }
  ];

  return (
    <section ref={sectionRef} className="how-it-works-section py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="cyber-grid"></div>
      <div className="data-streams"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-2xl md:text-3xl mb-4 md:mb-6 cyber-glitch-text font-pixel"
            variants={itemVariants}
            style={{
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#00ffff',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)',
              lineHeight: '1.4'
            }}
          >
            <span className="cyber-bracket">[</span> HOW IT WORKS <span className="cyber-bracket">]</span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-cyan-400 mx-auto mb-8 glow-line"
            variants={itemVariants}
          ></motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {steps.map((step) => (
            <motion.div 
              key={step.number}
              className="cyber-card"
              variants={itemVariants}
            >
              <div className="step-number">
                <span className="step-icon">{step.icon}</span>
                <span className="number font-pixel" style={{ fontSize: '14px', letterSpacing: '1px' }}>0{step.number}</span>
              </div>
              <h3 className="text-lg md:text-xl font-pixel mb-3 md:mb-4 cyber-text" style={{ letterSpacing: '1px' }}>{step.title}</h3>
              <p className="text-white leading-tight font-syncopate text-xs md:text-sm font-medium tracking-tight" style={{ letterSpacing: '0.01em', lineHeight: '1.4' }}>{step.description}</p>
              <div className="cyber-corner top-left"></div>
              <div className="cyber-corner top-right"></div>
              <div className="cyber-corner bottom-left"></div>
              <div className="cyber-corner bottom-right"></div>
              <div className="cyber-pulse"></div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.button 
            className="cyber-button glow-button font-pixel"
            variants={itemVariants}
            style={{ letterSpacing: '1px', fontSize: '12px', padding: '10px 20px', margin: '0 auto' }}
          >
            <span className="button-text">ENTER THE ARENA</span>
            <span className="button-glitch"></span>
          </motion.button>
        </motion.div>
      </div>
      
      {/* Animated Elements */}
      <div className="floating-particles"></div>
      <div className="scanning-line"></div>
    </section>
  );
};

export default HowItWorks;
