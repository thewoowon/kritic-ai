// FusionTextOverlay.tsx
'use client';

import { useState, useEffect } from 'react';
import { FusionPhase } from './FusionController';

interface FusionTextOverlayProps {
  phase: FusionPhase;
  phaseProgress: number;
}

const PHASE_MESSAGES = {
  orbit: 'Querying Multiple LLMs...',
  gather: 'Gathering Consensus...',
  fusion: 'Fusing Analysis...',
  reveal: 'Kritic Verdict Ready',
};

export function FusionTextOverlay({ phase, phaseProgress }: FusionTextOverlayProps) {
  const [displayText, setDisplayText] = useState('');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const message = PHASE_MESSAGES[phase];
    setDisplayText(message);

    // Fade in at start of phase, fade out at end
    if (phaseProgress < 0.2) {
      // Fade in
      setOpacity(phaseProgress / 0.2);
    } else if (phaseProgress > 0.8) {
      // Fade out
      setOpacity((1 - phaseProgress) / 0.2);
    } else {
      // Full opacity
      setOpacity(1);
    }
  }, [phase, phaseProgress]);

  // Special handling for reveal phase - keep visible longer
  const finalOpacity = phase === 'reveal' ? Math.min(1, phaseProgress * 2) : opacity;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        opacity: finalOpacity,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div className="text-center space-y-4">
        <h2
          className="text-4xl md:text-6xl font-bold tracking-tight"
          style={{
            textShadow: '0 0 20px rgba(255, 75, 92, 0.8), 0 0 40px rgba(255, 75, 92, 0.4)',
            color: phase === 'reveal' ? '#FF4B5C' : '#ffffff',
          }}
        >
          {displayText}
        </h2>

        {phase === 'reveal' && (
          <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span>GPT-5</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.1s' }} />
              <span>Claude</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span>Gemini</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span>Kritic</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
