
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
  
  const energyValues = Object.values(user.dailyEnergy || {}) as number[];
  const avgEnergy = energyValues.length > 0 ? (energyValues.reduce((a: number, b: number) => a + b, 0) / energyValues.length).toFixed(1) : "0.0";

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <h2 className="text-5xl font-black text-theme-text tracking-tighter">Insights do Perfil</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2">Conclusão de Projetos</p>
          <p className="text-6xl font-black text-theme-text">{completionRate}%</p>
          <div className="w-full h-2 bg-theme-bg rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-theme-accent transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
        <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2">Média de Foco (Energia)</p>
          <p className="text-6xl font-black text-theme-text">{avgEnergy}</p>
          <p className="text-[10px] font-bold text-theme-muted mt-2 uppercase tracking-widest">NÍVEL DE 1 A 5</p>
        </div>
        <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border shadow-sm text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted mb-2">Constância de Hábitos</p>
          <p className="text-6xl font-black text-theme-text">+{totalStreaks}</p>
          <p className="text-[10px] font-bold text-theme-muted mt-2 uppercase tracking-widest">TOTAL DE DIAS ATIVOS</p>
        </div>
      </div>

      <div className="bg-theme-accent text-theme-card p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-3xl font-black tracking-tight">Análise Estratégica</h3>
          <p className="text-theme-card/80 text-lg leading-relaxed max-w-2xl font-medium">
            Seu perfil demonstra uma <b className="text-theme-card">Excelência Organizacional</b> sólida. Sua consistência nos hábitos de <b className="text-theme-card">{habits.length}</b> áreas diferentes é o seu maior ponto forte. 
            Mantenha a média de energia acima de <b className="text-theme-card">4.0</b> para garantir a execução total das suas tarefas complexas.
          </p>
          <div className="pt-4">
             <span className="px-6 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Meta de Performance: 90% Conclusão</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
