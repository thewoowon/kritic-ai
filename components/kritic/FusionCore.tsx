// FusionCore.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FusionPhase } from './FusionController';

interface FusionCoreProps {
  phase: FusionPhase;
  phaseProgress: number;
}

export function FusionCore({ phase, phaseProgress }: FusionCoreProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();
    let scale = 0.0;
    let emissiveIntensity = 0.3;
    let glowScale = 0.0;

    if (phase === 'orbit' || phase === 'gather') {
      // Invisible during orbit and gather phases
      scale = 0.0;
      glowScale = 0.0;
    } else if (phase === 'fusion') {
      // DRAMATIC fusion moment
      const easeOut = 1 - Math.pow(1 - phaseProgress, 3);
      scale = THREE.MathUtils.lerp(0.0, 1.5, easeOut);
      glowScale = THREE.MathUtils.lerp(0.0, 2.5, phaseProgress);
      // EXTREME glow during fusion
      emissiveIntensity = THREE.MathUtils.lerp(1.0, 8.0, phaseProgress);
    } else if (phase === 'reveal') {
      // Dramatic pulse
      const pulse = 1 + 0.1 * Math.sin(t * 3);
      scale = 1.2 * pulse;
      glowScale = 1.8 + 0.2 * Math.sin(t * 2);
      emissiveIntensity = 4.0 + Math.sin(t * 2);
    }

    ref.current.scale.setScalar(scale);
    if (glowRef.current) {
      glowRef.current.scale.setScalar(glowScale);
    }

    // Update emissive intensity
    if (ref.current.material instanceof THREE.MeshStandardMaterial) {
      ref.current.material.emissiveIntensity = emissiveIntensity;
    }
    if (glowRef.current?.material instanceof THREE.MeshBasicMaterial) {
      glowRef.current.material.opacity = phase === 'reveal' ? 0.3 : THREE.MathUtils.lerp(0, 0.5, phaseProgress);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer glow layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial
          color="#FF4B5C"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main core */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 64, 64]} />
        <meshStandardMaterial
          color="#FF4B5C"
          metalness={0.8}
          roughness={0.05}
          emissive="#FF4B5C"
          emissiveIntensity={2.0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
