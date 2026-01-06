
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
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
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

  const pendingCount = tasks.filter(t => !t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd({
      title: newTitle,
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      notified: false
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 md:py-12 space-y-10 page-transition pb-32">
      {/* Header Alinhado */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-theme-accent text-theme-card rounded-planner-sm flex items-center justify-center shadow-sm shrink-0">
            <span className="material-symbols-outlined !text-2xl leading-none">checklist</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-theme-text tracking-tighter leading-tight">Tarefas</h2>
            <p className="text-theme-muted font-bold text-[9px] md:text-[10px] uppercase tracking-widest opacity-60">
              {pendingCount} Pendentes
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full 
            flex items-center justify-center shrink-0
            transition-all duration-300 shadow-lg
            ${isAdding 
              ? 'bg-rose-500 text-white rotate-45' 
              : 'bg-theme-accent text-theme-card hover:scale-105 active:scale-95'
            }
          `}
        >
          <span className="material-symbols-outlined !text-2xl leading-none">add</span>
        </button>
      </header>

      {/* Formulário de Adição */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-8 rounded-planner border border-theme-border shadow-premium space-y-6 animate-in slide-in-from-top-4">
          <input 
            autoFocus
            type="text" 
            placeholder="O que precisa ser feito?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-xl font-bold bg-transparent border-none outline-none text-theme-text placeholder:opacity-20"
          />
          <div className="flex flex-wrap gap-3">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-theme-bg px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border border-theme-border">
              {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-theme-bg px-4 py-2 rounded-xl text-[10px] font-black outline-none border border-theme-border" />
            <button type="submit" className="ml-auto bg-theme-accent text-theme-card px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Salvar</button>
          </div>
        </form>
      )}

      {/* Busca e Filtros - Grid Harmonizado */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-theme-card rounded-planner-sm border border-theme-border outline-none font-bold text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
            <span className="material-symbols-outlined !text-xl">search</span>
          </span>
        </div>
        <select 
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="w-full md:w-48 px-5 py-4 bg-theme-card rounded-planner-sm border border-theme-border outline-none font-black text-[10px] uppercase tracking-widest text-theme-muted appearance-none cursor-pointer"
        >
          <option value="all">Filtros</option>
          {userCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Lista de Tarefas - Espaçamento Uniforme */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-5 md:p-6 rounded-planner-sm border transition-all group ${
                task.completed ? 'bg-theme-bg/50 border-transparent opacity-50' : 'bg-theme-card border-theme-border shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4 cursor-pointer flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  task.completed ? 'bg-theme-accent border-theme-accent text-theme-card' : 'border-theme-border group-hover:border-theme-accent'
                }`}>
                  {task.completed && <span className="material-symbols-outlined !text-[14px]">check</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold text-[14px] truncate leading-none ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                    {task.title}
                  </h3>
                  <p className="text-[10px] font-bold text-theme-muted/50 mt-1 uppercase tracking-widest">{task.category} • {task.dueDate === todayStr ? 'Hoje' : task.dueDate}</p>
                </div>
              </div>
              <button onClick={() => onDelete(task.id)} className="p-2 text-theme-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
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
