
import React from 'react';
import { Task, User, Habit, Goal, ViewState } from '../types';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  user: User;
  setView: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, habits, goals, user, setView }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const productivity = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);

  const today = new Date();
  const dayName = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const fullDate = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-10 space-y-8 page-transition max-w-[1600px] mx-auto">
      {/* Header com Navegação */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-theme-card/80 text-theme-muted transition-all border border-theme-border">❮</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-theme-card/80 text-theme-muted transition-all border border-theme-border">❯</button>
          </div>
          <div>
            <h2 className="text-3xl font-black text-theme-text tracking-tight capitalize">{dayName}</h2>
            <p className="text-theme-muted font-medium text-sm">{fullDate}</p>
          </div>
        </div>

        <div className="bg-theme-card/50 p-1 rounded-2xl flex gap-1 border border-theme-border">
          <button onClick={() => setView('daily')} className="px-6 py-2 bg-theme-accent text-theme-card rounded-xl shadow-sm text-xs font-bold transition-all active:scale-95">Dia</button>
          <button onClick={() => setView('weekly')} className="px-6 py-2 rounded-xl text-xs font-bold text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-6 py-2 rounded-xl text-xs font-bold text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </header>

      {/* Grid de Estatísticas Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Produtividade', val: `${productivity}%`, icon: '📈', bg: 'bg-rosa-pastel', view: 'tasks', color: 'text-rose-600' },
          { label: 'Tarefas', val: tasks.length, icon: '✓', bg: 'bg-azul-pastel', view: 'tasks', color: 'text-blue-600' },
          { label: 'Streak Total', val: totalStreak, icon: '🔥', bg: 'bg-amarelo-pastel', view: 'habits', color: 'text-yellow-600' },
          { label: 'Metas Ativas', val: goals.length, icon: '🎯', bg: 'bg-emerald-100', view: 'monthly', color: 'text-emerald-600' }
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => setView(item.view as ViewState)}
            className={`p-8 rounded-[2.5rem] border border-theme-border flex flex-col justify-between h-44 relative overflow-hidden group hover:scale-[1.02] hover:shadow-xl transition-all text-left bg-theme-card`}
          >
            <div className="flex justify-between items-start relative z-10">
              <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">{item.label}</span>
              <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
            </div>
            <div className="relative z-10">
              <span className="text-4xl font-black text-theme-text">{item.val}</span>
              <p className="text-[10px] font-bold text-theme-muted mt-1 uppercase tracking-tight">Expandir visão</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-theme-card p-10 rounded-[3rem] border border-theme-border shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-start">
             <div className="w-16 h-16 bg-theme-accent rounded-2xl flex items-center justify-center text-theme-card shrink-0 shadow-lg">✨</div>
             <div className="space-y-4">
                <span className="px-4 py-1.5 bg-theme-accent/10 text-theme-accent rounded-full text-[10px] font-black uppercase tracking-widest">Ativo</span>
                <h3 className="text-2xl font-black text-theme-text tracking-tight">👋 Olá, {user.name.split(' ')[0]}!</h3>
                <p className="text-theme-muted font-medium leading-relaxed">Seu iPlanner está pronto e operando no modo <b>{user.theme.replace('-', ' ')}</b>.</p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <button onClick={() => setView('ai-assistant')} className="px-6 py-3 bg-theme-accent text-theme-card rounded-2xl font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all">
                    ✨ IA Coach
                  </button>
                  <button onClick={() => setView('insights')} className="px-6 py-3 text-theme-text bg-theme-bg rounded-2xl font-bold text-xs flex items-center gap-2 border border-theme-border hover:bg-theme-card transition-all">
                    📈 Ver Insights
                  </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-[100px] -z-10"></div>
          </div>

          <button 
            onClick={() => setView('daily')}
            className="w-full text-left bg-theme-card p-10 rounded-[3rem] border border-theme-border hover:bg-theme-accent/5 transition-all group"
          >
             <h3 className="text-2xl font-black text-theme-text tracking-tight flex items-center justify-between">
               Foco de Hoje
               <span className="text-sm opacity-0 group-hover:opacity-100 transition-all text-theme-accent">Ir para o Planner →</span>
             </h3>
             <p className="text-theme-muted font-medium mt-2">
               {tasks.filter(t => !t.completed).length > 0 
                ? `Você tem ${tasks.filter(t => !t.completed).length} itens pendentes hoje.` 
                : 'Dia planejado com sucesso. Ótimo trabalho!'}
             </p>
          </button>
        </div>

        <div className="lg:col-span-4 bg-theme-card p-10 rounded-[3rem] border border-theme-border shadow-sm space-y-8 flex flex-col h-full">
           <div className="flex items-center gap-3">
              <span className="text-theme-accent text-xl">🔥</span>
              <h3 className="text-xl font-black text-theme-text tracking-tight">Rotina Consistente</h3>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              {habits.length > 0 ? (
                <div className="w-full space-y-3 text-left">
                  {habits.slice(0, 5).map(h => (
                    <button 
                      key={h.id} 
                      onClick={() => setView('habits')}
                      className="w-full flex items-center justify-between p-4 bg-theme-bg rounded-2xl border border-theme-border hover:bg-theme-card hover:shadow-md transition-all group"
                    >
                      <span className="text-sm font-bold text-theme-text">{h.title}</span>
                      <span className="text-xs font-black text-theme-accent bg-theme-accent/10 px-3 py-1 rounded-lg">
                        {h.streak} 🔥
                      </span>
                    </button>
                  ))}
                  <button onClick={() => setView('habits')} className="w-full text-center text-[10px] font-black uppercase text-theme-muted py-4 hover:text-theme-text transition-all">Ver todos os hábitos</button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-theme-bg rounded-[2rem] flex items-center justify-center text-3xl text-theme-muted">✨</div>
                  <div className="space-y-2">
                    <p className="font-black text-theme-text">Crie sua rotina</p>
                    <p className="text-xs text-theme-muted font-medium leading-relaxed">Adicione hábitos para acompanhar sua consistência.</p>
                  </div>
                  <button onClick={() => setView('habits')} className="w-full py-4 bg-theme-accent text-theme-card rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                    + Novo Hábito
                  </button>
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
