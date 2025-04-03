'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { createDotGrid, createImageBasedDotGrid, createTextDotGrid, waveFunction, type Dot } from '@/lib/utils';
import { gsap } from 'gsap';
import '@/styles/fonts.css';
import '@/styles/retro-text.css';

interface HalftoneDotProps {
  onAnimationComplete?: () => void;
  colorScheme?: 'light' | 'dark';
  pattern?: 'radial' | 'grid' | 'diagonal' | 'spiral';
  imageSrc?: string;
  colorful?: boolean;
  interactive?: boolean;
  showText?: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

const HalftoneDots = ({
  onAnimationComplete,
  colorScheme = 'dark',
  pattern = 'radial',
  imageSrc,
  colorful = false,
  interactive = true,
  showText = false,
  text = 'AI SHARKTANK',
  fontSize = 120,
  fontFamily = "'Syncopate', sans-serif"
}: HalftoneDotProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const dotsRef = useRef<Dot[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  
  // Reference for mouse timeout
  const mouseTimeout = useRef<number>();
  
  // Animation settings
  const animationSettings = useMemo(() => ({
    baseSpeed: 0.02,
    amplitude: 0.6,
    frequency: 0.1,
    spacing: 20
  }), []);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize dots and canvas setup
  useEffect(() => {
    if (!isClient) return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isClient]);

  // Mouse interaction handlers
  useEffect(() => {
    if (!isClient || !interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseActive(true);
      
      // Auto-deactivate mouse influence after 2 seconds of no movement
      if (mouseTimeout.current) {
        clearTimeout(mouseTimeout.current);
      }
      mouseTimeout.current = window.setTimeout(() => {
        setIsMouseActive(false);
      }, 2000);
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (mouseTimeout.current) {
        clearTimeout(mouseTimeout.current);
      }
    };
  }, [isClient, interactive]);

  // Initialize dots
  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const initializeDots = async () => {
      // Calculate responsive font size based on screen width
      const responsiveFontSize = dimensions.width < 768 ? 
        Math.min(fontSize * 0.4, dimensions.width / 8) : // Mobile size
        Math.min(fontSize, dimensions.width / 6); // Desktop size
      
      if (imageSrc) {
        // Create dots based on an image
        dotsRef.current = await createImageBasedDotGrid(
          dimensions.width, 
          dimensions.height, 
          imageSrc, 
          animationSettings.spacing
        );
      } else if (showText) {
        // Create dots that form text
        dotsRef.current = createTextDotGrid(
          dimensions.width,
          dimensions.height,
          text,
          dimensions.width < 768 ? animationSettings.spacing / 3 : animationSettings.spacing / 2, // Smaller spacing for text, even smaller on mobile
          responsiveFontSize,
          fontFamily,
          colorScheme === 'dark' ? '#ffffff' : '#000000' // Always use monochrome
        );
      } else {
        // Create standard dot grid
        dotsRef.current = createDotGrid(
          dimensions.width, 
          dimensions.height, 
          animationSettings.spacing, 
          true, // Variable size
          false // Never use colorful dots
        );
      }

      // Start animation
      startAnimation();
    };

    initializeDots();

    return () => {
      // Cleanup animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isClient, imageSrc, colorful, animationSettings.spacing, showText, text, fontSize, fontFamily]);

  const startAnimation = () => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = timeRef.current;

      // Draw and animate each dot
      for (const dot of dotsRef.current) {
        // Calculate mouse influence if active
        let mouseInfluence = 0;
        if (isMouseActive && interactive) {
          const dx = dot.x - mousePosition.x;
          const dy = dot.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200; // Maximum distance for mouse influence
          
          if (distance < maxDistance) {
            mouseInfluence = 1 - (distance / maxDistance);
          }
        }

        // Calculate wave effect with enhanced 3D effect
        // Use Math.abs to ensure we don't get negative values that could cause negative radius
        const waveEffect = Math.abs(waveFunction(
          dot.x, 
          dot.y, 
          time, 
          animationSettings.amplitude * (1 + mouseInfluence), // Reduced amplitude to prevent negative values
          animationSettings.frequency, 
          pattern
        ));

        // Modify dot radius based on wave effect - more dramatic
        // Ensure radius is always positive with Math.max
        const radius = Math.max(0.1, dot.originalRadius * (1 + waveEffect * 0.8 + mouseInfluence * 0.5));

        // Set fill style based on dot color or color scheme with enhanced glow
        if (dot.color) {
          ctx.fillStyle = dot.color;
          if (dot.opacity !== undefined) {
            ctx.globalAlpha = dot.opacity;
          }
          
          // Add glow for dots
          ctx.shadowColor = dot.color;
          ctx.shadowBlur = 5 + (waveEffect * 10);
        } else {
          // Use teal/cyan color scheme for consistency with video stage
          const baseColor = colorScheme === 'dark' ? 'rgba(0, 255, 255, ' : 'rgba(0, 200, 255, ';
          const opacity = 0.3 + (waveEffect * 0.7);
          ctx.fillStyle = baseColor + opacity + ')';
          ctx.globalAlpha = 1.0;
          
          // Add glow effect
          ctx.shadowColor = baseColor + '0.8)';
          ctx.shadowBlur = 3 + (waveEffect * 8);
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }

      // Reset global alpha
      ctx.globalAlpha = 1.0;

      // Increment time for animation
      timeRef.current += animationSettings.baseSpeed;
      
      // Draw 3D perspective grid effect in background for text mode
      if (showText) {
        drawPerspectiveGrid(ctx, canvas.width, canvas.height, time);
      }

      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animate();

    // Add a timeline to transition the dots after initial animation
    const tl = gsap.timeline({
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    });

    // Animate the dots to create a transition effect
    tl.to(canvas, {
      duration: 0.5,
      delay: showText ? 3.5 : 2.5, // Longer delay for text to be visible
      ease: "power2.inOut",
      onStart: () => {
        // Additional animation at transition start if needed
      }
    });
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-30" style={{ background: colorScheme === 'dark' ? '#000' : '#fff' }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

// Function to draw a 3D perspective grid in the background
const drawPerspectiveGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
  try {
    // Save context state
    ctx.save();
    
    // Set grid properties
    const gridSize = 50;
    const vanishingPointX = width / 2;
    const vanishingPointY = height / 2;
    const gridLines = 15; // Reduced number of lines for better performance
    
    // Set line style
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    
    // Draw horizontal grid lines with perspective
    for (let i = 0; i <= gridLines; i++) {
      const y = height / 2 + (i - gridLines / 2) * gridSize;
      const perspectiveY = (y - vanishingPointY) / (1 + (i / gridLines) * 0.5);
      
      // Add wave effect to the grid lines with smaller amplitude
      const waveAmplitude = 5 * Math.sin(time * 0.3);
      const adjustedY = vanishingPointY + perspectiveY + waveAmplitude * Math.sin(i / 2);
      
      // Only draw if Y is within canvas bounds
      if (adjustedY >= 0 && adjustedY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, adjustedY);
        ctx.lineTo(width, adjustedY);
        ctx.stroke();
      }
    }
    
    // Draw vertical grid lines with perspective
    for (let i = 0; i <= gridLines; i++) {
      const x = width / 2 + (i - gridLines / 2) * gridSize;
      const perspectiveX = (x - vanishingPointX) / (1 + (i / gridLines) * 0.5);
      
      // Add wave effect to the grid lines with smaller amplitude
      const waveAmplitude = 5 * Math.sin(time * 0.3);
      const adjustedX = vanishingPointX + perspectiveX + waveAmplitude * Math.sin(i / 2);
      
      // Only draw if X is within canvas bounds
      if (adjustedX >= 0 && adjustedX <= width) {
        ctx.beginPath();
        ctx.moveTo(adjustedX, 0);
        ctx.lineTo(adjustedX, height);
        ctx.stroke();
      }
    }
    
    // Restore context state
    ctx.restore();
  } catch (error) {
    console.error('Error drawing perspective grid:', error);
    // Silently fail but restore context
    ctx.restore();
  }
};

export default HalftoneDots;
