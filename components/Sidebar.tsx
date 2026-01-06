
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
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'daily', label: 'Planner Diário', icon: 'event_repeat' },
    { id: 'calendar', label: 'Calendário', icon: 'calendar_month' },
    { id: 'tasks', label: 'Lista de Tarefas', icon: 'checklist' },
    { id: 'habits', label: 'Hábitos', icon: 'auto_fix_high' },
    { id: 'notes', label: 'Notas Rápidas', icon: 'edit_note' },
    { id: 'finance', label: 'Finanças', icon: 'account_balance_wallet' },
    { id: 'insights', label: 'Relatórios', icon: 'query_stats' },
    { id: 'settings', label: 'Configurações', icon: 'tune' },
  ];

  const getRank = (level: number) => {
    if (level < 3) return 'Iniciante';
    if (level < 7) return 'Estrategista';
    return 'Mestre do Foco';
  };

  const handleNavClick = (view: ViewState) => {
    setView(view);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-80 border-r border-theme-border h-screen flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="p-10 flex items-center justify-between shrink-0">
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-4 text-theme-text group cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <span className="w-14 h-14 rounded-[1.75rem] bg-theme-accent flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined !text-4xl text-theme-card leading-none">menu_book</span>
            </span>
            iPlanner
          </h1>
          <button 
            onClick={onClose} 
            className="md:hidden text-theme-muted hover:text-theme-text transition-colors"
          >
            <span className="material-symbols-outlined !text-3xl">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar py-4">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.75rem] transition-all duration-400 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-extrabold shadow-premium'
                    : 'text-theme-muted hover:bg-theme-accent-soft hover:text-theme-text'
                }`}
              >
                <span className={`material-symbols-outlined !text-2xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {isActive && (
                   <span className="absolute right-6 w-1.5 h-1.5 bg-theme-card rounded-full shadow-[0_0_10px_white]"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 space-y-4 border-t border-theme-border shrink-0 bg-theme-bg/50 glass-effect">
          <div className="bg-theme-card rounded-[2.5rem] p-6 border border-theme-border shadow-premium">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-theme-accent-soft flex items-center justify-center text-xl">
                <span className="material-symbols-outlined !text-2xl text-theme-accent">stars</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted opacity-60">Status de Perfil</p>
                <p className="text-xs font-black text-theme-text truncate">{getRank(user.level)} • Nível {user.level}</p>
              </div>
            </div>
            <div className="h-2 w-full bg-theme-bg rounded-full overflow-hidden border border-theme-border p-[1px]">
              <div 
                className="h-full bg-theme-accent rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(user.xp % 100)}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined !text-xl">power_settings_new</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
