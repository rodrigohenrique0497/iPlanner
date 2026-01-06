
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
    <div className="p-6 md:p-12 space-y-12 page-transition max-w-[1600px] mx-auto pb-32">
      {/* Header Premium */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-5xl font-extrabold text-theme-text tracking-tighter capitalize leading-none drop-shadow-sm">
            {dayName}
          </h2>
          <p className="text-theme-muted font-bold text-sm uppercase tracking-[0.3em] mt-3 opacity-60">
            {fullDate}
          </p>
        </div>

        <div className="bg-theme-card/50 glass-effect p-2 rounded-[2rem] flex gap-1 border border-theme-border shadow-premium">
          <button onClick={() => setView('daily')} className="px-8 py-3 bg-theme-accent text-theme-card rounded-2xl shadow-glow text-[11px] font-extrabold uppercase tracking-widest transition-all">Hoje</button>
          <button onClick={() => setView('weekly')} className="px-8 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="px-8 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Calendário</button>
        </div>
      </header>

      {/* Estatísticas com Efeito Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Produtividade', val: `${productivity}%`, icon: 'insights', bg: 'bg-indigo-500/10', view: 'tasks', color: 'text-indigo-500' },
          { label: 'Tarefas', val: tasks.length, icon: 'list_alt', bg: 'bg-theme-accent-soft', view: 'tasks', color: 'text-theme-accent' },
          { label: 'Hábito Ativo', val: totalStreak, icon: 'bolt', bg: 'bg-amber-500/10', view: 'habits', color: 'text-amber-500' },
          { label: 'Metas', val: goals.length, icon: 'flag', bg: 'bg-emerald-500/10', view: 'monthly', color: 'text-emerald-500' }
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => setView(item.view as ViewState)}
            className="p-10 rounded-[3rem] border border-theme-border flex flex-col justify-between h-52 hover-lift bg-theme-card shadow-premium group text-left transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] opacity-50">{item.label}</span>
              <div className={`w-12 h-12 ${item.bg} rounded-[1.25rem] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-2xl">{item.icon}</span>
              </div>
            </div>
            <div>
              <span className="text-5xl font-black text-theme-text tracking-tighter">{item.val}</span>
              <div className="mt-2 h-1 w-8 bg-theme-accent/20 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Banner de Boas Vindas */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-theme-card p-14 rounded-[4rem] border border-theme-border shadow-premium relative overflow-hidden flex flex-col md:flex-row gap-12 items-start group">
             <div className="w-24 h-24 bg-theme-accent rounded-[2.5rem] flex items-center justify-center text-theme-card shrink-0 shadow-glow group-hover:rotate-6 transition-transform duration-500">
                <span className="material-symbols-outlined !text-5xl">auto_awesome</span>
             </div>
             <div className="space-y-6 relative z-10">
                <span className="px-6 py-2.5 bg-theme-accent-soft text-theme-accent rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-theme-accent/5">Foco Máximo Ativado</span>
                <h3 className="text-5xl font-black text-theme-text tracking-tighter">Bom dia, {user.name.split(' ')[0]}!</h3>
                <p className="text-theme-muted font-medium text-xl leading-relaxed max-w-xl">
                  Seu iPlanner está pronto. Hoje é um excelente dia para <b className="text-theme-accent underline underline-offset-8">vencer suas metas</b>.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setView('insights')} className="px-10 py-5 text-theme-text bg-theme-bg rounded-[2rem] font-extrabold text-xs flex items-center gap-3 border border-theme-border hover:bg-theme-card transition-all uppercase tracking-widest">
                    <span className="material-symbols-outlined !text-xl">analytics</span> Performance
                  </button>
                </div>
             </div>
             {/* Efeito Visual de Fundo */}
             <div className="absolute -top-20 -right-20 w-96 h-96 bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          <button 
            onClick={() => setView('daily')}
            className="w-full text-left bg-theme-card/60 p-12 rounded-[4rem] border border-theme-border hover:border-theme-accent/30 transition-all group shadow-premium glass-effect"
          >
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black text-theme-text tracking-tighter">O Próximo Passo</h3>
                <span className="material-symbols-outlined text-theme-accent opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">arrow_forward</span>
             </div>
             <p className="text-theme-muted font-bold text-lg opacity-80 leading-relaxed">
               {tasks.filter(t => !t.completed).length > 0 
                ? `Você tem ${tasks.filter(t => !t.completed).length} tarefas aguardando. Vamos começar pela mais urgente?` 
                : 'Mente limpa, agenda vazia. Aproveite seu tempo ou planeje o amanhã.'}
             </p>
          </button>
        </div>

        {/* Card Lateral de Rotina */}
        <div className="lg:col-span-4 bg-theme-card p-12 rounded-[4rem] border border-theme-border shadow-premium flex flex-col">
           <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 bg-theme-accent-soft text-theme-accent rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined !text-2xl">sync_alt</span>
              </div>
              <h3 className="text-xl font-black text-theme-text tracking-tight uppercase tracking-[0.1em]">Sua Rotina</h3>
           </div>
           
           <div className="flex-1 space-y-5">
              {habits.length > 0 ? (
                habits.slice(0, 5).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-6 bg-theme-bg rounded-[2.5rem] border border-theme-border group hover:border-theme-accent/20 transition-all">
                    <span className="text-sm font-extrabold text-theme-text">{h.title}</span>
                    <span className="text-[10px] font-black text-theme-accent bg-theme-accent/5 px-4 py-2 rounded-xl">
                      {h.streak} 🔥
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-theme-bg rounded-[2.5rem] mx-auto flex items-center justify-center opacity-20">
                    <span className="material-symbols-outlined !text-4xl">add_task</span>
                  </div>
                  <p className="text-sm font-bold text-theme-muted px-4 leading-relaxed">Cultive novos hábitos para transformar sua jornada.</p>
                  <button onClick={() => setView('habits')} className="w-full py-5 bg-theme-accent/5 text-theme-accent rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-theme-accent hover:text-theme-card transition-all">
                    Configurar Hábitos
                  </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
