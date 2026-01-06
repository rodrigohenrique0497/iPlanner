
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
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{type === 'monthly' ? 'Objetivos do Mês' : 'Metas do Ano'}</h2>
          <p className="text-slate-500 font-medium mt-2">Visão macro do seu sucesso pessoal.</p>
        </div>
        
        {/* FAB PADRONIZADO PREMIUM */}
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-slate-900 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all focus:outline-none group relative"
        >
          <span className="text-3xl md:text-5xl font-light leading-none select-none flex items-center justify-center">+</span>
          <div className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-105 transition-transform"></div>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl animate-in fade-in zoom-in space-y-6">
          <input 
            type="text" 
            placeholder="Ex: Aprender React Avançado" 
            className="w-full text-2xl font-black p-6 bg-slate-50 rounded-3xl outline-none border-2 border-transparent focus:border-azul-pastel transition-all"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className="flex gap-4">
            <button onClick={handleAdd} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]">Adicionar</button>
            <button onClick={() => setIsAdding(false)} className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight truncate">{goal.title}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Progresso Atual: {goal.progress}%</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {/* BOTÕES DE CONTROLE PADRONIZADOS */}
                <button 
                  onClick={() => updateProgress(goal.id, -10)} 
                  className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl font-black hover:bg-slate-100 transition-all active:scale-90"
                >
                  <span className="flex items-center justify-center leading-none mt-[-2px] select-none">−</span>
                </button>
                <button 
                  onClick={() => updateProgress(goal.id, 10)} 
                  className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl font-black hover:bg-black transition-all active:scale-90"
                >
                  <span className="flex items-center justify-center leading-none mt-[-2px] select-none">+</span>
                </button>
              </div>
            </div>
            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-700 ${goal.completed ? 'bg-emerald-400' : 'bg-rosa-pastel'}`}
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
