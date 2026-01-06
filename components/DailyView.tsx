
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
          <h3 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-theme-text">{dayName}</h3>
          <p className="text-theme-muted font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">{fullDate}</p>
        </div>

        <div className="bg-theme-card/50 glass-effect p-1.5 rounded-2xl flex gap-1 border border-theme-border shadow-sm">
          <button onClick={() => setView('daily')} className="px-4 py-2 bg-theme-accent text-theme-card rounded-xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all">Dia</button>
          <button onClick={() => setView('weekly')} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
            {hours.map(h => {
              const task = getTaskForHour(h);
              const isCreating = creatingHour === h;

              return (
                <div key={h} className="flex gap-4 group items-center">
                  <span className="w-10 text-[9px] font-black text-theme-muted opacity-30 tracking-widest text-center">{h}:00</span>
                  
                  {isCreating ? (
                    <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1 relative animate-in fade-in zoom-in-95 duration-200">
                      <input 
                        autoFocus
                        type="text"
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        placeholder="Novo evento..."
                        className="w-full h-14 rounded-2xl border-2 border-theme-accent bg-theme-card px-6 font-bold text-sm outline-none shadow-glow text-theme-text"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-theme-accent text-theme-card rounded-xl flex items-center justify-center shadow-premium active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined !text-xl">done</span>
                      </button>
                    </form>
                  ) : (
                    <div 
                      onClick={() => !task && setCreatingHour(h)}
                      className={`flex-1 h-14 rounded-2xl border transition-all cursor-pointer flex items-center px-6 ${
                        task 
                        ? task.completed 
                          ? 'bg-theme-bg border-transparent text-theme-muted opacity-40' 
                          : 'bg-theme-accent border-theme-accent text-theme-card shadow-premium' 
                        : 'border-theme-border bg-theme-card hover:border-theme-accent/20'
                      }`}
                    >
                      {task ? (
                        <div className="flex justify-between items-center w-full">
                          <span className={`font-bold text-sm truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                          <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="p-1 opacity-50 hover:opacity-100">
                            <span className="material-symbols-outlined !text-lg">close</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-theme-accent opacity-0 group-hover:opacity-100 transition-all">+ Agendar</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-theme-card p-8 rounded-planner border border-theme-border shadow-premium space-y-8 lg:sticky lg:top-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-muted opacity-50 text-center">Estado Atual</h4>
            
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button 
                  key={v} 
                  onClick={() => onSetEnergy(v)} 
                  className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all ${
                    currentEnergy === v ? 'bg-theme-accent text-theme-card shadow-premium scale-110' : 'bg-theme-bg border border-theme-border grayscale opacity-40'
                  }`}
                >
                  {['😴', '🥱', '😐', '😊', '⚡'][v-1]}
                </button>
              ))}
            </div>

            <button 
              onClick={onStartFocus} 
              className={`w-full py-6 rounded-2xl font-black text-sm shadow-premium transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest ${currentEnergy > 0 ? 'bg-theme-accent text-theme-card' : 'bg-theme-border text-theme-muted cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined">timer</span>
              Foco Profundo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
