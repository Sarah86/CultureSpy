
import { AgentProfile, Mission, PersistedSearch } from './types';

// Every entity persisted here goes through this module — nothing else in the
// app touches localStorage directly. Swapping this for a real API/database
// later means changing only this file, not the call sites.

const STORAGE_VERSION = 1;

const KEYS = {
  profile: 'culturespy:profile',
  missions: 'culturespy:missions',
  missionCachePrefix: 'culturespy:mission_cache:',
  searchResults: 'culturespy:search_results'
};

interface Envelope<T> {
  version: number;
  data: T;
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeJSON<T>(key: string, data: T): void {
  try {
    const envelope: Envelope<T> = { version: STORAGE_VERSION, data };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // Storage unavailable (private browsing, quota exceeded) — the app keeps
    // working from in-memory state, it just won't persist across reloads.
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const storage = {
  getProfile(): AgentProfile | null {
    return readJSON<AgentProfile>(KEYS.profile);
  },

  saveProfile(profile: AgentProfile): void {
    writeJSON(KEYS.profile, profile);
  },

  getMissions(): Mission[] | null {
    return readJSON<Mission[]>(KEYS.missions);
  },

  saveMissions(missions: Mission[]): void {
    writeJSON(KEYS.missions, missions);
  },

  getMissionCache<T>(cacheKey: string): T | null {
    return readJSON<T>(KEYS.missionCachePrefix + cacheKey);
  },

  saveMissionCache<T>(cacheKey: string, data: T): void {
    writeJSON(KEYS.missionCachePrefix + cacheKey, data);
  },

  clearMissionCache(cacheKey: string): void {
    remove(KEYS.missionCachePrefix + cacheKey);
  },

  getSearchResults(): PersistedSearch | null {
    return readJSON<PersistedSearch>(KEYS.searchResults);
  },

  saveSearchResults(results: PersistedSearch): void {
    writeJSON(KEYS.searchResults, results);
  },

  clearSearchResults(): void {
    remove(KEYS.searchResults);
  },

  clearAll(): void {
    remove(KEYS.profile);
    remove(KEYS.missions);
    remove(KEYS.searchResults);
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(KEYS.missionCachePrefix))
        .forEach(key => remove(key));
    } catch {
      // ignore
    }
  }
};
