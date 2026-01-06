
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
    { id: 'dashboard', label: 'Início', icon: '🏠' },
    { id: 'daily', label: 'Meu Dia (Planner)', icon: '☀️' },
    { id: 'calendar', label: 'Calendário', icon: '📅' },
    { id: 'tasks', label: 'Tarefas', icon: '📋' },
    { id: 'habits', label: 'Hábitos', icon: '🔄' },
    { id: 'notes', label: 'Notas', icon: '📝' },
    { id: 'finance', label: 'Finanças', icon: '💰' },
    { id: 'ai-assistant', label: 'IA Coach', icon: '✨' },
    { id: 'weekly', label: 'Semana', icon: '🗓️' },
    { id: 'monthly', label: 'Metas (Mês)', icon: '🎯' },
    { id: 'annual', label: 'Metas (Ano)', icon: '🌍' },
    { id: 'insights', label: 'Insights', icon: '📈' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ];

  const getRank = (level: number) => {
    if (level < 3) return 'Novato Calmo';
    if (level < 7) return 'Planejador Ágil';
    return 'Mestre da Clareza';
  };

  const handleNavClick = (view: ViewState) => {
    setView(view);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 border-r border-theme-border h-screen flex flex-col z-[70] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
        bg-[var(--sidebar-bg)] glass-item
      `}>
        {/* Header com Logo adaptável ao tema */}
        <div className="p-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-theme-text">
            <span className="w-10 h-10 rounded-[1.25rem] bg-theme-accent flex items-center justify-center shadow-lg transition-transform hover:rotate-6">
              <span className="material-symbols-outlined text-[var(--bg-card)] !text-xl">menu_book</span>
            </span>
            iPlanner
          </h1>
          <button onClick={onClose} className="md:hidden text-theme-muted p-2 hover:bg-theme-bg rounded-full">✕</button>
        </div>
        
        {/* Navegação */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewState)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[1.25rem] transition-all duration-200 group ${
                  isActive
                    ? 'bg-theme-accent text-theme-card font-bold shadow-md'
                    : 'text-theme-muted hover:bg-theme-accent/10 hover:text-theme-text'
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé do Perfil */}
        <div className="p-4 space-y-3 border-t border-theme-border shrink-0">
          <div className="bg-theme-accent/5 rounded-[1.75rem] p-4 border border-theme-accent/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-theme-card flex items-center justify-center text-lg shadow-sm">🏆</div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-theme-muted">Rank Atual</p>
                <p className="text-xs font-black text-theme-text">{getRank(user.level)}</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-theme-card/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-theme-accent rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(user.xp % 100)}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-theme-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            🚪 Encerrar Sessão
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
