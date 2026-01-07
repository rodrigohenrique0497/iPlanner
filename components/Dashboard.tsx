
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
    <div className="px-4 py-6 md:px-12 md:py-12 space-y-8 md:space-y-12 page-transition max-w-[1600px] mx-auto pb-32">
      {/* Header Premium */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-theme-text tracking-tighter capitalize leading-none">
            {dayName}
          </h2>
          <p className="text-theme-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] mt-2 md:mt-3 opacity-60">
            {fullDate}
          </p>
        </div>

        <div className="w-full md:w-auto bg-theme-card/50 glass-effect p-1.5 rounded-planner-sm flex gap-1 border border-theme-border shadow-premium overflow-x-auto no-scrollbar">
          <button onClick={() => setView('daily')} className="whitespace-nowrap flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 bg-theme-accent text-theme-card rounded-planner-sm shadow-glow text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest transition-all">Hoje</button>
          <button onClick={() => setView('weekly')} className="whitespace-nowrap flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-planner-sm text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="whitespace-nowrap flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-planner-sm text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Calendário</button>
        </div>
      </header>

      {/* Estatísticas - Grid Inteligente */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Produtiv.', val: `${productivity}%`, icon: 'insights', bg: 'bg-indigo-500/10', view: 'tasks', color: 'text-indigo-500' },
          { label: 'Tarefas', val: tasks.length, icon: 'list_alt', bg: 'bg-theme-accent-soft', view: 'tasks', color: 'text-theme-accent' },
          { label: 'Hábitos', val: totalStreak, icon: 'bolt', bg: 'bg-amber-500/10', view: 'habits', color: 'text-amber-500' },
          { label: 'Metas', val: goals.length, icon: 'flag', bg: 'bg-emerald-500/10', view: 'monthly', color: 'text-emerald-500' }
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => setView(item.view as ViewState)}
            className="p-6 md:p-10 rounded-planner border border-theme-border flex flex-col justify-between h-40 md:h-52 hover-lift bg-theme-card shadow-premium group text-left transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] md:text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] opacity-50">{item.label}</span>
              <div className={`w-8 h-8 md:w-12 md:h-12 ${item.bg} rounded-planner-sm flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-xl md:!text-2xl">{item.icon}</span>
              </div>
            </div>
            <div>
              <span className="text-3xl md:text-5xl font-black text-theme-text tracking-tighter">{item.val}</span>
              <div className="mt-2 h-1 w-6 md:w-8 bg-theme-accent/20 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Banner de Boas Vindas */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          <div className="bg-theme-card p-8 md:p-14 rounded-planner border border-theme-border shadow-premium relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-12 items-start group">
             <div className="w-16 h-16 md:w-24 md:h-24 bg-theme-accent rounded-planner-sm flex items-center justify-center text-theme-card shrink-0 shadow-glow group-hover:rotate-6 transition-transform duration-500">
                <span className="material-symbols-outlined !text-4xl md:!text-5xl">menu_book</span>
             </div>
             <div className="space-y-4 md:space-y-6 relative z-10">
                <span className="inline-block px-4 py-1.5 md:px-6 md:py-2.5 bg-theme-accent-soft text-theme-accent rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] border border-theme-accent/5">Foco Máximo Ativado</span>
                <h3 className="text-3xl md:text-5xl font-black text-theme-text tracking-tighter">Bom dia, {user.name.split(' ')[0]}!</h3>
                <p className="text-theme-muted font-medium text-base md:text-xl leading-relaxed max-w-xl">
                  Seu iPlanner está pronto. Hoje é um excelente dia para <b className="text-theme-accent underline underline-offset-8">vencer suas metas</b>.
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                  <button onClick={() => setView('insights')} className="px-6 py-3 md:px-10 md:py-5 text-theme-text bg-theme-bg rounded-planner-sm font-extrabold text-[10px] md:text-xs flex items-center gap-3 border border-theme-border hover:bg-theme-card transition-all uppercase tracking-widest">
                    <span className="material-symbols-outlined !text-xl">analytics</span> Performance
                  </button>
                </div>
             </div>
             <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

          <button 
            onClick={() => setView('daily')}
            className="w-full text-left bg-theme-card/60 p-8 md:p-12 rounded-planner border border-theme-border hover:border-theme-accent/30 transition-all group shadow-premium glass-effect"
          >
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tighter">O Próximo Passo</h3>
                <span className="material-symbols-outlined text-theme-accent opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">arrow_forward</span>
             </div>
             <p className="text-theme-muted font-bold text-sm md:text-lg opacity-80 leading-relaxed">
               {tasks.filter(t => !t.completed).length > 0 
                ? `Você tem ${tasks.filter(t => !t.completed).length} tarefas aguardando. Vamos começar pela mais urgente?` 
                : 'Mente limpa, agenda vazia. Aproveite seu tempo ou planeje o amanhã.'}
             </p>
          </button>
        </div>

        {/* Card Lateral de Rotina */}
        <div className="lg:col-span-4 bg-theme-card p-8 md:p-12 rounded-planner border border-theme-border shadow-premium flex flex-col">
           <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-theme-accent-soft text-theme-accent rounded-planner-sm flex items-center justify-center">
                <span className="material-symbols-outlined !text-xl md:!text-2xl">sync_alt</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-theme-text tracking-tight uppercase tracking-[0.1em]">Sua Rotina</h3>
           </div>
           
           <div className="flex-1 space-y-4">
              {habits.length > 0 ? (
                habits.slice(0, 4).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-4 md:p-6 bg-theme-bg rounded-planner-sm border border-theme-border group hover:border-theme-accent/20 transition-all">
                    <span className="text-xs md:text-sm font-extrabold text-theme-text">{h.title}</span>
                    <span className="text-[8px] md:text-[10px] font-black text-theme-accent bg-theme-accent/5 px-3 py-1.5 md:px-4 md:py-2 rounded-planner-sm">
                      {h.streak} 🔥
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-10 space-y-4 md:space-y-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-theme-bg rounded-planner-sm mx-auto flex items-center justify-center opacity-20">
                    <span className="material-symbols-outlined !text-3xl md:!text-4xl">add_task</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-theme-muted px-4 leading-relaxed">Cultive novos hábitos para transformar sua jornada.</p>
                  <button onClick={() => setView('habits')} className="w-full py-4 md:py-5 bg-theme-accent/5 text-theme-accent rounded-planner-sm font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-theme-accent hover:text-theme-card transition-all">
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
