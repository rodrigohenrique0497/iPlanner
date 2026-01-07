
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

  return (
    <div className="px-4 py-6 md:px-12 md:py-10 space-y-8 page-transition flex flex-col h-full max-w-[1600px] mx-auto pb-32">
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-theme-card rounded-2xl flex items-center justify-center shadow-premium border border-theme-border">
            <span className="material-symbols-outlined !text-3xl text-theme-accent">calendar_today</span>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter capitalize leading-none">{monthName}</h2>
            <p className="text-theme-muted font-bold mt-2 tracking-widest uppercase text-[10px] opacity-60">{year}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="bg-theme-card/50 glass-premium p-1.5 rounded-[2rem] flex gap-1 border border-theme-border/50 shadow-sm flex-1 md:flex-none">
            <button onClick={() => setView('daily')} className="flex-1 md:flex-none px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Dia</button>
            <button onClick={() => setView('weekly')} className="flex-1 md:flex-none px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[10px] font-black uppercase tracking-widest">Mês</button>
          </div>

          <div className="flex items-center gap-3 bg-theme-card p-2 rounded-[2rem] border border-theme-border shadow-sm">
            <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-theme-accent-soft transition-all text-theme-text">
               <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-accent transition-all">Hoje</button>
            <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-theme-accent-soft transition-all text-theme-text">
               <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </header>

      <div className="bg-theme-card rounded-[2.5rem] border border-theme-border shadow-premium overflow-hidden flex flex-col flex-1 min-h-[500px]">
        {/* Dias da Semana Premium */}
        <div className="grid grid-cols-7 border-b border-theme-border bg-theme-accent-soft/30">
          {dayNames.map(d => (
            <div key={d} className="py-5 text-center text-[9px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-60">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de Dias com Interação Refinada */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto no-scrollbar">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="bg-theme-bg/5 border-r border-b border-theme-border/50"></div>;
            
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);
            const dateStr = date.toISOString().split('T')[0];

            return (
              <div 
                key={idx} 
                onClick={() => onNavigate(dateStr)}
                className={`min-h-[100px] md:min-h-[150px] p-3 md:p-4 border-r border-b border-theme-border/50 group hover:bg-theme-accent-soft/30 transition-all relative cursor-pointer flex flex-col ${
                  today ? 'bg-theme-accent-soft/20' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl text-[12px] font-black transition-all ${
                    today 
                    ? 'bg-theme-accent text-theme-card shadow-glow scale-105' 
                    : 'text-theme-muted group-hover:text-theme-text'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex -space-x-1.5">
                       {dayTasks.slice(0, 3).map((t, i) => (
                         <div key={i} className={`w-2 h-2 rounded-full border border-theme-card ${
                           t.completed ? 'bg-theme-muted opacity-40' : 'bg-theme-accent'
                         }`} />
                       ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 overflow-hidden hidden md:block">
                  {dayTasks.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={`px-2 py-1.5 rounded-lg border border-theme-border/50 text-[9px] font-black transition-all truncate ${
                        task.completed 
                        ? 'bg-theme-bg/50 text-theme-muted line-through opacity-30' 
                        : 'bg-theme-card text-theme-text shadow-sm'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <p className="text-[8px] font-black text-theme-muted/50 uppercase tracking-widest text-center mt-1">
                      + {dayTasks.length - 2} itens
                    </p>
                  )}
                </div>
                
                {/* Indicador mobile compacto */}
                <div className="md:hidden mt-auto flex justify-center">
                   {dayTasks.length > 0 && (
                     <div className="text-[7px] font-black text-theme-accent/70 uppercase">{dayTasks.length} T</div>
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
