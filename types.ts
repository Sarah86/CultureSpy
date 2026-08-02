
export interface Translations {
  selectCipher: string;
  briefingTitle: string;
  briefingText: string;
  startInfiltration: string;
  identityReq: string;
  enterCodename: string;
  confirmIdentity: string;
  welcome: string;
  selectRank: string;
  yearsSuffix: string;
  rankRookie: string;
  rankSpecialist: string;
  rankElite: string;
  stealthOn: string;
  xp: string;
  radarTitle: string;
  radarDesc: string;
  scanSector: string;
  manualSearch: string;
  searchPlaceholder: string;
  targetsLocked: string;
  pickZone: string;
  abortScan: string;
  retreat: string;
  missionClear: string;
  intelCaptured: string;
  secured: string;
  settingsTitle: string;
  rank: string;
  satelliteLink: string;
  satelliteDesc: string;
  updateKey: string;
  terminateIdentity: string;
  cipherSelect: string;
  proceed: string;
  uplinkRequired: string;
  noMissions: string;
  topSecret: string;
  lvl: string;
  microTasks: string;
  infiltrate: string;
  dataCached: string;
  activeOp: string;
  status_scanning: string;
  status_searching: string;
  status_connecting: string;
  status_encrypting: string;
  error_radar: string;
  error_gps: string;
  apiError: string;
  privacyLabel: string;
  privacyInfo: string;
  findNewMission: string;
  keepBrowsing: string;
  viewOnMaps: string;
  deleteMission: string;
  confirmDeleteTitle: string;
  confirmDeleteBody: string;
  cancel: string;
  stepOf: string;
}

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
  curiosity?: string; // New field for fun facts
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
  // Snapshot of the place this mission was generated for, so the mission
  // detail screen can still show address/distance/maps without re-fetching.
  targetName?: string;
  targetAddress?: string;
  targetLat?: number;
  targetLng?: number;
  targetDistanceKm?: number;
}

export interface AgentProfile {
  name: string;
  age: number;
  lang: Language;
}

export interface NearbyTarget {
  name: string;
  type: string;
  description: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface PersistedSearch {
  targets: NearbyTarget[];
  origin: { lat: number; lng: number } | null;
  lastTarget: NearbyTarget | null;
}
