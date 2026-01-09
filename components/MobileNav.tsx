
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
    { id: 'finance', label: 'Finanças', icon: 'account_balance_wallet' },
  ];

  const handleNavClick = (view: ViewState) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10); // Vibração levemente mais tátil
    }
    setView(view);
  };

  return (
    <nav className="md:hidden fixed bottom-6 left-5 right-5 h-[5rem] glass-mobile-nav flex justify-around items-center px-4 z-[60] rounded-[2.5rem] shadow-glass">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 h-full w-full max-w-[4.5rem] transition-all active:scale-90 relative ${isActive ? 'text-theme-accent' : 'text-theme-muted'}`}
          >
            <span 
              className={`material-symbols-outlined !text-[28px] transition-all duration-400 ${isActive ? 'font-black scale-110 opacity-100' : 'opacity-50'}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-2 right-3 w-2 h-2 bg-theme-accent rounded-full shadow-glow"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
