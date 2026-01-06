
import React from 'react';
import { Task } from '../types';

interface WeeklyViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onNavigate: (date: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ tasks, onToggle, onNavigate }) => {
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
    if (c === 'trabalho') return 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100';
    if (c === 'pessoal') return 'border-rose-500 bg-rose-50 text-rose-700 hover:bg-rose-100';
    return 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 page-transition">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Semana</h2>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Visão Geral de 7 dias</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-900">
            {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
          </p>
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
              className={`flex flex-col rounded-[2.5rem] border min-h-[450px] transition-all duration-300 overflow-hidden ${
                isToday 
                  ? 'bg-white border-slate-900 shadow-2xl scale-105 z-10' 
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-md hover:bg-slate-50/30'
              }`}
            >
              <button 
                onClick={() => onNavigate(dateStr)}
                className={`p-6 text-center border-b border-slate-50 transition-all duration-300 flex flex-col items-center justify-center ${
                  isToday 
                    ? 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]' 
                    : 'hover:bg-slate-50 active:scale-[0.98]'
                }`}
              >
                <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-slate-400' : 'opacity-60'}`}>
                  {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className="text-2xl font-black mt-1">{date.getDate()}</p>
              </button>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar">
                {dayTasks.length > 0 ? dayTasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => onNavigate(dateStr)}
                    className={`w-full text-left p-4 rounded-2xl border-l-4 text-[10px] font-black transition-all hover:scale-[1.03] shadow-sm ${
                      task.completed 
                        ? 'bg-slate-50 border-slate-200 text-slate-300 line-through opacity-60' 
                        : getCategoryColor(task.category)
                    }`}
                  >
                    <div className="truncate mb-1">{task.title}</div>
                    {task.scheduledHour !== undefined && task.scheduledHour >= 0 && (
                      <div className="opacity-60 text-[8px]">🕒 {task.scheduledHour}:00</div>
                    )}
                  </button>
                )) : (
                  <div className="h-full flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-100 rotate-90 select-none">Livre</span>
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
