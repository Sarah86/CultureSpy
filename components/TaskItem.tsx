
import React from 'react';
import { Task, SensoryType } from '../types';
import { Check, Eye, Ear, Hand, Wind, Zap, Star } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  t: any;
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
      className={`relative group flex items-center gap-3 p-3 rounded-lg border-2 transition-all active:scale-95 cursor-pointer
        ${task.completed 
          ? 'bg-spyGreen/20 border-spyGreen/40 opacity-70 scale-[0.98]' 
          : 'bg-spySlate border-white/5 hover:border-spyCyan shadow-lg hover:shadow-spyCyan/10'}
      `}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
        ${task.completed ? 'bg-spyGreen border-spyGreen text-black' : 'border-white/20 text-white/40'}
      `}>
        {task.completed ? <Check size={18} strokeWidth={4} /> : <span>{getSensoryIcon(task.sensoryType)}</span>}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-bold leading-tight transition-all
          ${task.completed ? 'text-spyGreen line-through' : 'text-white'}
        `}>
          {task.prompt}
        </p>
      </div>

      {!task.completed && (
        <div className="flex-shrink-0 animate-bounce">
          <Zap size={12} className="text-spyAmber" />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
