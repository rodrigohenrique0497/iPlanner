
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
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12 page-transition">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-theme-text tracking-tighter">{type === 'monthly' ? 'Objetivos do Mês' : 'Metas do Ano'}</h2>
          <p className="text-theme-muted font-medium mt-2">Visão macro do seu sucesso pessoal.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)} 
          className="w-14 h-14 md:w-16 md:h-16 bg-theme-accent text-theme-card rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined !text-4xl leading-none">add</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-2xl animate-in fade-in zoom-in space-y-6">
          <input 
            type="text" 
            placeholder="Ex: Aprender React Avançado" 
            className="w-full text-2xl font-black p-6 bg-theme-bg rounded-3xl outline-none border-2 border-transparent focus:border-theme-accent transition-all text-theme-text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="flex gap-4">
            <button onClick={handleAdd} className="flex-1 py-5 bg-theme-accent text-theme-card rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-[0.98]">Adicionar</button>
            <button onClick={() => setIsAdding(false)} className="px-10 py-5 bg-theme-bg text-theme-muted rounded-2xl font-black uppercase tracking-widest hover:bg-theme-card transition-all active:scale-[0.98]">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-sm space-y-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h3 className="text-2xl font-black text-theme-text tracking-tight truncate">{goal.title}</h3>
                <p className="text-xs font-bold text-theme-muted mt-1 uppercase tracking-widest">Progresso Atual: {goal.progress}%</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => updateProgress(goal.id, -10)} 
                  className="w-12 h-12 rounded-xl bg-theme-bg flex items-center justify-center text-theme-text font-black hover:bg-theme-border transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-2xl leading-none flex items-center justify-center">remove</span>
                </button>
                <button 
                  onClick={() => updateProgress(goal.id, 10)} 
                  className="w-12 h-12 rounded-xl bg-theme-accent text-theme-card flex items-center justify-center font-black hover:opacity-90 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined !text-2xl leading-none flex items-center justify-center">add</span>
                </button>
              </div>
            </div>
            <div className="w-full h-4 bg-theme-bg rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-700 ${goal.completed ? 'bg-emerald-400' : 'bg-theme-accent'}`}
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalView;
