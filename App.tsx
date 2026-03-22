
import React, { useState, useEffect } from 'react';
// Fixed the incorrect 'eye' import to 'Eye'
import { Terminal, ShieldAlert, Cpu, User, ChevronLeft, Power, Globe, LocateFixed, Radar, ExternalLink, Crosshair, Target, ChevronRight, Fingerprint, Activity, Zap, Key, Star, Trophy, Rocket, Ghost, Sparkles, Flame, UserCircle, Settings, ShieldCheck, ShieldX, CheckCircle2, RefreshCw, Languages, Search, Send, Shield, Eye, Info } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { getLocalizedMockMissions } from './data';
import { Mission, Task, TaskType, SensoryType, Language } from './types';
import MissionCard from './components/MissionCard';
import TaskItem from './components/TaskItem';
import TerminalText from './components/TerminalText';
import LocationScanner from './components/LocationScanner';

interface NearbyTarget {
  name: string;
  type: string;
  description: string;
}

const TRANSLATIONS: Record<Language, any> = {
  EN: {
    selectCipher: 'SELECT COMMUNICATION CIPHER',
    briefingTitle: 'MISSION_BRIEFING',
    briefingText: 'CultureSpy is your elite intelligence tool. Your mission: Infiltrate museums, galleries, and cities. Use your senses to detect cultural glitches, collect data, and unlock historical secrets hidden in plain sight.',
    startInfiltration: 'START_INFILTRATION',
    identityReq: 'SECRET IDENTITY REQUIRED',
    enterCodename: 'ENTER_CODENAME',
    confirmIdentity: 'CONFIRM IDENTITY',
    welcome: 'WELCOME',
    selectRank: 'SELECT TRAINING RANK',
    yearsSuffix: 'YEARS',
    rankRookie: 'RECRUIT',
    rankSpecialist: 'AGENT',
    rankElite: 'COMMANDER',
    stealthOn: 'Stealth_On',
    xp: 'XP',
    radarTitle: 'The Fun Radar',
    radarDesc: 'Ready to find some wacky cultural glitches nearby,',
    scanSector: 'SCAN SECTOR',
    manualSearch: 'MANUAL INFILTRATION',
    searchPlaceholder: 'ENTER_PLACE_NAME...',
    targetsLocked: 'Targets Locked!',
    pickZone: 'Pick a zone, Agent',
    abortScan: 'ABORT_SCAN',
    retreat: 'RETREAT_TO_HQ',
    missionClear: 'MISSION_CLEAR!',
    intelCaptured: 'Intel Captured',
    secured: 'SECURED',
    settingsTitle: 'Settings',
    rank: 'Agent Rank',
    satelliteLink: 'Satellite Link',
    satelliteDesc: 'Verify your connection to the CultureSpy satellite network.',
    updateKey: 'Update Key Selection',
    terminateIdentity: 'Terminate_Identity',
    cipherSelect: 'COMM_CIPHER',
    proceed: 'PROCEED',
    uplinkRequired: 'Uplink Required',
    noMissions: 'No Active Missions Found',
    topSecret: 'TOP_SECRET',
    lvl: 'Lvl',
    microTasks: 'MICRO_TASKS',
    infiltrate: 'Infiltrate',
    dataCached: 'DATA_CACHED',
    activeOp: 'ACTIVE_OP',
    status_scanning: 'FIRING_LASER_BEAMS',
    status_searching: 'SNIFFING_FOR_ADVENTURE',
    status_connecting: 'CATCHING_SECRET_WAVES',
    status_encrypting: 'ENCRYPTING_MISSION_DATA',
    error_radar: 'RADAR_JAMMED: NO_DATA_STREAM',
    error_gps: 'GPS_LINK_FAILURE'
  },
  IT: {
    selectCipher: 'SELEZIONA CIFRARIO COMUNICAZIONE',
    briefingTitle: 'BRIEFING_MISSIONE',
    briefingText: 'CultureSpy è il tuo strumento d\'élite. La tua missione: infiltrarti in musei, gallerie e città. Usa i tuoi sensi per rilevare glitch culturali, raccogliere dati e sbloccare segreti storici nascosti.',
    startInfiltration: 'INIZIA_INFILTRAZIONE',
    identityReq: 'IDENTITÀ SEGRETA RICHIESTA',
    enterCodename: 'INSERISCI_CODENAME',
    confirmIdentity: 'CONFERMA IDENTITÀ',
    welcome: 'BENVENUTO',
    selectRank: 'SELEZIONA GRADO ADDESTRAMENTO',
    yearsSuffix: 'ANNI',
    rankRookie: 'RECLUTA',
    rankSpecialist: 'AGENTE',
    rankElite: 'COMANDANTE',
    stealthOn: 'Modalità_Invisibile',
    xp: 'XP',
    radarTitle: 'Radar Divertimento',
    radarDesc: 'Pronto a trovare glitch culturali bizzarri,',
    scanSector: 'SCANSIONE SETTORE',
    manualSearch: 'INFILTRAZIONE MANUALE',
    searchPlaceholder: 'INSERISCI_NOME_LUOGO...',
    targetsLocked: 'Obiettivi Identificati!',
    pickZone: 'Scegli una zona, Agente',
    abortScan: 'ANNULLA_SCANSIONE',
    retreat: 'RITORNA_AL_QG',
    missionClear: 'MISSIONE COMPIUTA!',
    intelCaptured: 'Dati Acquisiti',
    secured: 'MESSO AL SICURO',
    settingsTitle: 'Impostazioni',
    rank: 'Grado Agente',
    satelliteLink: 'Collegamento Satellitare',
    satelliteDesc: 'Verifica la tua connessione alla rete CultureSpy.',
    updateKey: 'Aggiorna Chiave Segreta',
    terminateIdentity: 'Termina_Identità',
    cipherSelect: 'CIFRARIO_COMM',
    proceed: 'PROCEDI',
    uplinkRequired: 'Uplink Necessario',
    noMissions: 'Nessuna Missione Attiva',
    topSecret: 'TOP_SECRET',
    lvl: 'Liv',
    microTasks: 'MICRO_COMPITI',
    infiltrate: 'Infiltrati',
    dataCached: 'DATI_ARCHIVIATI',
    activeOp: 'OP_ATTIVA',
    status_scanning: 'ATTIVAZIONE_LASER',
    status_searching: 'RICERCA_AVVENTURE',
    status_connecting: 'SINTONIZZAZIONE_ONDE',
    status_encrypting: 'CRITTOGRAFIA_MISSIONE',
    error_radar: 'RADAR DISTURBATO: NO DATI',
    error_gps: 'ERRORE_LINK_GPS'
  },
  FR: {
    selectCipher: 'SÉLECTIONNER LE CHIFFREMENT',
    briefingTitle: 'BRIEFING_DE_MISSION',
    briefingText: 'CultureSpy est votre outil de renseignement d\'élite. Votre mission : infiltrez les musées et les villes. Utilisez vos sens pour détecter les anomalies culturelles et débloquer des secrets historiques.',
    startInfiltration: 'LANCER_INFILTRATION',
    identityReq: 'IDENTITÉ SECRÈTE REQUISE',
    enterCodename: 'NOM_DE_CODE',
    confirmIdentity: 'CONFIRMER IDENTITÉ',
    welcome: 'BIENVENUE',
    selectRank: 'SÉLECTIONNER RANG D\'ENTRAÎNEMENT',
    yearsSuffix: 'ANS',
    rankRookie: 'RECRUE',
    rankSpecialist: 'AGENT',
    rankElite: 'COMMANDANT',
    stealthOn: 'Mode_Furtif',
    xp: 'XP',
    radarTitle: 'Radar de Plaisir',
    radarDesc: 'Prêt à débusquer des anomalies culturelles,',
    scanSector: 'SCANNER SECTEUR',
    manualSearch: 'INFILTRATION MANUELLE',
    searchPlaceholder: 'NOM_DU_LIEU...',
    targetsLocked: 'Cibles Verrouillées !',
    pickZone: 'Choisis une zone, Agent',
    abortScan: 'ANNULER_SCAN',
    retreat: 'RETOUR_AU_QG',
    missionClear: 'MISSION RÉUSSIE !',
    intelCaptured: 'Infos Capturées',
    secured: 'SÉCURISÉ',
    settingsTitle: 'Paramètres',
    rank: 'Rang de l\'Agent',
    satelliteLink: 'Liaison Satellite',
    satelliteDesc: 'Vérifiez votre connexion au réseau CultureSpy.',
    updateKey: 'Mettre à Jour la Clé',
    terminateIdentity: 'Terminer_Identité',
    cipherSelect: 'CHIFFREMENT_COMM',
    proceed: 'CONTINUER',
    uplinkRequired: 'Liaison Requise',
    noMissions: 'Aucune Mission Trouvée',
    topSecret: 'TOP_SECRET',
    lvl: 'Niv',
    microTasks: 'MICRO_TACHES',
    infiltrate: 'Infiltrer',
    dataCached: 'DONNEES_CACHEES',
    activeOp: 'OP_ACTIVE',
    status_scanning: 'LANCEMENT_DES_LASERS',
    status_searching: 'RECHERCHE_AVENTURE',
    status_connecting: 'SYNCHRO_SATELLITE',
    status_encrypting: 'CHIFFREMENT_MISSION',
    error_radar: 'RADAR BROUILLÉ : PAS DE FLUX',
    error_gps: 'ERREUR_GPS'
  },
  PT: {
    selectCipher: 'SELECIONAR CÓDIGO DE COMUNICAÇÃO',
    briefingTitle: 'BRIEFING_DA_MISSÃO',
    briefingText: 'O CultureSpy é sua ferramenta de inteligência de elite. Sua missão: infiltrar-se em museus e centros culturais. Use seus sentidos para detectar falhas no sistema, coletar dados sensoriais e desbloquear segredos históricos escondidos por toda a cidade.',
    startInfiltration: 'INICIAR_INFILTRAÇÃO',
    identityReq: 'IDENTIDADE SECRETA REQUERIDA',
    enterCodename: 'DIGITAR_CODENOME',
    confirmIdentity: 'CONFIRMAR IDENTIDADE',
    welcome: 'BEM-VINDO',
    selectRank: 'SELECIONAR PATENTE DE TREINO',
    yearsSuffix: 'ANOS',
    rankRookie: 'RECRUTA',
    rankSpecialist: 'AGENTE',
    rankElite: 'COMANDANTE',
    stealthOn: 'Modo_Furtivo',
    xp: 'XP',
    radarTitle: 'Radar de Diversão',
    radarDesc: 'Pronto para encontrar falhas culturais por perto,',
    scanSector: 'ESCANEAR SETOR',
    manualSearch: 'INFILTRAÇÃO MANUAL',
    searchPlaceholder: 'NOME_DO_LUGAR...',
    targetsLocked: 'Alvos Localizados!',
    pickZone: 'Escolha uma zona, Agente',
    abortScan: 'ABORTAR_SCAN',
    retreat: 'VOLTAR_PARA_O_QG',
    missionClear: 'MISSÃO CONCLUÍDA!',
    intelCaptured: 'Dados Capturados',
    secured: 'EM SEGURANÇA',
    settingsTitle: 'Configurações',
    rank: 'Patente do Agente',
    satelliteLink: 'Link de Satélite',
    satelliteDesc: 'Verifique sua conexão com a rede CultureSpy.',
    updateKey: 'Atualizar Chave Secreta',
    terminateIdentity: 'Apagar_Identidade',
    cipherSelect: 'CÓDIGO_COMM',
    proceed: 'PROSSEGUIR',
    uplinkRequired: 'Conexão Necessária',
    noMissions: 'Nenhuma Missão Ativa Found',
    topSecret: 'CONFIDENCIAL',
    lvl: 'Nível',
    microTasks: 'MICRO_TAREFAS',
    infiltrate: 'Infiltrar',
    dataCached: 'DADOS_EM_CACHE',
    activeOp: 'OP_ATIVA',
    status_scanning: 'DISPARANDO_LASERS',
    status_searching: 'BUSCANDO_AVENTURA',
    status_connecting: 'CAPTURANDO_ONDAS',
    status_encrypting: 'CRIPTOGRAFANDO_MISSÃO',
    error_radar: 'RADAR BLOQUEADO: SEM DADOS',
    error_gps: 'FALHA_LINK_GPS'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [view, setView] = useState<'ONBOARDING' | 'HOME' | 'SELECT_LOCATION' | 'MISSION_DETAIL' | 'SETTINGS'>('ONBOARDING');
  const [agentName, setAgentName] = useState('');
  const [tempName, setTempName] = useState('');
  const [onboardingStep, setOnboardingStep] = useState<'LANG' | 'INTRO' | 'NAME' | 'AGE'>('LANG');
  const [agentAge, setAgentAge] = useState<number | null>(null);
  const [manualSearchInput, setManualSearchInput] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [lastTarget, setLastTarget] = useState<NearbyTarget | null>(null);
  const [scanStatus, setScanStatus] = useState('');
  const [scanError, setScanError] = useState<string | undefined>(undefined);
  const [detectedTargets, setDetectedTargets] = useState<NearbyTarget[]>([]);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [showKeySelection, setShowKeySelection] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    checkKeyStatus();
    setMissions(getLocalizedMockMissions(lang));
  }, [lang]);

  const checkKeyStatus = async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasValidKey(hasKey);
        if (hasKey) setShowKeySelection(false);
        return hasKey;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setShowKeySelection(false);
        setHasValidKey(true); 
      } catch (e) {}
    }
  };

  const handleManualBypass = () => {
    setShowKeySelection(false);
    setHasValidKey(true);
  };

  const toggleTask = (missionId: string, taskId: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      if (m.id === missionId) {
        const newTasks = m.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const allDone = newTasks.every(task => task.completed);
        return { 
          ...m, 
          tasks: newTasks,
          status: allDone ? 'COMPLETED' : 'ACTIVE'
        };
      }
      return m;
    }));
  };

  const handleSearchByName = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const query = manualSearchInput.trim();
    if (!query || isScanning) return;

    setIsScanning(true);
    setScanError(undefined);
    setScanStatus(t.status_searching);
    setDetectedTargets([]);

    try {
      // Create a new GoogleGenAI instance right before making an API call to use latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setScanStatus(t.status_connecting);

      let latLng = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch(e) {
        console.warn("Location context unavailable for manual search.");
      }

      const prompt = `
        Search context: "${query}"
        Language: ${lang === 'PT' ? 'Português do Brasil' : lang}
        TASK: Use Google Maps tool to find 4 specific cultural, historical, or interesting landmarks related to "${query}".
        IMPORTANT: Return ONLY a raw JSON array of objects.
        Structure: [{"name": "Landmark Name", "type": "Category", "description": "Short intriguing teaser"}]
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: { latLng }
            }
          }
        });

        const text = response.text;
        const jsonMatch = text?.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const targets = JSON.parse(jsonMatch[0]);
          if (Array.isArray(targets) && targets.length > 0) {
            setDetectedTargets(targets);
            setView('SELECT_LOCATION');
            setIsScanning(false);
            setManualSearchInput(''); 
          } else {
            throw new Error(t.error_radar);
          }
        } else {
          throw new Error(t.error_radar);
        }
      } catch (err: any) {
        if (err.message?.includes("Requested entity was not found.") || err.message?.includes("404")) {
          setShowKeySelection(true);
          setHasValidKey(false);
          throw new Error(t.uplinkRequired);
        }
        throw err;
      }
    } catch (err: any) {
      setScanError(err.message || "SEARCH_FAILURE: MAPS_UPLINK_DENIED");
    }
  };

  const handleScanSurroundings = async () => {
    setIsScanning(true);
    setScanError(undefined);
    setScanStatus(t.status_scanning);
    setDetectedTargets([]);

    try {
      setScanStatus(t.status_searching);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000 
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords({ lat: latitude, lng: longitude });

      // Create a new GoogleGenAI instance right before making an API call to use latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setScanStatus(t.status_connecting);

      const prompt = `
        LOCATION: Lat ${latitude}, Lng ${longitude}
        LANGUAGE: ${lang === 'PT' ? 'Português do Brasil' : lang}
        TASK: Find 4 super interesting places nearby (museums, funny statues, colorful walls, weird buildings).
        IMPORTANT: All values in the response MUST be in the target language.
        FORMAT: Return a JSON array: [{"name": "Name", "type": "Type", "description": "Description"}]
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: { retrievalConfig: { latLng: { latitude, longitude } } }
          }
        });

        const jsonMatch = response.text?.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          setDetectedTargets(JSON.parse(jsonMatch[0]));
          setView('SELECT_LOCATION');
          setIsScanning(false);
        } else {
          throw new Error(t.error_radar);
        }
      } catch (err: any) {
        if (err.message?.includes("Requested entity was not found.") || err.message?.includes("404")) {
          setShowKeySelection(true);
          setHasValidKey(false);
          throw new Error(t.uplinkRequired);
        }
        throw err;
      }
    } catch (err: any) {
      setScanError(err.message || t.error_gps);
    }
  };

  const handleRegenerateMission = () => {
    if (!lastTarget) return;
    const cacheKey = `culturespy_mission_${lastTarget.name.toLowerCase().replace(/\s+/g, '_')}_${lang}`;
    localStorage.removeItem(cacheKey);
    handleSelectTarget(lastTarget);
  };

  const handleSelectTarget = async (target: NearbyTarget) => {
    if (!agentAge) return;
    setLastTarget(target);
    setIsScanning(true);
    setScanError(undefined);
    setScanStatus(t.status_encrypting);

    try {
      // Check localStorage cache first — same location + language = same mission, zero API cost
      const cacheKey = `culturespy_mission_${target.name.toLowerCase().replace(/\s+/g, '_')}_${lang}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        const newMission: Mission = {
          ...data,
          id: `gen-${Date.now()}`,
          status: 'PENDING',
          isLocked: false,
          category: 'ART',
          tasks: (data.tasks || []).map((task: any, i: number) => ({
            ...task,
            id: `t-${i}-${Date.now()}`,
            completed: false
          }))
        };
        setMissions(prev => [newMission, ...prev]);
        setActiveMissionId(newMission.id);
        setView('MISSION_DETAIL');
        setIsScanning(false);
        return;
      }

      // Create a new GoogleGenAI instance right before making an API call to use latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        TARGET: ${target.name}
        AGENT_NAME: ${agentName}
        AGENT_AGE: ${agentAge}
        LANGUAGE: ${lang === 'PT' ? 'Português do Brasil' : lang}
        TASK: Create 10 sensory tasks for ${target.name} (sight, sound, touch).
        IMPORTANT: Each task must include a 'curiosity' (a mind-blowing fact or secret about that specific observation).
        IMPORTANT: All text content MUST be in the target language.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              codeName: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING },
                    curiosity: { type: Type.STRING, description: "A funny/interesting secret fact related to the task." },
                    sensoryType: { type: Type.STRING, enum: ['sight', 'sound', 'touch', 'smell', 'vibe'] },
                    type: { type: Type.STRING, enum: ['observation', 'deduction', 'sketch', 'audio'] }
                  },
                  required: ["prompt", "curiosity", "sensoryType", "type"]
                }
              }
            },
            required: ["codeName", "title", "description", "tasks"]
          }
        }
      });

      const data = JSON.parse(response.text);

      // Save to cache so the same location never triggers another API call
      localStorage.setItem(cacheKey, JSON.stringify(data));

      const newMission: Mission = {
        ...data,
        id: `gen-${Date.now()}`,
        status: 'PENDING',
        isLocked: false,
        category: 'ART',
        tasks: (data.tasks || []).map((task: any, i: number) => ({
          ...task,
          id: `t-${i}-${Date.now()}`,
          completed: false
        }))
      };

      setMissions(prev => [newMission, ...prev]);
      setActiveMissionId(newMission.id);
      setView('MISSION_DETAIL');
      setIsScanning(false);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found.")) {
        setShowKeySelection(true);
        setHasValidKey(false);
      }
      setScanError(t.status_encrypting + "_FAIL");
    }
  };

  const currentMission = activeMissionId ? missions.find(m => m.id === activeMissionId) : null;
  const completedCount = missions.reduce((acc, m) => acc + m.tasks.filter(tk => tk.completed).length, 0);
  const progressPercent = currentMission ? (currentMission.tasks.filter(tk => tk.completed).length / currentMission.tasks.length) * 100 : 0;

  const getRankInfo = (age: number) => {
    if (age <= 8) return { name: t.rankRookie, color: 'spyGreen' };
    if (age <= 10) return { name: t.rankSpecialist, color: 'spyCyan' };
    return { name: t.rankElite, color: 'spyPink' };
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative bg-spyDark border-x border-white/5">
      <LocationScanner 
        isScanning={isScanning} 
        statusText={scanStatus} 
        error={scanError} 
        onRetry={() => {
          setIsScanning(false);
          setScanError(undefined);
          if (manualSearchInput.trim()) handleSearchByName();
          else handleScanSurroundings();
        }}
        onClose={() => { setIsScanning(false); setScanError(undefined); }}
      />

      {showKeySelection && (
        <div className="fixed inset-0 z-[200] bg-spyDark/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center m-4 rounded-[40px] border-4 border-spyCyan glow-border animate-in zoom-in duration-300">
          <Key size={60} className="text-spyCyan mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter leading-none">{t.uplinkRequired}</h2>
          <p className="text-sm text-white/60 mb-8 font-mono leading-relaxed px-4 italic">{t.satelliteDesc}</p>
          <div className="flex flex-col gap-4 w-full">
            <button onClick={handleOpenKeySelector} className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#00a6af] active:translate-y-2 active:shadow-none transition-all text-xl uppercase tracking-widest flex items-center justify-center gap-3">
              <Key size={24} /> SELECT_KEY
            </button>
            <button onClick={handleManualBypass} className="w-full bg-spyGreen text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#008f24] active:translate-y-2 active:shadow-none transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3">
              <CheckCircle2 size={20} /> {t.proceed}
            </button>
          </div>
        </div>
      )}

      {view !== 'ONBOARDING' && (
        <header className="sticky top-0 z-50 bg-spyDark/80 backdrop-blur-xl border-b-2 border-white/10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-spyCyan to-spyPink text-black flex items-center justify-center rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
              <Ghost size={28} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none uppercase tracking-tighter">Spy_Squad</h1>
              <div className="text-[10px] text-spyCyan font-black tracking-widest uppercase flex items-center gap-1 animate-pulse"><Activity size={10}/> {t.stealthOn}</div>
            </div>
          </div>
          <div className="bg-spySlate px-4 py-2 rounded-2xl border-2 border-white/10 flex items-center gap-2 text-right">
            <div>
               <span className="block text-[10px] font-black text-spyCyan uppercase leading-none mb-0.5">{agentName}</span>
               <span className="text-sm font-black text-white tracking-widest leading-none">{completedCount * 10} {t.xp}</span>
            </div>
            <Zap size={18} className="text-spyAmber animate-pulse" />
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto p-5 pb-28">
        {view === 'ONBOARDING' ? (
          <div className="h-full flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
            {onboardingStep === 'LANG' ? (
              <div className="w-full px-4 animate-in slide-in-from-bottom-10">
                <div className="w-24 h-24 bg-spyPink/20 mx-auto flex items-center justify-center rounded-[30px] mb-10 border-4 border-spyPink shadow-[0_0_40px_rgba(255,0,122,0.3)] animate-pulse">
                  <Languages size={48} className="text-spyPink" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 text-center leading-none">
                  {TRANSLATIONS[lang].selectCipher}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {(['EN', 'IT', 'FR', 'PT'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setOnboardingStep('INTRO'); }}
                      className="group relative p-8 rounded-[30px] border-4 border-white/5 bg-spySlate hover:border-spyPink hover:scale-[1.05] transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-spyPink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="relative text-3xl font-black text-white group-hover:text-spyPink">{l}</span>
                      <div className="absolute bottom-2 right-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Ready</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : onboardingStep === 'INTRO' ? (
              <div className="w-full px-4 animate-in slide-in-from-right-10 flex flex-col h-full items-center justify-center">
                <div className="w-32 h-32 bg-spyAmber/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyAmber shadow-[0_0_40px_rgba(255,176,0,0.3)] relative overflow-hidden group">
                  <Shield size={64} className="text-spyAmber relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-spyAmber/10 animate-ping"></div>
                </div>
                <div className="bg-spySlate/50 border-4 border-white/5 rounded-[40px] p-8 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} /></div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6 leading-none border-b-2 border-spyAmber pb-4 inline-block">{t.briefingTitle}</h2>
                  <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-wider mb-2">
                    <TerminalText text={t.briefingText} delay={20} />
                  </p>
                  <div className="mt-6 flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-spyAmber animate-pulse"></div>
                     <div className="w-2 h-2 rounded-full bg-spyAmber/50 animate-pulse delay-75"></div>
                     <div className="w-2 h-2 rounded-full bg-spyAmber/20 animate-pulse delay-150"></div>
                  </div>
                </div>
                <button onClick={() => setOnboardingStep('NAME')} className="w-full bg-spyAmber text-black font-black py-6 rounded-3xl shadow-[0_8px_0_#b37b00] active:translate-y-2 active:shadow-none transition-all text-xl uppercase tracking-widest flex items-center justify-center gap-3">
                   {t.startInfiltration} <ChevronRight />
                </button>
                <button type="button" onClick={() => setOnboardingStep('LANG')} className="mt-8 text-[10px] text-white/30 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white transition-colors">
                  <ChevronLeft size={14}/> BACK_TO_CIPHER
                </button>
              </div>
            ) : onboardingStep === 'NAME' ? (
              <div className="w-full px-4 animate-in slide-in-from-right-10">
                <div className="w-32 h-32 bg-spyCyan/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyCyan shadow-[0_0_40px_rgba(0,242,255,0.3)] animate-pulse">
                  <UserCircle size={64} className="text-spyCyan" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 text-center leading-none">{t.identityReq}</h2>
                <form onSubmit={(e) => { e.preventDefault(); if(tempName.trim()) { setAgentName(tempName.trim().toUpperCase()); setOnboardingStep('AGE'); } }} className="space-y-6">
                  <input type="text" maxLength={12} value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder={t.enterCodename} className="w-full bg-spySlate border-4 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black text-spyCyan placeholder:text-white/10 focus:border-spyCyan focus:outline-none transition-all text-center uppercase tracking-widest" autoFocus />
                  <button disabled={!tempName.trim()} className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#00a6af] active:translate-y-2 active:shadow-none transition-all text-xl">{t.confirmIdentity}</button>
                  <button type="button" onClick={() => setOnboardingStep('INTRO')} className="w-full text-[10px] text-white/30 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white transition-colors">
                    <ChevronLeft size={14}/> BACK_TO_BRIEFING
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full animate-in slide-in-from-right-10">
                <div className="w-32 h-32 bg-spyPink/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyPink shadow-[0_0_40px_rgba(255,0,122,0.3)] animate-pulse">
                  <Fingerprint size={64} className="text-spyPink" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 text-center leading-none">{t.welcome},<br/><span className="text-spyPink">{agentName}!</span></h2>
                <p className="text-xs text-white/50 mb-12 text-center font-black px-12 uppercase tracking-widest leading-relaxed">{t.selectRank}</p>
                <div className="grid grid-cols-2 gap-5 w-full px-2 pb-10">
                  {[6, 7, 8, 9, 10, 11, 12].map((age) => {
                    const rank = getRankInfo(age);
                    return (
                      <button 
                        key={age} 
                        onClick={() => { setAgentAge(age); setView('HOME'); }} 
                        className="p-6 rounded-[40px] border-4 text-center transition-all active:scale-95 flex flex-col items-center group relative overflow-hidden bg-spySlate/50 border-white/10 hover:border-spyCyan hover:bg-spyCyan hover:text-black"
                      >
                        <span className="text-5xl font-black group-hover:scale-110 transition-transform mb-1 leading-none">{age}</span>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">{t.yearsSuffix}</span>
                          <span className={`text-[11px] font-black uppercase tracking-widest mt-2 bg-black/20 group-hover:bg-black/10 px-3 py-1 rounded-full`}>
                            {rank.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button type="button" onClick={() => setOnboardingStep('NAME')} className="w-full text-[10px] text-white/30 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white transition-colors">
                   <ChevronLeft size={14}/> BACK_TO_IDENTITY
                </button>
              </div>
            )}
          </div>
        ) : view === 'HOME' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-spyCyan/30 via-spyDark to-spyDark p-8 rounded-[40px] border-4 border-spyCyan/40 relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(0,242,255,0.3)]">
              <Radar className="absolute -bottom-10 -right-10 text-spyCyan/10 w-48 h-48 group-hover:scale-125 transition-transform duration-700" />
              <div className="flex items-center gap-3 text-spyCyan mb-4">
                <Sparkles size={24} className="animate-spin-slow" />
                <h2 className="text-sm font-black tracking-widest uppercase italic">{t.radarTitle}</h2>
              </div>
              <p className="text-lg text-white font-black mb-8 leading-tight">{t.radarDesc} <span className="text-spyCyan">{agentName}</span>?</p>
              
              <div className="space-y-4">
                <button onClick={handleScanSurroundings} className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl flex items-center justify-center gap-4 shadow-[0_8px_0_#00a6af] hover:shadow-[0_4px_0_#00a6af] hover:translate-y-[4px] active:translate-y-2 active:shadow-none transition-all group text-lg uppercase">
                  <Radar size={28} className="group-hover:rotate-180 transition-transform duration-1000" /> {t.scanSector}
                </button>

                <div className="relative pt-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-[0.4em] font-black">
                    <span className="bg-[#0b1b2b] px-4 text-white/20">OU</span>
                  </div>
                </div>

                <form onSubmit={handleSearchByName} className="mt-4 flex gap-3 relative z-10">
                  <div className="relative flex-1 group">
                    <input 
                      type="text" 
                      value={manualSearchInput}
                      onChange={(e) => setManualSearchInput(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-black/40 border-4 border-white/5 rounded-3xl py-4 pl-12 pr-6 font-black text-spyCyan uppercase tracking-widest placeholder:text-white/10 focus:border-spyCyan/50 focus:outline-none transition-all text-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-spyCyan transition-colors" size={20} />
                  </div>
                  <button 
                    type="submit"
                    disabled={!manualSearchInput.trim() || isScanning}
                    className="bg-spySlate border-4 border-white/5 p-4 rounded-3xl text-spyCyan hover:border-spyCyan hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale cursor-pointer"
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </div>
            
            <div className="grid gap-6">
              {missions.length > 0 ? missions.map(m => (
                <MissionCard key={m.id} mission={m} t={t} onSelect={(m) => { setActiveMissionId(m.id); setView('MISSION_DETAIL'); }} />
              )) : (
                <div className="py-20 text-center border-4 border-dashed border-white/5 rounded-[40px] bg-white/2">
                   <Ghost size={50} className="mx-auto text-white/10 mb-4 animate-pulse" />
                   <p className="text-sm text-white/20 font-black uppercase tracking-widest">{t.noMissions}</p>
                </div>
              )}
            </div>
          </div>
        ) : view === 'SELECT_LOCATION' ? (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-spyCyan font-black text-sm uppercase bg-spyCyan/10 px-6 py-3 rounded-full border-2 border-spyCyan/20 hover:bg-spyCyan hover:text-black transition-all">
              <ChevronLeft size={20} /> {t.abortScan}
            </button>
            <div className="mb-10 p-8 rounded-[40px] border-4 border-spyAmber/40 bg-spyAmber/5 flex gap-5 shadow-2xl shadow-spyAmber/10">
               <div className="bg-spyAmber p-4 rounded-3xl self-start shadow-lg"><Flame className="text-black" /></div>
               <div>
                 <h2 className="text-2xl font-black text-white uppercase leading-none mb-2">{t.targetsLocked}</h2>
                 <p className="text-sm text-spyAmber font-black uppercase tracking-widest">{t.pickZone}, {agentName}.</p>
               </div>
            </div>
            <div className="space-y-5">
              {detectedTargets.map((target, idx) => (
                <button key={idx} onClick={() => handleSelectTarget(target)} className="w-full text-left bg-spySlate p-8 rounded-[40px] border-4 border-white/5 hover:border-spyCyan hover:scale-[1.03] active:scale-95 transition-all relative overflow-hidden group shadow-2xl">
                  <span className="text-xs text-spyCyan font-black uppercase mb-3 block tracking-[0.3em]">TGT_{idx+1}</span>
                  <h3 className="text-2xl font-black text-white uppercase leading-tight mb-3">{target.name}</h3>
                  <p className="text-sm text-white/60 font-bold italic leading-relaxed">{target.description}</p>
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transform"><ChevronRight size={32} className="text-spyCyan" /></div>
                </button>
              ))}
            </div>
          </div>
        ) : view === 'SETTINGS' ? (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-20 h-20 rounded-[30px] bg-spyCyan text-black flex items-center justify-center shadow-lg shadow-spyCyan/20">
                  <Fingerprint size={40} />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{agentName}</h2>
                   <p className="text-xs font-black text-spyCyan uppercase tracking-[0.2em] mt-1">{t.rank}: {agentAge} {t.yearsSuffix}</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="p-8 rounded-[40px] bg-spySlate border-4 border-white/5 space-y-6">
                   <div className="flex items-center gap-3">
                      <Languages size={24} className="text-spyPink" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">{t.cipherSelect}</span>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {(['EN', 'IT', 'FR', 'PT'] as Language[]).map(l => (
                        <button key={l} onClick={() => setLang(l)} className={`py-3 rounded-2xl font-black text-xs transition-all border-2 ${lang === l ? 'bg-spyPink border-spyPink text-black' : 'border-white/10 text-white/40 hover:border-spyPink/50'}`}>{l}</button>
                      ))}
                   </div>
                </div>
                <div className="p-8 rounded-[40px] bg-spySlate border-4 border-white/5 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Globe size={24} className="text-spyCyan" />
                         <span className="text-sm font-black text-white uppercase tracking-widest">{t.satelliteLink}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${hasValidKey ? 'text-spyGreen' : 'text-spyRed'} animate-pulse`}>
                         {hasValidKey ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                      </div>
                   </div>
                   <button onClick={handleOpenKeySelector} className="w-full bg-spyCyan text-black font-black py-4 rounded-3xl shadow-[0_6px_0_#00a6af] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase text-[10px]"><RefreshCw size={18} /> {t.updateKey}</button>
                </div>
                <button onClick={() => { setView('ONBOARDING'); setOnboardingStep('LANG'); }} className="w-full py-4 border-2 border-spyRed/30 text-spyRed font-black uppercase text-[10px] tracking-[0.4em] rounded-3xl hover:bg-spyRed/10 transition-all mt-10">{t.terminateIdentity}</button>
             </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-spyCyan font-black text-sm uppercase bg-spyCyan/10 px-6 py-3 rounded-full border-2 border-spyCyan/20 hover:bg-spyCyan hover:text-black transition-all"><ChevronLeft size={20} /> {t.retreat}</button>
              <div className="flex items-center gap-3">
                {lastTarget && (
                  <button onClick={handleRegenerateMission} className="flex items-center gap-2 text-spyAmber font-black text-xs uppercase bg-spyAmber/10 px-4 py-3 rounded-full border-2 border-spyAmber/20 hover:bg-spyAmber hover:text-black transition-all">
                    <RefreshCw size={16} /> NEW
                  </button>
                )}
                {currentMission?.status === 'COMPLETED' && <div className="bg-spyGreen text-black font-black text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-spyGreen/30 animate-bounce"><Trophy size={18}/> {t.missionClear}</div>}
              </div>
            </div>
            {currentMission && (
              <div className="space-y-8 pb-10">
                <div className="p-8 rounded-[40px] border-4 border-spyGreen/30 bg-spyGreen/5 relative overflow-hidden shadow-2xl shadow-spyGreen/10">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="bg-spyGreen text-black text-[10px] font-black px-3 py-1.5 rounded-lg">{t.topSecret}</span>
                     <span className="text-spyGreen text-xs font-black tracking-widest">{currentMission.codeName}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase mb-4 leading-[0.9] tracking-tighter">{currentMission.title}</h2>
                  <p className="text-sm text-white/70 font-bold leading-relaxed mb-8">{currentMission.description}</p>
                  <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden border-2 border-white/5 p-1">
                    <div className="h-full bg-spyGreen rounded-full transition-all duration-700 shadow-[0_0_25px_#00ff41]" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] font-black text-spyGreen uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Sparkles size={14}/> {t.intelCaptured}</span>
                     <span>{currentMission.tasks.filter(tk => tk.completed).length} / {currentMission.tasks.length} {t.secured}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   {currentMission.tasks.map(tk => (
                     <TaskItem key={tk.id} task={tk} t={t} onToggle={(tid) => toggleTask(currentMission.id, tid)} />
                   ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {view !== 'ONBOARDING' && (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-spyDark/90 backdrop-blur-2xl border-t-2 border-white/10 p-5 flex justify-around items-center z-50 rounded-t-[40px]">
          <button onClick={() => setView('HOME')} className={`p-4 rounded-3xl transition-all ${view === 'HOME' || view === 'SELECT_LOCATION' ? 'bg-spyCyan text-black scale-110 shadow-lg shadow-spyCyan/40' : 'text-white/40 hover:text-spyCyan hover:bg-spyCyan/10'}`}><Radar size={32} /></button>
          <button onClick={() => setView('MISSION_DETAIL')} className={`p-4 rounded-3xl transition-all ${view === 'MISSION_DETAIL' ? 'bg-spyPink text-black scale-110 shadow-lg shadow-spyPink/40' : 'text-white/40 hover:text-spyPink hover:bg-spyPink/10'}`}><Terminal size={32} /></button>
          <button onClick={() => setView('SETTINGS')} className={`p-4 rounded-3xl transition-all ${view === 'SETTINGS' ? 'bg-spyAmber text-black scale-110 shadow-lg shadow-spyAmber/40' : 'text-white/40 hover:text-spyAmber hover:bg-spyAmber/10'}`}><UserCircle size={32} /></button>
          <button onClick={() => window.location.reload()} className="p-4 text-white/40 hover:text-spyRed transition-all"><Power size={32} /></button>
        </footer>
      )}
    </div>
  );
};

export default App;
