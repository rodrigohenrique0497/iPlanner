
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
            className="md:hidden text-theme-text hover:opacity-70 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-50 mb-4 ml-5">Menu Principal</p>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-planner-sm transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-black shadow-premium'
                    : 'text-theme-text opacity-75 hover:opacity-100 hover:bg-theme-accent-soft hover:text-theme-text'
                }`}
              >
                <span className={`material-symbols-outlined !text-xl transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-black tracking-tight">{item.label}</span>
                {isActive && (
                   <span className="absolute right-4 w-1.5 h-1.5 bg-theme-card rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-theme-border shrink-0 bg-theme-bg">
          <div className="flex items-center gap-4 px-4 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-theme-accent-soft flex items-center justify-center overflow-hidden border border-theme-border">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-theme-text truncate leading-none">{user.name}</p>
              <p className="text-[9px] font-bold text-theme-muted truncate mt-1">Sessão Ativa</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-theme-text opacity-70 hover:text-rose-600 hover:opacity-100 hover:bg-rose-500/5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined !text-lg">logout</span> Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
