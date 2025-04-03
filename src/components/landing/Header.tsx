'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import '@/styles/pixelated-logo.css';
import '@/styles/sticky-header.css';

interface HeaderProps {
  stageVisible: boolean;
  onEnterClick: () => void;
}

const Header = ({ stageVisible, onEnterClick }: HeaderProps) => {
  // State for header styling and mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple scroll handler just to track if we've scrolled for styling
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial animation
    gsap.from('.header-content', {
      y: -50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Only show header when stage is visible
  // Using our custom sticky-header class to ensure it stays visible
  const headerClasses = !stageVisible
    ? 'hidden'
    : 'sticky-header visible py-4 px-6 bg-black/90 backdrop-blur-md border-b border-[#96ff00]/30';
  
  return (
    <header
      className={headerClasses}
    >
      <div className="container mx-auto flex justify-between items-center header-content">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 relative">
              <div className="absolute inset-0 bg-black rounded-sm border-2 border-[#96ff00] shadow-[0_0_10px_rgba(150,255,0,0.5)]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#96ff00] font-pixel text-xs">AI</div>
            </div>
            <div className="text-[#96ff00] text-lg font-pixel" style={{letterSpacing: '1px', textShadow: '0 0 10px rgba(150,255,0,0.5)'}}>
              SHARKTANK
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-16">
          <a href="#how-it-works" className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item">How It Works</a>
          <a href="#upcoming-episodes" className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item">Upcoming Episodes</a>
          <a href="#apply" className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item">Apply to Pitch</a>
        </nav>

        {/* Desktop Enter App Button */}
        <Button onClick={onEnterClick} className="hidden md:block bg-black border border-[#96ff00] hover:bg-[#96ff00]/20 text-[#96ff00] font-pixel text-xs px-4 py-1">
          Enter App
        </Button>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center space-y-1.5 p-2 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          style={{ position: mobileMenuOpen ? 'fixed' : 'relative', right: mobileMenuOpen ? '16px' : '0' }}
        >
          <span className={`block w-6 h-0.5 bg-[#96ff00] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#96ff00] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-[#96ff00] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className={`fixed inset-0 bg-black/95 z-40 flex flex-col justify-start items-center transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ backdropFilter: 'blur(5px)', overflowY: 'auto', paddingTop: '80px' }}
      >
        <nav className="flex flex-col items-center space-y-6 my-auto py-12">
          <a 
            href="#how-it-works" 
            className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item text-lg" 
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#upcoming-episodes" 
            className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item text-lg" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Upcoming Episodes
          </a>
          <a 
            href="#apply" 
            className="text-white hover:text-[#96ff00] transition-colors pixel-menu-item text-lg" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Apply to Pitch
          </a>
        </nav>
        
        <Button 
          onClick={(e) => {
            setMobileMenuOpen(false);
            onEnterClick();
          }} 
          className="bg-black border-2 border-[#96ff00] hover:bg-[#96ff00]/20 text-[#96ff00] font-pixel text-sm px-6 py-2"
        >
          Enter App
        </Button>
        
        {/* Close button */}
        <button 
          className="absolute top-6 right-6 text-white hover:text-[#96ff00] transition-colors"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
