'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '@/styles/text-reveal.css';

interface SpinningWheelProps {
  onAnimationComplete?: () => void;
  visible: boolean;
}

const SpinningWheel = ({ onAnimationComplete, visible }: SpinningWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const [isClient, setIsClient] = useState(false);
  const [showText, setShowText] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize canvas and handle window resize
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

  // Animation setup
  useEffect(() => {
    if (!canvasRef.current || !isClient || !visible) return;

    // Start animation
    startAnimation();

    return () => {
      // Cleanup animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, isClient, visible]);

  const startAnimation = () => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center of canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Size of the wheel
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      
      // Draw the spinning wheel
      drawSpinningWheel(ctx, centerX, centerY, radius, timeRef.current);
      
      // Increment time and rotation
      timeRef.current += 0.02;
      rotationRef.current += 0.01;
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animate();

    // Add a timeline for the spinning effect
    const tl = gsap.timeline({
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    });

    // Initial appearance animation
    tl.fromTo(canvas, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
    )
    // Spin faster
    .to({}, { 
      duration: 2, 
      onUpdate: () => {
        timeRef.current += 0.03; // Increase speed gradually
      },
      ease: "power1.inOut"
    })
    // Final spin and fade out
    .to(canvas, {
      opacity: 0,
      scale: 1.2,
      duration: 1.5,
      delay: 1,
      ease: "power2.inOut",
      onStart: () => {
        // Increase spin speed dramatically for final effect
        gsap.to({}, {
          duration: 1.5,
          onUpdate: () => {
            timeRef.current += 0.1;
          }
        });
      },
      onComplete: () => {
        // Show the welcome text after the wheel animation
        setShowText(true);
        
        // Delay the final completion callback to allow text to be seen
        setTimeout(() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }, 2500);
      }
    });
  };

  // Function to draw the spinning wheel
  const drawSpinningWheel = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    time: number
  ) => {
    // Number of petals
    const numPetals = 24;
    
    // Rotation based on time
    const rotation = time * 0.5;
    
    // Draw each petal
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2 + rotation;
      const petalLength = radius * (0.7 + 0.3 * Math.sin(time * 2 + i * 0.2));
      
      // Petal start and end points
      const innerRadius = radius * 0.1;
      const startX = centerX + Math.cos(angle) * innerRadius;
      const startY = centerY + Math.sin(angle) * innerRadius;
      const endX = centerX + Math.cos(angle) * petalLength;
      const endY = centerY + Math.sin(angle) * petalLength;
      
      // Control points for the curve
      const controlAngle = angle + Math.PI / 2;
      const controlDistance = petalLength * 0.3 * (1 + 0.2 * Math.sin(time * 3 + i));
      const controlX = centerX + Math.cos(angle) * (petalLength * 0.5) + 
                      Math.cos(controlAngle) * controlDistance;
      const controlY = centerY + Math.sin(angle) * (petalLength * 0.5) + 
                      Math.sin(controlAngle) * controlDistance;
      
      // Create gradient for each petal
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      
      // Calculate colors based on position and time
      const hue1 = (i * 15 + time * 20) % 360;
      const hue2 = (hue1 + 60) % 360;
      const hue3 = (hue1 + 180) % 360;
      
      gradient.addColorStop(0, `hsla(${hue1}, 80%, 50%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 90%, 60%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue3}, 80%, 70%, 0.7)`);
      
      // Draw the petal
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.quadraticCurveTo(
        2 * centerX - controlX, 
        2 * centerY - controlY, 
        startX, 
        startY
      );
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add a subtle stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fill();
    
    // Add decorative elements around the wheel
    drawDecorativeElements(ctx, centerX, centerY, radius, time);
  };
  
  // Function to draw decorative elements around the wheel
  const drawDecorativeElements = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    time: number
  ) => {
    // Draw circular path
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw text labels around the circle
    ctx.font = `${radius * 0.06}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const labels = [
      'POWER OF THE SUN', 'POWER GENERATED', 'SEA TURBINE', 
      'FUSION REACTOR', 'MILLION WATTS'
    ];
    
    for (let i = 0; i < labels.length; i++) {
      const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2 + time * 0.1;
      const textX = centerX + Math.cos(angle) * (radius * 1.3);
      const textY = centerY + Math.sin(angle) * (radius * 1.3);
      
      // Rotate text to follow the circle
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(labels[i], 0, 0);
      ctx.restore();
    }
    
    // Draw date and title
    ctx.font = `${radius * 0.05}px monospace`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('DECEMBER 20', radius * 0.1, radius * 1.4);
    ctx.fillText('( 2023 )', radius * 0.1, radius * 1.5);
    
    ctx.textAlign = 'right';
    ctx.fillText('NEW ERA', centerX * 2 - radius * 0.1, radius * 1.4);
    ctx.fillStyle = 'rgba(0, 255, 100, 0.7)';
    ctx.fillText('( SUSTAINABLE )', centerX * 2 - radius * 0.1, radius * 1.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('ENERGY', centerX * 2 - radius * 0.1, radius * 1.6);
  };

  // Text reveal animation
  useEffect(() => {
    if (showText && textContainerRef.current) {
      const textElements = textContainerRef.current.querySelectorAll('.text-reveal');
      const highlightElements = textContainerRef.current.querySelectorAll('.text-reveal-highlight');
      
      // Create a timeline for the text reveal animation
      const tl = gsap.timeline();
      
      // Fade in and slide up the text elements
      tl.fromTo(textElements, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.15, 
          duration: 1, 
          ease: "power3.out"
        }
      );
      
      // Add the active class to the highlight elements after a delay
      setTimeout(() => {
        highlightElements.forEach((el: Element) => {
          el.classList.add('active');
        });
      }, 1500);
    }
  }, [showText]);

  if (!isClient) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={`absolute top-0 left-0 w-full h-full z-20 ${visible ? 'block' : 'hidden'}`}
        style={{
          background: 'transparent',
          pointerEvents: 'none'
        }}
      />
      
      {/* Welcome text overlay */}
      {visible && (
        <div 
          ref={textContainerRef}
          className={`absolute inset-0 flex flex-col items-center justify-center z-30 ${showText ? 'block' : 'hidden'}`}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-reveal text-white text-5xl md:text-7xl mb-2">
                WELCOME TO
              </h1>
              <h1 className="text-reveal text-white text-7xl md:text-9xl mb-4">
                AI <span className="text-reveal-highlight text-glow">SHARK</span>TANK
              </h1>
            </div>
            <div className="text-reveal text-gray-300 text-xl md:text-2xl mt-4">
              PITCH YOUR AI STARTUP TO THE SHARKS
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpinningWheel;
