
import React from 'react';
import { Trophy, Sparkles, Zap, ChevronRight, Star } from 'lucide-react';
import { Mission, Translations } from '../types';

interface MissionCompleteProps {
  mission: Mission;
  t: Translations;
  onFindNew: () => void;
  onClose: () => void;
}

const CONFETTI_COLORS = ['text-spyCyan', 'text-spyPink', 'text-spyAmber', 'text-spyGreen'];

const MissionComplete: React.FC<MissionCompleteProps> = ({ mission, t, onFindNew, onClose }) => {
  const xpEarned = mission.tasks.length * 10;

  return (
    <div className="fixed inset-0 z-[150] bg-spyDark/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Sparkles
            key={i}
            size={16 + (i % 3) * 8}
            className={`absolute animate-bounce ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`}
            style={{
              top: `${(i * 37) % 90}%`,
              left: `${(i * 53) % 90}%`,
              animationDelay: `${(i % 5) * 120}ms`,
              animationDuration: `${1.4 + (i % 3) * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full blur-[60px] bg-spyGreen/30 animate-pulse"></div>
        <div className="w-40 h-40 border-4 border-spyGreen/30 rounded-full flex items-center justify-center relative bg-spyGreen/10">
          <Trophy size={72} className="text-spyGreen animate-bounce" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="font-black text-4xl tracking-tighter uppercase italic text-spyGreen mb-2">{t.missionClear}</h2>
      <p className="text-sm text-white/60 font-black uppercase tracking-widest mb-6 px-4">{mission.codeName}</p>

      <div className="bg-black/40 rounded-3xl p-6 border-2 border-spyGreen/20 mb-10 flex items-center gap-3">
        <Zap size={24} className="text-spyAmber animate-pulse" />
        <span className="text-2xl font-black text-white">+{xpEarned} {t.xp}</span>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onFindNew}
          className="w-full bg-spyGreen text-black font-black py-5 rounded-3xl shadow-[0_8px_0_#008f24] active:translate-y-2 active:shadow-none transition-all text-lg uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <Star size={22} /> {t.findNewMission} <ChevronRight />
        </button>
        <button
          onClick={onClose}
          className="w-full bg-white/10 text-white/60 font-black py-4 rounded-3xl hover:bg-white/20 transition-all text-xs uppercase tracking-widest"
        >
          {t.keepBrowsing}
        </button>
      </div>
    </div>
  );
};

export default MissionComplete;
