
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onAdd: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle, onAdd, onDelete }) => {
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 md:space-y-12 page-transition pb-32">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter">Hábitos</h2>
        <p className="text-theme-muted font-medium text-base md:text-lg italic opacity-80">"Somos o que repetidamente fazemos."</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-4 items-center bg-theme-card p-3 rounded-[2rem] border border-theme-border shadow-sm">
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Novo hábito..." 
          className="flex-1 bg-transparent px-4 py-2.5 outline-none font-bold text-theme-text placeholder:opacity-40"
        />
        <button 
          type="submit" 
          className="w-12 h-12 bg-theme-accent text-theme-card rounded-full flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined !text-2xl leading-none">add</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map(habit => {
          const isDone = habit.lastCompleted === today;
          return (
            <div key={habit.id} className="bg-theme-card p-8 rounded-[2.5rem] border border-theme-border shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all h-full">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 ${habit.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none`}>
                  <span className="material-symbols-outlined !text-2xl leading-none flex items-center justify-center text-theme-text">
                    {isDone ? 'auto_awesome' : 'autorenew'}
                  </span>
                </div>
                <button 
                  onClick={() => onDelete(habit.id)} 
                  className="opacity-0 group-hover:opacity-100 w-10 h-10 flex items-center justify-center rounded-xl text-theme-muted hover:text-red-500 hover:bg-rose-50 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-xl leading-none">delete</span>
                </button>
              </div>
              <div className="mt-8 mb-8">
                <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tight leading-tight">{habit.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-orange-500 font-black text-base flex items-center gap-1">
                    <span className="material-symbols-outlined !text-lg">local_fire_department</span> {habit.streak}
                  </span>
                  <span className="text-[9px] font-black uppercase text-theme-muted tracking-widest opacity-60">DIAS DE SEQUÊNCIA</span>
                </div>
              </div>
              
              <button 
                onClick={() => onToggle(habit.id)}
                className={`w-full py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-glow ${
                  isDone 
                  ? 'bg-theme-bg text-theme-muted cursor-default border border-theme-border' 
                  : 'bg-theme-accent text-theme-card hover:opacity-95'
                }`}
              >
                {isDone ? (
                  <>
                    <span className="material-symbols-outlined !text-lg">task_alt</span>
                    Concluído Hoje
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined !text-lg">check_circle</span>
                    Marcar como Feito
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
