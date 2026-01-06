
import React, { useState } from 'react';
import { Task, Priority, ViewState } from '../types';

interface DailyViewProps {
  date: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onSetEnergy: (level: number) => void;
  currentEnergy: number;
  onStartFocus: () => void;
  onSchedule: (taskId: string, hour: number) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  setView: (view: ViewState) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ date, tasks, onToggle, onSetEnergy, currentEnergy, onStartFocus, onSchedule, onAddTask, setView }) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [creatingHour, setCreatingHour] = useState<number | null>(null);

  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 to 21:00
  const getTaskForHour = (h: number) => tasks.find(t => t.scheduledHour === h);

  const handleQuickAdd = (e: React.FormEvent, h: number) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) {
      setCreatingHour(null);
      return;
    }
    onAddTask({
      title: quickTaskTitle,
      completed: false,
      priority: Priority.MEDIUM,
      category: 'Geral',
      dueDate: date,
      scheduledHour: h,
      notified: false
    });
    setQuickTaskTitle('');
    setCreatingHour(null);
  };

  const displayDate = new Date(date + 'T00:00:00');
  const dayName = displayDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const fullDate = displayDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  return (
    <div className="px-4 py-6 md:px-12 md:py-12 space-y-8 md:space-y-12 page-transition max-w-7xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-theme-text">{dayName}</h3>
          <p className="text-theme-muted font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px] ml-1">{fullDate}</p>
        </div>

        <div className="w-full sm:w-auto bg-theme-card/50 glass-effect p-1.5 rounded-planner-sm flex gap-1 border border-theme-border shadow-premium overflow-x-auto no-scrollbar">
          <button onClick={() => setView('daily')} className="whitespace-nowrap flex-1 px-5 py-2.5 bg-theme-accent text-theme-card rounded-planner-sm shadow-glow text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">Dia</button>
          <button onClick={() => setView('weekly')} className="whitespace-nowrap flex-1 px-5 py-2.5 rounded-planner-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="whitespace-nowrap flex-1 px-5 py-2.5 rounded-planner-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="space-y-3 max-h-[600px] md:max-h-[800px] overflow-y-auto pr-2 no-scrollbar">
            {hours.map(h => {
              const task = getTaskForHour(h);
              const isCreating = creatingHour === h;

              return (
                <div key={h} className="flex gap-4 md:gap-6 group items-center">
                  <span className="w-10 md:w-12 text-[8px] md:text-[10px] font-black text-theme-muted/50 tracking-widest shrink-0 text-center">{h}:00</span>
                  
                  {isCreating ? (
                    <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1">
                      <input 
                        autoFocus
                        type="text"
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        onBlur={(e) => !quickTaskTitle && setCreatingHour(null)}
                        placeholder="Agendar nova tarefa..."
                        className="w-full min-h-[70px] md:min-h-[85px] rounded-planner-sm border-2 border-theme-accent bg-theme-card px-6 md:px-8 font-black text-sm outline-none shadow-glow text-theme-text"
                      />
                    </form>
                  ) : (
                    <div 
                      onClick={() => {
                        if (!task) setCreatingHour(h);
                      }}
                      className={`flex-1 min-h-[70px] md:min-h-[85px] rounded-planner-sm border-2 transition-all cursor-pointer flex items-center px-6 md:px-8 active:scale-[0.98] ${
                        task 
                        ? task.completed 
                          ? 'bg-theme-bg border-transparent text-theme-muted opacity-60' 
                          : 'bg-theme-accent border-theme-accent text-theme-card shadow-premium' 
                        : 'border-theme-border bg-theme-card hover:border-theme-accent/30 hover:shadow-glow text-theme-muted/40'
                      }`}
                    >
                      {task ? (
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${task.completed ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/20 border-white/30'}`}>
                              <span className="material-symbols-outlined !text-lg leading-none">{task.completed ? 'done_all' : 'schedule'}</span>
                            </span>
                            <span className={`font-black text-xs md:text-sm tracking-tight truncate ${task.completed ? 'line-through opacity-70' : ''}`}>{task.title}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-white/10 opacity-60 hover:opacity-100 active:scale-90 transition-all">
                            <span className="material-symbols-outlined !text-lg md:!text-xl">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-colors">
                            Disponível
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 text-[8px] font-black bg-theme-accent-soft text-theme-accent px-3 py-1.5 rounded-full transition-all uppercase tracking-widest">+ Agendar</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div className="bg-theme-card p-6 md:p-10 rounded-planner border border-theme-border shadow-premium space-y-8 md:space-y-10 lg:sticky lg:top-10 overflow-hidden">
            <div className="space-y-3 text-center">
              <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-theme-muted opacity-60">Meu Estado Atual</h4>
              <div className="h-1.5 w-12 md:w-14 bg-theme-accent rounded-full mx-auto"></div>
            </div>

            <div className="flex justify-between items-center gap-2 md:gap-4 px-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button 
                  key={v} 
                  onClick={() => onSetEnergy(v)} 
                  className={`flex-1 aspect-square rounded-planner-sm flex items-center justify-center text-xl md:text-4xl transition-all active:scale-95 relative group ${
                    currentEnergy === v 
                    ? 'bg-theme-accent text-theme-card shadow-premium ring-2 md:ring-4 ring-theme-accent-soft scale-110 z-10' 
                    : 'bg-theme-bg border border-theme-border grayscale hover:grayscale-0 opacity-40 hover:opacity-100'
                  }`}
                  style={{ maxWidth: '64px' }}
                >
                  <span className="flex items-center justify-center leading-none select-none relative z-10">
                    {['😴', '🥱', '😐', '😊', '⚡'][v-1]}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2 md:pt-4">
              <button 
                onClick={onStartFocus} 
                className={`
                  w-full py-6 md:py-10 rounded-planner-sm font-black text-sm md:text-xl shadow-premium transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em]
                  ${currentEnergy > 0 ? 'bg-theme-accent text-theme-card hover:opacity-95' : 'bg-theme-border text-theme-muted cursor-not-allowed'}
                `}
              >
                <span className="material-symbols-outlined !text-2xl md:!text-4xl">timer</span>
                Foco Profundo
              </button>
              <p className="text-[9px] font-black text-theme-muted text-center uppercase tracking-[0.3em] opacity-40 leading-relaxed">
                Gerencie seu tempo com Pomodoro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
