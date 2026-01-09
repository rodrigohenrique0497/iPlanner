
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
      if (!hasPerm) alert("Ative as notificações para lembretes.");
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
    [Priority.LOW]: { badge: 'text-blue-500 bg-blue-500/10 border-blue-500/20', solid: 'bg-blue-500 text-white' },
    [Priority.MEDIUM]: { badge: 'text-amber-500 bg-amber-500/10 border-amber-500/20', solid: 'bg-amber-500 text-white' },
    [Priority.HIGH]: { badge: 'text-rose-500 bg-rose-500/10 border-rose-500/20', solid: 'bg-rose-500 text-white' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-12 py-6 md:py-12 space-y-8 page-transition pb-32 overflow-x-hidden">
      <header className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-theme-accent text-theme-card rounded-2xl flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl md:!text-3xl">checklist</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-4xl font-black text-theme-text tracking-tighter truncate">Tarefas</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted opacity-60 truncate">Lembretes & Execução</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-premium transition-all active:scale-90 shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-2xl">{isAdding ? 'close' : 'add'}</span>
        </button>
      </header>

      {isAdding && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="bg-theme-card p-5 md:p-12 rounded-[2rem] border border-theme-border shadow-premium space-y-6 overflow-hidden w-full">
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="O que você precisa fazer?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xl md:text-2xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-20 p-0 text-left"
              />
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase text-theme-muted tracking-widest opacity-60 block text-center">Cat.</label>
                  <div className="relative w-full">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-premium input-picker-premium text-[10px] w-full">
                      {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase text-theme-muted tracking-widest opacity-60 block text-center">Prio.</label>
                  <div className="flex bg-theme-bg p-1 rounded-xl border border-theme-border h-[4.5rem] w-full items-center">
                    {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                      <button key={p} type="button" onClick={() => setNewPriority(p)} className={`flex-1 h-full rounded-lg text-[8px] font-black uppercase transition-all ${newPriority === p ? priorityStyleMap[p].solid : 'text-theme-muted opacity-40'}`}>
                        {p[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase text-theme-muted tracking-widest opacity-60 block text-center">Data</label>
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="input-premium input-picker-premium text-[10px] w-full" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase text-theme-muted tracking-widest opacity-60 block text-center">Hora</label>
                  <input type="time" value={newReminderTime} onChange={e => setNewReminderTime(e.target.value)} className="input-premium input-picker-premium text-[10px] w-full" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
              <button type="submit" className="btn-action-primary flex-1">CRIAR</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary flex-1">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div key={task.id} className={`flex items-center gap-4 p-5 md:p-8 rounded-[1.75rem] border transition-all ${task.completed ? 'bg-theme-bg border-transparent opacity-50' : 'bg-theme-card border-theme-border shadow-sm'}`}>
              <button onClick={() => onToggle(task.id)} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card' : 'bg-theme-bg border-theme-border'}`}>
                <span className={`material-symbols-outlined !text-xl ${task.completed ? 'opacity-100' : 'opacity-0'}`}>check</span>
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-[15px] md:text-[17px] truncate ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-theme-accent-soft text-theme-accent rounded-lg shrink-0">{task.category}</span>
                  {task.reminder && !task.completed && (
                    <span className="text-[8px] font-black text-theme-muted uppercase tracking-widest shrink-0">{task.reminder}</span>
                  )}
                  {isOverdue && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest shrink-0">Atrasado</span>}
                </div>
              </div>
              <button onClick={() => onDelete(task.id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-theme-muted active:text-rose-600 transition-all shrink-0">
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
