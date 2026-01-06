
import React, { useState } from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onNavigate: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onToggle, onNavigate }) => {
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
  
  // Ajuste para semana começando na Segunda-feira
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

  // Função para retornar cor de destaque baseada na categoria com cores mais sólidas e vibrantes
  const getCategoryStyles = (cat: string) => {
    const c = cat.toLowerCase();
    if (c === 'trabalho') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (c === 'pessoal') return 'bg-rose-100 text-rose-700 border-rose-300';
    if (c === 'geral') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    if (c === 'estudo') return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 page-transition flex flex-col h-full overflow-hidden">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-3xl shadow-sm border border-slate-50">📅</div>
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter capitalize leading-none">{monthName}</h2>
            <p className="text-slate-400 font-bold mt-2 tracking-widest uppercase text-xs">{year}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
          <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-xl">←</button>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
          >
            Este Mês
          </button>
          <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-xl">→</button>
        </div>
      </header>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
          {dayNames.map(d => (
            <div key={d} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {d}
            </div>
          ))}
        </div>

        {/* Grid de Dias */}
        <div className="grid grid-cols-7 flex-1 overflow-y-auto no-scrollbar">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="bg-slate-50/10 border-r border-b border-slate-50"></div>;
            
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);
            const dateStr = date.toISOString().split('T')[0];

            return (
              <div 
                key={idx} 
                onClick={() => onNavigate(dateStr)}
                className={`min-h-[160px] p-4 border-r border-b border-slate-50 group hover:bg-slate-50/80 transition-all relative cursor-pointer flex flex-col ${
                  today ? 'bg-blue-50/20' : ''
                }`}
              >
                {/* Cabeçalho do Dia */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`w-9 h-9 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
                    today 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 ring-4 ring-blue-100' 
                    : 'text-slate-400 group-hover:text-slate-900 bg-slate-50 group-hover:bg-white'
                  }`}>
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex -space-x-1">
                       {dayTasks.slice(0, 3).map((t, i) => (
                         <div key={i} className={`w-2 h-2 rounded-full border border-white ${
                           t.completed ? 'bg-slate-300' : 'bg-blue-500'
                         }`} />
                       ))}
                       {dayTasks.length > 3 && <span className="text-[8px] font-black ml-1 text-slate-300">+{dayTasks.length - 3}</span>}
                    </div>
                  )}
                </div>

                {/* Lista de Tarefas no Dia */}
                <div className="space-y-1.5 overflow-hidden flex-1">
                  {dayTasks.slice(0, 4).map(task => (
                    <div 
                      key={task.id} 
                      className={`px-3 py-1.5 rounded-xl border text-[9px] font-bold leading-tight transition-all truncate ${
                        task.completed 
                        ? 'bg-slate-50 border-transparent text-slate-300 line-through opacity-60' 
                        : `${getCategoryStyles(task.category)} shadow-sm`
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 4 && (
                    <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center mt-1">
                      Mais {dayTasks.length - 4} itens
                    </div>
                  )}

                  {dayTasks.length === 0 && (
                    <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Planejar</span>
                    </div>
                  )}
                </div>

                {/* Efeito de Hover de Fundo */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
