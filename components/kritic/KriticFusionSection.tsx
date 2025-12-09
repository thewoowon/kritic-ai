// KriticFusionSection.tsx
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { FusionTextOverlay } from './FusionTextOverlay';
import { FusionPhase } from './FusionController';

const KriticFusionCanvas = dynamic(
  () => import('./KriticFusionCanvas').then((m) => ({ default: m.KriticFusionCanvas })),
  { ssr: false }
);

export function KriticFusionSection() {
  const [phase, setPhase] = useState<FusionPhase>('orbit');
  const [phaseProgress, setPhaseProgress] = useState(0);

  // Listen for phase updates from the Canvas
  useEffect(() => {
    const handlePhaseUpdate = (event: CustomEvent) => {
      setPhase(event.detail.phase);
      setPhaseProgress(event.detail.phaseProgress);
    };

    window.addEventListener('fusion-phase-update' as any, handlePhaseUpdate);
    return () => {
      window.removeEventListener('fusion-phase-update' as any, handlePhaseUpdate);
    };
  }, []);

  return (
    <section
      className="relative w-full h-[600px] bg-black"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)',
      }}
    >
      <KriticFusionCanvas />

      {/* Animated Text Overlay */}
      <FusionTextOverlay phase={phase} phaseProgress={phaseProgress} />

      {/* Bottom label */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <div className="text-white/80 text-sm font-mono">
          <p>Multi-LLM Consensus Analysis</p>
        </div>
      </div>
    </section>
  );
}
