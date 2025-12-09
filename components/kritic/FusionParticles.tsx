// FusionParticles.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FusionPhase } from './FusionController';

interface FusionParticlesProps {
  phase: FusionPhase;
  phaseProgress: number;
}

export function FusionParticles({ phase, phaseProgress }: FusionParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null!);

  // Create particle positions
  const particleCount = 500;
  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2 + Math.random() * 1.5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random colors (red-ish)
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.4 + Math.random() * 0.3;

      scales[i] = Math.random() * 0.5 + 0.5;
    }

    return { positions, colors, scales };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const t = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

    // Only show particles during fusion and reveal phases
    let opacity = 0;
    if (phase === 'fusion') {
      opacity = phaseProgress * 0.8;
    } else if (phase === 'reveal') {
      opacity = Math.max(0, 0.8 - phaseProgress * 0.8);
    }

    if (particlesRef.current.material instanceof THREE.PointsMaterial) {
      particlesRef.current.material.opacity = opacity;
    }

    // Animate particles during fusion - pull inward
    if (phase === 'fusion') {
      for (let i = 0; i < particleCount; i++) {
        const originalX = positions[i * 3];
        const originalY = positions[i * 3 + 1];
        const originalZ = positions[i * 3 + 2];

        // Pull towards center
        const pullFactor = 1 - phaseProgress * 0.7;
        positions[i * 3] = originalX * pullFactor;
        positions[i * 3 + 1] = originalY * pullFactor;
        positions[i * 3 + 2] = originalZ * pullFactor;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Rotate particles
    particlesRef.current.rotation.y = t * 0.3;
    particlesRef.current.rotation.x = t * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
