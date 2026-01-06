
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
    { id: 'tasks', label: 'Tarefas', icon: 'checklist' },
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border h-screen flex flex-col z-[70] transition-transform duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-theme-text group cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <span className="w-11 h-11 rounded-planner-sm bg-theme-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined !text-2xl text-theme-card leading-none">menu_book</span>
            </span>
            iPlanner
          </h1>
          <button 
            onClick={onClose} 
            className="md:hidden text-theme-muted hover:text-theme-text transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-planner-sm transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-bold shadow-premium'
                    : 'text-theme-muted hover:bg-theme-accent-soft hover:text-theme-text'
                }`}
              >
                <span className={`material-symbols-outlined !text-xl transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                {isActive && (
                   <span className="absolute right-4 w-1 h-1 bg-theme-card rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-theme-border shrink-0 bg-theme-bg">
          <div className="bg-theme-card rounded-planner-sm p-5 border border-theme-border shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-theme-accent-soft flex items-center justify-center">
                <span className="material-symbols-outlined !text-xl text-theme-accent">stars</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-black uppercase tracking-widest text-theme-muted opacity-50">Nível {user.level}</p>
                <p className="text-[11px] font-black text-theme-text truncate leading-tight">{getRank(user.level)}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-theme-bg rounded-full overflow-hidden border border-theme-border p-[1px]">
              <div 
                className="h-full bg-theme-accent rounded-full transition-all duration-700" 
                style={{ width: `${(user.xp % 100)}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined !text-lg">power_settings_new</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
