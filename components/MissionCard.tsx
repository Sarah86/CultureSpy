
import React from 'react';
import { Mission, Translations } from '../types';
import { Shield, ChevronRight, Lock, Zap, Eye, Binary, Music, Target, Sparkles } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  t: Translations;
  onSelect: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, t, onSelect }) => {
  const isCompleted = mission.status === 'COMPLETED';
  const isActive = mission.status === 'ACTIVE';

  const CategoryIcon = () => {
    switch (mission.category) {
      case 'ART': return <Eye size={20} className="text-spyCyan" />;
      case 'SCIENCE': return <Binary size={20} className="text-spyAmber" />;
      case 'MUSIC': return <Music size={20} className="text-spyPink" />;
      default: return <Shield size={20} />;
    }
  };

  return (
    <div 
      onClick={() => !mission.isLocked && onSelect(mission)}
      className={`
        relative rounded-[32px] border-4 p-6 cursor-pointer transition-all duration-300 group overflow-hidden
        ${mission.isLocked ? 'border-zinc-800 opacity-50 grayscale bg-zinc-900/50' : 'border-white/5 bg-spySlate hover:border-spyCyan hover:scale-[1.02] shadow-2xl hover:shadow-spyCyan/20'}
        ${isActive ? 'border-spyGreen shadow-[0_0_30px_rgba(0,255,65,0.2)]' : ''}
        ${isCompleted ? 'border-spyGreen/40 bg-spyGreen/5' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col flex-1 min-w-0 pr-4">
          <span className="text-[10px] tracking-[0.3em] opacity-50 mb-2 font-black uppercase flex items-center gap-2">
            <Target size={12} /> ID: {mission.codeName}
          </span>
          <h3 className="text-2xl font-black leading-[0.9] uppercase tracking-tighter text-white group-hover:text-spyCyan transition-colors">{mission.title}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all group-hover:rotate-12
          ${mission.isLocked ? 'border-zinc-800 bg-black' : 'border-white/10 bg-black/40 shadow-inner'}`}>
          {mission.isLocked ? <Lock size={20} className="text-zinc-600" /> : <CategoryIcon />}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <Zap 
            key={i} 
            size={12} 
            className={`${i < mission.difficulty ? 'text-spyAmber fill-spyAmber' : 'text-white/10'} group-hover:scale-110 transition-transform`} 
          />
        ))}
        <span className="text-[10px] ml-3 tracking-widest font-black uppercase text-white/40">{t.lvl} {mission.difficulty}</span>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
           <div className="flex gap-1">
              {mission.tasks.map((task, idx) => (
                <div key={idx} className={`w-2 h-2 rounded-full border border-white/10 ${task.completed ? 'bg-spyGreen shadow-[0_0_8px_#00ff41]' : 'bg-white/5'}`}></div>
              ))}
           </div>
           <div className="text-[11px] font-black uppercase tracking-widest">
            {isCompleted ? (
              <span className="text-spyGreen flex items-center gap-1"><Sparkles size={12}/> {t.dataCached}</span>
            ) : isActive ? (
              <span className="text-spyGreen bg-spyGreen/10 border border-spyGreen/20 px-3 py-1 rounded-full">{t.activeOp}</span>
            ) : (
              <span className="text-white/30">{mission.tasks.length} {t.microTasks}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase text-spyCyan opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
          {t.infiltrate} <ChevronRight size={20} />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="w-full h-1 bg-spyCyan absolute top-0 animate-[scan_3s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default MissionCard;
