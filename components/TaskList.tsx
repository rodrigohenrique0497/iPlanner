
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
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [isManagingCats, setIsManagingCats] = useState(false);
  const [tempCategory, setTempCategory] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, filterCategory, filterPriority]);

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

  const handleAddCategory = () => {
    if (!tempCategory.trim() || userCategories.includes(tempCategory.trim())) return;
    onUpdateCategories([...userCategories, tempCategory.trim()]);
    setNewCategory(tempCategory.trim());
    setTempCategory('');
    setIsManagingCats(false);
  };

  const removeCategory = (cat: string) => {
    if (cat === 'Geral') return;
    onUpdateCategories(userCategories.filter(c => c !== cat));
  };

  const priorityColors = {
    [Priority.LOW]: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    [Priority.MEDIUM]: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    [Priority.HIGH]: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 md:py-12 space-y-10 page-transition pb-32">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-theme-accent text-theme-card rounded-[1.5rem] flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-3xl">checklist</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-theme-text tracking-tighter leading-tight">Tarefas</h2>
            <p className="text-theme-muted font-bold text-[11px] uppercase tracking-widest opacity-80 mt-1">Sua Lista de Execução</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsManagingCats(!isManagingCats)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all active:scale-95 ${isManagingCats ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border shadow-sm'}`}
            title="Categorias"
          >
            <span className="material-symbols-outlined !text-2xl">category</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium transition-all active:scale-90 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
          >
            <span className="material-symbols-outlined !text-[2rem]">{isAdding ? 'close' : 'add'}</span>
          </button>
        </div>
      </header>

      {/* Editor de Categorias Inline */}
      {isManagingCats && (
        <div className="animate-in slide-in-from-top-4 duration-400 bg-theme-card p-6 rounded-[2rem] border border-theme-border shadow-premium space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-theme-text uppercase tracking-widest">Categorias</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {userCategories.map(cat => (
                <div key={cat} className="flex items-center gap-3 px-5 py-2.5 bg-theme-bg rounded-xl border border-theme-border group">
                  <span className="text-xs font-bold text-theme-text">{cat}</span>
                  {cat !== 'Geral' && (
                    <button onClick={() => removeCategory(cat)} className="text-theme-muted hover:text-rose-500 transition-colors">
                      <span className="material-symbols-outlined !text-[20px]">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <input 
                type="text" 
                placeholder="Nova categoria..." 
                value={tempCategory}
                onChange={e => setTempCategory(e.target.value)}
                className="input-premium flex-1"
              />
              <button onClick={handleAddCategory} className="bg-theme-accent text-theme-card px-8 rounded-xl font-black text-[11px] uppercase tracking-widest h-[4.5rem] shadow-glow active:scale-95 transition-all">ADICIONAR</button>
            </div>
        </div>
      )}

      {/* Formulário de Tarefa Inline */}
      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <form onSubmit={handleSubmit} className="bg-theme-card p-6 md:p-12 rounded-[2.5rem] border border-theme-border shadow-premium space-y-8 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-theme-text uppercase">Nova Tarefa</h3>
            </div>
            
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="Qual o próximo passo?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-2xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-20 p-0"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-3 tracking-widest opacity-40">Categoria</label>
                  <div className="relative">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-premium appearance-none uppercase tracking-widest text-[11px]">
                      {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">expand_more</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-3 tracking-widest opacity-40">Prioridade</label>
                  <div className="flex bg-theme-bg p-1.5 rounded-2xl border border-theme-border h-[4.5rem] items-center">
                    {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                      <button 
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 h-full rounded-[0.75rem] text-[10px] font-black uppercase transition-all ${newPriority === p ? 'bg-theme-card shadow-sm text-theme-accent' : 'text-theme-muted opacity-50'}`}
                      >
                        {p === Priority.LOW ? 'Baixa' : p === Priority.MEDIUM ? 'Média' : 'Alta'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-3 tracking-widest opacity-40">Data Limite</label>
                  <div className="relative w-full overflow-hidden">
                    <input 
                      type="date" 
                      value={newDueDate} 
                      onChange={e => setNewDueDate(e.target.value)} 
                      className="input-premium uppercase tracking-widest text-[11px]" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button type="submit" className="btn-action-primary flex-1">SALVAR</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary flex-1">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros Padronizados */}
      <div className="space-y-6">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-[4.5rem] pl-16 pr-8 bg-theme-card rounded-[1.75rem] border border-theme-border outline-none font-bold text-base shadow-sm group-focus-within:border-theme-accent transition-all text-theme-text"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-theme-muted opacity-50 group-focus-within:text-theme-accent transition-all">
            <span className="material-symbols-outlined !text-2xl">search</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setFilterCategory('all')}
              className={`px-8 h-[3.5rem] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border flex items-center justify-center ${filterCategory === 'all' ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border opacity-70 hover:opacity-100'}`}
            >
              Todas
            </button>
            {userCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-8 h-[3.5rem] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border flex items-center justify-center ${filterCategory === cat ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border opacity-70 hover:opacity-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-theme-card p-1.5 rounded-2xl border border-theme-border flex gap-1.5 shrink-0 h-[3.5rem] items-center shadow-sm">
             <button onClick={() => setFilterPriority('all')} className={`px-5 h-full rounded-xl text-[9px] font-black uppercase tracking-widest ${filterPriority === 'all' ? 'bg-theme-bg text-theme-text shadow-sm' : 'text-theme-muted opacity-40'}`}>Todas</button>
             <button onClick={() => setFilterPriority(Priority.LOW)} className={`px-5 h-full rounded-xl text-[9px] font-black uppercase tracking-widest ${filterPriority === Priority.LOW ? 'bg-blue-500 text-white' : 'text-theme-muted opacity-40'}`}>Baixa</button>
             <button onClick={() => setFilterPriority(Priority.MEDIUM)} className={`px-5 h-full rounded-xl text-[9px] font-black uppercase tracking-widest ${filterPriority === Priority.MEDIUM ? 'bg-amber-500 text-white' : 'text-theme-muted opacity-40'}`}>Média</button>
             <button onClick={() => setFilterPriority(Priority.HIGH)} className={`px-5 h-full rounded-xl text-[9px] font-black uppercase tracking-widest ${filterPriority === Priority.HIGH ? 'bg-rose-500 text-white' : 'text-theme-muted opacity-40'}`}>Alta</button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-5 md:gap-6 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${task.completed ? 'bg-theme-bg border-transparent opacity-50 scale-[0.98]' : 'bg-theme-card border-theme-border shadow-sm hover:border-theme-accent/20 hover:shadow-premium'}`}
            >
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 active:scale-75 ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card shadow-glow' : 'bg-theme-bg border-theme-border hover:border-theme-accent/40'}`}
              >
                <span className={`material-symbols-outlined !text-2xl ${task.completed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all`}>check</span>
              </button>

              <div className="flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                <p className={`font-bold text-[17px] md:text-[18px] tracking-tight truncate ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                   <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1.5 rounded-lg whitespace-nowrap ${task.completed ? 'bg-theme-muted/10 text-theme-muted' : 'bg-theme-accent-soft text-theme-accent'}`}>
                     {task.category}
                   </span>
                   {!task.completed && (
                     <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1.5 rounded-lg border whitespace-nowrap ${priorityColors[task.priority as Priority]}`}>
                       {task.priority === Priority.LOW ? 'Baixa' : task.priority === Priority.MEDIUM ? 'Média' : 'Alta'}
                     </span>
                   )}
                   {isOverdue && (
                     <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                       <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span> Atrasado
                     </span>
                   )}
                </div>
              </div>

              <button 
                onClick={() => onDelete(task.id)} 
                className="w-11 h-11 flex items-center justify-center rounded-2xl text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all active:scale-90"
              >
                <span className="material-symbols-outlined !text-2xl">delete</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
