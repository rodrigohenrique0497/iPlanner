
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
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-theme-card border border-theme-border text-theme-muted hover:text-theme-text transition-all">❮</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-theme-card border border-theme-border text-theme-muted hover:text-theme-text transition-all">❯</button>
          </div>
          <div>
            <h2 className="text-4xl font-black text-theme-text tracking-tight capitalize leading-none">{dayName}</h2>
            <p className="text-theme-muted font-bold text-xs uppercase tracking-widest mt-2">{fullDate}</p>
          </div>
        </div>

        <div className="bg-theme-card p-1.5 rounded-3xl flex gap-1 border border-theme-border shadow-premium">
          <button onClick={() => setView('daily')} className="px-6 py-2.5 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Dia</button>
          <button onClick={() => setView('weekly')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </header>

      {/* Grid de Estatísticas Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Produtividade', val: `${productivity}%`, icon: 'trending_up', bg: 'bg-theme-accent-soft', view: 'tasks', color: 'text-theme-accent' },
          { label: 'Tarefas', val: tasks.length, icon: 'check_circle', bg: 'bg-theme-accent-soft', view: 'tasks', color: 'text-theme-accent' },
          { label: 'Streak Total', val: totalStreak, icon: 'local_fire_department', bg: 'bg-amber-100/10', view: 'habits', color: 'text-amber-500' },
          { label: 'Metas Ativas', val: goals.length, icon: 'track_changes', bg: 'bg-emerald-100/10', view: 'monthly', color: 'text-emerald-500' }
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => setView(item.view as ViewState)}
            className={`p-10 rounded-[3rem] border border-theme-border flex flex-col justify-between h-48 relative overflow-hidden group hover:scale-[1.02] hover:shadow-premium transition-all text-left bg-theme-card shadow-premium`}
          >
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">{item.label}</span>
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-2xl">{item.icon}</span>
              </div>
            </div>
            <div className="relative z-10">
              <span className="text-5xl font-black text-theme-text tracking-tighter">{item.val}</span>
              <p className="text-[9px] font-black text-theme-muted mt-2 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Detalhes →</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-theme-card p-12 rounded-[4rem] border border-theme-border shadow-premium relative overflow-hidden flex flex-col md:flex-row gap-10 items-start">
             <div className="w-20 h-20 bg-theme-accent rounded-[2rem] flex items-center justify-center text-theme-card shrink-0 shadow-glow">
                <span className="material-symbols-outlined !text-4xl">auto_awesome</span>
             </div>
             <div className="space-y-4">
                <span className="px-5 py-2 bg-theme-accent-soft text-theme-accent rounded-full text-[10px] font-black uppercase tracking-widest border border-theme-accent/10">Perfil Verificado</span>
                <h3 className="text-4xl font-black text-theme-text tracking-tighter">👋 Olá, {user.name.split(' ')[0]}!</h3>
                <p className="text-theme-muted font-bold text-lg leading-relaxed opacity-80">Seu iPlanner está configurado no modo <b className="text-theme-accent">{user.theme.toUpperCase()}</b>. Otimize seus resultados com IA.</p>
                <div className="flex flex-wrap gap-4 pt-6">
                  <button onClick={() => setView('ai-assistant')} className="px-10 py-5 bg-theme-accent text-theme-card rounded-[2rem] font-black text-xs flex items-center gap-3 hover:opacity-90 transition-all shadow-premium uppercase tracking-widest">
                    <span className="material-symbols-outlined !text-xl">smart_toy</span> IA Coach
                  </button>
                  <button onClick={() => setView('insights')} className="px-10 py-5 text-theme-text bg-theme-bg rounded-[2rem] font-black text-xs flex items-center gap-3 border border-theme-border hover:bg-theme-card transition-all uppercase tracking-widest">
                    <span className="material-symbols-outlined !text-xl">bar_chart</span> Insights
                  </button>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-theme-accent/5 rounded-full blur-[120px] -z-10"></div>
          </div>

          <button 
            onClick={() => setView('daily')}
            className="w-full text-left bg-theme-card p-12 rounded-[4rem] border border-theme-border hover:border-theme-accent/40 transition-all group shadow-premium"
          >
             <h3 className="text-2xl font-black text-theme-text tracking-tighter flex items-center justify-between">
               Foco de Hoje
               <span className="text-xs opacity-0 group-hover:opacity-100 transition-all text-theme-accent font-black uppercase tracking-widest">Ir para o Planner →</span>
             </h3>
             <p className="text-theme-muted font-bold mt-3 text-lg opacity-80 leading-relaxed">
               {tasks.filter(t => !t.completed).length > 0 
                ? `Existem ${tasks.filter(t => !t.completed).length} pendências aguardando sua ação imediata.` 
                : 'Você completou todo o planejamento de hoje. Tempo livre garantido!'}
             </p>
          </button>
        </div>

        <div className="lg:col-span-4 bg-theme-card p-12 rounded-[4rem] border border-theme-border shadow-premium space-y-10 flex flex-col h-full">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-theme-accent-soft text-theme-accent rounded-2xl flex items-center justify-center shadow-glow">
                <span className="material-symbols-outlined !text-2xl">autorenew</span>
              </div>
              <h3 className="text-xl font-black text-theme-text tracking-tighter uppercase">Rotina</h3>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              {habits.length > 0 ? (
                <div className="w-full space-y-4 text-left">
                  {habits.slice(0, 4).map(h => (
                    <button 
                      key={h.id} 
                      onClick={() => setView('habits')}
                      className="w-full flex items-center justify-between p-6 bg-theme-bg rounded-[2rem] border border-theme-border hover:border-theme-accent/30 hover:bg-theme-card transition-all group shadow-glow"
                    >
                      <span className="text-sm font-black text-theme-text tracking-tight">{h.title}</span>
                      <span className="text-[10px] font-black text-theme-accent bg-theme-accent-soft px-4 py-2 rounded-xl border border-theme-accent/10">
                        {h.streak} 🔥
                      </span>
                    </button>
                  ))}
                  <button onClick={() => setView('habits')} className="w-full text-center text-[10px] font-black uppercase text-theme-muted py-6 hover:text-theme-text transition-all tracking-[0.3em] opacity-50">Explorar Rotinas</button>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-theme-bg rounded-[3rem] border border-theme-border flex items-center justify-center text-4xl text-theme-muted opacity-30 shadow-glow">✨</div>
                  <div className="space-y-3">
                    <p className="font-black text-theme-text text-xl">Arquitetura de Hábitos</p>
                    <p className="text-xs text-theme-muted font-bold leading-relaxed px-6 opacity-60">Consolide comportamentos de alta performance.</p>
                  </div>
                  <button onClick={() => setView('habits')} className="w-full py-6 bg-theme-accent text-theme-card rounded-[2rem] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-premium">
                    + Iniciar Hábito
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
