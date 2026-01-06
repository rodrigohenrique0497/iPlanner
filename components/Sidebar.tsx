
import React from 'react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: 'home' },
    { id: 'daily', label: 'Meu Dia (Planner)', icon: 'today' },
    { id: 'calendar', label: 'Calendário', icon: 'calendar_month' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt' },
    { id: 'habits', label: 'Hábitos', icon: 'repeat' },
    { id: 'notes', label: 'Notas', icon: 'description' },
    { id: 'finance', label: 'Finanças', icon: 'payments' },
    { id: 'weekly', label: 'Semana', icon: 'date_range' },
    { id: 'monthly', label: 'Metas (Mês)', icon: 'track_changes' },
    { id: 'annual', label: 'Metas (Ano)', icon: 'public' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  const getRank = (level: number) => {
    if (level < 3) return 'Novato Calmo';
    if (level < 7) return 'Planejador Ágil';
    return 'Mestre da Clareza';
  };

  const handleNavClick = (view: ViewState) => {
    setView(view);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border h-screen flex flex-col z-[70] transition-transform duration-300 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-4 text-theme-text transition-colors duration-500">
            <span className="w-12 h-12 rounded-[1.5rem] bg-theme-accent flex items-center justify-center shadow-lg transition-all hover:rotate-6">
              <span className="material-symbols-outlined !text-3xl text-theme-card leading-none">menu_book</span>
            </span>
            iPlanner
          </h1>
          <button 
            onClick={onClose} 
            className="md:hidden text-theme-muted w-10 h-10 flex items-center justify-center hover:bg-theme-accent/5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined !text-2xl leading-none">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-[1.75rem] transition-all duration-300 group ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-bold shadow-xl'
                    : 'text-theme-muted hover:bg-theme-accent/5 hover:text-theme-text'
                }`}
              >
                <span className={`material-symbols-outlined !text-2xl flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-5 space-y-3 border-t border-theme-border shrink-0">
          <div className="bg-theme-card rounded-[2.5rem] p-6 border border-theme-border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-theme-accent-soft flex items-center justify-center text-xl shadow-sm">
                <span className="material-symbols-outlined !text-2xl text-theme-accent">emoji_events</span>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-theme-muted">EXPERIÊNCIA</p>
                <p className="text-xs font-black text-theme-text">{getRank(user.level)} • Nível {user.level}</p>
              </div>
            </div>
            <div className="h-2 w-full bg-theme-bg rounded-full overflow-hidden border border-theme-border">
              <div 
                className="h-full bg-theme-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                style={{ width: `${(user.xp % 100)}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined !text-xl">logout</span> Encerrar Sessão
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
