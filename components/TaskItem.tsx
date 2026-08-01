
import React from 'react';
import { Task, SensoryType, Translations } from '../types';
import { Check, Eye, Ear, Hand, Wind, Zap, Star, Binary } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  t: Translations;
  onToggle: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, t, onToggle }) => {
  const getSensoryIcon = (type?: SensoryType) => {
    switch (type) {
      case 'sight': return <Eye size={18} className="text-spyCyan" />;
      case 'sound': return <Ear size={18} className="text-spyAmber" />;
      case 'touch': return <Hand size={18} className="text-spyPink" />;
      case 'smell': return <Wind size={18} className="text-spyGreen" />;
      case 'vibe': return <Zap size={18} className="text-yellow-400 animate-pulse" />;
      default: return <Star size={18} className="text-white" />;
    }
  };

  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`relative group flex flex-col gap-3 p-6 rounded-[24px] border-4 transition-all active:scale-95 cursor-pointer overflow-hidden
        ${task.completed
          ? 'bg-spyGreen/10 border-spyGreen/30 opacity-80'
          : 'bg-spySlate border-white/5 hover:border-spyCyan shadow-xl hover:shadow-spyCyan/10'}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all
          ${task.completed ? 'bg-spyGreen border-spyGreen text-black rotate-12' : 'border-white/10 text-white/40'}
        `}>
          {task.completed ? <Check size={28} strokeWidth={4} /> : <span>{getSensoryIcon(task.sensoryType)}</span>}
        </div>

        <div className="flex-1 min-w-0 pt-2">
          <p className={`text-lg font-black leading-snug uppercase tracking-tight transition-all
            ${task.completed ? 'text-spyGreen line-through opacity-50' : 'text-white'}
          `}>
            {task.prompt}
          </p>
        </div>

        {!task.completed && (
          <div className="flex-shrink-0 animate-bounce pt-2">
            <Zap size={18} className="text-spyAmber" />
          </div>
        )}
      </div>

      {task.curiosity && (
        <div className={`mt-2 p-4 rounded-xl border-2 transition-all duration-500
          ${task.completed ? 'bg-spyGreen/5 border-spyGreen/10' : 'bg-black/20 border-white/5'}
        `}>
          <div className="flex items-center gap-2 mb-2">
             <Binary size={14} className={task.completed ? "text-spyGreen" : "text-spyCyan"} />
             <span className={`text-xs font-black uppercase tracking-[0.2em] ${task.completed ? "text-spyGreen" : "text-spyCyan"}`}>
               DECRYPTED_INTEL
             </span>
          </div>
          <p className={`text-sm font-bold leading-relaxed ${task.completed ? "text-white/60" : "text-white/80"}`}>
            {task.curiosity}
          </p>
        </div>
      )}

      {/* Decorative scanline for uncompleted tasks */}
      {!task.completed && (
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div className="w-full h-[1px] bg-spyCyan absolute top-0 animate-[scan_2s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
