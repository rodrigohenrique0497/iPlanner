
import React, { useState, useMemo } from 'react';
import { Task, Priority } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  userCategories: string[];
  onUpdateCategories: (cats: string[]) => void;
  onNavigate?: (date: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onAdd, userCategories, onUpdateCategories, onNavigate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newCategory, setNewCategory] = useState(userCategories[0] || 'Pessoal');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newScheduledHour, setNewScheduledHour] = useState<string>('none');
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tasks, searchQuery, filterCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    onAdd({
      title: newTitle,
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      scheduledHour: newScheduledHour === 'none' ? undefined : parseInt(newScheduledHour),
      notified: false
    });
    
    setNewTitle('');
    setNewScheduledHour('none');
    setIsAdding(false);
  };

  const handleAddCategory = () => {
    if (newCatName && !userCategories.includes(newCatName)) {
      onUpdateCategories([...userCategories, newCatName]);
      setNewCatName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 page-transition pb-24 px-4">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Tarefas</h2>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowCatManager(!showCatManager)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-colors">Gerenciar Categorias</button>
          </div>
        </div>
        
        {/* FAB PADRONIZADO PREMIUM - CENTRAMENTO ABSOLUTO */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`
            relative w-16 h-16 md:w-20 md:h-20 rounded-full 
            flex items-center justify-center 
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            focus:outline-none group active:scale-90
            ${isAdding 
              ? 'bg-rose-500 shadow-[0_15px_30px_rgba(244,63,94,0.3)] rotate-45' 
              : 'bg-slate-900 shadow-[0_15px_30px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.4)] hover:scale-105'
            }
          `}
        >
          <span className="text-white text-3xl md:text-5xl font-light leading-none flex items-center justify-center select-none">+</span>
          <div className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-105 transition-transform"></div>
        </button>
      </div>

      {showCatManager && (
        <div className="bg-azul-pastel/10 p-8 rounded-[3rem] border border-azul-pastel/20 animate-in zoom-in duration-300">
          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Suas Categorias</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {userCategories.map(cat => (
              <div key={cat} className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
                <span className="text-[10px] font-bold">{cat}</span>
                <button onClick={() => onUpdateCategories(userCategories.filter(c => c !== cat))} className="text-red-400">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nova Categoria..." 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 bg-white p-4 rounded-2xl outline-none text-xs font-bold" 
            />
            <button onClick={handleAddCategory} className="bg-slate-900 text-white px-6 rounded-2xl text-[10px] font-black uppercase active:scale-95 transition-transform">Adicionar</button>
          </div>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-2xl space-y-8 animate-in slide-in-from-top duration-500">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest px-4 opacity-40">Título da Tarefa</label>
            <input
              autoFocus
              type="text"
              placeholder="O que precisa ser feito?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-2xl font-black p-6 bg-slate-50 rounded-[2rem] outline-none focus:bg-white border-2 border-transparent focus:border-azul-pastel transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest px-4 opacity-40">Data</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-slate-50 p-6 rounded-[2rem] text-sm font-bold outline-none border-2 border-transparent focus:border-azul-pastel transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest px-4 opacity-40">Horário (Opcional)</label>
              <select
                value={newScheduledHour}
                onChange={(e) => setNewScheduledHour(e.target.value)}
                className="w-full bg-slate-50 p-6 rounded-[2rem] text-sm font-bold outline-none border-2 border-transparent focus:border-azul-pastel transition-all appearance-none"
              >
                <option value="none">Não agendar</option>
                {hours.map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest px-4 opacity-40">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 p-6 rounded-[2rem] text-sm font-bold outline-none border-2 border-transparent focus:border-azul-pastel transition-all appearance-none"
              >
                {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-black transition-all active:scale-[0.98]">Salvar Tarefa</button>
        </form>
      )}

      <div className="space-y-5">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          const isDueToday = !task.completed && task.dueDate === todayStr;
          
          return (
            <div
              key={task.id}
              className={`
                flex items-center justify-between 
                p-5 md:p-7 rounded-[2.5rem] border 
                transition-all duration-300 group
                ${task.completed 
                  ? 'bg-slate-50/50 border-transparent opacity-60' 
                  : isOverdue 
                    ? 'bg-rose-50/40 border-rose-100 shadow-sm shadow-rose-100/20' 
                    : isDueToday
                      ? 'bg-amber-50/50 border-amber-100 shadow-sm shadow-amber-100/20'
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-0.5'
                }
              `}
            >
              <div className="flex items-center gap-5 md:gap-7 cursor-pointer flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                {/* CHECK BUTTON PADRONIZADO - SIMBOLO PROPORCIONAL */}
                <div className={`
                  relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center 
                  transition-all duration-500 shrink-0 border-2 active:scale-90
                  ${task.completed 
                    ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' 
                    : isOverdue
                      ? 'bg-white border-rose-200 shadow-inner'
                      : 'bg-white border-slate-100 group-hover:border-slate-300 shadow-inner'
                  }
                `}>
                  {task.completed ? (
                    <span className="text-white text-2xl md:text-3xl leading-none flex items-center justify-center animate-in zoom-in duration-300 select-none">✓</span>
                  ) : (
                    (isOverdue || isDueToday) && (
                      <span className={`text-sm md:text-base font-black flex items-center justify-center leading-none ${isOverdue ? 'text-rose-500' : 'text-amber-600'} animate-pulse`}>!</span>
                    )
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className={`font-black text-lg md:text-xl tracking-tight truncate transition-all duration-300 ${
                    task.completed 
                      ? 'line-through text-slate-400 italic' 
                      : isOverdue 
                        ? 'text-rose-900' 
                        : isDueToday 
                          ? 'text-amber-900' 
                          : 'text-slate-800'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 overflow-x-auto no-scrollbar">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shrink-0 ${
                      task.completed
                        ? 'bg-slate-200 text-slate-400'
                        : isOverdue 
                          ? 'bg-rose-100/50 text-rose-500' 
                          : isDueToday 
                            ? 'bg-amber-100/50 text-amber-700' 
                            : 'bg-slate-100 text-slate-400'
                    }`}>
                      {task.category}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onNavigate?.(task.dueDate); }}
                      className={`text-[9px] font-bold flex items-center gap-1.5 hover:underline shrink-0 ${
                        task.completed 
                          ? 'text-slate-300' 
                          : isOverdue 
                            ? 'text-rose-500' 
                            : isDueToday 
                              ? 'text-amber-600' 
                              : 'text-slate-400'
                      }`}
                    >
                      📅 {task.dueDate} {task.scheduledHour !== undefined && `@ ${task.scheduledHour}:00`}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION ICON PADRONIZADO (LIXEIRA) - CENTRAMENTO TOTAL */}
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                className={`
                  ml-4 w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-300
                  flex items-center justify-center active:scale-90
                  ${task.completed ? 'opacity-30' : 'opacity-40 group-hover:opacity-100'}
                  hover:bg-rose-50 hover:text-rose-500 text-slate-300
                `}
                aria-label="Excluir tarefa"
              >
                <span className="text-xl md:text-2xl flex items-center justify-center leading-none">🗑️</span>
              </button>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4 opacity-10 flex justify-center">📋</div>
            <p className="opacity-20 font-black italic text-lg tracking-tight">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
