
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Terminal, ShieldAlert, Cpu, User, ChevronLeft, Power, Globe, LocateFixed, Radar, ExternalLink, Crosshair, Target, ChevronRight, Fingerprint, Activity, Zap, Key, Star, Trophy, Rocket, Ghost, Sparkles, Flame, UserCircle, Settings, ShieldCheck, ShieldX, CheckCircle2, RefreshCw, Languages, Search, Send, Shield, Eye, Info, MapPin, Navigation, Tag, Trash2 } from 'lucide-react';
import { getLocalizedMockMissions } from './data';
import { Mission, Task, TaskType, SensoryType, Language, Translations, NearbyTarget } from './types';
import { storage } from './storage';
import MissionCard from './components/MissionCard';
import TaskItem from './components/TaskItem';
import TerminalText from './components/TerminalText';
import LocationScanner from './components/LocationScanner';
import MissionComplete from './components/MissionComplete';

const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const sortByDistance = (targets: NearbyTarget[], origin: { lat: number; lng: number } | null): NearbyTarget[] => {
  if (!origin) return targets;
  return [...targets].sort((a, b) => {
    const da = typeof a.lat === 'number' && typeof a.lng === 'number' ? getDistanceKm(origin.lat, origin.lng, a.lat, a.lng) : Infinity;
    const db = typeof b.lat === 'number' && typeof b.lng === 'number' ? getDistanceKm(origin.lat, origin.lng, b.lat, b.lng) : Infinity;
    return da - db;
  });
};

const formatDistance = (km: number): string => km < 1 ? `${Math.round(km * 1000)} M` : `${km.toFixed(1)} KM`;

const getGoogleMapsUrl = (name: string, address?: string): string => {
  const query = [name, address].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const TRANSLATIONS: Record<Language, Translations> = {
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
    error_gps: 'GPS_LINK_FAILURE',
    apiError: 'FREE_UPLINK_LIMIT: SATELLITE_CONGESTION. RE-ESTABLISHING_IN_30S.',
    privacyLabel: 'PRIVACY_PROTOCOL',
    privacyInfo: 'We use Vercel Analytics to improve the service. No personal data or cookies are collected. GDPR compliant.',
    findNewMission: 'FIND_NEW_TARGET',
    keepBrowsing: 'KEEP_BROWSING',
    viewOnMaps: 'VIEW_ON_MAPS',
    deleteMission: 'Delete Mission',
    confirmDeleteTitle: 'Delete this mission?',
    confirmDeleteBody: 'All progress on this mission will be lost. This cannot be undone.',
    cancel: 'Cancel',
    stepOf: 'Step',
    viewLastResults: 'View Last Scan Results'
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
    error_gps: 'ERRORE_LINK_GPS',
    apiError: 'LIMITE_UPLINK_GRATUITO: CONGESTIONE_SATELLITE. RIPROVA_TRA_30S.',
    privacyLabel: 'PROTOCOLLO_PRIVACY',
    privacyInfo: 'Usiamo Vercel Analytics per migliorare il servizio. Non vengono raccolti dati personali o cookie. Conforme al GDPR.',
    findNewMission: 'NUOVO_OBIETTIVO',
    keepBrowsing: 'CONTINUA_A_ESPLORARE',
    viewOnMaps: 'VEDI_SU_MAPS',
    deleteMission: 'Elimina Missione',
    confirmDeleteTitle: 'Eliminare questa missione?',
    confirmDeleteBody: 'Tutti i progressi su questa missione andranno persi. Non si può annullare.',
    cancel: 'Annulla',
    stepOf: 'Passo',
    viewLastResults: 'Vedi Ultima Scansione'
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
    error_gps: 'ERREUR_GPS',
    apiError: 'LIMITE_LIAISON_GRATUITE : CONGESTION_SATELLITE. RÉESSAYER_DANS_30S.',
    privacyLabel: 'PROTOCOLE_PRIVACY',
    privacyInfo: "Nous utilisons Vercel Analytics pour améliorer le service. Aucune donnée personnelle ou cookie n'est collecté. Conforme au RGPD.",
    findNewMission: 'NOUVELLE_CIBLE',
    keepBrowsing: 'CONTINUER_EXPLORATION',
    viewOnMaps: 'VOIR_SUR_MAPS',
    deleteMission: 'Supprimer la mission',
    confirmDeleteTitle: 'Supprimer cette mission ?',
    confirmDeleteBody: 'Toute la progression sur cette mission sera perdue. Action irréversible.',
    cancel: 'Annuler',
    stepOf: 'Étape',
    viewLastResults: 'Voir Le Dernier Scan'
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
    noMissions: 'Nenhuma Missão Ativa',
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
    error_gps: 'FALHA_LINK_GPS',
    apiError: 'LIMITE_DE_LINK_GRATUITO: CONGESTIONAMENTO_SATÉLITE. RECONECTANDO_EM_30S.',
    privacyLabel: 'PROTOCOLO_PRIVACIDADE',
    privacyInfo: 'Usamos o Vercel Analytics para melhorar o serviço. Não são coletados dados pessoais ou cookies. Em conformidade com o RGPD.',
    findNewMission: 'NOVO_ALVO',
    keepBrowsing: 'CONTINUAR_EXPLORANDO',
    viewOnMaps: 'VER_NO_MAPS',
    deleteMission: 'Excluir Missão',
    confirmDeleteTitle: 'Excluir esta missão?',
    confirmDeleteBody: 'Todo o progresso nesta missão será perdido. Essa ação não pode ser desfeita.',
    cancel: 'Cancelar',
    stepOf: 'Passo',
    viewLastResults: 'Ver Último Escaneamento'
  }
};

const App: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [lang, setLang] = useState<Language>(() => storage.getProfile()?.lang ?? 'EN');
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = storage.getMissions();
    return saved && saved.length > 0 ? saved : getLocalizedMockMissions(storage.getProfile()?.lang ?? 'EN');
  });
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [view, setView] = useState<'ONBOARDING' | 'HOME' | 'SELECT_LOCATION' | 'MISSION_DETAIL' | 'SETTINGS'>(() => {
    if (!storage.getProfile()) return 'ONBOARDING';
    const savedSearch = storage.getSearchResults();
    return savedSearch && savedSearch.targets.length > 0 ? 'SELECT_LOCATION' : 'HOME';
  });
  const [agentName, setAgentName] = useState(() => storage.getProfile()?.name ?? '');
  const [tempName, setTempName] = useState('');
  const [onboardingStep, setOnboardingStep] = useState<'LANG' | 'INTRO' | 'NAME' | 'AGE'>('LANG');
  const [agentAge, setAgentAge] = useState<number | null>(() => storage.getProfile()?.age ?? null);
  const [manualSearchInput, setManualSearchInput] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const [lastTarget, setLastTarget] = useState<NearbyTarget | null>(() => storage.getSearchResults()?.lastTarget ?? null);
  const [scanStatus, setScanStatus] = useState('');
  const [scanError, setScanError] = useState<string | undefined>(undefined);
  const [detectedTargets, setDetectedTargets] = useState<NearbyTarget[]>(() => storage.getSearchResults()?.targets ?? []);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [searchOrigin, setSearchOrigin] = useState<{lat: number, lng: number} | null>(() => storage.getSearchResults()?.origin ?? null);
  const [showKeySelection, setShowKeySelection] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);
  const [completedMission, setCompletedMission] = useState<Mission | null>(null);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [focusedTaskIndex, setFocusedTaskIndex] = useState<number | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    checkKeyStatus();
  }, []);

  // Persist missions (progress, evidence, completion) so a reload doesn't lose them.
  useEffect(() => {
    storage.saveMissions(missions);
  }, [missions]);

  // Persist the last search result list so revisiting it — or reloading mid-browse —
  // never costs another /api/scan or /api/search call. Only a new search replaces it.
  useEffect(() => {
    storage.saveSearchResults({ targets: detectedTargets, origin: searchOrigin, lastTarget });
  }, [detectedTargets, searchOrigin, lastTarget]);

  // Reset step navigation whenever a different mission is opened.
  useEffect(() => {
    setFocusedTaskIndex(null);
  }, [activeMissionId]);

  // Persist the agent's profile once onboarding is complete, and keep it in sync with language changes.
  useEffect(() => {
    if (agentName && agentAge) {
      storage.saveProfile({ name: agentName, age: agentAge, lang });
    }
  }, [agentName, agentAge, lang]);

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

  const handleTerminateIdentity = () => {
    storage.clearAll();
    setAgentName('');
    setAgentAge(null);
    setMissions([]);
    setActiveMissionId(null);
    setDetectedTargets([]);
    setSearchOrigin(null);
    setLastTarget(null);
    setView('ONBOARDING');
    setOnboardingStep('LANG');
  };

  const handleConfirmDeleteMission = () => {
    if (!missionToDelete) return;
    setMissions(prev => prev.filter(m => m.id !== missionToDelete.id));
    if (activeMissionId === missionToDelete.id) {
      setActiveMissionId(null);
      setView('HOME');
    }
    setMissionToDelete(null);
  };

  const toggleTask = (missionId: string, taskId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const newTasks = mission.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const allDone = newTasks.every(task => task.completed);
    const wasCompleted = mission.status === 'COMPLETED';
    const updatedMission: Mission = { ...mission, tasks: newTasks, status: allDone ? 'COMPLETED' : 'ACTIVE' };

    setMissions(prevMissions => prevMissions.map(m => m.id === missionId ? updatedMission : m));

    if (allDone && !wasCompleted) {
      setCompletedMission(updatedMission);
    }
  };

  const formatApiError = (err: any, t: Translations): string => {
    const errorMsg = err.message || (typeof err === 'string' ? err : '');
    
    const getRetrySeconds = (apiErr: any, msg: string): number => {
      const details = Array.isArray(apiErr.details) ? apiErr.details : [];
      const retryInfo = details.find((d: any) => d['@type']?.includes('RetryInfo'));
      
      const secondsFromDetails = retryInfo?.retryDelay?.match(/(\d+)/)?.[1];
      if (secondsFromDetails) return parseInt(secondsFromDetails);

      const secondsFromMsg = msg.match(/retry in ([\d.]+)/i)?.[1];
      if (secondsFromMsg) return Math.floor(parseFloat(secondsFromMsg));

      return 30; 
    };

    try {
      const jsonStart = errorMsg.indexOf('{');
      const apiErr = jsonStart !== -1 
        ? (JSON.parse(errorMsg.substring(jsonStart)).error || JSON.parse(errorMsg.substring(jsonStart)))
        : err;

      const details = Array.isArray(apiErr.details) ? apiErr.details : [];
      const isQuotaExceeded = details.some((d: any) => d['@type']?.includes('QuotaFailure')) || 
                              apiErr.status === 'RESOURCE_EXHAUSTED' || 
                              apiErr.code === 429;

      if (isQuotaExceeded) {
        return t.apiError.replace(/\d+S/i, `${getRetrySeconds(apiErr, errorMsg)}S`);
      }
    } catch (e) {
      // JSON parse error, proceed to fallback
    }

    const isRateLimited = errorMsg.includes('429') || 
                          errorMsg.includes('RESOURCE_EXHAUSTED') || 
                          errorMsg.includes('quota');

    if (isRateLimited) {
      const match = errorMsg.match(/retry in ([\d.]+)s/i);
      const seconds = match ? Math.floor(parseFloat(match[1])) : 30;
      return t.apiError.replace(/\d+S/i, `${seconds}S`);
    }
    
    return errorMsg.length > 100 ? t.apiError : (errorMsg || t.apiError);
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
      setScanStatus(t.status_connecting);

      let latLng = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 1500, maximumAge: 60000 });
        });
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch(e) {
        console.warn("Location context unavailable for manual search.");
      }

      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang, latLng })
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 404) {
          setShowKeySelection(true);
          setHasValidKey(false);
          throw new Error(t.uplinkRequired);
        }
        throw new Error(err.error || t.error_radar);
      }

      const { targets } = await res.json();
      const origin = latLng ? { lat: latLng.latitude, lng: latLng.longitude } : null;
      setSearchOrigin(origin);
      setDetectedTargets(sortByDistance(targets, origin));
      setView('SELECT_LOCATION');
      setIsScanning(false);
      setManualSearchInput('');
    } catch (err: any) {
      setScanError(formatApiError(err, t));
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
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords({ lat: latitude, lng: longitude });
      setScanStatus(t.status_connecting);

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latitude, lng: longitude, lang })
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 404) {
          setShowKeySelection(true);
          setHasValidKey(false);
          throw new Error(t.uplinkRequired);
        }
        throw new Error(err.error || t.error_radar);
      }

      const { targets } = await res.json();
      const origin = { lat: latitude, lng: longitude };
      setSearchOrigin(origin);
      setDetectedTargets(sortByDistance(targets, origin));
      setView('SELECT_LOCATION');
      setIsScanning(false);
    } catch (err: any) {
      setScanError(formatApiError(err, t));
    }
  };

  const handleRegenerateMission = () => {
    if (!lastTarget) return;
    const cacheKey = `${lastTarget.name.toLowerCase().replace(/\s+/g, '_')}_${lang}`;
    storage.clearMissionCache(cacheKey);
    handleSelectTarget(lastTarget);
  };

  const handleSelectTarget = async (target: NearbyTarget) => {
    if (!agentAge) return;
    setLastTarget(target);
    setIsScanning(true);
    setScanError(undefined);
    setScanStatus(t.status_encrypting);

    const targetMeta = {
      targetName: target.name,
      targetAddress: target.address,
      targetLat: target.lat,
      targetLng: target.lng,
      targetDistanceKm: searchOrigin && typeof target.lat === 'number' && typeof target.lng === 'number'
        ? getDistanceKm(searchOrigin.lat, searchOrigin.lng, target.lat, target.lng)
        : undefined
    };

    try {
      // Check the mission cache first — same location + language = same mission, zero API cost
      const cacheKey = `${target.name.toLowerCase().replace(/\s+/g, '_')}_${lang}`;
      const cachedMission = storage.getMissionCache<any>(cacheKey);
      if (cachedMission) {
        const newMission: Mission = {
          ...cachedMission,
          ...targetMeta,
          id: `gen-${Date.now()}`,
          status: 'PENDING',
          isLocked: false,
          category: 'ART',
          tasks: (cachedMission.tasks || []).map((task: any, i: number) => ({
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

      const apiRes = await fetch('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetName: target.name, agentName, agentAge, lang })
      });

      if (!apiRes.ok) {
        const err = await apiRes.json();
        if (apiRes.status === 404) {
          setShowKeySelection(true);
          setHasValidKey(false);
        }
        throw new Error(err.error || t.apiError);
      }

      const data = await apiRes.json();

      // Save to cache so the same location never triggers another API call
      storage.saveMissionCache(cacheKey, data);

      const newMission: Mission = {
        ...data,
        ...targetMeta,
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
      setScanError(formatApiError(err, t));
    }
  };

  const currentMission = activeMissionId ? missions.find(m => m.id === activeMissionId) : null;
  const completedCount = missions.reduce((acc, m) => acc + m.tasks.filter(tk => tk.completed).length, 0);
  const progressPercent = currentMission ? (currentMission.tasks.filter(tk => tk.completed).length / currentMission.tasks.length) * 100 : 0;
  const firstIncompleteIndex = currentMission ? currentMission.tasks.findIndex(tk => !tk.completed) : -1;
  const defaultStepIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
  const stepIndex = focusedTaskIndex !== null
    ? Math.max(0, Math.min((currentMission?.tasks.length ?? 1) - 1, focusedTaskIndex))
    : defaultStepIndex;
  const viewTask = currentMission?.tasks[stepIndex] ?? null;
  const goToStep = (i: number) => {
    if (!currentMission) return;
    setFocusedTaskIndex(Math.max(0, Math.min(currentMission.tasks.length - 1, i)));
  };

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

      {completedMission && (
        <MissionComplete
          mission={completedMission}
          t={t}
          onFindNew={() => { setCompletedMission(null); setView('HOME'); }}
          onClose={() => setCompletedMission(null)}
        />
      )}

      {missionToDelete && (
        <div className="fixed inset-0 z-[200] bg-spyDark/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center m-4 rounded-[40px] border-4 border-spyRed animate-in zoom-in duration-300">
          <Trash2 size={56} className="text-spyRed mb-6" />
          <h2 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter leading-tight">{t.confirmDeleteTitle}</h2>
          <p className="text-base text-white/60 mb-8 leading-relaxed px-2">{t.confirmDeleteBody}</p>
          <div className="flex flex-col gap-4 w-full self-stretch">
            <button onClick={handleConfirmDeleteMission} className="w-full bg-spyRed text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#a11f1f] active:translate-y-2 active:shadow-none transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-3">
              <Trash2 size={20} /> {t.deleteMission}
            </button>
            <button onClick={() => setMissionToDelete(null)} className="w-full bg-white/10 text-white/70 font-black py-4 rounded-3xl hover:bg-white/20 transition-all text-base uppercase tracking-widest">
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {showKeySelection && (
        <div className="fixed inset-0 z-[200] bg-spyDark/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center m-4 rounded-[40px] border-4 border-spyCyan glow-border animate-in zoom-in duration-300">
          <Key size={60} className="text-spyCyan mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter leading-none">{t.uplinkRequired}</h2>
          <p className="text-sm text-white/60 mb-8 font-mono leading-relaxed px-4 italic">{t.satelliteDesc}</p>
          <div className="flex flex-col gap-4 w-full self-stretch">
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
        <header className="sticky top-0 z-50 bg-spyDark/80 backdrop-blur-xl border-b-2 border-white/10 px-3 py-3 sm:p-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-gradient-to-br from-spyCyan to-spyPink text-black flex items-center justify-center rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
              <Ghost size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-white leading-none uppercase tracking-tighter truncate">Spy_Squad</h1>
              <div className="text-[10px] text-spyCyan font-black tracking-widest uppercase flex items-center gap-1 animate-pulse whitespace-nowrap"><Activity size={10}/> {t.stealthOn}</div>
            </div>
          </div>
          <div className="bg-spySlate px-3 py-2 sm:px-4 rounded-2xl border-2 border-white/10 flex items-center gap-2 text-right flex-shrink-0">
            <div>
               <span className="block text-[10px] font-black text-spyCyan uppercase leading-none mb-0.5 max-w-[80px] truncate">{agentName}</span>
               <span className="text-sm font-black text-white tracking-widest leading-none whitespace-nowrap">{completedCount * 10} {t.xp}</span>
            </div>
            <Zap size={18} className="text-spyAmber animate-pulse" />
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto p-5 pb-28">
        {view === 'ONBOARDING' ? (
          <div className="h-full flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
            {onboardingStep === 'LANG' ? (
              <div className="w-full self-stretch px-4 animate-in slide-in-from-bottom-10">
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
              <div className="w-full self-stretch px-4 animate-in slide-in-from-right-10 flex flex-col h-full items-center justify-center">
                <div className="w-32 h-32 bg-spyAmber/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyAmber shadow-[0_0_40px_rgba(255,176,0,0.3)] relative overflow-hidden group">
                  <Shield size={64} className="text-spyAmber relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-spyAmber/10 animate-ping"></div>
                </div>
                <div className="w-full self-stretch bg-spySlate/50 border-4 border-white/5 rounded-[40px] p-8 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} /></div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-6 leading-tight border-b-2 border-spyAmber pb-4">{t.briefingTitle}</h2>
                  <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-wider mb-2">
                    <TerminalText text={t.briefingText} delay={20} />
                  </p>
                  <div className="mt-6 flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-spyAmber animate-pulse"></div>
                     <div className="w-2 h-2 rounded-full bg-spyAmber/50 animate-pulse delay-75"></div>
                     <div className="w-2 h-2 rounded-full bg-spyAmber/20 animate-pulse delay-150"></div>
                  </div>
                </div>
                <button onClick={() => setOnboardingStep('NAME')} className="w-full self-stretch bg-spyAmber text-black font-black py-6 rounded-3xl shadow-[0_8px_0_#b37b00] active:translate-y-2 active:shadow-none transition-all text-sm sm:text-xl uppercase tracking-normal sm:tracking-widest flex items-center justify-center gap-2 sm:gap-3 px-4 text-center">
                   {t.startInfiltration} <ChevronRight className="flex-shrink-0" />
                </button>
                <button type="button" onClick={() => setOnboardingStep('LANG')} className="mt-8 text-[10px] text-white/30 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white transition-colors">
                  <ChevronLeft size={14}/> BACK_TO_CIPHER
                </button>
              </div>
            ) : onboardingStep === 'NAME' ? (
              <div className="w-full self-stretch px-4 animate-in slide-in-from-right-10">
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
              <div className="w-full self-stretch animate-in slide-in-from-right-10">
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
            <div className="mt-12 mb-4 text-[10px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              Made with ❤️ by <a href="https://github.com/Sarah86" target="_blank" rel="noopener noreferrer" className="text-spyPink hover:text-white transition-colors underline decoration-spyPink/30">Sarah86</a>
            </div>
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

            {detectedTargets.length > 0 && (
              <button
                onClick={() => setView('SELECT_LOCATION')}
                className="w-full flex items-center justify-between gap-3 bg-spyAmber/10 border-4 border-spyAmber/30 rounded-[32px] p-6 hover:border-spyAmber hover:bg-spyAmber/20 transition-all"
              >
                <div className="flex items-center gap-3 text-left">
                  <Flame className="text-spyAmber flex-shrink-0" size={22} />
                  <span className="text-sm font-black uppercase text-white">{t.viewLastResults} ({detectedTargets.length})</span>
                </div>
                <ChevronRight className="text-spyAmber flex-shrink-0" size={22} />
              </button>
            )}

            <div className="grid gap-6">
              {missions.length > 0 ? missions.map(m => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  t={t}
                  onSelect={(m) => { setActiveMissionId(m.id); setView('MISSION_DETAIL'); }}
                  onDelete={(m) => setMissionToDelete(m)}
                />
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
              {detectedTargets.map((target, idx) => {
                const distanceKm = searchOrigin && typeof target.lat === 'number' && typeof target.lng === 'number'
                  ? getDistanceKm(searchOrigin.lat, searchOrigin.lng, target.lat, target.lng)
                  : null;
                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectTarget(target)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectTarget(target); }}
                    className="w-full text-left bg-spySlate p-8 rounded-[40px] border-4 border-white/5 hover:border-spyCyan hover:scale-[1.03] active:scale-95 transition-all relative overflow-hidden group shadow-2xl cursor-pointer"
                  >
                    <span className="text-xs text-spyCyan font-black uppercase mb-3 block tracking-[0.3em]">TGT_{idx+1}</span>
                    <h3 className="text-2xl font-black text-white uppercase leading-tight mb-3 pr-10">{target.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {target.type && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-spyAmber bg-spyAmber/10 border border-spyAmber/20 px-3 py-1.5 rounded-full">
                          <Tag size={11} /> {target.type}
                        </span>
                      )}
                      {distanceKm !== null && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-spyGreen bg-spyGreen/10 border border-spyGreen/20 px-3 py-1.5 rounded-full">
                          <Navigation size={11} /> {formatDistance(distanceKm)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 font-bold italic leading-relaxed mb-4">{target.description}</p>
                    {target.address && (
                      <div className="flex items-start gap-2 text-xs text-white/40 font-bold mb-4">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5 text-spyCyan" />
                        <span>{target.address}</span>
                      </div>
                    )}
                    <a
                      href={getGoogleMapsUrl(target.name, target.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-10 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-spyCyan bg-spyCyan/10 border-2 border-spyCyan/20 px-4 py-2 rounded-full hover:bg-spyCyan hover:text-black transition-all"
                    >
                      <ExternalLink size={12} /> {t.viewOnMaps}
                    </a>
                    <div className="absolute top-1/2 -translate-y-1/2 right-6 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transform"><ChevronRight size={32} className="text-spyCyan" /></div>
                  </div>
                );
              })}
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
                <button onClick={handleTerminateIdentity} className="w-full py-4 border-2 border-spyRed/30 text-spyRed font-black uppercase text-[10px] tracking-[0.4em] rounded-3xl hover:bg-spyRed/10 transition-all mt-10">{t.terminateIdentity}</button>
             </div>
                <div className="mt-10 pb-4 text-[10px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                  Made with ❤️ by <a href="https://github.com/Sarah86" target="_blank" rel="noopener noreferrer" className="text-spyPink hover:text-white transition-colors underline decoration-spyPink/30">Sarah86</a>
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
                {currentMission && (
                  <button
                    onClick={() => setMissionToDelete(currentMission)}
                    aria-label={t.deleteMission}
                    className="flex items-center gap-2 text-white/40 font-black text-xs uppercase bg-white/5 p-3 rounded-full border-2 border-white/10 hover:bg-spyRed hover:border-spyRed hover:text-black transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
                  <p className="text-sm text-white/70 font-bold leading-relaxed mb-6">{currentMission.description}</p>
                  {(currentMission.targetAddress || typeof currentMission.targetDistanceKm === 'number') && (
                    <div className="mb-6 pb-6 border-b-2 border-white/5 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {typeof currentMission.targetDistanceKm === 'number' && (
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-spyGreen bg-spyGreen/10 border border-spyGreen/20 px-3 py-1.5 rounded-full">
                            <Navigation size={11} /> {formatDistance(currentMission.targetDistanceKm)}
                          </span>
                        )}
                        <a
                          href={getGoogleMapsUrl(currentMission.targetName ?? currentMission.title, currentMission.targetAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-spyCyan bg-spyCyan/10 border-2 border-spyCyan/20 px-4 py-2 rounded-full hover:bg-spyCyan hover:text-black transition-all"
                        >
                          <ExternalLink size={12} /> {t.viewOnMaps}
                        </a>
                      </div>
                      {currentMission.targetAddress && (
                        <div className="flex items-start gap-2 text-xs text-white/60 font-bold">
                          <MapPin size={14} className="flex-shrink-0 mt-0.5 text-spyCyan" />
                          <span>{currentMission.targetAddress}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden border-2 border-white/5 p-1">
                    <div className="h-full bg-spyGreen rounded-full transition-all duration-700 shadow-[0_0_25px_#00ff41]" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] font-black text-spyGreen uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Sparkles size={14}/> {t.intelCaptured}</span>
                     <span>{currentMission.tasks.filter(tk => tk.completed).length} / {currentMission.tasks.length} {t.secured}</span>
                  </div>
                </div>
                {viewTask && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-2">
                      {currentMission.tasks.map((tk, i) => (
                        <button
                          key={tk.id}
                          onClick={() => goToStep(i)}
                          aria-label={`${t.stepOf} ${i + 1}`}
                          className={`h-2.5 rounded-full transition-all ${
                            tk.completed ? 'bg-spyGreen w-8' : i === stepIndex ? 'bg-spyCyan w-10' : 'bg-white/10 w-2.5'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => goToStep(stepIndex - 1)}
                        disabled={stepIndex === 0}
                        aria-label="Previous step"
                        className="p-2 rounded-full text-white/40 hover:text-spyCyan hover:bg-spyCyan/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <p className="text-center text-sm font-black uppercase tracking-widest text-white/40 w-28">
                        {t.stepOf} {stepIndex + 1} / {currentMission.tasks.length}
                      </p>
                      <button
                        onClick={() => goToStep(stepIndex + 1)}
                        disabled={stepIndex === currentMission.tasks.length - 1}
                        aria-label="Next step"
                        className="p-2 rounded-full text-white/40 hover:text-spyCyan hover:bg-spyCyan/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <TaskItem task={viewTask} t={t} onToggle={(tid) => toggleTask(currentMission.id, tid)} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {view !== 'ONBOARDING' && (
        <>
          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-spyDark/90 backdrop-blur-2xl border-t-2 border-white/10 px-2 py-4 sm:px-5 sm:py-5 flex justify-around items-center z-50 rounded-t-[40px]">
            <button onClick={() => setView('HOME')} className={`p-2.5 sm:p-4 rounded-3xl transition-all ${view === 'HOME' || view === 'SELECT_LOCATION' ? 'bg-spyCyan text-black scale-110 shadow-lg shadow-spyCyan/40' : 'text-white/40 hover:text-spyCyan hover:bg-spyCyan/10'}`}><Radar size={26} /></button>
            <button onClick={() => setView('MISSION_DETAIL')} className={`p-2.5 sm:p-4 rounded-3xl transition-all ${view === 'MISSION_DETAIL' ? 'bg-spyPink text-black scale-110 shadow-lg shadow-spyPink/40' : 'text-white/40 hover:text-spyPink hover:bg-spyPink/10'}`}><Terminal size={26} /></button>
            <button onClick={() => setView('SETTINGS')} className={`p-2.5 sm:p-4 rounded-3xl transition-all ${view === 'SETTINGS' ? 'bg-spyAmber text-black scale-110 shadow-lg shadow-spyAmber/40' : 'text-white/40 hover:text-spyAmber hover:bg-spyAmber/10'}`}><UserCircle size={26} /></button>
            <button onClick={() => window.location.reload()} className="p-2.5 sm:p-4 text-white/40 hover:text-spyRed transition-all"><Power size={26} /></button>
            <button onClick={() => setShowPrivacy(!showPrivacy)} className="p-2.5 sm:p-4 text-white/40 hover:text-spyCyan transition-all"><Shield size={26} /></button>
            {showPrivacy && (
              <div className="absolute bottom-full left-0 right-0 p-8 bg-spyDark/95 backdrop-blur-3xl border-t-4 border-spyCyan animate-in slide-in-from-bottom-10">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="text-spyCyan" size={24} />
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">{t.privacyLabel}</h3>
                </div>
                <p className="text-sm text-white/70 font-bold leading-relaxed">{t.privacyInfo}</p>
                <button onClick={() => setShowPrivacy(false)} className="mt-6 w-full py-4 bg-spyCyan text-black font-black uppercase text-xs tracking-widest rounded-2xl">{t.proceed}</button>
              </div>
            )}
          </footer>
          <Analytics />
        </>
      )}
    </div>
  );
};

export default App;
