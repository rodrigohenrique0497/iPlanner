
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
    { id: 'ai-assistant', label: 'IA Coach', icon: 'smart_toy' },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-2xl border border-slate-100/50 flex justify-around items-center px-2 py-3 z-[60] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-[1.5rem] transition-all duration-300 min-w-[64px] ${
              isActive
                ? 'text-slate-900 scale-105 bg-slate-50/50'
                : 'text-slate-300'
            }`}
          >
            <span className={`material-symbols-outlined !text-3xl flex items-center justify-center leading-none transition-transform ${
              isActive ? 'scale-110' : ''
            }`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${
              isActive ? 'text-slate-900' : 'text-slate-300'
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
