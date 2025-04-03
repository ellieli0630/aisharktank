'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Text,
  useTexture,
  useGLTF,
  MeshReflectorMaterial,
  Float,
  Billboard,
  Html
} from '@react-three/drei';
import { gsap } from 'gsap';
import type * as THREE from 'three';
import StageOverlay from './StageOverlay';

interface StageProps {
  visible: boolean;
  showWelcomeText?: boolean;
}

// Main floor component with reflective material
function Floor() {
  const floorTexture = useTexture({
    map: '/textures/floor.jpg',
    roughnessMap: '/textures/floor_roughness.jpg',
    normalMap: '/textures/floor_normal.jpg',
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <MeshReflectorMaterial
        {...floorTexture}
        color="#333"
        metalness={0.4}
        roughness={0.6}
        mirror={0.5}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={0.6}
        blur={[300, 100]}
        minDepthThreshold={0.8}
        maxDepthThreshold={1.2}
        depthScale={1}
        depthToBlurRatioBias={0.2}
      />
    </mesh>
  );
}

// Shark chair component with reduced animation
function SharkChair({ position, chairIndex = 0 }: { position: [number, number, number]; chairIndex?: number }) {
  const chairRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  // More muted accent colors for each chair
  const accentColors = [
    "#2a5999", // Muted Blue
    "#993344", // Muted Red
    "#336644", // Muted Green
    "#996633", // Muted Orange
    "#663366"  // Muted Purple
  ];
  
  const accentColor = accentColors[chairIndex % accentColors.length];
  
  // Minimal animation for the chair
  useFrame((state) => {
    if (glowRef.current) {
      // Reduced breathing glow effect
      glowRef.current.intensity = 0.2 + Math.sin(state.clock.getElapsedTime() * 0.3 + chairIndex) * 0.05;
    }
    
    if (chairRef.current) {
      // Very subtle chair movement
      chairRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.2 + chairIndex * 0.5) * 0.01;
      chairRef.current.rotation.y = 0; // No rotation
    }
  });
  
  return (
    <group position={position}>
      {/* Chair glow */}
      <pointLight 
        ref={glowRef}
        position={[0, 1.5, 0]} 
        color={accentColor} 
        intensity={0.3} 
        distance={3} 
      />
      
      {/* Main chair group with animation */}
      <group ref={chairRef}>
        {/* Chair base - more substantial */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.8, 0.3, 1.8]} />
          <meshPhysicalMaterial 
            color="#111" 
            metalness={0.8} 
            roughness={0.2} 
            clearcoat={0.5}
          />
        </mesh>
        
        {/* Base accent lighting */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.85, 0.05, 1.85]} />
          <meshStandardMaterial 
            color={accentColor} 
            emissive={accentColor} 
            emissiveIntensity={0.8} 
            transparent 
            opacity={0.9} 
          />
        </mesh>
        
        {/* Chair seat - plush */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[1.6, 0.15, 1.6]} />
          <meshStandardMaterial color="#222" metalness={0.2} roughness={0.8} />
        </mesh>
        
        {/* Chair back - high throne style */}
        <mesh castShadow position={[0, 2.2, -0.7]}>
          <boxGeometry args={[1.6, 2.8, 0.15]} />
          <meshPhysicalMaterial 
            color="#111" 
            metalness={0.7} 
            roughness={0.3} 
            clearcoat={0.3}
          />
        </mesh>
        
        {/* Chair back accent pattern */}
        <mesh position={[0, 2.2, -0.62]}>
          <planeGeometry args={[1.4, 2.6]} />
          <meshStandardMaterial 
            color="#222" 
            metalness={0.6} 
            roughness={0.4} 
          />
        </mesh>
        
        {/* Chair back emissive outline */}
        {[[-0.8, 0, -0.63], [0.8, 0, -0.63], [0, -1.4, -0.63], [0, 1.4, -0.63]].map((pos, i) => (
          <mesh key={`outline-${i}`} position={[pos[0] + position[0], pos[1] + 2.2, pos[2]]}>
            <boxGeometry args={i < 2 ? [0.05, 2.7, 0.05] : [1.65, 0.05, 0.05]} />
            <meshStandardMaterial 
              color={accentColor} 
              emissive={accentColor} 
              emissiveIntensity={1} 
            />
          </mesh>
        ))}
        
        {/* Chair legs - more substantial */}
        {[[-0.7, 0, -0.7], [0.7, 0, -0.7], [-0.7, 0, 0.7], [0.7, 0, 0.7]].map((pos, i) => (
          <mesh key={`leg-${i}`} castShadow position={[pos[0], 0.25, pos[2]]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        
        {/* Enhanced armrests with control panels */}
        {[[-0.9, 1.2, 0], [0.9, 1.2, 0]].map((pos, i) => (
          <group key={`armrest-${i}`} position={[pos[0], pos[1], pos[2]]}>
            {/* Main armrest */}
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.15, 1.7]} />
              <meshPhysicalMaterial 
                color="#222" 
                metalness={0.7} 
                roughness={0.2} 
                clearcoat={0.5}
              />
            </mesh>
            
            {/* Control panel on right armrest */}
            {i === 1 && (
              <group position={[0, 0.1, -0.4]}>
                <mesh>
                  <boxGeometry args={[0.18, 0.02, 0.6]} />
                  <meshStandardMaterial 
                    color="#111" 
                    metalness={0.9} 
                    roughness={0.1} 
                  />
                </mesh>
                
                {/* Control panel buttons */}
                {[[-0.05, 0, -0.15], [0.05, 0, -0.15], [-0.05, 0, 0], [0.05, 0, 0], [0, 0, 0.15]].map((btnPos, j) => (
                  <mesh key={`button-${j}`} position={[btnPos[0], 0.02, btnPos[2]]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.01, 8]} />
                    <meshStandardMaterial 
                      color={j === 4 ? accentColor : '#444'} 
                      emissive={j === 4 ? accentColor : '#444'} 
                      emissiveIntensity={j === 4 ? 1 : 0.2} 
                    />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

// 3D Character model for judges
function JudgeCharacter({ position, color, chairIndex, name }: { position: [number, number, number]; color: string; chairIndex: number; name: string }) {
  const characterRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Different character traits for variety
  const characterTraits = [
    { hairColor: "#222222", skinTone: "#e0b280", suitColor: "#2a3f5f" }, // Tech Shark
    { hairColor: "#553322", skinTone: "#d4a377", suitColor: "#4f2a3f" }, // Finance Shark
    { hairColor: "#111111", skinTone: "#c68642", suitColor: "#2a4f3f" }, // Lead Shark
    { hairColor: "#5a3825", skinTone: "#e5c298", suitColor: "#3f2a4f" }, // Marketing Shark
    { hairColor: "#777777", skinTone: "#bb9977", suitColor: "#3f4f2a" }  // Growth Shark
  ];
  
  const traits = characterTraits[chairIndex % characterTraits.length];
  
  // Subtle animation for the character
  useFrame((state) => {
    if (characterRef.current) {
      // Subtle breathing movement
      characterRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5 + chairIndex) * 0.02;
      
      // Occasional head movement
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2 + chairIndex * 0.7) * 0.15;
        headRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1 + chairIndex * 0.5) * 0.03;
      }
    }
  });
  
  return (
    <group ref={characterRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
        <meshStandardMaterial color={traits.suitColor} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={traits.skinTone} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={traits.hairColor} metalness={0.1} roughness={0.9} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.45, 0.7, 0]} rotation={[0, 0, -Math.PI * 0.15]} castShadow>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color={traits.suitColor} metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.45, 0.7, 0]} rotation={[0, 0, Math.PI * 0.15]} castShadow>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
        <meshStandardMaterial color={traits.suitColor} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.65, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={traits.skinTone} metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.65, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={traits.skinTone} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Legs (partially visible above chair) */}
      <mesh position={[-0.2, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
        <meshStandardMaterial color="#222" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
        <meshStandardMaterial color="#222" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Shark panel/seating area with enhanced lighting and platform design
function SharkSeating() {
  // Define chair positions
  const chairPositions = [
    { id: 'chair-left-2', pos: [-5, -1.5, -6], name: 'TECH SHARK' },
    { id: 'chair-left-1', pos: [-2.5, -1.5, -6], name: 'FINANCE SHARK' },
    { id: 'chair-center', pos: [0, -1.5, -6], name: 'LEAD SHARK' },
    { id: 'chair-right-1', pos: [2.5, -1.5, -6], name: 'MARKETING SHARK' },
    { id: 'chair-right-2', pos: [5, -1.5, -6], name: 'GROWTH SHARK' }
  ];
  
  // Animation for the platform lighting
  const platformLightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (platformLightRef.current) {
      // Subtle breathing effect for the platform lighting
      platformLightRef.current.intensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  // Muted colors for the chairs and lighting
  const accentColors = [
    "#2a5999", // Muted Blue
    "#993344", // Muted Red
    "#336644", // Muted Green
    "#996633", // Muted Orange
    "#663366"  // Muted Purple
  ];

  return (
    <group>
      {/* Platform lighting - reduced intensity */}
      <pointLight 
        ref={platformLightRef}
        position={[0, -1.5, -6]} 
        color="#4080c0" 
        intensity={0.3} 
        distance={10} 
      />
      
      {/* Main platform - enhanced with glass/metallic material */}
      <mesh receiveShadow castShadow position={[0, -1.8, -6]}>
        <boxGeometry args={[15, 0.3, 5]} />
        <meshPhysicalMaterial 
          color="#222" 
          metalness={0.6} 
          roughness={0.3} 
          clearcoat={0.4}
          reflectivity={0.4}
        />
      </mesh>
      
      {/* Platform edge lighting - front - reduced intensity */}
      <mesh position={[0, -1.65, -3.6]} castShadow>
        <boxGeometry args={[15, 0.05, 0.05]} />
        <meshStandardMaterial color="#4080c0" emissive="#4080c0" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Platform edge lighting - back - reduced intensity */}
      <mesh position={[0, -1.65, -8.4]} castShadow>
        <boxGeometry args={[15, 0.05, 0.05]} />
        <meshStandardMaterial color="#4080c0" emissive="#4080c0" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Platform edge lighting - sides - reduced intensity */}
      {[[-7.5, -1.65, -6], [7.5, -1.65, -6]].map((pos, i) => (
        <mesh key={`edge-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.05, 0.05, 5]} />
          <meshStandardMaterial color="#4080c0" emissive="#4080c0" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* Floor glow rings under each chair - with muted colors */}
      {chairPositions.map((chair, index) => (
        <mesh key={`ring-${chair.id}`} position={[chair.pos[0], -1.64, chair.pos[2]]} rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.8, 0.9, 32]} />
          <meshStandardMaterial 
            color={accentColors[index]} 
            emissive={accentColors[index]} 
            emissiveIntensity={0.4} 
          />
        </mesh>
      ))}

      {/* Enhanced chairs with index for different colors */}
      {chairPositions.map((chair, index) => (
        <SharkChair 
          key={chair.id} 
          position={chair.pos as [number, number, number]} 
          chairIndex={index} 
        />
      ))}
      
      {/* 3D Character models sitting in the chairs */}
      {chairPositions.map((chair, index) => (
        <JudgeCharacter 
          key={`character-${chair.id}`}
          position={[chair.pos[0], chair.pos[1] + 1.5, chair.pos[2] - 0.2]}
          color={accentColors[index]}
          chairIndex={index}
          name={chair.name}
        />
      ))}
      
      {/* Enhanced name plates for each shark */}
      {chairPositions.map((chair, index) => (
        <Billboard key={`nameplate-${chair.id}`} position={[chair.pos[0], -0.7, chair.pos[2] - 1]}>
          <mesh>
            <planeGeometry args={[1.5, 0.4]} />
            <meshPhysicalMaterial 
              color="#111" 
              metalness={0.6} 
              roughness={0.3} 
              clearcoat={0.4}
            />
          </mesh>
          <Html position={[0, 0, 0.01]} transform occlude>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '14px', 
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              fontFamily: '"Syncopate", sans-serif',
              letterSpacing: '0.05em',
              textShadow: `0 0 3px ${accentColors[index]}`,
            }}>
              {chair.name}
            </div>
          </Html>
        </Billboard>
      ))}
    </group>
  );
}

// Back wall and branding with futuristic cityscape
function BackWall() {
  const [time, setTime] = useState(0);
  const wallLightRef = useRef<THREE.PointLight>(null);
  const panelRefs = useRef<THREE.Mesh[]>([]);
  
  // Reduced animation for the wall elements
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    setTime(elapsedTime);
    
    // Animate wall lights with reduced intensity
    if (wallLightRef.current) {
      wallLightRef.current.intensity = 0.3 + Math.sin(elapsedTime * 0.2) * 0.1;
    }
    
    // Minimal animation for wall panels
    panelRefs.current.forEach((panel, index) => {
      if (panel) {
        // @ts-ignore - accessing material property
        if (panel.material) {
          // @ts-ignore - accessing emissiveIntensity property
          panel.material.emissiveIntensity = 0.2;
        }
      }
    });
  });
  
  // Create a simplified, less flashy wall backdrop
  const createWallPanels = () => {
    const panels = [];
    const cols = 10;
    const rows = 4;
    const panelWidth = 1.8;
    const panelHeight = 1.8;
    const gapSize = 0.2;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2 + 0.5) * (panelWidth + gapSize);
        const y = (row - rows / 2 + 0.5) * (panelHeight + gapSize) + 1;
        
        // Simplified panel with muted colors
        panels.push(
          <mesh 
            key={`panel-${row}-${col}`} 
            position={[x, y, 0.1]} 
            receiveShadow
            ref={(el) => {
              if (el) panelRefs.current[row * cols + col] = el;
            }}
          >
            <boxGeometry args={[panelWidth, panelHeight, 0.1]} />
            <meshStandardMaterial 
              color="#222" 
              metalness={0.5} 
              roughness={0.5} 
              emissive="#001933"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      }
    }
    
    return panels;
  };
  
  return (
    <group position={[0, 2, -10]}>
      {/* Reduced wall lighting */}
      <pointLight 
        ref={wallLightRef}
        position={[0, 2, 2]} 
        color="#2a4a80" 
        intensity={0.3} 
        distance={15} 
      />
      
      {/* Main wall base */}
      <mesh receiveShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshPhysicalMaterial 
          color="#111" 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.3}
        />
      </mesh>
      
      {/* Dynamic wall panels */}
      {createWallPanels()}

      {/* AI SharkTank Logo - 3D text with emissive material */}
      <group position={[0, 4.5, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[10, 1.2, 0.2]} />
          <meshStandardMaterial 
            color="#000" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        
        <Html position={[0, 0, 0.2]} transform occlude>
          <div style={{ 
            color: '#4080c0', 
            fontSize: '32px', 
            fontWeight: 'bold',
            textAlign: 'center',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: '"Syncopate", sans-serif',
            letterSpacing: '0.1em',
            textShadow: '0 0 5px rgba(64, 128, 192, 0.5)',
            transform: 'scale(2)',
            transformOrigin: 'center'
          }}>
            AI SHARKTANK
          </div>
        </Html>
      </group>
      
      {/* Wall accent lighting - top */}
      <mesh position={[0, 6, 0.3]} castShadow>
        <boxGeometry args={[18, 0.1, 0.1]} />
        <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={1} />
      </mesh>
      
      {/* Wall accent lighting - bottom */}
      <mesh position={[0, -2, 0.3]} castShadow>
        <boxGeometry args={[18, 0.1, 0.1]} />
        <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={1} />
      </mesh>
      
      {/* Removed flashy decorative elements */}
    </group>
  );
}

// Spotlight component with animation
interface AnimatedSpotlightProps {
  position: [number, number, number];
  target: [number, number, number];
  color: string;
  intensity?: number;
  angle?: number;
}

function AnimatedSpotlight({ position, target, color, intensity = 1.5, angle = 0.3 }: AnimatedSpotlightProps) {
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  
  // Animation for spotlight intensity
  useFrame((state) => {
    if (spotlightRef.current) {
      // Subtle breathing effect for the spotlight
      spotlightRef.current.intensity = intensity + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });
  
  return (
    <>
      <spotLight
        ref={spotlightRef}
        position={position}
        intensity={intensity}
        angle={angle}
        penumbra={0.7}
        distance={20}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color={color}
        target={targetRef.current || undefined}
      />
      <object3D ref={targetRef} position={target} />
      
      {/* Visible cone effect for the spotlight */}
      <mesh position={position} rotation={[Math.PI/2, 0, 0]}>
        <coneGeometry args={[angle * 10, 10, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} side={2} />
      </mesh>
    </>
  );
}

// Lighting setup with reduced intensity
function Lighting() {
  return (
    <>
      {/* Base ambient light - increased for better visibility */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Main spotlight over the presenter area - reduced intensity */}
      <AnimatedSpotlight 
        position={[0, 12, 0]} 
        target={[0, 0, 0]} 
        color="#ffffff" 
        intensity={1.5} 
        angle={0.4} 
      />
      
      {/* Spotlight for the judges area - reduced intensity */}
      <AnimatedSpotlight 
        position={[0, 10, -6]} 
        target={[0, 0, -6]} 
        color="#4080ff" 
        intensity={0.8} 
        angle={0.5} 
      />
      
      {/* Removed colored accent spotlights that were too flashy */}
      
      {/* Floor lighting - reduced intensity */}
      <pointLight position={[0, -1, 0]} intensity={0.2} color="#4080c0" distance={8} />
    </>
  );
}

// Camera rig with animation
function CameraRig({ visible }: { visible: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { camera, scene } = useThree();

  useEffect(() => {
    if (visible && cameraRef.current) {
      // Animate camera from entrance to final position
      gsap.timeline()
        .from(cameraRef.current.position, {
          z: 25,
          y: 15,
          duration: 3.5,
          ease: "power2.inOut"
        })
        .to(cameraRef.current.position, {
          x: 3,
          y: 3,
          z: 10,
          duration: 2,
          ease: "power1.inOut",
          delay: 1
        })
        .to(cameraRef.current.position, {
          x: -3,
          y: 2,
          z: 8,
          duration: 2,
          ease: "power1.inOut",
          delay: 0.5
        });
    }
  }, [visible]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 8]}
        fov={60}
      />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={15}
      />
    </>
  );
}

// Presenter Area
function PresenterArea() {
  // Animation for the hologram effect
  const [time, setTime] = useState(0);
  const hologramRef = useRef<THREE.Group>(null);
  const floorGlowRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    setTime(elapsedTime);
    
    if (hologramRef.current) {
      hologramRef.current.rotation.y = elapsedTime * 0.5;
      hologramRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.1 + 3.5;
    }
    
    // Animate floor glow
    if (floorGlowRef.current) {
      floorGlowRef.current.intensity = 0.5 + Math.sin(elapsedTime * 0.8) * 0.2;
    }
  });
  
  return (
    <group position={[0, -1.7, 0]}>
      {/* Floor glow light */}
      <pointLight 
        ref={floorGlowRef}
        position={[0, 0.2, 0]} 
        color="#0066ff" 
        intensity={0.5} 
        distance={6} 
      />
      
      {/* Presentation platform - upgraded with glass/metallic look */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshPhysicalMaterial 
          color="#222" 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={1} 
          clearcoatRoughness={0.2}
          reflectivity={0.5}
        />
      </mesh>
      
      {/* Platform edge lighting - enhanced */}
      <mesh receiveShadow castShadow position={[0, 0.11, 0]}>
        <ringGeometry args={[2.9, 3, 32]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={1} />
      </mesh>
      
      {/* Inner platform ring */}
      <mesh receiveShadow castShadow position={[0, 0.12, 0]}>
        <ringGeometry args={[1.5, 1.6, 32]} />
        <meshStandardMaterial color="#00aaff" emissive="#00aaff" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Central podium - enhanced with metallic finish */}
      <mesh receiveShadow castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 1, 16]} />
        <meshPhysicalMaterial 
          color="#333" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={0.5}
        />
      </mesh>

      {/* Holographic display */}
      <group ref={hologramRef} position={[0, 3.5, 0]}>
        {/* Hologram content */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color="#00aaff" 
            emissive="#00aaff" 
            emissiveIntensity={0.5} 
            transparent={true} 
            opacity={0.7} 
          />
        </mesh>
        
        {/* Hologram rings */}
        {[0.7, 1, 1.3].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, time * (i + 1) * 0.2]}>
            <ringGeometry args={[radius, radius + 0.05, 32]} />
            <meshStandardMaterial 
              color="#00aaff" 
              emissive="#00aaff" 
              emissiveIntensity={0.5} 
              transparent={true} 
              opacity={0.3} 
            />
          </mesh>
        ))}
        
        {/* Removed sparkles for hologram effect */}
      </group>
      
      {/* Display screen */}
      <mesh position={[0, 3, -2.5]} castShadow rotation={[0, 0, 0]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#111" emissive="#004488" emissiveIntensity={0.2} />
      </mesh>

      {/* Text */}
      <Html position={[0, 3, -2.4]} transform occlude>
        <div style={{ 
          color: '#ffffff', 
          fontSize: '16px', 
          fontWeight: 'bold',
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transform: 'scale(2)'
        }}>
          AI PITCH
        </div>
      </Html>
      
      {/* Floating stats display */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[3, 2, 1]}>
        <Billboard>
          <mesh>
            <planeGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#111" transparent opacity={0.7} />
          </mesh>
          <Html position={[0, 0.3, 0.01]} transform occlude>
            <div style={{ 
              color: '#00aaff', 
              fontSize: '10px', 
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              INVESTMENT STATS
            </div>
          </Html>
          <Html position={[0, 0.1, 0.01]} transform occlude>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '8px', 
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              Valuation: $2.5M
            </div>
          </Html>
          <Html position={[0, -0.1, 0.01]} transform occlude>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '8px', 
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              Equity: 15%
            </div>
          </Html>
          <Html position={[0, -0.3, 0.01]} transform occlude>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '8px', 
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              ROI: 3.2x
            </div>
          </Html>
        </Billboard>
      </Float>
    </group>
  );
}

// Import our custom fonts
import '@/styles/fonts.css';

// Welcome Text Component
const WelcomeText = ({ visible }: { visible: boolean }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    if (visible) {
      // Start animation sequence
      const timer1 = setTimeout(() => setAnimationStage(1), 300); // Show main title
      const timer2 = setTimeout(() => setAnimationStage(2), 1200); // Show subtitle
      const timer3 = setTimeout(() => setAnimationStage(3), 2000); // Show additional elements
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setAnimationStage(0);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <group position={[0, 5, 0]}>
      <Html transform position={[0, 0, 0]} center>
        <div style={{ 
          width: '100vw',
          textAlign: 'center',
          pointerEvents: 'none',
          perspective: '1000px'
        }}>
          {/* Main title with pixel font for a retro gaming feel */}
          <div style={{ 
            opacity: animationStage >= 1 ? 1 : 0,
            transform: `translateY(${animationStage >= 1 ? 0 : '30px'})`,
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
          }}>
            <h1 style={{ 
              fontFamily: '"Syncopate", sans-serif',
              fontSize: '4.5rem', 
              margin: '0 0 0.5rem 0',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'white',
              textShadow: '0 0 15px rgba(0, 150, 255, 0.7), 0 0 30px rgba(0, 150, 255, 0.4)'
            }}>
              Welcome to <span style={{ color: '#00aaff' }}>SharkTank</span>
            </h1>
          </div>
          
          {/* Subtitle with elegant font */}
          <div style={{ 
            opacity: animationStage >= 2 ? 0.9 : 0,
            transform: `translateY(${animationStage >= 2 ? 0 : '20px'})`,
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            transitionDelay: '0.2s'
          }}>
            <p style={{ 
              fontFamily: '"Manrope", sans-serif',
              fontSize: '1.6rem', 
              margin: '1rem 0',
              fontWeight: 300,
              color: 'white',
              letterSpacing: '0.02em'
            }}>
              Where artificial intelligence meets business innovation
            </p>
          </div>
          
          {/* Decorative element */}
          {animationStage >= 3 && (
            <div style={{ 
              width: '60px',
              height: '4px',
              background: 'linear-gradient(90deg, rgba(0,170,255,0) 0%, rgba(0,170,255,1) 50%, rgba(0,170,255,0) 100%)',
              margin: '2rem auto',
              animation: 'fadeUp 0.5s ease-out forwards'
            }}></div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Main Stage Component
const StageScene = ({ visible, showWelcomeText }: StageProps) => {
  return (
    <group visible={visible}>
      <CameraRig visible={visible} />
      <Lighting />
      <Floor />
      <SharkSeating />
      <BackWall />
      <PresenterArea />
      <Environment preset="city" />
      
      {/* Additional atmospheric effects */}
      {/* Removed sparkles effect */}
      
      {/* Welcome text overlay */}
      {showWelcomeText && <WelcomeText visible={showWelcomeText} />}
    </group>
  );
};

// Main export component
const SharkTankStage = ({ visible = false, showWelcomeText = false }: StageProps) => {
  return (
    <div className={`w-full h-screen ${visible ? 'relative' : 'absolute top-0 left-0 z-0'}`}>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
        <StageScene visible={visible} showWelcomeText={showWelcomeText} />
      </Canvas>
      
      {/* Overlay text on top of the 3D stage */}
      <StageOverlay visible={visible && showWelcomeText} />
    </div>
  );
};

export default SharkTankStage;
