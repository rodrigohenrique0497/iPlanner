
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

  const handleNavClick = (view: ViewState) => {
    // Implement standard haptic feedback pattern for high-end feel (12ms tick)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setView(view);
  };

  return (
    <nav className="md:hidden fixed bottom-8 left-6 right-6 glass-mobile-nav flex justify-between items-center px-4 py-3.5 z-[60] rounded-[2.5rem] shadow-glass transition-all border border-white/10">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-all active:scale-90 relative ${isActive ? 'text-theme-accent' : 'text-theme-text'}`}
          >
            <span 
              className={`material-symbols-outlined !text-[30px] transition-all duration-300 ${isActive ? 'font-black scale-110 opacity-100' : 'opacity-70'}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
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
