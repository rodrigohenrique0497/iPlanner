
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
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-10 md:py-10 space-y-8 md:space-y-10 page-transition pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-theme-card rounded-planner-sm flex items-center justify-center shadow-sm border border-theme-border shrink-0">
            <span className="material-symbols-outlined !text-2xl md:!text-4xl text-theme-accent leading-none">format_list_bulleted</span>
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-theme-text tracking-tighter leading-none">Minhas Tarefas</h2>
            <p className="text-theme-muted font-bold mt-1 md:mt-2 tracking-widest uppercase text-[8px] md:text-[10px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {pendingCount} itens pendentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowCatManager(!showCatManager)}
            className="flex-1 md:flex-none px-5 py-3 md:px-6 md:py-3 bg-theme-card border border-theme-border rounded-planner-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all"
          >
            Listas
          </button>
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`
              w-12 h-12 md:w-16 md:h-16 rounded-full 
              flex items-center justify-center shrink-0
              transition-all duration-500 shadow-xl
              ${isAdding 
                ? 'bg-rose-500 text-white rotate-45' 
                : 'bg-theme-accent text-theme-card hover:scale-105 active:scale-95'
              }
            `}
          >
            <span className="material-symbols-outlined !text-3xl md:!text-4xl leading-none">add</span>
          </button>
        </div>
      </header>

      {/* Barra de Filtros */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4">
        <div className="md:col-span-8 relative">
          <input 
            type="text" 
            placeholder="Buscar tarefas..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 md:pl-14 pr-4 py-4 md:py-5 bg-theme-card rounded-planner-sm border border-theme-border shadow-sm focus:ring-4 focus:ring-theme-accent-soft outline-none font-bold text-sm text-theme-text"
          />
          <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 opacity-30">
            <span className="material-symbols-outlined !text-2xl md:!text-3xl leading-none">search</span>
          </span>
        </div>
        <div className="md:col-span-4">
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-5 py-4 md:py-5 bg-theme-card rounded-planner-sm border border-theme-border shadow-sm outline-none font-black text-[9px] md:text-[10px] uppercase tracking-widest text-theme-muted appearance-none cursor-pointer"
          >
            <option value="all">Categorias</option>
            {userCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Lista de Tarefas Otimizada */}
      <div className="space-y-3 md:space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isDueToday = !task.completed && task.dueDate === todayStr;
            
            return (
              <div
                key={task.id}
                className={`
                  flex items-center justify-between 
                  p-4 md:p-8 rounded-planner-sm border 
                  transition-all duration-300 group
                  ${task.completed 
                    ? 'bg-theme-bg border-transparent opacity-60' 
                    : isOverdue 
                      ? 'bg-rose-50/50 border-rose-100' 
                      : 'bg-theme-card border-theme-border shadow-sm hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-center gap-4 md:gap-6 cursor-pointer flex-1 min-w-0" onClick={() => onToggle(task.id)}>
                  <div className={`
                    relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                    transition-all duration-500 shrink-0 border-2
                    ${task.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isOverdue
                        ? 'bg-white border-rose-200'
                        : 'bg-theme-bg border-theme-border group-hover:border-theme-accent'
                    }
                  `}>
                    {task.completed ? (
                      <span className="material-symbols-outlined !text-xl md:!text-2xl animate-in zoom-in leading-none">check</span>
                    ) : (
                      (isOverdue || isDueToday) && (
                        <span className={`material-symbols-outlined !text-lg md:!text-xl ${isOverdue ? 'text-rose-500' : 'text-amber-500'} animate-pulse leading-none`}>priority_high</span>
                      )
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className={`font-black text-sm md:text-lg tracking-tight truncate transition-all ${
                      task.completed ? 'line-through text-theme-muted italic' : 'text-theme-text'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 overflow-hidden">
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest bg-theme-accent-soft text-theme-muted px-2 py-1 rounded-full shrink-0">
                        {task.category}
                      </span>
                      <span className={`text-[7px] md:text-[8px] font-bold flex items-center gap-1 shrink-0 ${
                        isOverdue ? 'text-rose-500' : 'text-theme-muted/60'
                      }`}>
                        {task.dueDate === todayStr ? 'Hoje' : task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center ml-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-100 transition-all text-theme-muted hover:text-rose-500 active:scale-90"
                  >
                    <span className="material-symbols-outlined !text-2xl leading-none">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4">
            <span className="material-symbols-outlined !text-4xl md:!text-6xl text-theme-muted opacity-20">cloud_done</span>
            <p className="font-bold text-theme-muted text-sm md:text-base">Tudo limpo por aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
