
import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalViewProps {
  type: 'monthly' | 'annual';
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onUpdate: (goals: Goal[]) => void;
}

const GoalView: React.FC<GoalViewProps> = ({ type, goals, onAdd, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      targetDate: new Date().toISOString(),
      progress: 0,
      type,
      completed: false
    };
    onAdd(goal);
    setNewTitle('');
    setIsAdding(false);
  };

  const updateProgress = (id: string, increment: number) => {
    onUpdate(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + increment)), completed: g.progress + increment >= 100 } : g));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 md:space-y-12 page-transition pb-32">
      <div className="flex justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-theme-text tracking-tighter leading-none">{type === 'monthly' ? 'Objetivos' : 'Metas'}</h2>
          <p className="text-theme-muted font-bold mt-2 text-sm md:text-base opacity-80 uppercase tracking-widest">{type === 'monthly' ? 'Visão Mensal' : 'Visão Anual'}</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-premium hover:scale-105 active:scale-95 transition-all shrink-0 ${isAdding ? 'bg-rose-500 text-white' : 'bg-theme-accent text-theme-card'}`}
        >
          <span className="material-symbols-outlined !text-3xl leading-none">{isAdding ? 'close' : 'add'}</span>
        </button>
      </div>

      {/* Formulário de Meta Inline */}
      {isAdding && (
        <div className="animate-in slide-in-from-top-6 duration-500">
          <div className="bg-theme-card p-8 md:p-12 rounded-[2.5rem] border border-theme-border shadow-premium space-y-10">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-theme-text uppercase">Definir Objetivo</h3>
            </div>
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                placeholder="Qual o seu grande objetivo?" 
                className="w-full h-16 bg-theme-bg px-7 rounded-2xl border border-theme-border outline-none font-bold text-lg text-theme-text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleAdd} className="btn-action-primary flex-1 shadow-glow">ADICIONAR META</button>
              <button onClick={() => setIsAdding(false)} className="btn-action-secondary flex-1">CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-theme-card p-8 md:p-10 rounded-[2.5rem] border border-theme-border shadow-sm space-y-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tight truncate leading-tight">{goal.title}</h3>
                <p className="text-[9px] font-black text-theme-muted mt-1.5 uppercase tracking-widest opacity-60">Progresso: {goal.progress}%</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => updateProgress(goal.id, -10)} 
                  className="w-10 h-10 rounded-xl bg-theme-bg flex items-center justify-center text-theme-text border border-theme-border transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-xl leading-none">remove</span>
                </button>
                <button 
                  onClick={() => updateProgress(goal.id, 10)} 
                  className="w-10 h-10 rounded-xl bg-theme-accent text-theme-card flex items-center justify-center shadow-sm hover:opacity-90 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-xl leading-none">add</span>
                </button>
              </div>
            </div>
            <div className="w-full h-3 bg-theme-bg rounded-full overflow-hidden border border-theme-border/50">
              <div 
                className={`h-full transition-all duration-700 ${goal.completed ? 'bg-emerald-500' : 'bg-theme-accent'}`}
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
        {goals.length === 0 && !isAdding && (
          <div className="py-24 text-center opacity-30 space-y-4">
             <span className="material-symbols-outlined !text-5xl">flag</span>
             <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma meta cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalView;
