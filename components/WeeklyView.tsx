
import React from 'react';
import { Task, ViewState } from '../types';

interface WeeklyViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onNavigate: (date: string) => void;
  setView: (view: ViewState) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onToggle, onNavigate, setView }) => {
  const getDaysOfWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDays = getDaysOfWeek();

  const getTasksForDate = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate === dStr);
  };

  const getCategoryColor = (cat: string) => {
    const c = cat.toLowerCase();
    // No modo escuro, as cores de categoria precisam de opacidade para não "queimar" o OLED
    if (c === 'trabalho') return 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20';
    if (c === 'pessoal') return 'border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20';
    return 'border-theme-muted bg-theme-accent-soft text-theme-muted hover:opacity-80';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 page-transition pb-24">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-theme-text tracking-tighter leading-none">Semana</h2>
          <p className="text-theme-muted font-bold mt-3 uppercase tracking-[0.3em] text-[10px] ml-1">Visão Estratégica</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-theme-card p-1.5 rounded-3xl flex gap-1 border border-theme-border shadow-premium">
            <button onClick={() => setView('daily')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Dia</button>
            <button onClick={() => setView('weekly')} className="px-6 py-2.5 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Semana</button>
            <button onClick={() => setView('calendar')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
          </div>

          <div className="bg-theme-card px-6 py-3 rounded-2xl border border-theme-border shadow-premium shrink-0">
            <p className="text-[10px] font-black text-theme-text uppercase tracking-widest">
              {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} — {weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date, idx) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayTasks = getTasksForDate(date);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div 
              key={idx} 
              className={`flex flex-col rounded-[3rem] border min-h-[500px] transition-all duration-500 overflow-hidden ${
                isToday 
                  ? 'bg-theme-card border-theme-accent shadow-premium scale-[1.03] z-10' 
                  : 'bg-theme-card/40 border-theme-border hover:border-theme-accent/30 hover:bg-theme-card'
              }`}
            >
              <button 
                onClick={() => onNavigate(dateStr)}
                className={`p-8 text-center border-b border-theme-border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  isToday 
                    ? 'bg-theme-accent text-theme-card' 
                    : 'hover:bg-theme-accent-soft'
                }`}
              >
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'opacity-70' : 'text-theme-muted opacity-60'}`}>
                  {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className="text-3xl font-black tracking-tighter">{date.getDate()}</p>
              </button>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar">
                {dayTasks.length > 0 ? dayTasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => onNavigate(dateStr)}
                    className={`w-full text-left p-4 rounded-[1.75rem] border-l-4 text-[10px] font-black transition-all hover:scale-[1.02] shadow-sm ${
                      task.completed 
                        ? 'bg-theme-bg border-theme-border text-theme-muted line-through opacity-40' 
                        : getCategoryColor(task.category)
                    }`}
                  >
                    <div className="truncate mb-1">{task.title}</div>
                    {task.scheduledHour !== undefined && task.scheduledHour >= 0 && (
                      <div className="opacity-60 text-[8px] flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined !text-xs">schedule</span> {task.scheduledHour}:00
                      </div>
                    )}
                  </button>
                )) : (
                  <div className="h-full flex items-center justify-center pointer-events-none opacity-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-theme-text rotate-90 select-none">Foco</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
