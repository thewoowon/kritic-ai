// KriticFusionScene.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { LLM_BALLS } from './fusionConfig';
import { FusionController } from './FusionController';
import { FusionCore } from './FusionCore';
import { LLMBall } from './LLMBall';
import { FusionParticles } from './FusionParticles';
import * as THREE from 'three';

function CameraRig({ phase, phaseProgress }: { phase: string; phaseProgress: number }) {
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Dynamic camera movement based on phase
    if (phase === 'orbit') {
      // Gentle orbit around scene
      cameraRef.current.x = Math.sin(t * 0.3) * 0.5;
      cameraRef.current.y = Math.cos(t * 0.2) * 0.3;
      cameraRef.current.z = 5;
    } else if (phase === 'gather') {
      // Zoom in slightly
      const targetZ = THREE.MathUtils.lerp(5, 4.2, phaseProgress);
      cameraRef.current.z = THREE.MathUtils.lerp(cameraRef.current.z, targetZ, 0.05);
    } else if (phase === 'fusion') {
      // DRAMATIC zoom in during fusion
      const targetZ = THREE.MathUtils.lerp(4.2, 3.5, phaseProgress);
      cameraRef.current.z = targetZ;
      // Add shake effect
      cameraRef.current.x = (Math.random() - 0.5) * 0.1 * phaseProgress;
      cameraRef.current.y = (Math.random() - 0.5) * 0.1 * phaseProgress;
    } else if (phase === 'reveal') {
      // Pull back to reveal
      cameraRef.current.x = Math.sin(t * 0.5) * 0.2;
      cameraRef.current.y = 0;
      cameraRef.current.z = THREE.MathUtils.lerp(cameraRef.current.z, 4.5, 0.02);
    }

    state.camera.position.lerp(cameraRef.current, 0.1);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function KriticFusionScene() {
  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#4F8BFF" />
      <pointLight position={[5, -5, 0]} intensity={1.0} color="#FF4B5C" />
      <pointLight position={[0, 5, -5]} intensity={0.8} color="#FFC857" />

      {/* Fusion Controller: phase & progress management */}
      <FusionController>
        {(phase, phaseProgress) => (
          <>
            <CameraRig phase={phase} phaseProgress={phaseProgress} />

            {/* Individual LLM Balls */}
            {LLM_BALLS.map((cfg) => (
              <LLMBall
                key={cfg.id}
                config={cfg}
                phase={phase}
                phaseProgress={phaseProgress}
              />
            ))}

            {/* Final Fusion Core */}
            <FusionCore phase={phase} phaseProgress={phaseProgress} />

            {/* Particle Effects */}
            <FusionParticles phase={phase} phaseProgress={phaseProgress} />
          </>
        )}
      </FusionController>

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
