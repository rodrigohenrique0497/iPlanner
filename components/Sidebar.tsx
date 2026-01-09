
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
        fixed inset-y-0 left-0 w-72 border-r border-theme-border/30 h-screen flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Header Compacto - Logo iPlanner */}
        <div className="px-6 pt-2 pb-1 flex items-center justify-between shrink-0 h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-theme-accent flex items-center justify-center shadow-premium group-hover:rotate-6 transition-all">
              <span className="material-symbols-outlined !text-xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-theme-text group-hover:translate-x-0.5 transition-transform">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-theme-muted hover:text-theme-text transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Menu Principal - Densidade Máxima para evitar scroll em qualquer smartphone */}
        <nav className="flex-1 px-4 py-1 space-y-0 overflow-y-auto no-scrollbar flex flex-col justify-start">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3.5 px-4 py-1.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-black shadow-glow'
                    : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                }`}
              >
                <span className={`material-symbols-outlined !text-[18px] ${isActive ? 'scale-110' : 'opacity-60'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-extrabold tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute right-4 w-1.5 h-1.5 bg-theme-card rounded-full shadow-glow"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Base da Sidebar - Área do Usuário e Logout */}
        <div className="px-3 pb-4 pt-2 mt-auto shrink-0 border-t border-theme-border/20 bg-theme-card/5">
          <div className="space-y-1.5">
            <button 
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all group/profile border border-transparent ${currentView === 'settings' ? 'bg-theme-accent text-theme-card shadow-glow' : 'hover:bg-theme-accent-soft'}`}
            >
              <div className="w-9 h-9 rounded-full border-2 border-theme-accent/20 overflow-hidden shrink-0 shadow-sm">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left min-w-0">
                <p className={`text-sm font-black truncate leading-none ${currentView === 'settings' ? 'text-theme-card' : 'text-theme-text'}`}>
                  {user.name.split(' ')[0]}
                </p>
                <p className={`text-[8px] font-black uppercase tracking-[0.25em] mt-1 opacity-50 ${currentView === 'settings' ? 'text-theme-card' : 'text-theme-muted'}`}>
                  Conta Premium
                </p>
              </div>
            </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-5 h-[3rem] rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all group active:scale-[0.98]"
            >
              <span className="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
