
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
        fixed inset-y-0 left-0 w-64 border-r border-theme-border h-screen flex flex-col z-[70] transition-transform duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Header Compacto */}
        <div className="p-5 md:p-6 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-black tracking-tighter flex items-center gap-2.5 text-theme-text group cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <span className="w-9 h-9 rounded-xl bg-theme-accent flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined !text-xl text-theme-card leading-none">menu_book</span>
            </span>
            iPlanner
          </h1>
          <button 
            onClick={onClose} 
            className="md:hidden text-theme-text hover:opacity-70 transition-colors"
          >
            <span className="material-symbols-outlined !text-xl">close</span>
          </button>
        </div>
        
        {/* Navegação de Alta Densidade */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-hidden py-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-theme-muted opacity-40 mb-2 ml-4">Menu</p>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-black shadow-premium'
                    : 'text-theme-text opacity-75 hover:opacity-100 hover:bg-theme-accent-soft hover:text-theme-text'
                }`}
              >
                <span className={`material-symbols-outlined !text-[20px] transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[12.5px] font-bold tracking-tight">{item.label}</span>
                {isActive && (
                   <span className="absolute right-3.5 w-1.5 h-1.5 bg-theme-card rounded-full shadow-sm"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Minimalista */}
        <div className="p-4 border-t border-theme-border shrink-0 bg-theme-bg/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-2 hover:bg-theme-accent-soft rounded-xl transition-colors cursor-pointer" onClick={() => handleNavClick('settings')}>
            <div className="w-8 h-8 rounded-full bg-theme-accent-soft flex items-center justify-center overflow-hidden border border-theme-border shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black text-theme-text truncate leading-none">{user.name.split(' ')[0]}</p>
              <p className="text-[8px] font-bold text-theme-muted truncate mt-0.5 uppercase tracking-tighter">Minha Conta</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-theme-text opacity-50 hover:text-rose-600 hover:opacity-100 hover:bg-rose-500/5 rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-rose-500/10"
          >
            <span className="material-symbols-outlined !text-lg">logout</span> Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
