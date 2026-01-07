
import React from 'react';
import { ViewState } from '../types';

interface MobileNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: 'home' },
    { id: 'daily', label: 'Planner', icon: 'today' },
    { id: 'calendar', label: 'Calendário', icon: 'calendar_month' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt' },
    { id: 'finance', label: 'Finanças', icon: 'account_balance_wallet' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-5 right-5 glass-mobile-nav border border-theme-border/20 flex justify-between items-center px-4 py-2.5 z-[60] rounded-planner shadow-glass transition-all">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 p-2 transition-all active:scale-90 relative ${isActive ? 'text-theme-accent' : 'text-theme-muted'}`}
          >
            <span className={`material-symbols-outlined !text-[24px] transition-all duration-300 ${isActive ? 'font-black scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}>
              {item.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-0.5 w-1 h-1 bg-theme-accent rounded-full shadow-glow"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
