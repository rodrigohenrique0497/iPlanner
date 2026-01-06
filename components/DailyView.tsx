
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
    <div className="px-6 py-6 md:px-12 md:py-10 space-y-10 page-transition max-w-7xl mx-auto pb-32">
      {/* Header com Alinhamento Perfeito */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-theme-text leading-tight">{dayName}</h3>
          <p className="text-theme-muted font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] opacity-60">{fullDate}</p>
        </div>

        <div className="bg-theme-card/50 glass-effect p-1.5 rounded-planner-sm flex gap-1 border border-theme-border shadow-sm">
          <button onClick={() => setView('daily')} className="px-5 py-2.5 bg-theme-accent text-theme-card rounded-planner-sm shadow-glow text-[10px] font-black uppercase tracking-widest transition-all">Dia</button>
          <button onClick={() => setView('weekly')} className="px-5 py-2.5 rounded-planner-sm text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-5 py-2.5 rounded-planner-sm text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Agenda - Alinhamento Óptico */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-4 no-scrollbar">
            {hours.map(h => {
              const task = getTaskForHour(h);
              const isCreating = creatingHour === h;

              return (
                <div key={h} className="flex gap-4 group items-center">
                  <span className="w-12 text-[10px] font-black text-theme-muted/40 tracking-widest shrink-0 text-center">{h}:00</span>
                  
                  {isCreating ? (
                    <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1">
                      <input 
                        autoFocus
                        type="text"
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        onBlur={() => !quickTaskTitle && setCreatingHour(null)}
                        placeholder="Nome da tarefa..."
                        className="w-full min-h-[70px] rounded-planner-sm border-2 border-theme-accent bg-theme-card px-6 font-bold text-sm outline-none shadow-glow text-theme-text"
                      />
                    </form>
                  ) : (
                    <div 
                      onClick={() => !task && setCreatingHour(h)}
                      className={`flex-1 min-h-[70px] rounded-planner-sm border transition-all cursor-pointer flex items-center px-6 ${
                        task 
                        ? task.completed 
                          ? 'bg-theme-bg border-transparent text-theme-muted opacity-40' 
                          : 'bg-theme-accent border-theme-accent text-theme-card shadow-premium' 
                        : 'border-theme-border bg-theme-card hover:border-theme-accent/20 hover:shadow-glow'
                      }`}
                    >
                      {task ? (
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-4 min-w-0">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${task.completed ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/20 border-white/30'}`}>
                              <span className="material-symbols-outlined !text-base">{task.completed ? 'check' : 'schedule'}</span>
                            </span>
                            <span className={`font-bold text-[14px] truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="p-2 opacity-50 hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined !text-lg">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full opacity-0 group-hover:opacity-100 transition-all">
                          <span className="text-[10px] font-black uppercase tracking-widest text-theme-accent">+ Agendar</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel de Estado - Pixel Perfect Energy Emojis */}
        <div className="lg:col-span-5">
          <div className="bg-theme-card p-8 md:p-10 rounded-planner border border-theme-border shadow-premium space-y-10 lg:sticky lg:top-8 overflow-hidden">
            <div className="text-center space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-muted opacity-50">Estado Atual</h4>
              <div className="h-1 w-12 bg-theme-accent/20 rounded-full mx-auto"></div>
            </div>

            <div className="flex justify-center items-center gap-3">
              {[1, 2, 3, 4, 5].map(v => (
                <button 
                  key={v} 
                  onClick={() => onSetEnergy(v)} 
                  className={`flex-1 aspect-square max-w-[64px] rounded-planner-sm flex items-center justify-center text-2xl md:text-3xl transition-all relative ${
                    currentEnergy === v 
                    ? 'bg-theme-accent text-theme-card shadow-premium scale-110 z-10 ring-4 ring-theme-accent-soft' 
                    : 'bg-theme-bg border border-theme-border grayscale hover:grayscale-0 opacity-40 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <span className="leading-none flex items-center justify-center">
                    {['😴', '🥱', '😐', '😊', '⚡'][v-1]}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 space-y-5">
              <button 
                onClick={onStartFocus} 
                className={`
                  w-full py-7 rounded-planner-sm font-black text-sm md:text-lg shadow-premium transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest
                  ${currentEnergy > 0 ? 'bg-theme-accent text-theme-card hover:opacity-95' : 'bg-theme-border text-theme-muted cursor-not-allowed'}
                `}
              >
                <span className="material-symbols-outlined !text-2xl">timer</span>
                Foco Profundo
              </button>
              <p className="text-[9px] font-black text-theme-muted text-center uppercase tracking-[0.2em] opacity-40">
                Técnica Pomodoro Ativa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
