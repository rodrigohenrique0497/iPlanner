
import React, { useState, useMemo } from 'react';
import { Task, Priority } from '../types';
import { notificationService } from '../services/notificationService';

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
  const [newReminderTime, setNewReminderTime] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [tasks, searchQuery, filterCategory, filterPriority]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (newReminderTime) {
      const hasPerm = await notificationService.requestPermission();
      if (!hasPerm) alert("Ative as notificações para receber lembretes.");
    }

    onAdd({
      title: newTitle,
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      reminder: newReminderTime || undefined,
      notified: false
    });
    
    setNewTitle('');
    setNewReminderTime('');
    setIsAdding(false);
  };

  const priorityStyleMap = {
    [Priority.LOW]: { badge: 'text-blue-500 bg-blue-500/10 border-blue-500/20', solid: 'bg-blue-500 text-white shadow-glow' },
    [Priority.MEDIUM]: { badge: 'text-amber-500 bg-amber-500/10 border-amber-500/20', solid: 'bg-amber-500 text-white shadow-glow' },
    [Priority.HIGH]: { badge: 'text-rose-500 bg-rose-500/10 border-rose-500/20', solid: 'bg-rose-500 text-white shadow-glow' },
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-12 py-6 md:py-12 space-y-10 page-transition pb-32 overflow-hidden">
      <header className="flex justify-between items-center w-full">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-theme-accent text-theme-card rounded-2xl flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl">checklist</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-4xl font-black text-theme-text tracking-tighter truncate leading-none">Tarefas</h2>
            <p className="text-theme-muted font-bold text-[9px] uppercase tracking-[0.3em] opacity-60 mt-1 truncate">Gestão & Execução</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium transition-all active:scale-90 shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-[2rem]">{isAdding ? 'close' : 'add'}</span>
        </button>
      </header>

      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500 w-full">
          <form onSubmit={handleSubmit} className="bg-theme-card p-6 md:p-12 rounded-[2.5rem] border-2 border-theme-border shadow-premium space-y-10 w-full overflow-hidden">
            <div className="space-y-10">
              <input 
                autoFocus
                type="text" 
                placeholder="Qual a missão?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-20 p-0 text-center tracking-tighter"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-40 block text-center">Categoria</label>
                  <div className="relative w-full">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-premium uppercase tracking-widest text-[11px] appearance-none cursor-pointer">
                      {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-theme-muted opacity-40">expand_more</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-40 block text-center">Prioridade</label>
                  <div className="flex bg-theme-bg p-1.5 rounded-2xl border-2 border-theme-border h-[4.5rem] w-full gap-1">
                    {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                      <button key={p} type="button" onClick={() => setNewPriority(p)} className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all tracking-tight ${newPriority === p ? priorityStyleMap[p].solid : 'text-theme-muted opacity-40 hover:opacity-100'}`}>
                        {p === Priority.LOW ? 'Baixa' : p === Priority.MEDIUM ? 'Média' : 'Alta'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-40 block text-center">Data Entrega</label>
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="input-premium text-[12px]" />
                </div>

                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-40 block text-center">Lembrete</label>
                  <input type="time" value={newReminderTime} onChange={e => setNewReminderTime(e.target.value)} className="input-premium text-[12px]" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-4 w-full">
              <button type="submit" className="btn-action-primary">CONFIRMAR TAREFA</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4 w-full">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div key={task.id} className={`flex items-center gap-5 p-5 md:p-8 rounded-[2rem] border transition-all duration-300 w-full ${task.completed ? 'bg-theme-bg border-transparent opacity-50' : 'bg-theme-card border-theme-border shadow-sm hover:shadow-premium'}`}>
              <button onClick={() => onToggle(task.id)} className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card shadow-glow' : 'bg-theme-bg border-theme-border opacity-50'}`}>
                <span className={`material-symbols-outlined !text-2xl ${task.completed ? 'opacity-100' : 'opacity-0'}`}>check</span>
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-[16px] md:text-[18px] truncate tracking-tight ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-theme-accent-soft text-theme-accent rounded-lg">{task.category}</span>
                  {task.reminder && !task.completed && (
                    <div className="flex items-center gap-1 text-[8px] font-black text-theme-accent uppercase tracking-widest">
                      <span className="material-symbols-outlined !text-[12px]">alarm</span>
                      {task.reminder}
                    </div>
                  )}
                  {isOverdue && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Atrasado</span>}
                </div>
              </div>
              <button onClick={() => onDelete(task.id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-theme-muted hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0">
                <span className="material-symbols-outlined !text-xl">delete</span>
              </button>
            </div>
          );
        }) : (
          <div className="py-24 text-center opacity-20">
             <span className="material-symbols-outlined !text-5xl">inventory_2</span>
             <p className="text-[10px] font-black uppercase tracking-widest mt-4">Nenhuma tarefa pendente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
