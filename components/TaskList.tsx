
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
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-theme-accent text-theme-card rounded-planner-sm flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl leading-none">checklist</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-theme-text tracking-tighter leading-tight">Tarefas</h2>
            <p className="text-theme-muted font-bold text-[10px] uppercase tracking-[0.2em] opacity-60">
              {pendingCount} Pendentes
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`
            w-14 h-14 rounded-full 
            flex items-center justify-center shrink-0
            transition-all duration-500 shadow-premium
            ${isAdding 
              ? 'bg-rose-500 text-white rotate-45 scale-90' 
              : 'bg-theme-accent text-theme-card hover:scale-105 active:scale-95'
            }
          `}
        >
          <span className="material-symbols-outlined !text-2xl leading-none">add</span>
        </button>
      </header>

      {/* Formulário de Adição */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-10 rounded-planner border border-theme-border shadow-premium space-y-8 animate-in slide-in-from-top-4 duration-500">
          <input 
            autoFocus
            type="text" 
            placeholder="O que precisa ser feito?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-2xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-20"
          />
          <div className="flex flex-wrap gap-4 items-center">
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-theme-bg px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-theme-border cursor-pointer">
              {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="bg-theme-bg px-5 py-3 rounded-2xl text-[10px] font-black outline-none border border-theme-border" />
            <button type="submit" className="ml-auto bg-theme-accent text-theme-card px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow active:scale-95 transition-all">Salvar Plano</button>
          </div>
        </form>
      )}

      {/* Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Buscar nas suas tarefas..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-theme-card rounded-planner-sm border border-theme-border outline-none font-bold text-sm shadow-sm focus:border-theme-accent/30 transition-all"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted/40">
            <span className="material-symbols-outlined !text-2xl">search</span>
          </span>
        </div>
        <div className="relative w-full md:w-48">
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full pl-6 pr-10 py-5 bg-theme-card rounded-planner-sm border border-theme-border outline-none font-black text-[10px] uppercase tracking-[0.2em] text-theme-muted appearance-none cursor-pointer"
          >
            <option value="all">Categorias</option>
            {userCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted/40">
            <span className="material-symbols-outlined !text-xl">expand_more</span>
          </span>
        </div>
      </div>

      {/* Lista de Tarefas - Pixel Perfect Action Buttons */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          
          return (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 md:p-5 rounded-planner-sm border transition-all duration-300 group ${
                task.completed 
                ? 'bg-theme-bg/40 border-transparent opacity-60' 
                : 'bg-theme-card border-theme-border shadow-sm hover:shadow-premium hover:border-theme-accent/20'
              }`}
            >
              {/* Checkbox de Alta Precisão */}
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                  task.completed 
                  ? 'bg-theme-accent border-theme-accent text-theme-card shadow-glow scale-95' 
                  : 'bg-theme-bg border-theme-border hover:border-theme-accent text-transparent'
                }`}
              >
                <span className={`material-symbols-outlined !text-xl leading-none transition-transform duration-500 ${task.completed ? 'scale-110' : 'scale-50'}`}>
                  check
                </span>
              </button>

              {/* Conteúdo da Tarefa */}
              <div className="flex-1 min-w-0 py-1" onClick={() => onToggle(task.id)}>
                <div className="flex items-center gap-2 mb-1">
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                     task.completed ? 'bg-theme-muted/10 text-theme-muted' : 'bg-theme-accent-soft text-theme-accent'
                   }`}>
                     {task.category}
                   </span>
                   {isOverdue && (
                     <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1">
                       <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse"></span> Atrasado
                     </span>
                   )}
                </div>
                <h3 className={`font-bold text-[15px] md:text-[16px] tracking-tight truncate leading-tight transition-all ${
                  task.completed ? 'line-through text-theme-muted' : 'text-theme-text'
                }`}>
                  {task.title}
                </h3>
              </div>

              {/* Botão Deletar - Refinado para Mobile/Desktop */}
              <button 
                onClick={() => onDelete(task.id)} 
                className={`
                  w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl 
                  transition-all duration-300 shrink-0
                  ${task.completed ? 'text-theme-muted/30 hover:text-rose-500' : 'text-theme-muted hover:text-rose-500 hover:bg-rose-500/5'}
                  md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0
                  opacity-40 active:scale-90
                `}
              >
                <span className="material-symbols-outlined !text-xl md:!text-2xl leading-none">delete</span>
              </button>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-20">
            <span className="material-symbols-outlined !text-6xl">cloud_done</span>
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">Tudo organizado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
