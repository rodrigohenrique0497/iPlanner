
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 page-transition pb-24 px-4 max-w-7xl mx-auto mt-6">
      <div className="lg:col-span-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4">
        <div className="space-y-1">
          <h3 className="text-4xl font-black tracking-tighter capitalize text-theme-text">{dayName}</h3>
          <p className="text-theme-muted font-bold uppercase tracking-[0.3em] text-[10px] ml-1">{fullDate}</p>
        </div>

        <div className="bg-theme-card p-1.5 rounded-3xl flex gap-1 border border-theme-border shadow-premium shrink-0">
          <button onClick={() => setView('daily')} className="px-6 py-2.5 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Dia</button>
          <button onClick={() => setView('weekly')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-3 max-h-[750px] overflow-y-auto pr-4 no-scrollbar">
          {hours.map(h => {
            const task = getTaskForHour(h);
            const isCreating = creatingHour === h;

            return (
              <div key={h} className="flex gap-6 group items-center">
                <span className="w-12 text-[10px] font-black text-theme-muted/50 tracking-widest shrink-0 text-center">{h}:00</span>
                
                {isCreating ? (
                  <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1">
                    <input 
                      autoFocus
                      type="text"
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      onBlur={(e) => !quickTaskTitle && setCreatingHour(null)}
                      placeholder="Agendar nova tarefa..."
                      className="w-full min-h-[85px] rounded-[2.5rem] border-2 border-theme-accent bg-theme-card px-8 font-black text-sm outline-none shadow-glow text-theme-text"
                    />
                  </form>
                ) : (
                  <div 
                    onClick={() => {
                      if (!task) {
                        if (selectedHour === h) setSelectedHour(null);
                        else setCreatingHour(h);
                      }
                    }}
                    className={`flex-1 min-h-[85px] rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center px-8 active:scale-[0.99] ${
                      task 
                      ? task.completed 
                        ? 'bg-theme-bg border-transparent text-theme-muted opacity-60' 
                        : 'bg-theme-accent border-theme-accent text-theme-card shadow-premium' 
                      : selectedHour === h
                        ? 'border-theme-accent bg-theme-accent-soft text-theme-accent shadow-glow'
                        : 'border-theme-border bg-theme-card hover:border-theme-accent/30 hover:shadow-glow text-theme-muted/40'
                    }`}
                  >
                    {task ? (
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${task.completed ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-white/20 border-white/30'}`}>
                            <span className="material-symbols-outlined !text-lg leading-none">{task.completed ? 'done_all' : 'schedule'}</span>
                          </span>
                          <span className={`font-black text-sm tracking-tight truncate ${task.completed ? 'line-through opacity-70' : ''}`}>{task.title}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 opacity-60 hover:opacity-100 active:scale-90 transition-all">
                          <span className="material-symbols-outlined !text-xl">close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-theme-muted transition-colors">
                          {selectedHour === h ? 'Aguardando sua entrada...' : 'Horário Disponível'}
                        </span>
                        {!selectedHour && (
                          <span className="opacity-0 group-hover:opacity-100 text-[9px] font-black bg-theme-accent-soft text-theme-accent px-4 py-2 rounded-xl transition-all uppercase tracking-widest">+ Agendar</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="bg-theme-card p-10 md:p-14 rounded-[4rem] border border-theme-border shadow-premium space-y-12 sticky top-10">
          <div className="space-y-4 text-center">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-theme-muted opacity-60">Meu Estado Atual</h4>
            <div className="h-1.5 w-16 bg-theme-accent rounded-full mx-auto"></div>
          </div>

          <div className="flex justify-around items-center gap-2">
            {[1, 2, 3, 4, 5].map(v => (
              <button 
                key={v} 
                onClick={() => onSetEnergy(v)} 
                className={`w-16 h-16 md:w-20 md:h-20 rounded-[2.5rem] flex items-center justify-center text-3xl md:text-5xl transition-all active:scale-90 relative group ${
                  currentEnergy === v 
                  ? 'bg-theme-accent text-theme-card shadow-premium ring-8 ring-theme-accent-soft scale-110 z-10' 
                  : 'bg-theme-bg border border-theme-border grayscale hover:grayscale-0 opacity-40 hover:opacity-100'
                }`}
              >
                <span className="flex items-center justify-center leading-none select-none relative z-10">
                  {['😴', '🥱', '😐', '😊', '⚡'][v-1]}
                </span>
                {currentEnergy === v && (
                  <span className="absolute inset-0 bg-white/20 rounded-[2.5rem] animate-ping duration-[3000ms]"></span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-6">
            <button 
              onClick={onStartFocus} 
              className={`
                w-full py-8 rounded-[3rem] font-black text-xl shadow-premium transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em]
                ${currentEnergy > 0 ? 'bg-theme-accent text-theme-card hover:opacity-90' : 'bg-theme-border text-theme-muted cursor-not-allowed'}
              `}
            >
              <span className="material-symbols-outlined !text-3xl">timer</span>
              Sessão de Foco
            </button>
            <p className="text-[9px] font-black text-theme-muted text-center uppercase tracking-[0.3em] opacity-40">
              Gerencie seu tempo com Pomodoro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
