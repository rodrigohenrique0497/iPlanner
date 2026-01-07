
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
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border/40 h-screen flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo / Header Premium */}
        <div className="px-6 py-8 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-11 h-11 rounded-2xl bg-theme-accent overflow-hidden shadow-premium group-hover:rotate-6 transition-all flex items-center justify-center p-2">
              <span className="material-symbols-outlined !text-2xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-theme-text group-hover:translate-x-0.5 transition-transform">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-theme-muted hover:text-theme-text transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Menu Principal com melhor espaçamento */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 mb-4 ml-4">Navegação Principal</p>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-extrabold shadow-premium scale-[1.02]'
                    : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                }`}
              >
                <span className={`material-symbols-outlined !text-[22px] ${isActive ? 'scale-105' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute right-4 w-1.5 h-1.5 bg-theme-card rounded-full shadow-glow"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bloco de Conta Unificado Premium */}
        <div className="p-4 mt-auto">
          <div className="bg-theme-card/60 backdrop-blur-md rounded-[2.5rem] p-2 border border-theme-border/50 shadow-sm flex items-center gap-2">
            <button 
              onClick={() => handleNavClick('settings')}
              className={`flex-1 flex items-center gap-3 p-2.5 rounded-[2rem] transition-all hover:bg-theme-accent-soft group/profile ${currentView === 'settings' ? 'bg-theme-accent-soft' : ''}`}
            >
              <div className="w-9 h-9 rounded-full border-2 border-theme-accent/10 overflow-hidden shrink-0 shadow-sm group-hover/profile:border-theme-accent transition-colors">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[12px] font-black text-theme-text truncate leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[9px] font-bold text-theme-muted uppercase tracking-tighter opacity-50">Assinante</p>
              </div>
            </button>

            <button 
              onClick={onLogout}
              className="w-12 h-12 flex items-center justify-center rounded-[1.75rem] text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all shrink-0 active:scale-90"
            >
              <span className="material-symbols-outlined !text-2xl">logout</span>
            </button>
          </div>
          <p className="text-[8px] text-center mt-4 font-black text-theme-muted uppercase tracking-[0.5em] opacity-30">iPlanner Premium Edition</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
