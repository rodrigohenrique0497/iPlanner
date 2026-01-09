
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const colors = ['bg-rose-100', 'bg-blue-100', 'bg-amber-100', 'bg-emerald-100', 'bg-indigo-100'];
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      streak: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 md:space-y-12 page-transition pb-32 overflow-x-hidden">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter">Hábitos</h2>
          <p className="text-theme-muted font-medium text-base md:text-lg italic opacity-80">Cultive sua disciplina.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-3xl">{isAdding ? 'close' : 'add'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <form onSubmit={handleAdd} className="bg-theme-card p-8 md:p-12 rounded-[2.5rem] border-2 border-theme-border shadow-premium space-y-10 overflow-hidden w-full">
            <h3 className="text-xl font-black text-theme-text uppercase px-4">Novo Hábito</h3>
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Qual hábito quer cultivar?" 
                className="input-premium"
              />
            </div>
            <div className="flex flex-col gap-5">
              <button type="submit" className="btn-action-primary">INICIAR JORNADA</button>
              <button type="button" onClick={() => setIsAdding(false)} className="btn-action-secondary">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map(habit => {
          const isDone = habit.lastCompleted === today;
          return (
            <div key={habit.id} className="bg-theme-card p-8 rounded-[2.5rem] border-2 border-theme-border shadow-sm flex flex-col justify-between group transition-all h-full">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 ${habit.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
                  <span className="material-symbols-outlined !text-2xl text-theme-text">
                    {isDone ? 'auto_awesome' : 'autorenew'}
                  </span>
                </div>
                <button onClick={() => onDelete(habit.id)} className="w-10 h-10 flex items-center justify-center rounded-xl text-theme-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <div className="my-8">
                <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tight">{habit.title}</h3>
                <span className="text-orange-500 font-black text-base flex items-center gap-1 mt-2">
                  <span className="material-symbols-outlined !text-lg">local_fire_department</span> {habit.streak} Dias
                </span>
              </div>
              
              <button 
                onClick={() => onToggle(habit.id)}
                className={isDone ? 'btn-action-secondary opacity-50' : 'btn-action-primary'}
                disabled={isDone}
              >
                {isDone ? 'CONCLUÍDO HOJE' : 'MARCAR COMO FEITO'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
