
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

  // Calcula a saudação dinâmica baseada no fuso de Brasília
  const getGreeting = () => {
    const hour = parseInt(new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'America/Sao_Paulo'
    }).format(new Date()));

    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const greeting = getGreeting();
  const firstName = user.name.split(' ')[0];

  return (
    <div className="px-5 py-8 md:px-12 md:py-12 space-y-10 md:space-y-14 page-transition max-w-[1600px] mx-auto pb-32">
      {/* Header Premium com proporções refinadas */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-black text-theme-text tracking-tighter capitalize leading-none">
            {dayName}
          </h2>
          <p className="text-theme-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-60">
            {fullDate}
          </p>
        </div>

        <div className="w-full md:w-auto bg-theme-card/50 glass-premium p-1.5 rounded-[2.5rem] flex gap-1 border border-theme-border shadow-sm overflow-x-auto no-scrollbar">
          <button onClick={() => setView('daily')} className="whitespace-nowrap flex-1 md:flex-none px-8 py-3 bg-theme-accent text-theme-card rounded-[2rem] shadow-glow text-[11px] font-black uppercase tracking-widest transition-all active:scale-95">Hoje</button>
          <button onClick={() => setView('weekly')} className="whitespace-nowrap flex-1 md:flex-none px-8 py-3 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Semana</button>
          <button onClick={() => setView('calendar')} className="whitespace-nowrap flex-1 md:flex-none px-8 py-3 rounded-[2rem] text-[11px] font-black uppercase tracking-widest text-theme-muted hover:text-theme-text transition-all">Mês</button>
        </div>
      </header>

      {/* Grid de Estatísticas Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Insights', val: `${productivity}%`, icon: 'insights', bg: 'bg-indigo-500/10', view: 'insights', color: 'text-indigo-500' },
          { label: 'Tarefas', val: tasks.filter(t => !t.completed).length, icon: 'list_alt', bg: 'bg-theme-accent-soft', view: 'tasks', color: 'text-theme-accent' },
          { label: 'Hábitos', val: totalStreak, icon: 'bolt', bg: 'bg-amber-500/10', view: 'habits', color: 'text-amber-500' },
          { label: 'Metas', val: goals.length, icon: 'flag', bg: 'bg-emerald-500/10', view: 'monthly', color: 'text-emerald-500' }
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => setView(item.view as ViewState)}
            className="p-8 md:p-12 rounded-[2.5rem] border border-theme-border/60 flex flex-col justify-between h-44 md:h-60 hover:scale-[1.02] bg-theme-card shadow-premium group text-left transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest opacity-50">{item.label}</span>
              <div className={`w-10 h-10 md:w-12 md:h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:rotate-6 transition-transform`}>
                <span className="material-symbols-outlined !text-2xl">{item.icon}</span>
              </div>
            </div>
            <div>
              <span className="text-4xl md:text-6xl font-black text-theme-text tracking-tighter">{item.val}</span>
              <div className="mt-3 h-1.5 w-8 bg-theme-accent/20 rounded-full group-hover:w-full transition-all duration-500"></div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Banner de Boas Vindas com Design Premium */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-theme-card p-10 md:p-16 rounded-[3rem] border border-theme-border shadow-premium relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-14 items-start group">
             <div className="w-20 h-20 md:w-28 md:h-28 bg-theme-accent rounded-[2rem] flex items-center justify-center text-theme-card shrink-0 shadow-glow group-hover:rotate-3 transition-transform duration-700 overflow-hidden p-4 md:p-6">
                <span className="material-symbols-outlined !text-4xl md:!text-6xl text-theme-card">menu_book</span>
             </div>
             <div className="space-y-6 md:space-y-8 relative z-10">
                <h3 className="text-4xl md:text-6xl font-black text-theme-text tracking-tighter leading-tight">{greeting}, {firstName}!</h3>
                <p className="text-theme-muted font-bold text-lg md:text-2xl leading-relaxed max-w-xl opacity-80">
                  Pronto para transformar hoje em um dia <b className="text-theme-accent underline underline-offset-[12px] decoration-4">extraordinário</b>?
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setView('insights')} className="px-10 py-5 bg-theme-accent text-theme-card rounded-[2rem] font-black text-[11px] flex items-center gap-4 shadow-glow hover:opacity-90 transition-all uppercase tracking-widest active:scale-95">
                    <span className="material-symbols-outlined !text-2xl">query_stats</span> Relatórios
                  </button>
                </div>
             </div>
             <div className="absolute -top-32 -right-32 w-80 h-80 md:w-[500px] md:h-[500px] bg-theme-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
          </div>

          <button 
            onClick={() => setView('daily')}
            className="w-full text-left bg-theme-card/40 p-10 md:p-14 rounded-[3rem] border border-theme-border hover:border-theme-accent/40 transition-all group shadow-glass glass-premium"
          >
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl md:text-3xl font-black text-theme-text tracking-tighter">O Próximo Passo</h3>
                <span className="material-symbols-outlined text-theme-accent opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 !text-3xl">arrow_forward</span>
             </div>
             <p className="text-theme-muted font-bold text-base md:text-xl opacity-70 leading-relaxed">
               {tasks.filter(t => !t.completed).length > 0 
                ? `Você tem ${tasks.filter(t => !t.completed).length} tarefas aguardando sua ação imediata.` 
                : 'Você está no controle total. Nada pendente para este momento.'}
             </p>
          </button>
        </div>

        {/* Card Lateral de Rotina Refinado */}
        <div className="lg:col-span-4 bg-theme-card p-10 md:p-14 rounded-[3rem] border border-theme-border shadow-premium flex flex-col h-full">
           <div className="flex items-center gap-5 mb-10 md:mb-14">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-theme-accent-soft text-theme-accent rounded-2xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined !text-[28px]">auto_fix_high</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-theme-text tracking-tight uppercase tracking-widest">Sua Rotina</h3>
           </div>
           
           <div className="flex-1 space-y-5">
              {habits.length > 0 ? (
                habits.slice(0, 5).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-5 md:p-6 bg-theme-bg/50 rounded-2xl border border-theme-border hover:border-theme-accent/30 transition-all group">
                    <span className="text-sm md:text-base font-extrabold text-theme-text">{h.title}</span>
                    <span className="text-[10px] font-black text-theme-accent bg-theme-accent/5 px-4 py-2 rounded-xl">
                      {h.streak} 🔥
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-8">
                  <div className="w-20 h-20 bg-theme-bg rounded-[2rem] mx-auto flex items-center justify-center opacity-10">
                    <span className="material-symbols-outlined !text-5xl">edit_calendar</span>
                  </div>
                  <p className="text-sm font-bold text-theme-muted px-6 leading-relaxed">Pequenos passos diários levam a grandes conquistas.</p>
                  <button onClick={() => setView('habits')} className="w-full py-5 bg-theme-accent text-theme-card rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-glow hover:opacity-90 transition-all">
                    Iniciar Hábitos
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
