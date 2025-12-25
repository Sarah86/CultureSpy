
export type TaskType = 'observation' | 'deduction' | 'sketch' | 'audio';
export type SensoryType = 'sight' | 'sound' | 'touch' | 'smell' | 'vibe';
export type Language = 'EN' | 'IT' | 'FR' | 'PT';

export interface Evidence {
  timestamp: number;
  data: string; // Base64 or Text
  type: TaskType;
}

export interface Task {
  id: string;
  prompt: string;
  type: TaskType;
  sensoryType?: SensoryType;
  details?: string;
  completed: boolean;
  evidence?: Evidence;
}

export interface Mission {
  id: string;
  codeName: string;
  title: string;
  category: 'ART' | 'SCIENCE' | 'MUSIC';
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tasks: Task[];
  isLocked: boolean;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}
