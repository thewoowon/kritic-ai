// KriticFusionCanvas.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { KriticFusionScene } from './KriticFusionScene';
import { CAMERA_CONFIG } from './fusionConfig';

export function KriticFusionCanvas() {
  return (
    <Canvas
      camera={{
        position: CAMERA_CONFIG.initialPosition,
        fov: CAMERA_CONFIG.fov
      }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <KriticFusionScene />
      </Suspense>
    </Canvas>
  );
}
