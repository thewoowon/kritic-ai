// fusionConfig.ts
export type LLMId = 'gpt' | 'claude' | 'gemini' | 'kritic';

export interface LLMBallConfig {
  id: LLMId;
  label: string;
  color: string;       // hex or THREE.ColorRepresentation
  orbitRadius: number; // 초기 궤도 반지름
  orbitSpeed: number;  // 회전 속도 계수
  phaseOffset: number; // 초기 위상 (rad)
}

export const LLM_BALLS: LLMBallConfig[] = [
  {
    id: 'gpt',
    label: 'GPT-5',
    color: '#4F8BFF',
    orbitRadius: 1.6,
    orbitSpeed: 1.0,
    phaseOffset: 0
  },
  {
    id: 'claude',
    label: 'Claude',
    color: '#FFC857',
    orbitRadius: 1.9,
    orbitSpeed: 0.9,
    phaseOffset: 1.2
  },
  {
    id: 'gemini',
    label: 'Gemini',
    color: '#3DDC97',
    orbitRadius: 2.1,
    orbitSpeed: 1.1,
    phaseOffset: 2.4
  },
  {
    id: 'kritic',
    label: 'Kritic',
    color: '#FF6B9D',
    orbitRadius: 2.3,
    orbitSpeed: 0.95,
    phaseOffset: 3.6
  },
];

export const FUSION_TIMING = {
  orbitDuration: 2.0,    // Orbit Phase: 0-2s
  gatherDuration: 2.0,   // Gathering Phase: 2-4s
  fusionDuration: 1.0,   // Fusion Phase: 4-5s
  // Reveal phase starts after 5s
};

export const CAMERA_CONFIG = {
  initialPosition: [0, 0, 5] as [number, number, number],
  fusionZoomPosition: [0, 0, 4] as [number, number, number],
  fov: 50,
};
