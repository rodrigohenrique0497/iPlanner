
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

  const getRank = () => "Platinum Member";

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] md:hidden transition-all"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border/40 h-[100dvh] flex flex-col z-[70] transition-all duration-500 ease-in-out bg-theme-bg
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Header Compacto */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between shrink-0">
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-theme-accent flex items-center justify-center p-2 shadow-premium">
              <span className="material-symbols-outlined !text-xl text-theme-card">menu_book</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-theme-text">iPlanner</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-theme-muted active:scale-90 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Navegação Principal */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-40 mb-4 ml-4">Menu</p>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-extrabold shadow-glow'
                    : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-theme-accent-soft'
                }`}
              >
                <span className={`material-symbols-outlined !text-[20px] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé Fixo de Conta */}
        <div className="p-4 shrink-0 border-t border-theme-border/30 bg-theme-card/10 space-y-2">
          <button 
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border border-transparent ${currentView === 'settings' ? 'bg-theme-accent text-theme-card' : 'hover:bg-theme-accent-soft'}`}
          >
            <div className="w-9 h-9 rounded-full border-2 border-theme-accent/20 overflow-hidden shrink-0">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-left min-w-0">
              <p className={`text-xs font-black truncate leading-none ${currentView === 'settings' ? 'text-theme-card' : 'text-theme-text'}`}>
                {user.name}
              </p>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-1 block opacity-60`}>
                {getRank()}
              </span>
            </div>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined !text-[20px]">logout</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
