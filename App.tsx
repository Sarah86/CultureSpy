
import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu, User, ChevronLeft, Power, Globe, LocateFixed, Radar, ExternalLink, Crosshair, Target, ChevronRight, Fingerprint, Activity, Zap, Key, Star, Trophy, Rocket, Ghost, Sparkles, Flame, UserCircle, Settings, ShieldCheck, ShieldX, CheckCircle2, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_MISSIONS } from './data';
import { Mission, Task, TaskType, SensoryType } from './types';
import MissionCard from './components/MissionCard';
import TaskItem from './components/TaskItem';
import TerminalText from './components/TerminalText';
import LocationScanner from './components/LocationScanner';

interface NearbyTarget {
  name: string;
  type: string;
  description: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [view, setView] = useState<'AGE_SELECT' | 'HOME' | 'SELECT_LOCATION' | 'MISSION_DETAIL' | 'SETTINGS'>('AGE_SELECT');
  const [agentName, setAgentName] = useState('');
  const [tempName, setTempName] = useState('');
  const [onboardingStep, setOnboardingStep] = useState<'NAME' | 'AGE'>('NAME');
  const [agentAge, setAgentAge] = useState<number | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanError, setScanError] = useState<string | undefined>(undefined);
  const [detectedTargets, setDetectedTargets] = useState<NearbyTarget[]>([]);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [showKeySelection, setShowKeySelection] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasValidKey(hasKey);
        if (hasKey) setShowKeySelection(false);
        return hasKey;
      } catch (e) {
        console.error("Key check failed", e);
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
        handleScanSurroundings();
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    }
  };

  const handleManualBypass = () => {
    setShowKeySelection(false);
    setHasValidKey(true);
    handleScanSurroundings();
  };

  const toggleTask = (missionId: string, taskId: string) => {
    setMissions(prevMissions => prevMissions.map(m => {
      if (m.id === missionId) {
        const newTasks = m.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allDone = newTasks.every(t => t.completed);
        return { 
          ...m, 
          tasks: newTasks,
          status: allDone ? 'COMPLETED' : 'ACTIVE'
        };
      }
      return m;
    }));
  };

  const handleScanSurroundings = async () => {
    setIsScanning(true);
    setScanError(undefined);
    setScanStatus('FIRING_LASER_BEAMS');
    setDetectedTargets([]);

    try {
      setScanStatus('SNIFFING_FOR_ADVENTURE');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000 
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords({ lat: latitude, lng: longitude });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setScanStatus('CATCHING_THE_SECRET_WAVES');

      const prompt = `
        LOCATION: Lat ${latitude}, Lng ${longitude}
        TASK: Find 4 super interesting places nearby (museums, funny statues, colorful walls, weird buildings).
        FORMAT: Return a JSON array: [{"name": "Funny Place", "type": "Type", "description": "10-word wacky teaser"}]
      `;

      try {
        // GUIDELINE: For Google Maps tool, model MUST be gemini-2.5-flash
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
          throw new Error("RADAR_JAMMED: NO_DATA_STREAM");
        }
      } catch (err: any) {
        if (err.message?.includes("Requested entity was not found.") || err.message?.includes("404")) {
          setShowKeySelection(true);
          setHasValidKey(false);
          throw new Error("NEED_A_SECRET_KEY_MATE");
        }
        throw err;
      }
    } catch (err: any) {
      setScanError(err.message || 'GPS_LINK_FAILURE');
    }
  };

  const handleSelectTarget = async (target: NearbyTarget) => {
    if (!userCoords || !agentAge) return;
    setIsScanning(true);
    setScanError(undefined);
    setScanStatus(`ENCRYPTING MISSION DATA...`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        TARGET: ${target.name}
        AGENT_NAME: ${agentName}
        AGENT_AGE: ${agentAge}
        TASK: Create 10 super fun tasks for ${target.name}. 
        Tasks should mention ${agentName} and be sensory (sight, sound, touch).
      `;

      // GUIDELINE: Use responseSchema to ensure the structure is exactly what we need
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
                    prompt: { type: Type.STRING, description: "The specific sensory action for the kid to do." },
                    sensoryType: { type: Type.STRING, enum: ['sight', 'sound', 'touch', 'smell', 'vibe'] },
                    type: { type: Type.STRING, enum: ['observation', 'deduction', 'sketch', 'audio'] }
                  },
                  required: ["prompt", "sensoryType", "type"]
                }
              }
            },
            required: ["codeName", "title", "description", "tasks"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      const newMission: Mission = {
        ...data,
        id: `gen-${Date.now()}`,
        status: 'PENDING',
        isLocked: false,
        category: 'ART', // Defaulting category as the schema handles core data
        tasks: (data.tasks || []).map((t: any, i: number) => ({ 
          ...t, 
          id: `t-${i}-${Date.now()}`, 
          completed: false 
        }))
      };

      setMissions(prev => [newMission, ...prev]);
      setActiveMissionId(newMission.id);
      setView('MISSION_DETAIL');
      setIsScanning(false);
    } catch (err: any) {
      console.error("Mission Generation Error:", err);
      if (err.message?.includes("Requested entity was not found.")) {
        setShowKeySelection(true);
        setHasValidKey(false);
      }
      setScanError("SATELLITE_DECODE_ERROR");
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setAgentName(tempName.trim().toUpperCase());
      setOnboardingStep('AGE');
    }
  };

  const handleAgeSelect = (age: number) => {
    setAgentAge(age);
    setView('HOME');
  };

  const currentMission = activeMissionId ? missions.find(m => m.id === activeMissionId) : null;
  const completedCount = missions.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  const progressPercent = currentMission ? (currentMission.tasks.filter(t => t.completed).length / currentMission.tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative bg-spyDark border-x border-white/5">
      <LocationScanner 
        isScanning={isScanning} 
        statusText={scanStatus} 
        error={scanError} 
        onRetry={() => {
          if (!hasValidKey) {
            handleOpenKeySelector();
          } else {
            handleScanSurroundings();
          }
        }}
        onClose={() => {
          setIsScanning(false);
          setScanError(undefined);
        }}
      />

      {showKeySelection && (
        <div className="fixed inset-0 z-[200] bg-spyDark/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center m-4 rounded-[40px] border-4 border-spyCyan glow-border animate-in zoom-in duration-300">
          <Key size={60} className="text-spyCyan mb-6 animate-bounce" />
          <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tighter leading-none">Uplink Required</h2>
          <p className="text-sm text-white/60 mb-8 font-mono leading-relaxed px-4 italic">Agent, decrypting local sectors requires an Elite Secret Key.</p>
          
          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={handleOpenKeySelector} 
              className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#00a6af] active:translate-y-2 active:shadow-none transition-all text-xl uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Key size={24} /> SELECT_KEY
            </button>
            
            <button 
              onClick={handleManualBypass} 
              className="w-full bg-spyGreen text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#008f24] active:translate-y-2 active:shadow-none transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <CheckCircle2 size={20} /> I_HAVE_A_KEY / PROCEED
            </button>

            <button 
              onClick={() => setShowKeySelection(false)} 
              className="w-full bg-white/5 text-white/40 font-black py-3 rounded-3xl transition-all text-[10px] uppercase tracking-[0.2em] border border-white/5"
            >
              CANCEL
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-black/40 rounded-2xl border border-white/5 w-full">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] text-spyCyan underline uppercase tracking-widest font-black flex items-center justify-center gap-2">
              <ExternalLink size={12}/> Billing Protocols
            </a>
          </div>
        </div>
      )}

      {view !== 'AGE_SELECT' && (
        <header className="sticky top-0 z-50 bg-spyDark/80 backdrop-blur-xl border-b-2 border-white/10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-spyCyan to-spyPink text-black flex items-center justify-center rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <Ghost size={28} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none uppercase tracking-tighter">Spy_Squad</h1>
              <div className="text-[10px] text-spyCyan font-black tracking-widest uppercase flex items-center gap-1 animate-pulse"><Activity size={10}/> Stealth_On</div>
            </div>
          </div>
          <div className="bg-spySlate px-4 py-2 rounded-2xl border-2 border-white/10 flex items-center gap-2 group cursor-help text-right">
            <div>
               <span className="block text-[10px] font-black text-spyCyan uppercase leading-none mb-0.5">{agentName}</span>
               <span className="text-sm font-black text-white tracking-widest leading-none">{completedCount * 10} XP</span>
            </div>
            <Zap size={18} className="text-spyAmber group-hover:scale-125 transition-transform" />
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto p-5 pb-28">
        {view === 'AGE_SELECT' ? (
          <div className="h-full flex flex-col items-center justify-center py-10 animate-in zoom-in duration-500">
            {onboardingStep === 'NAME' ? (
              <div className="w-full px-4 animate-in slide-in-from-bottom-10">
                <div className="w-32 h-32 bg-spyCyan/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyCyan shadow-[0_0_40px_rgba(0,242,255,0.3)] animate-pulse">
                  <UserCircle size={64} className="text-spyCyan" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 text-center leading-none">Secret Identity<br/><span className="text-spyCyan text-2xl tracking-[0.2em]">Required</span></h2>
                <form onSubmit={handleNameSubmit} className="space-y-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      maxLength={12}
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="ENTER_CODENAME"
                      className="w-full bg-spySlate border-4 border-white/10 rounded-3xl py-6 px-8 text-2xl font-black text-spyCyan placeholder:text-white/10 focus:border-spyCyan focus:outline-none transition-all text-center uppercase tracking-widest"
                      autoFocus
                    />
                    <div className="absolute top-0 right-4 h-full flex items-center">
                       <Fingerprint className="text-white/10" size={32} />
                    </div>
                  </div>
                  <button 
                    disabled={!tempName.trim()}
                    className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#00a6af] active:translate-y-2 active:shadow-none transition-all text-xl disabled:opacity-20 disabled:grayscale disabled:shadow-none"
                  >
                    CONFIRM IDENTITY
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full animate-in slide-in-from-right-10">
                <div className="w-32 h-32 bg-spyPink/20 mx-auto flex items-center justify-center rounded-[40px] mb-10 border-4 border-spyPink shadow-[0_0_40px_rgba(255,0,122,0.3)] animate-pulse">
                  <Fingerprint size={64} className="text-spyPink" />
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 text-center leading-none">Welcome,<br/><span className="text-spyPink">{agentName}!</span></h2>
                <p className="text-xs text-white/50 mb-12 text-center font-bold px-12 uppercase tracking-widest">Select your rank:</p>
                <div className="grid grid-cols-2 gap-5 w-full px-2">
                  {[6, 7, 8, 9, 10, 11, 12].map((age) => (
                    <button
                      key={age}
                      onClick={() => handleAgeSelect(age)}
                      className={`p-6 rounded-3xl border-4 text-center transition-all active:scale-90 flex flex-col items-center group
                        ${age <= 8 ? 'border-spyGreen text-spyGreen bg-spyGreen/5 hover:bg-spyGreen hover:text-black' : 'border-spyCyan text-spyCyan bg-spyCyan/5 hover:bg-spyCyan hover:text-black'}`}
                    >
                      <span className="text-5xl font-black group-hover:scale-110 transition-transform">{age}</span>
                      <span className="text-[10px] uppercase font-black tracking-[0.2em] mt-2 opacity-60">{age <= 8 ? 'ROOKIE' : 'ELITE'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : view === 'HOME' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-spyCyan/30 via-spyDark to-spyDark p-8 rounded-[40px] border-4 border-spyCyan/40 relative overflow-hidden group shadow-[0_20px_60px_-15px_rgba(0,242,255,0.3)]">
              <Radar className="absolute -bottom-10 -right-10 text-spyCyan/10 w-48 h-48 group-hover:scale-125 transition-transform duration-700" />
              <div className="flex items-center gap-3 text-spyCyan mb-4">
                <Sparkles size={24} className="animate-spin-slow" />
                <h2 className="text-sm font-black tracking-widest uppercase italic">The Fun Radar</h2>
              </div>
              <p className="text-lg text-white font-black mb-8 leading-tight">Ready to find some wacky cultural glitches nearby, <span className="text-spyCyan">{agentName}</span>?</p>
              <button onClick={handleScanSurroundings} className="w-full bg-spyCyan text-black font-black py-5 rounded-3xl flex items-center justify-center gap-4 shadow-[0_8px_0_#00a6af] hover:shadow-[0_4px_0_#00a6af] hover:translate-y-[4px] active:translate-y-2 active:shadow-none transition-all group text-lg">
                <Radar size={28} className="group-hover:rotate-180 transition-transform duration-1000" /> SCAN SECTOR
              </button>
            </div>

            <div className="grid gap-6">
              {missions.length > 0 ? missions.map(m => (
                <MissionCard key={m.id} mission={m} onSelect={(m) => { setActiveMissionId(m.id); setView('MISSION_DETAIL'); }} />
              )) : (
                <div className="py-20 text-center border-4 border-dashed border-white/5 rounded-[40px] bg-white/2">
                   <Ghost size={50} className="mx-auto text-white/10 mb-4 animate-pulse" />
                   <p className="text-sm text-white/20 font-black uppercase tracking-widest">No Active Missions Found</p>
                </div>
              )}
            </div>
          </div>
        ) : view === 'SELECT_LOCATION' ? (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <button onClick={() => setView('HOME')} className="mb-8 flex items-center gap-2 text-spyCyan font-black text-sm uppercase bg-spyCyan/10 px-6 py-3 rounded-full border-2 border-spyCyan/20 hover:bg-spyCyan hover:text-black transition-all">
              <ChevronLeft size={20} /> ABORT_SCAN
            </button>
            <div className="mb-10 p-8 rounded-[40px] border-4 border-spyAmber/40 bg-spyAmber/5 flex gap-5 shadow-2xl shadow-spyAmber/10">
               <div className="bg-spyAmber p-4 rounded-3xl self-start shadow-lg"><Flame className="text-black" /></div>
               <div>
                 <h2 className="text-2xl font-black text-white uppercase leading-none mb-2">Targets Locked!</h2>
                 <p className="text-sm text-spyAmber font-black uppercase tracking-widest">Pick a zone, {agentName}.</p>
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
                   <p className="text-xs font-black text-spyCyan uppercase tracking-[0.2em] mt-1">Agent Rank: Level {agentAge}</p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="p-8 rounded-[40px] bg-spySlate border-4 border-white/5 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Globe size={24} className="text-spyCyan" />
                         <span className="text-sm font-black text-white uppercase tracking-widest">Satellite Link</span>
                      </div>
                      {hasValidKey ? (
                        <div className="flex items-center gap-2 text-spyGreen bg-spyGreen/10 px-4 py-2 rounded-full border border-spyGreen/20">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-black uppercase">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-spyRed bg-spyRed/10 px-4 py-2 rounded-full border border-spyRed/20 animate-pulse">
                          <ShieldX size={16} />
                          <span className="text-[10px] font-black uppercase">Offline</span>
                        </div>
                      )}
                   </div>
                   <button 
                     onClick={handleOpenKeySelector}
                     className="w-full bg-spyCyan text-black font-black py-4 rounded-3xl shadow-[0_6px_0_#00a6af] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase text-xs"
                   >
                     <RefreshCw size={18} /> Update Key Selection
                   </button>
                </div>

                <button 
                  onClick={() => { setView('AGE_SELECT'); setOnboardingStep('NAME'); }}
                  className="w-full py-4 border-2 border-spyRed/30 text-spyRed font-black uppercase text-[10px] tracking-[0.4em] rounded-3xl hover:bg-spyRed/10 transition-all mt-10"
                >
                  Terminate_Identity
                </button>
             </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-spyCyan font-black text-sm uppercase bg-spyCyan/10 px-6 py-3 rounded-full border-2 border-spyCyan/20 hover:bg-spyCyan hover:text-black transition-all"><ChevronLeft size={20} /> RETREAT_TO_HQ</button>
              {currentMission?.status === 'COMPLETED' && <div className="bg-spyGreen text-black font-black text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-spyGreen/30 animate-bounce"><Trophy size={18}/> MISSION_CLEAR!</div>}
            </div>

            {currentMission && (
              <div className="space-y-8 pb-10">
                <div className="p-8 rounded-[40px] border-4 border-spyGreen/30 bg-spyGreen/5 relative overflow-hidden shadow-2xl shadow-spyGreen/10">
                  <div className="flex items-center gap-3 mb-6">
                     <span className="bg-spyGreen text-black text-[10px] font-black px-3 py-1.5 rounded-lg">TOP_SECRET</span>
                     <span className="text-spyGreen text-xs font-black tracking-widest">{currentMission.codeName}</span>
                  </div>
                  <h2 className="text-4xl font-black text-white uppercase mb-4 leading-[0.9] tracking-tighter">{currentMission.title}</h2>
                  <p className="text-sm text-white/70 font-bold leading-relaxed mb-8">{currentMission.description}</p>
                  
                  <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden border-2 border-white/5 p-1">
                    <div className="h-full bg-spyGreen rounded-full transition-all duration-700 shadow-[0_0_25px_#00ff41]" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {currentMission.tasks.map(t => (
                     <TaskItem key={t.id} task={t} onToggle={(tid) => toggleTask(currentMission.id, tid)} />
                   ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {view !== 'AGE_SELECT' && (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-spyDark/90 backdrop-blur-2xl border-t-2 border-white/10 p-5 flex justify-around items-center z-50 rounded-t-[40px]">
          <button onClick={() => setView('HOME')} className={`p-4 rounded-3xl transition-all ${view === 'HOME' || view === 'SELECT_LOCATION' ? 'bg-spyCyan text-black scale-110 shadow-lg shadow-spyCyan/40' : 'text-white/40 hover:text-spyCyan hover:bg-spyCyan/10'}`}>
            <Radar size={32} />
          </button>
          <button onClick={() => setView('MISSION_DETAIL')} className={`p-4 rounded-3xl transition-all ${view === 'MISSION_DETAIL' ? 'bg-spyPink text-black scale-110 shadow-lg shadow-spyPink/40' : 'text-white/40 hover:text-spyPink hover:bg-spyPink/10'}`}>
            <Terminal size={32} />
          </button>
          <button onClick={() => setView('SETTINGS')} className={`p-4 rounded-3xl transition-all ${view === 'SETTINGS' ? 'bg-spyAmber text-black scale-110 shadow-lg shadow-spyAmber/40' : 'text-white/40 hover:text-spyAmber hover:bg-spyAmber/10'}`}>
             <UserCircle size={32} />
          </button>
          <button onClick={() => window.location.reload()} className="p-4 text-white/40 hover:text-spyRed transition-all"><Power size={32} /></button>
        </footer>
      )}
    </div>
  );
};

export default App;
