
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
    [Priority.LOW]: { badge: 'text-blue-500 bg-blue-500/10 border-blue-500/20', solid: 'bg-blue-500 text-white shadow-glow', label: 'Baixa' },
    [Priority.MEDIUM]: { badge: 'text-amber-500 bg-amber-500/10 border-amber-500/20', solid: 'bg-amber-500 text-white shadow-glow', label: 'Média' },
    [Priority.HIGH]: { badge: 'text-rose-500 bg-rose-500/10 border-rose-500/20', solid: 'bg-rose-500 text-white shadow-glow', label: 'Alta' },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-12 py-6 md:py-12 space-y-8 page-transition pb-32 overflow-x-hidden">
      <header className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-theme-accent text-theme-card rounded-2xl flex items-center justify-center shadow-premium shrink-0">
            <span className="material-symbols-outlined !text-2xl md:!text-3xl">checklist</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-4xl font-black text-theme-text tracking-tighter truncate">Tarefas</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted opacity-60 truncate">Lembretes & Execução</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-premium transition-all active:scale-90 shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-2xl">{isAdding ? 'close' : 'add'}</span>
        </button>
      </header>

      {isAdding && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="bg-theme-card p-6 md:p-14 rounded-[2.5rem] border border-theme-border shadow-premium space-y-10 overflow-hidden w-full">
            <div className="space-y-8">
              <input 
                autoFocus
                type="text" 
                placeholder="O que você precisa fazer?"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-black bg-transparent border-none outline-none text-theme-text placeholder:opacity-20 p-0 text-left"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 w-full">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-60 block ml-4">Categoria</label>
                  <div className="relative w-full">
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="input-premium input-picker-premium text-[12px] w-full uppercase tracking-widest">
                      {userCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-60 block ml-4">Prioridade</label>
                  <div className="flex bg-theme-bg/50 p-2 rounded-[1.75rem] border-2 border-theme-border h-[4.5rem] w-full items-center gap-1.5">
                    {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => setNewPriority(p)} 
                        className={`flex-1 h-full rounded-2xl text-[10px] font-black uppercase transition-all tracking-tighter flex items-center justify-center ${newPriority === p ? priorityStyleMap[p].solid : 'text-theme-muted opacity-40 hover:opacity-100'}`}
                      >
                        {priorityStyleMap[p].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-60 block ml-4">Data Limite</label>
                  <input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="input-premium input-picker-premium text-[12px] w-full" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-theme-muted tracking-widest opacity-60 block ml-4">Lembrete</label>
                  <input type="time" value={newReminderTime} onChange={e => setNewReminderTime(e.target.value)} className="input-premium input-picker-premium text-[12px] w-full" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4 w-full">
              <button type="submit" className="btn-action-primary flex-1">
                <span className="material-symbols-outlined">check_circle</span>
                CONFIRMAR TAREFA
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary flex-1">
                <span className="material-symbols-outlined">delete_forever</span>
                DESCARTAR
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const isOverdue = !task.completed && task.dueDate < todayStr;
          return (
            <div key={task.id} className={`flex items-center gap-4 p-5 md:p-8 rounded-[2rem] border transition-all duration-300 ${task.completed ? 'bg-theme-bg border-transparent opacity-50' : 'bg-theme-card border-theme-border shadow-sm hover:shadow-md'}`}>
              <button onClick={() => onToggle(task.id)} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${task.completed ? 'bg-theme-accent border-theme-accent text-theme-card shadow-glow' : 'bg-theme-bg border-theme-border opacity-50'}`}>
                <span className={`material-symbols-outlined !text-2xl ${task.completed ? 'opacity-100' : 'opacity-0'}`}>check</span>
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-[16px] md:text-[18px] truncate tracking-tight ${task.completed ? 'line-through text-theme-muted' : 'text-theme-text'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar whitespace-nowrap">
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-theme-accent-soft text-theme-accent rounded-lg shrink-0">{task.category}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shrink-0 ${priorityStyleMap[task.priority].badge}`}>
                    {priorityStyleMap[task.priority].label}
                  </span>
                  {task.reminder && !task.completed && (
                    <span className="text-[9px] font-black text-theme-muted uppercase tracking-widest shrink-0 flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[12px]">alarm</span> {task.reminder}
                    </span>
                  )}
                  {isOverdue && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest shrink-0">Atrasado</span>}
                </div>
              </div>
              <button onClick={() => onDelete(task.id)} className="w-12 h-12 flex items-center justify-center rounded-2xl text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all shrink-0">
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
