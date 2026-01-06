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
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10 page-transition pb-32">
      {/* Header Padronizado */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-theme-card rounded-[2rem] flex items-center justify-center shadow-sm border border-theme-border">
            <span className="material-symbols-outlined !text-4xl text-theme-accent leading-none">format_list_bulleted</span>
          </div>
          <div>
            <h2 className="text-5xl font-black text-theme-text tracking-tighter leading-none">Minhas Tarefas</h2>
            <p className="text-theme-muted font-bold mt-2 tracking-widest uppercase text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {pendingCount} itens pendentes hoje
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowCatManager(!showCatManager)}
            className="px-6 py-3 bg-theme-card border border-theme-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all"
          >
            Categorias
          </button>
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`
              w-14 h-14 md:w-16 md:h-16 rounded-full 
              flex items-center justify-center 
              transition-all duration-500 shadow-xl
              ${isAdding 
                ? 'bg-rose-500 text-white rotate-45' 
                : 'bg-theme-accent text-theme-card hover:scale-110'
              }
            `}
          >
            <span className="material-symbols-outlined !text-4xl leading-none flex items-center justify-center">add</span>
          </button>
        </div>
      </header>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <input 
            type="text" 
            placeholder="Buscar em todas as tarefas..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-theme-card rounded-[2rem] border border-theme-border shadow-sm focus:ring-4 focus:ring-theme-accent/5 outline-none font-bold text-sm text-theme-text"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30">
            <span className="material-symbols-outlined !text-3xl leading-none">search</span>
          </span>
        </div>
        <div className="md:col-span-4">
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-6 py-5 bg-theme-card rounded-[2rem] border border-theme-border shadow-sm outline-none font-black text-[10px] uppercase tracking-widest text-theme-muted appearance-none cursor-pointer"
          >
            <option value="all">Todas Categorias</option>
            {userCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Painel de Categorias */}
      {showCatManager && (
        <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-xl space-y-8 animate-in zoom-in duration-300">
          <div className="flex justify-between items-center">
             <h4 className="text-[11px] font-black uppercase tracking-widest text-theme-muted opacity-60">Suas Listas</h4>
             <button onClick={() => setShowCatManager(false)} className="text-theme-muted hover:text-theme-text w-10 h-10 flex items-center justify-center">
               <span className="material-symbols-outlined !text-2xl leading-none">close</span>
             </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userCategories.map(cat => (
              <div key={cat} className="bg-theme-bg px-5 py-3 rounded-2xl border border-theme-border flex items-center gap-4 group">
                <span className="text-[10px] font-black uppercase tracking-tight text-theme-text">{cat}</span>
                <button 
                  onClick={() => onUpdateCategories(userCategories.filter(c => c !== cat))} 
                  className="text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined !text-lg leading-none">close</span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-theme-border">
            <input 
              type="text" 
              placeholder="Nome da nova lista..." 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 bg-theme-bg p-5 rounded-2xl outline-none text-xs font-bold border-2 border-transparent focus:border-theme-accent/20" 
            />
            <button onClick={handleAddCategory} className="bg-theme-accent text-theme-card px-8 rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Criar</button>
          </div>
        </div>
      )}

      {/* Formulário de Nova Tarefa */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-theme-card p-12 rounded-[4rem] border border-theme-border shadow-2xl space-y-10 animate-in slide-in-from-top duration-500">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest px-6 text-theme-muted opacity-40">Título da Tarefa</label>
            <input
              autoFocus
              type="text"
              placeholder="O que vamos realizar hoje?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-3xl font-black p-8 bg-theme-bg rounded-[2.5rem] outline-none border-2 border-transparent focus:border-theme-accent transition-all text-theme-text"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest px-6 text-theme-muted opacity-40">Prazo</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-theme-bg p-6 rounded-3xl text-xs font-black outline-none border-2 border-transparent focus:border-theme-accent transition-all text-theme-text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest px-6 text-theme-muted opacity-40">Agendar (Opcional)</label>
              <select
                value={newScheduledHour}
                onChange={(e) => setNewScheduledHour(e.target.value)}
                className="w-full bg-theme-bg p-6 rounded-3xl text-xs font-black outline-none border-2 border-transparent focus:border-theme-accent transition-all appearance-none text-theme-text"
              >
                <option value="none">Livre</option>
                {hours.map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest px-6 text-theme-muted opacity-40">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-theme-bg p-6 rounded-3xl text-xs font-black outline-none border-2 border-transparent focus:border-theme-accent transition-all appearance-none text-theme-text"
              >
                {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-8 bg-theme-accent text-theme-card rounded-[2.5rem] font-black text-xl shadow-2xl hover:opacity-95 transition-all active:scale-[0.98]">
            Adicionar à Lista
          </button>
        </form>
      )}

      {/* Lista de Tarefas */}
      <div className="space-y-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isDueToday = !task.completed && task.dueDate === todayStr;
            
            return (
              <div
                key={task.id}
                className={`
                  flex items-center justify-between 
                  p-6 md:p-10 rounded-[3rem] border 
                  transition-all duration-300 group
                  ${task.completed 
                    ? 'bg-theme-bg border-transparent opacity-60' 
                    : isOverdue 
                      ? 'bg-rose-50/50 border-rose-100' 
                      : 'bg-theme-card border-theme-border shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }
                `}
              >
                <div className="flex items-center gap-8 cursor-pointer flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                  {/* Checkbox Circular Material */}
                  <div className={`
                    relative w-14 h-14 rounded-full flex items-center justify-center 
                    transition-all duration-500 shrink-0 border-2
                    ${task.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isOverdue
                        ? 'bg-white border-rose-200'
                        : 'bg-theme-bg border-theme-border group-hover:border-theme-accent'
                    }
                  `}>
                    {task.completed ? (
                      <span className="material-symbols-outlined !text-3xl animate-in zoom-in leading-none">check</span>
                    ) : (
                      (isOverdue || isDueToday) && (
                        <span className={`material-symbols-outlined !text-2xl ${isOverdue ? 'text-rose-500' : 'text-amber-500'} animate-pulse leading-none`}>priority_high</span>
                      )
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`font-black text-xl tracking-tight truncate transition-all ${
                      task.completed 
                        ? 'line-through text-theme-muted italic' 
                        : 'text-theme-text'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 overflow-x-auto no-scrollbar">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-theme-accent/5 text-theme-muted px-3 py-1.5 rounded-xl shrink-0">
                        {task.category}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate?.(task.dueDate); }}
                        className={`text-[9px] font-bold flex items-center gap-1.5 hover:text-theme-accent shrink-0 ${
                          isOverdue ? 'text-rose-500' : 'text-theme-muted'
                        }`}
                      >
                        <span className="material-symbols-outlined !text-lg leading-none">calendar_today</span> {task.dueDate === todayStr ? 'Hoje' : task.dueDate} 
                        {task.scheduledHour !== undefined && ` • ${task.scheduledHour}:00`}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center ml-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white text-theme-muted active:scale-90"
                    aria-label="Excluir"
                  >
                    <span className="material-symbols-outlined !text-3xl leading-none flex items-center justify-center">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 bg-theme-card rounded-[2.5rem] border border-theme-border flex items-center justify-center text-5xl mx-auto shadow-sm grayscale opacity-30">
              <span className="material-symbols-outlined !text-5xl leading-none">auto_awesome</span>
            </div>
            <div className="space-y-2">
              <p className="font-black text-theme-text text-xl">Nenhuma tarefa encontrada</p>
              <p className="text-sm text-theme-muted font-medium max-w-xs mx-auto">Tente ajustar seus filtros ou crie um novo desafio para hoje.</p>
            </div>
            <button 
              onClick={() => {setSearchQuery(''); setFilterCategory('all');}}
              className="text-[10px] font-black uppercase tracking-widest text-theme-accent hover:underline"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;