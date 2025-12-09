// LLMBall.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FusionPhase } from './FusionController';
import type { LLMBallConfig } from './fusionConfig';

interface LLMBallProps {
  config: LLMBallConfig;
  phase: FusionPhase;
  phaseProgress: number;
}

export function LLMBall({ config, phase, phaseProgress }: LLMBallProps) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();
    let radius = config.orbitRadius;
    const center = new THREE.Vector3(0, 0, 0);

    // Phase-based radius calculation
    if (phase === 'orbit') {
      radius = config.orbitRadius;
    } else if (phase === 'gather') {
      // Gradually shrink orbit radius to almost center
      radius = THREE.MathUtils.lerp(config.orbitRadius, 0.3, phaseProgress);
    } else if (phase === 'fusion' || phase === 'reveal') {
      // Very close to center
      radius = 0.1;
    }

    // Calculate position based on orbit
    const angle = config.phaseOffset + t * config.orbitSpeed;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    const z = 0;

    ref.current.position.set(x, y, z);

    // Breathing scale effect
    const scalePulse = 1 + 0.05 * Math.sin(t * 2 + config.phaseOffset);
    const baseScale = phase === 'reveal' ? 0.01 : 1; // Hide in reveal phase
    ref.current.scale.setScalar(scalePulse * baseScale);

    // Opacity based on phase
    if (ref.current.material instanceof THREE.MeshStandardMaterial) {
      if (phase === 'fusion') {
        ref.current.material.opacity = THREE.MathUtils.lerp(1, 0, phaseProgress);
        ref.current.material.transparent = true;
      } else if (phase === 'reveal') {
        ref.current.material.opacity = 0;
        ref.current.material.transparent = true;
      } else {
        ref.current.material.opacity = 1;
        ref.current.material.transparent = false;
      }
    }
  });

  // Enhanced emissive intensity based on phase
  const getEmissiveIntensity = () => {
    if (phase === 'orbit') return 0.8;
    if (phase === 'gather') return THREE.MathUtils.lerp(0.8, 2.0, phaseProgress);
    if (phase === 'fusion') return 3.0;
    return 0;
  };

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 48, 48]} />
      <meshStandardMaterial
        color={config.color}
        metalness={0.6}
        roughness={0.1}
        emissive={config.color}
        emissiveIntensity={getEmissiveIntensity()}
        toneMapped={false}
      />
    </mesh>
  );
}
