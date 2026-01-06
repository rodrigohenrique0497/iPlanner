
import React, { useState, useMemo } from 'react';
import { Task, Priority, ViewState } from '../types';

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
  const [newCategory, setNewCategory] = useState(userCategories[0] || 'Geral');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

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
      priority: Priority.MEDIUM,
      category: newCategory,
      dueDate: newDueDate,
      notified: false
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 md:py-12 space-y-8 page-transition pb-32">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-theme-accent text-theme-card rounded-[1.25rem] flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl">checklist</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-theme-text tracking-tighter leading-tight">Suas Tarefas</h2>
            <p className="text-theme-muted font-bold text-[10px] uppercase tracking-widest opacity-80">Organização Total</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-premium transition-all active:scale-90 ${isAdding ? 'bg-rose-500 text-white rotate-45 scale-90' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-2xl">add</span>
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-8 md:p-10 rounded-planner border border-theme-border shadow-premium space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          <input 
            autoFocus
            type="text" 
            placeholder="Qual o próximo passo?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-none outline-none text-theme-text placeholder:opacity-30"
          />
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-col gap-2">
               <label className="text-[9px] font-black uppercase text-theme-muted opacity-60 ml-2 tracking-widest">Categoria</label>
               <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-theme-bg px-5 py-3 rounded-2xl text-[11px] font-black uppercase outline-none border border-theme-border cursor-pointer">
                 {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
            <div className="flex flex-col gap-2">
               <label className="text-[9px] font-black uppercase text-theme-muted opacity-60 ml-2 tracking-widest">Data Limite</label>
               <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-theme-bg px-5 py-3 rounded-2xl text-[11px] font-black outline-none border border-theme-border" />
            </div>
            <button type="submit" className="ml-auto bg-theme-accent text-theme-card px-10 py-4 rounded-2xl text-[11px] font-black uppercase shadow-glow active:scale-95 transition-all self-end">Salvar Plano</button>
          </div>
        </form>
      )}

      <div className="relative">
        <input 
          type="text" 
          placeholder="Filtrar tarefas..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-theme-card rounded-[1.25rem] border border-theme-border outline-none font-bold text-sm shadow-sm focus:border-theme-accent/40 transition-all text-theme-text"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted opacity-60">
          <span className="material-symbols-outlined !text-2xl">search</span>
        </span>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 md:p-5 rounded-[1.25rem] border transition-all duration-300 ${task.completed ? 'bg-theme-bg border-transparent opacity-60 scale-[0.98]' : 'bg-theme-card border-theme-border shadow-sm hover:border-theme-accent/20 hover:shadow-premium'}`}
            >
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 active:scale-75 ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card shadow-glow' : 'bg-theme-bg border-theme-border'}`}
              >
                <span className={`material-symbols-outlined !text-xl ${task.completed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all`}>check</span>
              </button>

              <div className="flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                <p className={`font-bold text-[16px] tracking-tight truncate ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                   <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.completed ? 'bg-theme-muted/10 text-theme-muted' : 'bg-theme-accent-soft text-theme-accent'}`}>
                     {task.category}
                   </span>
                   {isOverdue && (
                     <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded">
                       <span className="w-1 h-1 bg-rose-600 rounded-full animate-pulse"></span> Atrasado
                     </span>
                   )}
                </div>
              </div>

              <button 
                onClick={() => onDelete(task.id)} 
                className="w-11 h-11 flex items-center justify-center rounded-2xl text-theme-muted hover:text-rose-600 active:bg-rose-500/10 transition-all"
              >
                <span className="material-symbols-outlined !text-2xl">delete</span>
              </button>
            </div>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center space-y-4 opacity-40">
            <span className="material-symbols-outlined !text-6xl text-theme-muted">inventory_2</span>
            <p className="font-black uppercase tracking-[0.2em] text-[11px] text-theme-muted">Nenhuma tarefa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
