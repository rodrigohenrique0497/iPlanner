
import React from 'react';
import { Task, Habit, User } from '../types';

interface InsightsProps {
  tasks: Task[];
  habits: Habit[];
  user: User;
}

const Insights: React.FC<InsightsProps> = ({ tasks, habits, user }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  
  // Fix: Explicitly cast to number array and provide types for reduce to avoid 'unknown' operator errors
  const energyValues = Object.values(user.dailyEnergy || {}) as number[];
  const avgEnergy = energyValues.length > 0 ? (energyValues.reduce((a: number, b: number) => a + b, 0) / energyValues.length).toFixed(1) : "0.0";

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 page-transition">
      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Insights do Perfil</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Conclusão de Projetos</p>
          <p className="text-6xl font-black text-slate-900">{completionRate}%</p>
          <div className="w-full h-2 bg-slate-50 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-rosa-pastel" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Média de Foco (Energia)</p>
          <p className="text-6xl font-black text-slate-900">{avgEnergy}</p>
          <p className="text-[10px] font-bold text-slate-300 mt-2">NÍVEL DE 1 A 5</p>
        </div>
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Habit Points</p>
          <p className="text-6xl font-black text-slate-900">+{totalStreaks * 10}</p>
          <p className="text-[10px] font-bold text-slate-300 mt-2">PONTOS DE CONSISTÊNCIA</p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-3xl font-black tracking-tight">Análise Pessoal</h3>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
            Seu perfil está classificado como <b>Mestre da Clareza</b>. Sua consistência nos hábitos de <b>{habits.length}</b> áreas diferentes é o seu maior ponto forte. 
            Mantenha a média de energia em <b>4.0</b> para maximizar seus ganhos de XP semanal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
