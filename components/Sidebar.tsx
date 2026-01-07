
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 border-r border-theme-border h-screen flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo / Header */}
        <div className="px-5 py-6 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-theme-accent flex items-center justify-center shadow-premium group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined !text-xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-theme-text">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-1 text-theme-muted hover:text-theme-text transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Menu Principal */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-hidden">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-theme-muted opacity-40 mb-2 ml-4">Navegação Principal</p>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-black shadow-premium'
                    : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                }`}
              >
                <span className={`material-symbols-outlined !text-[20px] ${isActive ? 'scale-105' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[12px] font-bold tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute right-3.5 w-1 h-1 bg-theme-card rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bloco de Conta Unificado (Design Exclusivo) */}
        <div className="p-3 mt-auto">
          <div className="bg-theme-card/40 rounded-[2rem] p-1.5 border border-theme-border/50 shadow-sm flex items-center gap-1">
            
            {/* Botão de Perfil */}
            <button 
              onClick={() => handleNavClick('settings')}
              className={`flex-1 flex items-center gap-3 p-2 rounded-[1.5rem] transition-all hover:bg-theme-accent-soft group/profile ${currentView === 'settings' ? 'bg-theme-accent-soft' : ''}`}
            >
              <div className="w-8 h-8 rounded-full border-2 border-theme-accent/20 overflow-hidden shrink-0 shadow-sm group-hover/profile:border-theme-accent transition-colors">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[11px] font-black text-theme-text truncate leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[8px] font-bold text-theme-muted uppercase tracking-tighter opacity-60">Conta</p>
              </div>
            </button>

            {/* Ação de Sair Rápida */}
            <button 
              onClick={onLogout}
              title="Sair do iPlanner"
              className="w-11 h-11 flex items-center justify-center rounded-[1.25rem] text-theme-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all shrink-0 active:scale-90"
            >
              <span className="material-symbols-outlined !text-xl">logout</span>
            </button>
          </div>
          
          <p className="text-[7px] text-center mt-3 font-black text-theme-muted uppercase tracking-[0.4em] opacity-30">v2.1 Premium Edition</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
