
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
    { id: 'calendar', label: 'Calend.', icon: 'calendar_month' },
    { id: 'tasks', label: 'Tarefas', icon: 'task_alt' },
    { id: 'finance', label: 'Dinheiro', icon: 'account_balance_wallet' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 glass-effect bg-theme-card/80 border border-theme-border flex justify-between items-center px-4 py-3 z-[60] rounded-full shadow-premium transition-all">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 p-2 transition-all active:scale-75 ${isActive ? 'text-theme-accent' : 'text-theme-muted opacity-60'}`}
          >
            <span className={`material-symbols-outlined !text-2xl transition-transform ${isActive ? 'font-black scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[7px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {isActive && <span className="w-1 h-1 bg-theme-accent rounded-full mt-0.5 animate-pulse"></span>}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
