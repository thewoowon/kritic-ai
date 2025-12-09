// FusionController.tsx
'use client';

import { ReactNode, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { FUSION_TIMING } from './fusionConfig';

export type FusionPhase = 'orbit' | 'gather' | 'fusion' | 'reveal';

interface FusionControllerProps {
  children: (phase: FusionPhase, phaseProgress: number) => ReactNode;
}

export function FusionController({ children }: FusionControllerProps) {
  const [phase, setPhase] = useState<FusionPhase>('orbit');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const phaseStartRef = useRef<number | null>(null);

  const { orbitDuration, gatherDuration, fusionDuration } = FUSION_TIMING;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (phaseStartRef.current === null) {
      phaseStartRef.current = t;
    }

    const elapsed = t - phaseStartRef.current;

    let nextPhase: FusionPhase = phase;
    let phaseDuration = orbitDuration;
    let phaseBase = 0;

    if (elapsed < orbitDuration) {
      nextPhase = 'orbit';
      phaseDuration = orbitDuration;
      phaseBase = 0;
    } else if (elapsed < orbitDuration + gatherDuration) {
      nextPhase = 'gather';
      phaseDuration = gatherDuration;
      phaseBase = orbitDuration;
    } else if (elapsed < orbitDuration + gatherDuration + fusionDuration) {
      nextPhase = 'fusion';
      phaseDuration = fusionDuration;
      phaseBase = orbitDuration + gatherDuration;
    } else {
      nextPhase = 'reveal';
      phaseDuration = 1;
      phaseBase = orbitDuration + gatherDuration + fusionDuration;
    }

    if (nextPhase !== phase) {
      setPhase(nextPhase);
      phaseStartRef.current = t;
    }

    const phaseElapsed = t - (phaseStartRef.current ?? t);
    const progress = Math.min(1, Math.max(0, phaseElapsed / phaseDuration));
    setPhaseProgress(progress);

    // Emit phase updates for text overlay
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fusion-phase-update', {
          detail: { phase: nextPhase, phaseProgress: progress },
        })
      );
    }
  });

  return <>{children(phase, phaseProgress)}</>;
}
