'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '@/styles/fonts.css';
import '@/styles/holographic.css';
import '@/styles/glowing-container.css';
import '@/styles/holographic-cube.css';
import '@/styles/sci-fi-hud.css';
import Link from 'next/link';

// Define the episode and judge types
interface Judge {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  color: string;
}

interface Episode {
  id: string;
  title: string;
  date: string;
  description: string;
  judges: Judge[];
  featured: boolean;
}

// Sample data for upcoming episodes
const episodes: Episode[] = [
  {
    id: 'ep001',
    title: 'AI Revolution in Healthcare',
    date: 'April 15, 2025',
    description: 'Startups present cutting-edge AI solutions transforming the healthcare industry, from diagnostics to personalized treatment plans.',
    featured: true,
    judges: [
      {
        id: 'j001',
        name: 'Dr. Sarah Chen',
        role: 'TECH SHARK',
        image: '/images/judges/sarah-chen.jpg',
        bio: 'Former CTO of MediTech AI with 15+ years in healthcare technology',
        color: '#2a5999'
      },
      {
        id: 'j002',
        name: 'Marcus Johnson',
        role: 'FINANCE SHARK',
        image: '/images/judges/marcus-johnson.jpg',
        bio: 'Venture capitalist with $500M+ invested in healthcare startups',
        color: '#993344'
      },
      {
        id: 'j003',
        name: 'Elena Rodriguez',
        role: 'LEAD SHARK',
        image: '/images/judges/elena-rodriguez.jpg',
        bio: 'Founder of BioAI Solutions, acquired for $2.3B in 2023',
        color: '#336644'
      },
      {
        id: 'j004',
        name: 'James Wilson',
        role: 'MARKETING SHARK',
        image: '/images/judges/james-wilson.jpg',
        bio: 'Former CMO of Global Health Systems with expertise in market expansion',
        color: '#996633'
      },
      {
        id: 'j005',
        name: 'Dr. Amara Patel',
        role: 'GROWTH SHARK',
        image: '/images/judges/amara-patel.jpg',
        bio: 'Scaled three healthcare startups to unicorn status',
        color: '#663366'
      }
    ]
  },
  {
    id: 'ep002',
    title: 'Sustainable Tech Solutions',
    date: 'April 29, 2025',
    description: 'Innovative startups showcase AI-powered solutions addressing climate change and environmental sustainability.',
    featured: false,
    judges: [
      {
        id: 'j006',
        name: 'Michael Chang',
        role: 'TECH SHARK',
        image: '/images/judges/michael-chang.jpg',
        bio: 'Pioneer in green technology with 20+ patents',
        color: '#2a5999'
      },
      {
        id: 'j007',
        name: 'Olivia Greenfield',
        role: 'FINANCE SHARK',
        image: '/images/judges/olivia-greenfield.jpg',
        bio: 'Managing partner at EcoVentures with $1B+ in sustainable investments',
        color: '#993344'
      },
      {
        id: 'j003',
        name: 'Elena Rodriguez',
        role: 'LEAD SHARK',
        image: '/images/judges/elena-rodriguez.jpg',
        bio: 'Founder of BioAI Solutions, acquired for $2.3B in 2023',
        color: '#336644'
      },
      {
        id: 'j008',
        name: 'Thomas Wright',
        role: 'MARKETING SHARK',
        image: '/images/judges/thomas-wright.jpg',
        bio: 'Built the brand strategy for three leading sustainable tech companies',
        color: '#996633'
      },
      {
        id: 'j009',
        name: 'Zara Mahmood',
        role: 'GROWTH SHARK',
        image: '/images/judges/zara-mahmood.jpg',
        bio: 'Scaled CleanTech Solutions from startup to global leader',
        color: '#663366'
      }
    ]
  },
  {
    id: 'ep003',
    title: 'Future of Education',
    date: 'May 13, 2025',
    description: 'Startups revolutionizing education with AI-powered personalized learning platforms and immersive educational experiences.',
    featured: false,
    judges: [
      {
        id: 'j010',
        name: 'David Kim',
        role: 'TECH SHARK',
        image: '/images/judges/david-kim.jpg',
        bio: 'Former CTO of EduTech Global with expertise in AI learning systems',
        color: '#2a5999'
      },
      {
        id: 'j011',
        name: 'Rebecca Santos',
        role: 'FINANCE SHARK',
        image: '/images/judges/rebecca-santos.jpg',
        bio: 'Led investments in education technology totaling $750M',
        color: '#993344'
      },
      {
        id: 'j012',
        name: 'Alexander Chen',
        role: 'LEAD SHARK',
        image: '/images/judges/alexander-chen.jpg',
        bio: 'Founded LearnAI, revolutionizing K-12 education in 45 countries',
        color: '#336644'
      },
      {
        id: 'j004',
        name: 'James Wilson',
        role: 'MARKETING SHARK',
        image: '/images/judges/james-wilson.jpg',
        bio: 'Former CMO of Global Health Systems with expertise in market expansion',
        color: '#996633'
      },
      {
        id: 'j013',
        name: 'Sophia Martinez',
        role: 'GROWTH SHARK',
        image: '/images/judges/sophia-martinez.jpg',
        bio: 'Scaled educational platforms reaching 50M+ students worldwide',
        color: '#663366'
      }
    ]
  }
];

// Holographic judge card component
const JudgeCard = ({ judge }: { judge: Judge }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <motion.div 
      className="bg-black rounded-lg overflow-hidden relative"
      style={{
        border: `1px solid ${judge.color}`,
        boxShadow: hovered ? `0 0 15px ${judge.color}` : 'none',
        transition: 'box-shadow 0.3s ease'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-32 relative">
        {/* Image container with overlay */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Using initials instead of image for consistent cyberpunk style */}
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: `${judge.color}22` }}
          >
            {judge.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          {/* Color overlay with tech pattern */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, ${judge.color}44 25%, ${judge.color}44 26%, transparent 27%, transparent 74%, ${judge.color}44 75%, ${judge.color}44 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, ${judge.color}44 25%, ${judge.color}44 26%, transparent 27%, transparent 74%, ${judge.color}44 75%, ${judge.color}44 76%, transparent 77%, transparent)
              `,
              backgroundSize: '15px 15px',
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Scan line effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(transparent, rgba(0,0,0,0.5) 90%)',
              boxShadow: `inset 0 0 10px ${judge.color}33`
            }}
          />
        </div>
        
        {/* Role badge */}
        <div 
          className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: judge.color,
            border: `1px solid ${judge.color}`
          }}
        >
          {judge.role}
        </div>
      </div>
      
      <div className="p-4 relative">
        {/* Tech line separator */}
        <div 
          className="h-0.5 w-1/2 mb-3"
          style={{ backgroundColor: judge.color }}
        />
        
        <h4 className="text-white font-bold font-syncopate tracking-wide">{judge.name}</h4>
        <p 
          className="text-xs mb-2 font-mono"
          style={{ color: judge.color }}
        >
          ID: {judge.id}
        </p>
        <p className="text-white text-sm font-syncopate font-medium tracking-tight" style={{ letterSpacing: '0.01em', lineHeight: '1.4' }}>{judge.bio}</p>
      </div>
    </motion.div>
  );
};

// Holographic cube episode card component inspired by the reference images
const HolographicEpisodeCard = ({ episode }: { episode: Episode }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Determine the glow color based on featured status
  const glowColor = episode.featured ? '#00ffff' : '#00cc66';
  
  return (
    <motion.div 
      className="relative mb-16 perspective-1000 w-full h-80"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Holographic cube container */}
      <motion.div 
        className="w-full h-full relative preserve-3d"
        animate={{
          rotateY: hovered ? 15 : 0,
          rotateX: hovered ? -10 : 0,
          scale: hovered ? 1.05 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Main face of the cube */}
        <div className="absolute inset-0 backface-hidden">
          {/* Outer border with glow effect */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 100%)`,
              boxShadow: `0 0 20px ${glowColor}, inset 0 0 10px rgba(0,255,255,0.3)`,
              border: `1px solid ${glowColor}`,
              overflow: 'hidden'
            }}
          >
            {/* Grid overlay pattern */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, ${glowColor} 25%, ${glowColor} 26%, transparent 27%, transparent 74%, ${glowColor} 75%, ${glowColor} 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, ${glowColor} 25%, ${glowColor} 26%, transparent 27%, transparent 74%, ${glowColor} 75%, ${glowColor} 76%, transparent 77%, transparent)
                `,
                backgroundSize: '30px 30px'
              }}
            />
            
            {/* Digital noise effect - using CSS instead of image */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px',
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Content container */}
            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Header section */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 
                    className="text-2xl font-bold font-syncopate tracking-wider"
                    style={{ color: glowColor }}
                  >
                    {episode.title.toUpperCase()}
                  </h2>
                  <div 
                    className="h-0.5 w-3/4 mt-1 mb-2"
                    style={{ backgroundColor: glowColor }}
                  />
                  <p className="text-sm font-syncopate tracking-wide text-white">{episode.date}</p>
                </div>
                
                {episode.featured && (
                  <div 
                    className="px-3 py-1 text-xs font-bold rounded"
                    style={{ backgroundColor: 'rgba(0,255,255,0.2)', color: glowColor, border: `1px solid ${glowColor}` }}
                  >
                    FEATURED
                  </div>
                )}
              </div>
              
              {/* Description with tech styling */}
              <div 
                className="mt-2 mb-4 text-gray-300 p-3 rounded"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid rgba(${episode.featured ? '0,255,255' : '0,204,102'},0.3)` }}
              >
                <p className="font-syncopate text-sm font-medium text-white tracking-tight" style={{ letterSpacing: '0.01em', lineHeight: '1.4' }}>{episode.description}</p>
              </div>
              
              {/* Tech details at bottom */}
              <div className="mt-auto">
                <div className="flex justify-between items-center">
                  <div 
                    className="text-xs font-mono"
                    style={{ color: glowColor }}
                  >
                    ID: {episode.id} • JUDGES: {episode.judges.length}
                  </div>
                  
                  <button 
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center text-sm font-medium"
                    style={{ color: glowColor }}
                  >
                    {expanded ? 'HIDE PANEL' : 'SHOW JUDGES'}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reflection effect */}
        <div 
          className="absolute inset-x-0 bottom-0 h-1/3 transform scale-y-[-0.3] translate-y-full opacity-30 blur-sm"
          style={{
            background: `linear-gradient(to bottom, ${glowColor}22, transparent)`,
            borderRadius: '0.75rem',
            pointerEvents: 'none'
          }}
        />
      </motion.div>
      
      {/* Expanded judges panel */}
      {expanded && (
        <motion.div 
          className="mt-4 bg-black bg-opacity-70 rounded-xl p-6 border"
          style={{ borderColor: glowColor }}
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 
            className="text-lg font-bold mb-4 font-syncopate tracking-wide"
            style={{ color: glowColor }}
          >
            EPISODE JUDGES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {episode.judges.map(judge => (
              <JudgeCard key={judge.id} judge={judge} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Episode navigator component with glowing container style
const EpisodeNavigator = () => {
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const totalEpisodes = 3;
  
  const nextEpisode = () => {
    if (currentEpisode < totalEpisodes) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };
  
  const prevEpisode = () => {
    if (currentEpisode > 0) {
      setCurrentEpisode(currentEpisode - 1);
    }
  };
  
  // Episode data
  const episodeData = [
    {
      id: 'ep000',
      number: 0,
      title: 'Pilot Episode',
      date: 'April 15, 2025',
      judges: 4,
      startups: 3,
      image: '/images/episodes/ep0.jpg'
    },
    {
      id: 'ep001',
      number: 1,
      title: 'AI Revolution in Healthcare',
      date: 'May 8, 2025',
      judges: 4,
      startups: 3,
      image: '/images/episodes/ep1.jpg'
    },
    {
      id: 'ep002',
      number: 2,
      title: 'Sustainable Tech Solutions',
      date: 'May 22, 2025',
      judges: 4,
      startups: 3,
      image: '/images/episodes/ep2.jpg'
    }
  ];
  
  const episode = episodeData[currentEpisode];
  
  return (
    <div className="episode-navigator">
      {/* Episode selector */}
      <div className="flex justify-center items-center mb-8 font-pixel text-sm space-x-8">
        <button 
          onClick={prevEpisode} 
          disabled={currentEpisode === 0}
          className={`text-[#96ff00] ${currentEpisode === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#b8ff66]'}`}
        >
          ← EP{currentEpisode - 1}
        </button>
        
        <div className="text-[#96ff00] border border-[#96ff00] px-4 py-1 rounded-sm">
          [ EP{currentEpisode} ]
        </div>
        
        <button 
          onClick={nextEpisode} 
          disabled={currentEpisode === totalEpisodes - 1}
          className={`text-[#96ff00] ${currentEpisode === totalEpisodes - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#b8ff66]'}`}
        >
          EP{currentEpisode + 1} →
        </button>
      </div>
      
      {/* Episode content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative">
        <div className="galaxy-background"></div>
        <div className="glowing-container">
          <div 
            className="holographic-cube aspect-square bg-black/30 backdrop-blur-sm overflow-hidden relative hover:scale-105"
            style={{
              transform: 'rotateX(15deg) rotateY(-15deg) translateZ(20px)',
              transformStyle: 'preserve-3d',
              transition: 'all 0.5s ease',
              boxShadow: '0 0 30px rgba(150, 255, 0, 0.5), inset 0 0 15px rgba(150, 255, 0, 0.3)',
              border: '1px solid rgba(150, 255, 0, 0.4)',
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 10;
              const rotateY = (centerX - x) / 10;
              
              el.style.transform = `rotateX(${rotateX + 15}deg) rotateY(${rotateY - 15}deg) translateZ(20px)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotateX(15deg) rotateY(-15deg) translateZ(20px)';
            }}
          >
            {/* Cube content */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center p-4">
                <h3 className="text-2xl font-pixel text-[#96ff00] mb-4 glow-text-green">
                  EP{episode.number}
                </h3>
                <div className="text-[#b8ff66] text-sm font-pixel mb-2 opacity-80">
                  QUBIT {episode.number * 1024}
                </div>
                <p className="text-[#96ff00]/90 text-xs uppercase tracking-wider mt-4 font-pixel">{episode.title}</p>
              </div>
            </div>
            
            {/* Circuit board background */}
            <div className="absolute inset-0 bg-black opacity-50 z-0">
              <div className="circuit-pattern"></div>
            </div>
            
            {/* Glowing edges */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-[#96ff00] glow-edge-green z-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#96ff00] glow-edge-green z-20"></div>
            <div className="absolute top-0 left-0 w-0.5 h-full bg-[#96ff00] glow-edge-green z-20"></div>
            <div className="absolute top-0 right-0 w-0.5 h-full bg-[#96ff00] glow-edge-green z-20"></div>
            
            {/* 3D cube edges */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
              <div className="absolute top-0 left-0 w-full h-full border border-[#96ff00]/30" 
                style={{ transform: 'translateZ(10px)', opacity: 0.7 }}></div>
              <div className="absolute top-0 left-0 w-full h-full border border-[#96ff00]/20" 
                style={{ transform: 'translateZ(20px)', opacity: 0.5 }}></div>
              <div className="absolute top-0 left-0 w-full h-full border border-[#96ff00]/10" 
                style={{ transform: 'translateZ(30px)', opacity: 0.3 }}></div>
            </div>
            
            {/* Scanning effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none">
              <div className="scan-line"></div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="holographic-display p-6 relative">
            <div 
              className="relative overflow-hidden"
              style={{
                transform: 'rotateX(2deg) rotateY(2deg) translateZ(10px)',
                transformStyle: 'preserve-3d',
                transition: 'all 0.5s ease',
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateX(2deg) rotateY(2deg) translateZ(10px)';
              }}
            >
              {/* Tech details */}
              <div className="tech-detail tech-detail-bottom-left">
                DATE: {episode.date}<br/>
                JUDGES: {episode.judges}<br/>
                STARTUPS: {episode.startups}
              </div>
              
              <div className="tech-detail tech-detail-bottom-right">
                EPISODE: {currentEpisode + 1}/{totalEpisodes}<br/>
                SECTOR: {episode.title.toUpperCase()}<br/>
                STATUS: SCHEDULED
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-pixel text-[#96ff00] mb-3 md:mb-4 sci-fi-title">{episode.title}</h2>
                <p className="text-gray-300 mb-4 md:mb-6 relative z-10 font-syncopate text-xs md:text-sm">
                  Join us for an exciting episode featuring innovative startups in the {episode.title.toLowerCase()} space. 
                  Our AI judges will evaluate, challenge, and potentially invest in the most promising ventures.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                  <div className="data-display">
                    <span className="data-label">DATE:</span>
                    <span className="data-value">{episode.date}</span>
                  </div>
                  <div className="data-display">
                    <span className="data-label">AI JUDGES:</span>
                    <span className="data-value">{episode.judges}</span>
                  </div>
                  <div className="data-display">
                    <span className="data-label">STARTUPS:</span>
                    <span className="data-value">{episode.startups}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <Link href="#watch" className="inline-block">
                    <div className="sci-fi-button">
                      WATCH LIVE
                    </div>
                  </Link>
                  
                  <Link href="#predict" className="inline-block">
                    <div className="sci-fi-button">
                      MAKE PREDICTIONS
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component for upcoming episodes with sci-fi HUD styling
const UpcomingEpisodes = () => {
  return (
    <section className="py-16 bg-black relative overflow-hidden" id="episodes">
      {/* Sci-Fi HUD Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black z-0"></div>
      <div className="hud-background"></div>
      <div className="hud-circle hud-circle-1"></div>
      <div className="hud-circle hud-circle-2"></div>
      <div className="hud-circle hud-circle-3"></div>
      <div className="hud-line hud-line-horizontal" style={{ top: '50%' }}></div>
      <div className="hud-line hud-line-vertical" style={{ left: '50%' }}></div>
      
      {/* HUD Corners */}
      <div className="hud-corner hud-corner-top-left"></div>
      <div className="hud-corner hud-corner-top-right"></div>
      <div className="hud-corner hud-corner-bottom-left"></div>
      <div className="hud-corner hud-corner-bottom-right"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative"
        >
          <h1 className="text-2xl md:text-3xl font-pixel text-[#96ff00] mb-3 md:mb-4 tracking-wider text-center sci-fi-title">
            UPCOMING EPISODES
          </h1>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-[#96ff00] to-transparent mx-auto mb-4 md:mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-center font-syncopate text-xs md:text-sm px-4">
            Each episode features a unique panel of AI judges ready to evaluate and invest in the next big innovation.
          </p>
        </motion.div>
        
        {/* Episode Navigator */}
        <EpisodeNavigator />
      </div>
    </section>
  );
};

export default UpcomingEpisodes;
