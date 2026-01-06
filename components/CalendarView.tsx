
import React, { useState } from 'react';
import { Task, ViewState } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onNavigate: (date: string) => void;
  setView: (view: ViewState) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onToggle, onNavigate, setView }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  const totalDays = daysInMonth(year, month);
  const startingDay = firstDayOfMonth(year, month);
  
  const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

  const days = [];
  for (let i = 0; i < adjustedStartingDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }

  const getTasksForDate = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate === dStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  const getCategoryStyles = (cat: string) => {
    const c = cat.toLowerCase();
    if (c === 'trabalho') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (c === 'pessoal') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-theme-accent-soft text-theme-muted border-theme-border';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 page-transition flex flex-col h-full overflow-hidden pb-32">
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-theme-card rounded-[2rem] flex items-center justify-center text-3xl shadow-premium border border-theme-border">
            <span className="material-symbols-outlined !text-3xl text-theme-accent">calendar_month</span>
          </div>
          <div>
            <h2 className="text-5xl font-black text-theme-text tracking-tighter capitalize leading-none">{monthName}</h2>
            <p className="text-theme-muted font-bold mt-2 tracking-widest uppercase text-[10px] ml-1">{year}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-theme-card p-1.5 rounded-3xl flex gap-1 border border-theme-border shadow-premium">
            <button onClick={() => setView('daily')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Dia</button>
            <button onClick={() => setView('weekly')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
            <button onClick={() => setView('calendar')} className="px-6 py-2.5 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Mês</button>
          </div>

          <div className="flex items-center gap-2 bg-theme-card p-2 rounded-[2.5rem] border border-theme-border shadow-premium">
            <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-theme-accent-soft transition-all text-theme-text">
               <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted hover:text-theme-accent transition-all"
            >
              Hoje
            </button>
            <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-theme-accent-soft transition-all text-theme-text">
               <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-theme-card rounded-[4rem] border border-theme-border shadow-premium overflow-hidden flex flex-col flex-1 min-h-[600px]">
        {/* Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-theme-border bg-theme-bg/30">
          {dayNames.map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-60">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto no-scrollbar">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="bg-theme-bg/10 border-r border-b border-theme-border"></div>;
            
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);
            const dateStr = date.toISOString().split('T')[0];

            return (
              <div 
                key={idx} 
                onClick={() => onNavigate(dateStr)}
                className={`min-h-[160px] p-5 border-r border-b border-theme-border group hover:bg-theme-accent-soft transition-all relative cursor-pointer flex flex-col ${
                  today ? 'bg-theme-accent-soft/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
                    today 
                    ? 'bg-theme-accent text-theme-card shadow-premium scale-110' 
                    : 'text-theme-muted group-hover:text-theme-text'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex -space-x-1">
                       {dayTasks.slice(0, 3).map((t, i) => (
                         <div key={i} className={`w-2.5 h-2.5 rounded-full border border-theme-card ${
                           t.completed ? 'bg-theme-muted opacity-40' : 'bg-theme-accent'
                         }`} />
                       ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 overflow-hidden">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={`px-3 py-2 rounded-xl border text-[9px] font-black leading-tight transition-all truncate ${
                        task.completed 
                        ? 'bg-theme-bg border-transparent text-theme-muted line-through opacity-30' 
                        : `${getCategoryStyles(task.category)} shadow-sm`
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-[8px] font-black text-theme-muted uppercase tracking-widest text-center mt-2 opacity-50">
                      + {dayTasks.length - 3} itens
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
