
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
        {/* Logo / Header Premium */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-11 h-11 rounded-2xl bg-theme-accent overflow-hidden shadow-premium group-hover:rotate-6 transition-all flex items-center justify-center p-2.5">
              <span className="material-symbols-outlined !text-2xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-theme-text group-hover:translate-x-0.5 transition-transform">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-theme-muted hover:text-theme-text transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Menu Principal */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar flex flex-col justify-start">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-40 mb-3 ml-4">Navegação</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-theme-accent text-theme-card font-extrabold shadow-glow translate-x-1'
                      : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                  }`}
                >
                  <span className={`material-symbols-outlined !text-[20px] ${isActive ? 'scale-105 opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <span className="absolute right-4 w-1.5 h-1.5 bg-theme-card rounded-full shadow-glow"></span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Base da Sidebar - Conta e Sair Refinados */}
        <div className="p-4 mt-auto shrink-0 border-t border-theme-border/30 bg-theme-card/10">
          <div className="space-y-2">
            <button 
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all group/profile border border-transparent ${currentView === 'settings' ? 'bg-theme-accent text-theme-card shadow-glow' : 'hover:bg-theme-accent-soft hover:border-theme-border/50'}`}
            >
              <div className="w-10 h-10 rounded-full border-2 border-theme-accent/20 overflow-hidden shrink-0 shadow-sm group-hover/profile:scale-105 transition-transform">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <p className={`text-sm font-black truncate leading-none ${currentView === 'settings' ? 'text-theme-card' : 'text-theme-text'}`}>
                  {user.name.split(' ')[0]}
                </p>
                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60 ${currentView === 'settings' ? 'text-theme-card' : 'text-theme-muted'}`}>
                  Ver Perfil
                </p>
              </div>
            </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all group active:scale-[0.98]"
            >
              <span className="material-symbols-outlined !text-[20px] group-hover:rotate-12 transition-transform">logout</span>
              <span className="text-[12px] font-extrabold uppercase tracking-widest">Sair da conta</span>
            </button>
          </div>
          <p className="text-[8px] text-center mt-4 font-black text-theme-muted uppercase tracking-[0.5em] opacity-30">iPlanner Premium</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
