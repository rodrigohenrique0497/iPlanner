
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
    { id: 'notes', label: 'Notas', icon: 'description' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 glass-effect bg-theme-card/80 border border-theme-border flex justify-around items-center px-1 py-2 z-[60] rounded-planner shadow-premium">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-planner-sm transition-all duration-300 min-w-[56px] ${
              isActive
                ? 'text-theme-text scale-105 bg-theme-accent-soft'
                : 'text-theme-muted'
            }`}
          >
            <span className={`material-symbols-outlined !text-2xl flex items-center justify-center leading-none transition-transform ${
              isActive ? 'scale-110 font-black' : 'opacity-60'
            }`}>
              {item.icon}
            </span>
            <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors ${
              isActive ? 'text-theme-text' : 'text-theme-muted opacity-60'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
