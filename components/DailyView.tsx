
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface DailyViewProps {
  date: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onSetEnergy: (level: number) => void;
  currentEnergy: number;
  onStartFocus: () => void;
  onSchedule: (taskId: string, hour: number) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ date, tasks, onToggle, onSetEnergy, currentEnergy, onStartFocus, onSchedule, onAddTask }) => {
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
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-1">
          <h3 className="text-4xl font-black tracking-tighter capitalize text-slate-900">{dayName}</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{fullDate}</p>
        </div>
        
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-4 no-scrollbar">
          {hours.map(h => {
            const task = getTaskForHour(h);
            const isCreating = creatingHour === h;

            return (
              <div key={h} className="flex gap-6 group items-center">
                <span className="w-12 text-[10px] font-black text-slate-400 tracking-widest shrink-0">{h}:00</span>
                
                {isCreating ? (
                  <form onSubmit={(e) => handleQuickAdd(e, h)} className="flex-1">
                    <input 
                      autoFocus
                      type="text"
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      onBlur={(e) => !quickTaskTitle && setCreatingHour(null)}
                      placeholder="Nome da tarefa..."
                      className="w-full min-h-[75px] rounded-[2rem] border-2 border-azul-pastel bg-white px-8 font-black text-sm outline-none shadow-lg shadow-azul-pastel/20"
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
                    className={`flex-1 min-h-[75px] rounded-[2rem] border-2 transition-all cursor-pointer flex items-center px-8 active:scale-[0.99] ${
                      task 
                      ? task.completed 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800 opacity-60' 
                        : 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
                      : selectedHour === h
                        ? 'border-azul-pastel bg-blue-50 text-blue-600'
                        : 'border-dashed border-slate-100 hover:border-slate-200 hover:bg-white text-slate-300'
                    }`}
                  >
                    {task ? (
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3 min-w-0">
                          {task.completed && <span className="text-lg flex items-center justify-center">✅</span>}
                          <span className={`font-black text-sm tracking-tight truncate ${task.completed ? 'line-through opacity-70' : ''}`}>{task.title}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onSchedule(task.id, -1); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 opacity-50 hover:opacity-100 active:scale-90 transition-all">✕</button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-slate-500">
                          {selectedHour === h ? 'Aguardando tarefa...' : 'Agendar'}
                        </span>
                        {!selectedHour && (
                          <span className="opacity-0 group-hover:opacity-100 text-xs font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-lg transition-all">+ Novo</span>
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

      <div className="lg:col-span-7 space-y-12">
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-8">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Nível de Energia</h4>
          <div className="flex justify-around gap-2">
            {[1, 2, 3, 4, 5].map(v => (
              <button 
                key={v} 
                onClick={() => onSetEnergy(v)} 
                className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center text-3xl md:text-5xl transition-all active:scale-90 ${currentEnergy === v ? 'bg-slate-900 shadow-2xl scale-110' : 'bg-slate-50 grayscale opacity-40 hover:opacity-100'}`}
              >
                <span className="flex items-center justify-center leading-none select-none">{['😴', '🥱', '😐', '😊', '⚡'][v-1]}</span>
              </button>
            ))}
          </div>
          <button onClick={onStartFocus} className="w-full py-8 bg-rosa-pastel text-rose-900 rounded-[2.5rem] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-rose-100">
            Iniciar Sessão de Foco
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
