
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

  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const getTaskForHour = (h: number) => tasks.find(t => t.scheduledHour === h);

  const handleQuickAdd = (e?: React.FormEvent, h?: number) => {
    if (e) e.preventDefault();
    const targetHour = h ?? creatingHour;
    
    if (!quickTaskTitle.trim() || targetHour === null) {
      setCreatingHour(null);
      setQuickTaskTitle('');
      return;
    }

    onAddTask({
      title: quickTaskTitle,
      completed: false,
      priority: Priority.MEDIUM,
      category: 'Geral',
      dueDate: date,
      scheduledHour: targetHour,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-theme-text leading-tight">{dayName}</h3>
          <p className="text-theme-muted font-bold uppercase tracking-[0.3em] text-[10px] opacity-100">{fullDate}</p>
        </div>

        <div className="bg-theme-card/80 glass-effect p-1.5 rounded-2xl flex gap-1 border border-theme-border shadow-sm">
          <button onClick={() => setView('daily')} className="px-4 py-2 bg-theme-accent text-theme-card rounded-xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all">Dia</button>
          <button onClick={() => setView('weekly')} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-3 no-scrollbar pb-10">
            {hours.map(h => {
              const task = getTaskForHour(h);
              const isCreating = creatingHour === h;

              return (
                <div key={h} className="flex gap-5 group items-center">
                  <span className="w-12 text-[11px] font-black text-theme-text opacity-90 tracking-widest text-center shrink-0">{h}:00</span>
                  
                  {isCreating ? (
                    <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1 relative animate-in fade-in zoom-in-95 duration-200">
                      <input 
                        autoFocus
                        type="text"
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        placeholder={`O que fará às ${h}:00?`}
                        className="w-full h-16 rounded-2xl border-2 border-theme-accent bg-theme-card px-6 font-bold text-sm outline-none shadow-premium text-theme-text"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-theme-accent text-theme-card rounded-xl flex items-center justify-center shadow-premium active:scale-90 transition-all hover:opacity-90"
                      >
                        <span className="material-symbols-outlined !text-2xl">done</span>
                      </button>
                    </form>
                  ) : (
                    <div 
                      onClick={() => !task && setCreatingHour(h)}
                      className={`flex-1 h-16 rounded-2xl border transition-all cursor-pointer flex items-center px-6 relative group/slot ${
                        task 
                        ? task.completed 
                          ? 'bg-theme-bg border-transparent text-theme-muted opacity-50' 
                          : 'bg-theme-accent border-theme-accent text-theme-card shadow-premium' 
                        : 'border-theme-border bg-theme-card hover:border-theme-accent/50 hover:bg-theme-accent-soft/40 shadow-sm'
                      }`}
                    >
                      {task ? (
                        <div className="flex justify-between items-center w-full">
                          <span className={`font-black text-[15px] truncate tracking-tight ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                          <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-black/10 rounded-lg transition-all">
                            <span className="material-symbols-outlined !text-xl">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full transition-opacity">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined !text-xl text-theme-accent opacity-60 group-hover/slot:opacity-100 group-hover/slot:scale-110 transition-all">add_circle</span>
                            <span className="text-[10px] font-black uppercase text-theme-accent opacity-80 tracking-widest group-hover/slot:opacity-100 animate-pulse-slow group-hover/slot:animate-none">+ Agendar</span>
                          </div>
                          <span className="text-[9px] font-bold text-theme-muted opacity-30 group-hover/slot:opacity-60 transition-opacity uppercase tracking-tighter">Espaço Livre</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-theme-card p-10 rounded-planner border border-theme-border shadow-premium space-y-10 lg:sticky lg:top-8">
            <div className="space-y-1 text-center">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-theme-text">Estado de Energia</h4>
              <div className="h-1 w-10 bg-theme-accent rounded-full mx-auto mt-2"></div>
            </div>
            
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map(v => (
                <button 
                  key={v} 
                  onClick={() => onSetEnergy(v)} 
                  className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-90 ${
                    currentEnergy === v 
                    ? 'bg-theme-accent text-theme-card shadow-premium scale-110 ring-4 ring-theme-accent-soft' 
                    : 'bg-theme-bg border border-theme-border grayscale opacity-50 hover:opacity-100 hover:grayscale-0 hover:border-theme-accent/30'
                  }`}
                >
                  {['😴', '🥱', '😐', '😊', '⚡'][v-1]}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-theme-border">
              <button 
                onClick={onStartFocus} 
                className={`w-full py-7 rounded-2xl font-black text-sm shadow-premium transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-widest ${currentEnergy > 0 ? 'bg-theme-accent text-theme-card hover:opacity-95' : 'bg-theme-bg border border-theme-border text-theme-muted cursor-not-allowed opacity-50'}`}
              >
                <span className="material-symbols-outlined !text-2xl">timer</span>
                Foco Profundo
              </button>
              <p className="text-[9px] font-black text-theme-muted text-center uppercase tracking-[0.2em] opacity-80">Sessão Pomodoro Recomendada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
