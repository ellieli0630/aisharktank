'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface SpotlightEffectProps {
  visible: boolean;
  onAnimationComplete?: () => void;
}

const SpotlightEffect = ({ visible, onAnimationComplete }: SpotlightEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle window resize
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

  // Create animation function
  const createAnimation = useCallback(() => {
    if (!canvasRef.current || !isClient || !visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear existing animation if any
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Animation parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numRays = 24;
    const maxRayLength = Math.max(canvas.width, canvas.height) * 0.5;

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update time for animation
      timeRef.current += 0.005;
      const time = timeRef.current;

      // Draw the spotlight rays
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + time;
        const spinFactor = time * 0.5; // Controls the spinning speed

        // Calculate ray properties
        const startRadius = 20;
        const endRadius = startRadius + maxRayLength * (0.5 + 0.5 * Math.sin(time * 2 + i * 0.5));
        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        const endX = centerX + Math.cos(angle + spinFactor * 0.1) * endRadius;
        const endY = centerY + Math.sin(angle + spinFactor * 0.1) * endRadius;

        // Create ray gradient
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);

        // Colorful ray effect with iridescent colors
        const hue = (i * 15 + time * 30) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${(hue + 40) % 360}, 90%, 70%, 0.6)`);
        gradient.addColorStop(1, `hsla(${(hue + 120) % 360}, 90%, 80%, 0)`);

        // Draw the ray
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 5 + 3 * Math.sin(time * 3 + i);
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      // Add central glow
      const glowRadius = 30 + 10 * Math.sin(time * 3);
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
      glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      glowGradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.5)');
      glowGradient.addColorStop(1, 'rgba(50, 100, 255, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Set up a timeline to manage the complete animation sequence
    if (visible) {
      gsap.timeline({
        onComplete: () => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      })
      .fromTo(canvas,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" }
      )
      .to(canvas,
        { opacity: 0, duration: 0.5, delay: 2, ease: "power2.in" }
      );
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient, visible, onAnimationComplete]);

  // Run the animation
  useEffect(() => {
    return createAnimation();
  }, [createAnimation]);

  if (!isClient) return null;

  return (
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
  );
};

export default SpotlightEffect;
