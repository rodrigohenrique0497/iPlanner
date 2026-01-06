
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-theme-accent text-theme-card rounded-2xl flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-xl">checklist</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-theme-text tracking-tighter">Tarefas</h2>
            <p className="text-theme-muted font-bold text-[9px] uppercase tracking-widest opacity-60">Foco Total</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glow transition-all active:scale-90 ${isAdding ? 'bg-rose-500 text-white rotate-45' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-6 md:p-8 rounded-planner border border-theme-border shadow-premium space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <input 
            autoFocus
            type="text" 
            placeholder="O que planeja hoje?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-xl font-bold bg-transparent border-none outline-none text-theme-text placeholder:opacity-20"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-theme-bg px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none border border-theme-border">
              {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-theme-bg px-4 py-2 rounded-xl text-[10px] font-black outline-none border border-theme-border" />
            <button type="submit" className="ml-auto bg-theme-accent text-theme-card px-8 py-2 rounded-xl text-[10px] font-black uppercase shadow-glow active:scale-95 transition-all">Salvar</button>
          </div>
        </form>
      )}

      <div className="relative">
        <input 
          type="text" 
          placeholder="Buscar nas suas tarefas..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-theme-card rounded-2xl border border-theme-border outline-none font-bold text-sm shadow-sm focus:border-theme-accent/30 transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted opacity-30">
          <span className="material-symbols-outlined">search</span>
        </span>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all duration-300 ${task.completed ? 'bg-theme-bg border-transparent opacity-60 scale-[0.98]' : 'bg-theme-card border-theme-border shadow-sm'}`}
            >
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 active:scale-75 ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card' : 'bg-theme-bg border-theme-border'}`}
              >
                <span className={`material-symbols-outlined !text-lg ${task.completed ? 'scale-100' : 'scale-0'} transition-transform`}>check</span>
              </button>

              <div className="flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                <p className={`font-bold text-sm tracking-tight truncate ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[8px] font-black uppercase tracking-widest text-theme-muted opacity-50">{task.category}</span>
                   {isOverdue && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">• Atrasado</span>}
                </div>
              </div>

              <button 
                onClick={() => onDelete(task.id)} 
                className="w-9 h-9 flex items-center justify-center rounded-xl text-theme-muted hover:text-rose-500 active:bg-rose-500/10 transition-all"
              >
                <span className="material-symbols-outlined !text-xl">delete</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
