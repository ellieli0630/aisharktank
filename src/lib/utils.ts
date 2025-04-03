import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to check if a point is inside text
export function isPointInText(
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fontFamily: string,
  canvasWidth: number,
  canvasHeight: number
): boolean {
  // Create an offscreen canvas for text rendering
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return false;
  
  // Set text properties
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Fill the text
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
  
  // Get pixel data at the point
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  
  // If alpha channel is not zero, the point is inside the text
  return pixel[3] > 0;
}

// Type definition for the dot objects
export interface Dot {
  x: number;
  y: number;
  radius: number;
  originalRadius: number;
  delay: number;
  color?: string;
  opacity?: number;
}

// Create a 2D array of dots for halftone effect
export function createDotGrid(
  width: number,
  height: number,
  spacing = 20,
  variableSize = true,
  colorful = false
): Dot[] {
  const dots: Dot[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      // Calculate distance from center for size variation
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      // Create size variation based on distance
      let dotRadius = spacing / 3;
      if (variableSize) {
        // Smaller dots near center, larger dots at edges
        const maxDistance = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
        const normalizedDistance = distanceFromCenter / maxDistance;
        dotRadius = spacing / 3 * (0.5 + normalizedDistance * 0.8);
      }
      
      // Generate color if colorful mode is enabled
      let color = undefined;
      if (colorful) {
        const hue = (Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 180) % 360;
        color = `hsl(${hue}, 70%, 60%)`;
      }
      
      dots.push({
        x,
        y,
        radius: dotRadius,
        originalRadius: dotRadius,
        delay: (x + y) / 500, // Stagger the animation based on position
        color,
        opacity: 0.8 + Math.random() * 0.2 // Slight opacity variation
      });
    }
  }
  return dots;
}

// Wave animation function that can be used to modify dots
export function waveFunction(
  x: number,
  y: number,
  time: number,
  amplitude = 0.5,
  frequency = 0.1,
  pattern = 'radial'
) {
  // Handle cases where window is not defined (SSR)
  if (typeof window === 'undefined') {
    return 0;
  }
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  if (pattern === 'radial') {
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    return (
      amplitude *
      Math.sin(distanceFromCenter * frequency + time) *
      Math.exp(-0.001 * distanceFromCenter)
    );
  } else if (pattern === 'grid') {
    return amplitude * Math.sin(x * frequency * 0.05 + time) * Math.sin(y * frequency * 0.05 + time);
  } else if (pattern === 'diagonal') {
    return amplitude * Math.sin((x + y) * frequency * 0.05 + time);
  } else if (pattern === 'spiral') {
    const dx = x - centerX;
    const dy = y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return amplitude * Math.sin(distance * frequency * 0.05 + angle * 3 + time);
  }
  
  // Default to radial
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );
  
  return (
    amplitude *
    Math.sin(distanceFromCenter * frequency + time) *
    Math.exp(-0.001 * distanceFromCenter)
  );
}

// Utility function to convert degrees to radians
export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

// Create dots that form text
export function createTextDotGrid(
  width: number,
  height: number,
  text: string,
  spacing = 10,
  fontSize = 120,
  fontFamily = "'Syncopate', sans-serif",
  dotColor = "#ffffff"
): Dot[] {
  const dots: Dot[] = [];
  
  // Only run in browser environment
  if (typeof window === 'undefined') return dots;
  
  // Create a temporary canvas to render the text
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return dots;
  
  // Set text properties
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  
  // Measure text width to center it properly
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  
  // Fill the text
  ctx.fillText(text, width / 2, height / 2);
  
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Create dots based on text pixels
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      const i = (y * width + x) * 4;
      
      // If pixel has alpha > 0, it's part of the text
      if (data[i + 3] > 0) {
        // Calculate distance from center for size variation
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Create size variation based on distance
        const maxDistance = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
        const normalizedDistance = distanceFromCenter / maxDistance;
        const dotRadius = spacing / 2.5 * (0.8 + normalizedDistance * 0.4);
        
        dots.push({
          x,
          y,
          radius: dotRadius,
          originalRadius: dotRadius,
          delay: (x + y) / 500,
          color: dotColor,
          opacity: 0.9 + Math.random() * 0.1
        });
      }
    }
  }
  
  return dots;
}

// Create a halftone pattern from an image
export async function createImageBasedDotGrid(
  width: number,
  height: number,
  imageSrc: string,
  spacing = 20,
  threshold = 0.5
): Promise<Dot[]> {
  return new Promise((resolve) => {
    const dots: Dot[] = [];
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(createDotGrid(width, height, spacing)); // Fallback
        return;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and scale the image to fit the canvas
      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;
      
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      
      // Sample the image at each dot position
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const pixelData = ctx.getImageData(x, y, 1, 1).data;
          const brightness = (pixelData[0] + pixelData[1] + pixelData[2]) / (3 * 255);
          
          // Adjust dot size based on brightness
          const dotRadius = spacing / 3 * (1 - brightness + threshold);
          
          if (dotRadius > 0) {
            dots.push({
              x,
              y,
              radius: dotRadius,
              originalRadius: dotRadius,
              delay: (x + y) / 500,
              color: `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`,
              opacity: 0.8 + Math.random() * 0.2
            });
          }
        }
      }
      
      resolve(dots);
    };
    
    img.onerror = () => {
      resolve(createDotGrid(width, height, spacing)); // Fallback
    };
    
    img.src = imageSrc;
  });
}
