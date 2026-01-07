
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
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] md:hidden transition-all"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border/40 h-screen flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo / Header Premium - Compacto e elegante */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-theme-accent overflow-hidden shadow-premium group-hover:rotate-6 transition-all flex items-center justify-center p-2">
              <span className="material-symbols-outlined !text-xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-theme-text group-hover:translate-x-0.5 transition-transform">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-theme-muted hover:text-theme-text transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Menu Principal - Espaçamento ajustado para caber sem rolagem */}
        <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-hidden flex flex-col justify-start">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-theme-muted opacity-40 mb-2 ml-4">Menu</p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-theme-accent text-theme-card font-extrabold shadow-glow'
                      : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                  }`}
                >
                  <span className={`material-symbols-outlined !text-[18px] ${isActive ? 'scale-105 opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[12px] font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute right-4 w-1 h-1 bg-theme-card rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bloco de Conta - Base compacta e robusta */}
        <div className="px-4 py-4 mt-auto shrink-0">
          <div className="bg-theme-card/40 rounded-2xl p-1 border border-theme-border/50 shadow-sm flex items-center gap-1.5">
            <button 
              onClick={() => handleNavClick('settings')}
              className={`flex-1 flex items-center gap-2.5 p-1.5 rounded-xl transition-all hover:bg-theme-accent-soft group/profile ${currentView === 'settings' ? 'bg-theme-accent-soft' : ''}`}
            >
              <div className="w-8 h-8 rounded-full border border-theme-accent/10 overflow-hidden shrink-0 group-hover/profile:border-theme-accent transition-colors">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] font-black text-theme-text truncate leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[7px] font-bold text-theme-muted uppercase tracking-tighter opacity-40">Assinante</p>
              </div>
            </button>

            <button 
              onClick={onLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all shrink-0 active:scale-90"
            >
              <span className="material-symbols-outlined !text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
