
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
    <nav className="md:hidden fixed bottom-6 left-5 right-5 glass-mobile-nav flex justify-between items-center px-4 py-3 z-[60] rounded-[2.5rem] shadow-glass transition-all border border-theme-border/30">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all active:scale-90 relative ${isActive ? 'text-theme-accent' : 'text-theme-text'}`}
          >
            <span 
              className={`material-symbols-outlined !text-[26px] transition-all duration-300 ${isActive ? 'font-black scale-110 opacity-100' : 'opacity-75 group-hover:opacity-100'}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1.5 h-1.5 bg-theme-accent rounded-full shadow-glow"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
