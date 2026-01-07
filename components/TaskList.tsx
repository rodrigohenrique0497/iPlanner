
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
          <div className="w-14 h-14 bg-theme-accent text-theme-card rounded-[1.25rem] flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl">checklist</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-theme-text tracking-tighter leading-tight">Suas Tarefas</h2>
            <p className="text-theme-muted font-bold text-[11px] uppercase tracking-widest opacity-80 mt-1">Organização Total</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsManagingCats(!isManagingCats)}
            className={`btn-square-action border transition-all ${isManagingCats ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border shadow-sm active:scale-95'}`}
            title="Categorias"
          >
            <span className="material-symbols-outlined !text-xl">category</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`btn-square-action shadow-premium transition-all ${isAdding ? 'bg-rose-500 text-white rotate-45' : 'bg-theme-accent text-theme-card'}`}
          >
            <span className="material-symbols-outlined !text-2xl">add</span>
          </button>
        </div>
      </header>

      {isManagingCats && (
        <div className="bg-theme-card p-6 md:p-8 rounded-planner border border-theme-border shadow-premium space-y-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-theme-muted">Gerenciar Categorias</h3>
          <div className="flex flex-wrap gap-2.5">
            {userCategories.map(cat => (
              <div key={cat} className="flex items-center gap-3 px-4 py-2 bg-theme-bg rounded-xl border border-theme-border group">
                <span className="text-xs font-bold text-theme-text">{cat}</span>
                {cat !== 'Geral' && (
                  <button onClick={() => removeCategory(cat)} className="text-theme-muted hover:text-rose-500 transition-colors">
                    <span className="material-symbols-outlined !text-[18px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Formulário com correção de transbordo */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Nova categoria..." 
              value={tempCategory}
              onChange={e => setTempCategory(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold outline-none focus:border-theme-accent transition-all min-h-0"
            />
            <button onClick={handleAddCategory} className="btn-action-primary !h-[3.5rem] !px-8 shadow-glow">Adicionar</button>
          </div>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-8 md:p-10 rounded-planner border border-theme-border shadow-premium space-y-10 animate-in slide-in-from-bottom-4 duration-300">
          <input 
            autoFocus
            type="text" 
            placeholder="Qual o próximo passo?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-2xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-30 p-0 min-h-0"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-theme-muted opacity-60 ml-2 tracking-widest">Categoria</label>
               <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full px-5 rounded-xl uppercase outline-none border border-theme-border cursor-pointer appearance-none text-xs tracking-widest bg-theme-bg">
                 {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-theme-muted opacity-60 ml-2 tracking-widest">Prioridade</label>
               <div className="flex bg-theme-bg p-1.5 rounded-xl border border-theme-border h-14 items-center">
                  {[
                    { id: Priority.LOW, label: 'Baixa' },
                    { id: Priority.MEDIUM, label: 'Média' },
                    { id: Priority.HIGH, label: 'Alta' }
                  ].map(p => (
                    <button 
                      key={p.id}
                      type="button"
                      onClick={() => setNewPriority(p.id)}
                      className={`flex-1 h-full rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${newPriority === p.id ? 'bg-theme-accent text-theme-card shadow-sm' : 'text-theme-muted opacity-50'}`}
                    >
                      {p.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-theme-muted opacity-60 ml-2 tracking-widest">Data Limite</label>
               <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="w-full px-5 rounded-xl outline-none border border-theme-border text-xs font-black bg-theme-bg" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4">
            <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">Cancelar</button>
            <button type="submit" className="btn-action-primary shadow-glow">Agendar Tarefa</button>
          </div>
        </form>
      )}

      {/* Filtros Padronizados */}
      <div className="space-y-5">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 bg-theme-card rounded-2xl border border-theme-border outline-none font-bold text-base shadow-sm group-focus-within:border-theme-accent transition-all text-theme-text"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted opacity-40 group-focus-within:text-theme-accent group-focus-within:opacity-100 transition-all">
            <span className="material-symbols-outlined !text-xl">search</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button 
              onClick={() => setFilterCategory('all')}
              className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border ${filterCategory === 'all' ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border opacity-70'}`}
            >
              Todas
            </button>
            {userCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border ${filterCategory === cat ? 'bg-theme-accent text-theme-card border-theme-accent shadow-glow' : 'bg-theme-card text-theme-muted border-theme-border opacity-70'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-theme-card p-1.5 rounded-2xl border border-theme-border flex gap-1 shrink-0 h-14 items-center">
             <button onClick={() => setFilterPriority('all')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${filterPriority === 'all' ? 'bg-theme-bg text-theme-text shadow-sm' : 'text-theme-muted opacity-40'}`}>Todas</button>
             <button onClick={() => setFilterPriority(Priority.LOW)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${filterPriority === Priority.LOW ? 'bg-blue-500 text-white' : 'text-theme-muted opacity-40'}`}>Baixa</button>
             <button onClick={() => setFilterPriority(Priority.MEDIUM)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${filterPriority === Priority.MEDIUM ? 'bg-amber-500 text-white' : 'text-theme-muted opacity-40'}`}>Média</button>
             <button onClick={() => setFilterPriority(Priority.HIGH)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${filterPriority === Priority.HIGH ? 'bg-rose-500 text-white' : 'text-theme-muted opacity-40'}`}>Alta</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-5 p-5 md:p-6 rounded-2xl border transition-all duration-300 ${task.completed ? 'bg-theme-bg border-transparent opacity-50 scale-[0.98]' : 'bg-theme-card border-theme-border shadow-sm hover:border-theme-accent/20 hover:shadow-premium'}`}
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
                <div className="flex items-center gap-3 mt-1.5">
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${task.completed ? 'bg-theme-muted/10 text-theme-muted' : 'bg-theme-accent-soft text-theme-accent'}`}>
                     {task.category}
                   </span>
                   {!task.completed && (
                     <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${priorityColors[task.priority as Priority]}`}>
                       {task.priority === Priority.LOW ? 'Baixa' : task.priority === Priority.MEDIUM ? 'Média' : 'Alta'}
                     </span>
                   )}
                   {isOverdue && (
                     <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                       <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span> Atrasado
                     </span>
                   )}
                </div>
              </div>

              <button 
                onClick={() => onDelete(task.id)} 
                className="w-11 h-11 flex items-center justify-center rounded-xl text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all active:scale-90"
              >
                <span className="material-symbols-outlined !text-xl">delete</span>
              </button>
            </div>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center space-y-4 opacity-40">
            <span className="material-symbols-outlined !text-6xl text-theme-muted">inventory_2</span>
            <p className="font-black uppercase tracking-[0.2em] text-[11px] text-theme-muted">Nenhum resultado</p>
            <button onClick={() => { setFilterCategory('all'); setFilterPriority('all'); setSearchQuery(''); }} className="text-xs font-black text-theme-accent uppercase underline tracking-widest active:scale-95">Limpar Filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
