
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
    { id: 'calendar', label: 'Agenda', icon: 'calendar_month' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt' },
    { id: 'finance', label: 'Money', icon: 'account_balance_wallet' },
  ];

  const handleNavClick = (view: ViewState) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
    setView(view);
  };

  return (
    <nav className="md:hidden fixed bottom-6 left-5 right-5 h-[4.75rem] glass-mobile-nav flex justify-around items-center px-4 z-[60] rounded-[2rem] shadow-glass border border-theme-border/50">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 h-full w-full max-w-[4rem] transition-all active:scale-90 relative ${isActive ? 'text-theme-accent' : 'text-theme-muted'}`}
          >
            <span 
              className={`material-symbols-outlined !text-[26px] transition-all duration-300 ${isActive ? 'font-black scale-110 opacity-100' : 'opacity-60'}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[7.5px] font-black uppercase tracking-[0.1em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-1 right-3 w-1.5 h-1.5 bg-theme-accent rounded-full shadow-glow"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
