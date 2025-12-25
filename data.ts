
import { Mission } from './types';

export const MOCK_MISSIONS: Mission[] = [
  {
    id: 'm1',
    codeName: 'OP-GLITCH-HUNT',
    title: 'The Gallery Ghost',
    category: 'ART',
    description: 'A sneaky digital ghost is hiding in the art! Use your hero senses to track down all 10 glitches before the time runs out!',
    difficulty: 3,
    isLocked: false,
    status: 'PENDING',
    tasks: [
      { id: 'm1t1', type: 'observation', sensoryType: 'sight', prompt: 'Find the brightest color in the room!', completed: false },
      { id: 'm1t2', type: 'observation', sensoryType: 'sight', prompt: 'Spot a painting with a hidden animal.', completed: false },
      { id: 'm1t3', type: 'observation', sensoryType: 'touch', prompt: 'Touch a cold wall (Stealth Mode!).', completed: false },
      { id: 'm1t4', type: 'observation', sensoryType: 'sound', prompt: 'Listen for a secret whisper in the air.', completed: false },
      { id: 'm1t5', type: 'observation', sensoryType: 'sight', prompt: 'Count 5 people wearing glasses.', completed: false },
      { id: 'm1t6', type: 'observation', sensoryType: 'vibe', prompt: 'Spin around 3 times like a spy!', completed: false },
      { id: 'm1t7', type: 'observation', sensoryType: 'sight', prompt: 'Find a statue that looks bored.', completed: false },
      { id: 'm1t8', type: 'observation', sensoryType: 'sight', prompt: 'Find something shaped like a triangle.', completed: false },
      { id: 'm1t9', type: 'observation', sensoryType: 'touch', prompt: 'Feel the texture of your own spy gear.', completed: false },
      { id: 'm1t10', type: 'observation', sensoryType: 'vibe', prompt: 'High-five a nearby shadow!', completed: false }
    ]
  }
];
