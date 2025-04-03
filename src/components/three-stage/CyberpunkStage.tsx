'use client';

import React, { useRef, useEffect, useState, useMemo, createContext, useContext, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Text,
  useTexture,
  MeshReflectorMaterial,
  Float,
  useGLTF,
  Sparkles
} from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import StageOverlay from './StageOverlay';

interface StageProps {
  visible: boolean;
  showWelcomeText?: boolean;
}

// Realistic floor with dot pattern like in the reference image
function Floor() {
  const [floorTexture] = useState(() => {
    // Create a clean texture without dots
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark background - no dots
      ctx.fillStyle = '#050a0a';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add subtle grid lines instead of dots
      ctx.strokeStyle = '#0a1a1a';
      ctx.lineWidth = 1;
      
      // Draw subtle grid lines
      for (let i = 0; i < 1024; i += 100) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1024);
        ctx.stroke();
      }
    }
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    return texture;
  });
  
  // Create a clean carpet texture for the central area
  const [carpetTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Solid background
      ctx.fillStyle = '#081010';
      ctx.fillRect(0, 0, 512, 512);
      
      // Add subtle gradient instead of pattern
      const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 400);
      gradient.addColorStop(0, '#0a2020');
      gradient.addColorStop(1, '#081010');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  });
  
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          map={floorTexture}
          color="#050a0a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Central carpet area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial 
          map={carpetTexture}
          color="#081010"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

// Textured wall with dot matrix display like in the reference image
function BackWall() {
  // Create a wall texture with subtle pattern
  const [wallTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Dark background with slight texture
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1024, 1024);
      
      // Add subtle noise pattern
      ctx.fillStyle = '#151515';
      for (let i = 0; i < 1024; i += 4) {
        for (let j = 0; j < 1024; j += 4) {
          if (Math.random() > 0.7) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }
      
      // Add some reddish tint in places (like in the reference)
      ctx.fillStyle = 'rgba(100, 20, 20, 0.05)';
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const size = 100 + Math.random() * 200;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
  });
  
  // Dot matrix for text removed as requested
  
  return (
    <group>
      {/* Back wall with texture */}
      <mesh position={[0, 10, -15]} receiveShadow>
        <boxGeometry args={[50, 20, 0.5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color="#0a0a0a" 
          emissive="#001a1a" 
          emissiveIntensity={0.2} 
        />
      </mesh>
      
      {/* Side walls */}
      <mesh position={[-25, 10, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <boxGeometry args={[30, 20, 0.5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color="#0a0a0a" 
          emissive="#001a1a" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      <mesh position={[25, 10, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
        <boxGeometry args={[30, 20, 0.5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color="#0a0a0a" 
          emissive="#001a1a" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      {/* Clean title display instead of dot matrix */}
      <group position={[0, 15, -14.5]}>
        <Text 
          color="#00ffff"
          fontSize={1.5}
          font="/fonts/syncopate-bold.ttf"
          anchorX="center"
          anchorY="middle"
        >
          AI SHARKTANK
        </Text>
      </group>
    </group>
  );
}

interface SharkChairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  chairIndex?: number;
}

// Cyberpunk shark chair
function SharkChair({ position = [0, 0, 0], rotation = [0, 0, 0], chairIndex = 0 }: SharkChairProps) {
  // Animation for the glowing elements
  const [glowIntensity, setGlowIntensity] = useState(1);
  const chairRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setGlowIntensity(0.8 + Math.sin(t * 2 + chairIndex) * 0.2);
    
    if (chairRef.current) {
      // Very subtle chair movement
      chairRef.current.position.y = Math.sin(t * 0.2 + chairIndex * 0.5) * 0.01;
    }
  });
  
  return (
    <group position={position} rotation={rotation} ref={chairRef}>
      {/* Chair base with glowing elements */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.8]} />
        <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Chair seat */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[1.6, 0.4, 1.6]} />
        <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Chair back - taller and more throne-like */}
      <mesh castShadow position={[0, 2.5, -0.7]}>
        <boxGeometry args={[1.6, 3.5, 0.15]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} clearcoat={0.5} />
      </mesh>
      
      {/* Chair arms */}
      <mesh castShadow position={[-0.85, 1.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 1.6]} />
        <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh castShadow position={[0.85, 1.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 1.6]} />
        <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Chair trim - cyan glowing outline */}
      <mesh position={[0, 2.5, -0.78]}>
        <boxGeometry args={[1.7, 3.6, 0.02]} />
        <meshStandardMaterial 
          emissive="#00ffff" 
          emissiveIntensity={glowIntensity} 
          color="#000" 
        />
      </mesh>
      
      {/* Side trim */}
      <mesh position={[-0.81, 2.5, -0.7]}>
        <boxGeometry args={[0.02, 3.6, 0.16]} />
        <meshStandardMaterial 
          emissive="#00ffff" 
          emissiveIntensity={glowIntensity} 
          color="#000" 
        />
      </mesh>
      
      <mesh position={[0.81, 2.5, -0.7]}>
        <boxGeometry args={[0.02, 3.6, 0.16]} />
        <meshStandardMaterial 
          emissive="#00ffff" 
          emissiveIntensity={glowIntensity} 
          color="#000" 
        />
      </mesh>
      
      {/* Control panel on armrest with animated glow */}
      <mesh position={[0.85, 1.4, -0.2]}>
        <boxGeometry args={[0.12, 0.05, 0.4]} />
        <meshStandardMaterial 
          emissive="#00ffff" 
          emissiveIntensity={glowIntensity * 1.5} 
          color="#000" 
        />
      </mesh>
      
      {/* Additional tech details */}
      <mesh position={[-0.85, 1.4, -0.2]}>
        <boxGeometry args={[0.12, 0.05, 0.4]} />
        <meshStandardMaterial 
          emissive="#00ffff" 
          emissiveIntensity={glowIntensity * 1.2} 
          color="#000" 
        />
      </mesh>
    </group>
  );
}

// Stage lighting setup like in the reference image
function Lighting() {
  // Spotlight references for animation
  const spotLightRef1 = useRef<THREE.SpotLight>(null);
  const spotLightRef2 = useRef<THREE.SpotLight>(null);
  
  // Animate spotlights subtly
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (spotLightRef1.current) {
      spotLightRef1.current.intensity = 2 + Math.sin(t * 0.2) * 0.2;
    }
    
    if (spotLightRef2.current) {
      spotLightRef2.current.intensity = 2 + Math.sin(t * 0.2 + Math.PI) * 0.2;
    }
  });
  
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.1} color="#001a1a" />
      
      {/* Main stage lights - matching the reference image */}
      <group position={[-12, 8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        <spotLight
          ref={spotLightRef1}
          position={[0, -1, 0]}
          angle={0.3}
          penumbra={0.7}
          intensity={2}
          color="#00ffff"
          castShadow
          target-position={[5, 0, 0]}
          distance={20}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Light fixture glow */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      </group>
      
      <group position={[12, 8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
        </mesh>
        <spotLight
          ref={spotLightRef2}
          position={[0, -1, 0]}
          angle={0.3}
          penumbra={0.7}
          intensity={2}
          color="#00ffff"
          castShadow
          target-position={[-5, 0, 0]}
          distance={20}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Light fixture glow */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      </group>
      
      {/* Additional lighting for the back wall */}
      <spotLight
        position={[0, 15, -5]}
        angle={0.6}
        penumbra={0.5}
        intensity={1}
        color="#00ffff"
        target-position={[0, 10, -15]}
        distance={20}
      />
      
      {/* Subtle floor lighting */}
      <pointLight position={[0, 0.5, 0]} intensity={0.5} color="#00ffff" distance={10} />
      
      {/* Red accent lighting like in the reference */}
      <pointLight position={[-15, 5, -10]} intensity={0.3} color="#ff0000" distance={15} />
    </>
  );
}

// Matrix effect removed as requested

// Holographic presenter and stage area like in the reference image
function PresenterArea() {
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setGlowIntensity(0.8 + Math.sin(t * 1.5) * 0.2);
    setScanLinePosition((t * 0.5) % 2 - 1); // Scan line moving effect
  });
  
  // Function to create a circular platform with glowing rings
  const CircularPlatform = () => {
    return (
      <group position={[0, -0.48, 0]}>
        {/* Main platform */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 64]} />
          <meshStandardMaterial color="#041414" roughness={0.9} />
        </mesh>
        
        {/* Glowing rings */}
        {[1.8, 1.4, 1.0].map((radius, i) => (
          <mesh 
            key={`ring-${i}`} 
            position={[0, 0.01, 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[radius, radius + 0.05, 64]} />
            <meshStandardMaterial 
              color="#000" 
              emissive="#00ffff" 
              emissiveIntensity={glowIntensity * (0.7 - i * 0.15)}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
    );
  };
  
  // Holographic human figure
  const HolographicFigure = () => {
    // Create a grid pattern texture for the hologram
    const [gridTexture] = useState(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 256, 256);
        
        // Draw horizontal lines
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 256; i += 4) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(256, i);
          ctx.globalAlpha = 0.3 + Math.random() * 0.3;
          ctx.stroke();
        }
      }
      
      return new THREE.CanvasTexture(canvas);
    });
    
    return (
      <group position={[0, 0, 0]}>
        {/* Body */}
        <mesh>
          <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        {/* Arms */}
        <mesh position={[0.5, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        <mesh position={[-0.5, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        {/* Legs */}
        <mesh position={[0.2, -0.6, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        <mesh position={[-0.2, -0.6, 0]}>
          <capsuleGeometry args={[0.12, 0.8, 4, 8]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={glowIntensity * 0.5}
            transparent 
            opacity={0.3} 
            alphaMap={gridTexture}
          />
        </mesh>
        
        {/* Scan line effect */}
        <mesh position={[0, scanLinePosition, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Removed particles around the figure as requested */}
      </group>
    );
  };
  
  return (
    <group position={[0, 0, 0]}>
      {/* Central circular platform with holographic presenter */}
      <group position={[0, 0, 0]}>
        <CircularPlatform />
        <HolographicFigure />
      </group>
      
      {/* Additional tech details on the floor */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.sin(angle) * 3.5;
        const z = Math.cos(angle) * 3.5;
        return (
          <mesh 
            key={`tech-detail-${i}`} 
            position={[x, -0.48, z]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.3, 16]} />
            <meshStandardMaterial 
              emissive="#00ffff" 
              emissiveIntensity={glowIntensity * 0.4} 
              color="#000" 
              transparent 
              opacity={0.7} 
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main scene component with cyberpunk aesthetic
// Camera controls UI component - moved outside of Canvas
function CameraControls({ onChangeAngle }: { onChangeAngle: (angle: string) => void }) {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
      <button 
        onClick={() => onChangeAngle('front')}
        className="px-3 py-1 bg-black bg-opacity-50 border border-cyan-400 text-cyan-400 text-xs rounded hover:bg-cyan-900 hover:bg-opacity-30"
      >
        Front View
      </button>
      <button 
        onClick={() => onChangeAngle('top')}
        className="px-3 py-1 bg-black bg-opacity-50 border border-cyan-400 text-cyan-400 text-xs rounded hover:bg-cyan-900 hover:bg-opacity-30"
      >
        Top View
      </button>
      <button 
        onClick={() => onChangeAngle('side')}
        className="px-3 py-1 bg-black bg-opacity-50 border border-cyan-400 text-cyan-400 text-xs rounded hover:bg-cyan-900 hover:bg-opacity-30"
      >
        Side View
      </button>
    </div>
  );
}

// Define a type for camera angle change function
type CameraAngleChangeFunction = (angleType: string) => void;

// Create a context to pass the camera angle function
const CameraAngleContext = createContext<CameraAngleChangeFunction | null>(null);

function StageScene({ visible = false, showWelcomeText = false }: StageProps) {
  const { camera } = useThree();
  // No longer need to manage camera controls visibility inside the canvas
  
  // Camera animation on scene enter - zoomed in with better angle
  useEffect(() => {
    if (visible) {
      // Animate camera to a closer, more focused position
      gsap.to(camera.position, {
        x: 0,
        y: 6, // Lower height for better view
        z: 10, // Closer to the stage
        duration: 2,
        ease: "power2.inOut"
      });
      
      // Rotate camera to look at the stage
      gsap.to(camera.rotation, {
        x: -Math.PI / 8, // Less steep angle for better viewing
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
      });
    }
  }, [visible, camera]);
  
  // Function to change camera angle
  const changeCameraAngle = (angleType: string) => {
    switch(angleType) {
      case 'front':
        gsap.to(camera.position, { x: 0, y: 5, z: 12, duration: 1.5 });
        gsap.to(camera.rotation, { x: -Math.PI / 12, y: 0, z: 0, duration: 1.5 });
        break;
      case 'top':
        gsap.to(camera.position, { x: 0, y: 10, z: 0, duration: 1.5 });
        gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 1.5 });
        break;
      case 'side':
        gsap.to(camera.position, { x: 12, y: 5, z: 0, duration: 1.5 });
        gsap.to(camera.rotation, { x: 0, y: -Math.PI / 2, z: 0, duration: 1.5 });
        break;
      default:
        break;
    }
  };
  
  // Animation for glowing elements
  const [glowIntensity, setGlowIntensity] = useState(1);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setGlowIntensity(0.8 + Math.sin(t * 1.5) * 0.2);
  });
  
  // Get the camera angle change function from context - must be at component level
  const cameraAngleHandler = useContext(CameraAngleContext);
  
  // Set up effect for any camera-related initialization
  useEffect(() => {
    // Any camera setup can go here
    // The context is now properly accessed at the component level
  }, [camera]);
  
  return (
    <>
      <Lighting />
      <Floor />
      <BackWall />
      
      {/* Shark seating area - arranged in a row facing the presenter */}
      <group position={[0, 0, -5]}>
        {/* Four chairs in a row properly facing the presenter */}
        <SharkChair position={[-4.5, 0, 0]} rotation={[0, 0, 0]} chairIndex={0} />
        <SharkChair position={[-1.5, 0, 0]} rotation={[0, 0, 0]} chairIndex={1} />
        <SharkChair position={[1.5, 0, 0]} rotation={[0, 0, 0]} chairIndex={2} />
        <SharkChair position={[4.5, 0, 0]} rotation={[0, 0, 0]} chairIndex={3} />
      </group>
      
      {/* Center stage / presenter area */}
      <PresenterArea />
      
      {/* Enhanced floor details */}
      <group position={[0, -0.49, 0]}>
        {/* Main outer ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8, 8.2, 64]} />
          <meshStandardMaterial 
            emissive="#00ffff" 
            emissiveIntensity={glowIntensity * 0.7} 
            color="#000" 
            transparent 
            opacity={0.7} 
          />
        </mesh>
        
        {/* Inner rings */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.1, 64]} />
          <meshStandardMaterial 
            emissive="#00ffff" 
            emissiveIntensity={glowIntensity * 0.5} 
            color="#000" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4, 4.05, 64]} />
          <meshStandardMaterial 
            emissive="#00ffff" 
            emissiveIntensity={glowIntensity * 0.4} 
            color="#000" 
            transparent 
            opacity={0.4} 
          />
        </mesh>
        
        {/* Floor outer ring instead of grid pattern */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[15, 15.1, 64]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </mesh>
      </group>
      
      {/* Enhanced stage effects when active */}
      {showWelcomeText && (
        <group>
          {/* Floor light beams */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 8;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            return (
              <spotLight
                key={`floor-light-${i}`}
                position={[x, 0.5, z]}
                angle={0.2}
                penumbra={0.8}
                intensity={1.5}
                color="#00ffff"
                target-position={[0, 0, 0]}
                distance={15}
                castShadow
              />
            );
          })}
          
          {/* Removed ambient particles as requested */}
        </group>
      )}
      
      {/* Removed all particle effects as requested */}
      
      {/* Environment map for reflections */}
      <Environment preset="night" />
    </>
  );
}

// Main export component
const CyberpunkStage = ({ visible = false, showWelcomeText = false }: StageProps) => {
  const [showCameraControls, setShowCameraControls] = useState(false);
  const [cameraAngleFunction, setCameraAngleFunction] = useState<CameraAngleChangeFunction | null>(null);
  
  // Function to change camera angle - moved outside Canvas
  const changeCameraAngle = useCallback((angleType: string) => {
    // Store the camera angle change request
    if (cameraAngleFunction) {
      cameraAngleFunction(angleType);
    }
  }, [cameraAngleFunction]);
  
  // Show camera controls after a delay
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowCameraControls(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowCameraControls(false);
    }
  }, [visible]);
  
  return (
    <div className={`w-full h-screen ${visible ? 'relative' : 'absolute top-0 left-0 z-0'}`}>
      {/* Camera controls outside Canvas */}
      {showCameraControls && (
        <CameraControls onChangeAngle={changeCameraAngle} />
      )}
      
      {/* Improved camera settings for better viewing angle and field of view */}
      <Canvas shadows camera={{ position: [0, 6, 10], fov: 45 }}>
        <CameraAngleContext.Provider value={(angleType: string) => {
          // Inside Canvas camera controls
          // Access the camera through useThree instead of DOM
          const canvasElement = document.querySelector('canvas');
          // @ts-ignore - R3F adds __r3f to the canvas element
          const camera = canvasElement?.__r3f?.state?.camera;
          if (camera) {
            switch(angleType) {
              case 'front':
                gsap.to(camera.position, { x: 0, y: 5, z: 12, duration: 1.5 });
                gsap.to(camera.rotation, { x: -Math.PI / 12, y: 0, z: 0, duration: 1.5 });
                break;
              case 'top':
                gsap.to(camera.position, { x: 0, y: 10, z: 0, duration: 1.5 });
                gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 1.5 });
                break;
              case 'side':
                gsap.to(camera.position, { x: 12, y: 5, z: 0, duration: 1.5 });
                gsap.to(camera.rotation, { x: 0, y: -Math.PI / 2, z: 0, duration: 1.5 });
                break;
              default:
                break;
            }
          }
        }}>
          <StageScene visible={visible} showWelcomeText={showWelcomeText} />
        </CameraAngleContext.Provider>
      </Canvas>
      
      {/* Overlay text on top of the 3D stage */}
      <StageOverlay visible={visible && showWelcomeText} />
    </div>
  );
};

export default CyberpunkStage;
