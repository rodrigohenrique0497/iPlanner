
import React, { useState, useEffect } from 'react';
import { User, ThemeType } from '../types';
import { db } from '../services/databaseService';

interface SettingsProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  onLogout: () => void;
  onExport: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onLogout, onExport }) => {
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.focusGoal);
  const [storageUsage, setStorageUsage] = useState("0");

  useEffect(() => {
    setStorageUsage(db.getStorageUsage());
  }, []);

  const themes: { id: ThemeType; label: string; icon: string; description: string; colorClass: string }[] = [
    { id: 'light', label: 'Modo Claro', icon: 'light_mode', description: 'Visual limpo e profissional.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Modo Escuro', icon: 'dark_mode', description: 'Focado e elegante.', colorClass: 'bg-slate-900' },
    { id: 'rosa', label: 'Modo Rosa', icon: 'favorite', description: 'Suave, inspirador e alegre.', colorClass: 'bg-pink-100' },
    { id: 'glass', label: 'Modo Glass', icon: 'blur_on', description: 'Transparências modernas.', colorClass: 'bg-gradient-to-br from-blue-100 to-indigo-100' },
  ];

  const handleExportData = () => {
    const allData = {
      user,
      tasks: JSON.parse(localStorage.getItem(`iplanner_local_tasks_${user.id}`) || '[]'),
      habits: JSON.parse(localStorage.getItem(`iplanner_local_habits_${user.id}`) || '[]'),
      goals: JSON.parse(localStorage.getItem(`iplanner_local_goals_${user.id}`) || '[]'),
      notes: JSON.parse(localStorage.getItem(`iplanner_local_notes_${user.id}`) || '[]'),
      finance: JSON.parse(localStorage.getItem(`iplanner_local_finance_${user.id}`) || '[]')
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iplanner_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tighter text-theme-text">Configurações</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-theme-accent/5 rounded-lg border border-theme-border">
             <span className="text-[10px] font-black uppercase text-theme-muted">Armazenamento: {storageUsage}</span>
          </div>
        </div>
      </div>
      
      {/* Temas Premium */}
      <div className="space-y-8">
        <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50 px-4">Estilo Visual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => onUpdate({ theme: t.id })}
              className={`p-8 rounded-[3.5rem] border-2 transition-all text-left flex items-center gap-6 active:scale-95 ${
                user.theme === t.id 
                ? 'border-theme-accent bg-theme-card shadow-2xl' 
                : 'border-theme-border bg-theme-card/50 hover:border-theme-accent/30'
              }`}
            >
              <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-inner shrink-0 ${t.colorClass}`}>
                <span className={`material-symbols-outlined !text-3xl ${t.id === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.icon}
                </span>
              </div>
              <div>
                <p className="font-black text-theme-text text-lg tracking-tight">{t.label}</p>
                <p className="text-xs font-medium text-theme-muted mt-0.5">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Perfil permanecem com cores de tema dinâmicas */}
      <div className="bg-theme-card glass-item p-10 rounded-[3.5rem] border border-theme-border space-y-8 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50">Dados & Backup</h3>
        <button 
          onClick={handleExportData}
          className="w-full flex items-center gap-6 p-8 bg-theme-bg rounded-3xl border border-theme-border hover:border-theme-accent transition-all group"
        >
          <span className="material-symbols-outlined !text-4xl text-theme-accent">download</span>
          <div className="text-left">
            <span className="font-black text-theme-text uppercase text-[10px] tracking-widest block">Baixar Cópia (.json)</span>
            <p className="text-[10px] text-theme-muted mt-1">Exporta todas as tarefas, hábitos e notas locais.</p>
          </div>
        </button>
      </div>

      <div className="p-10 rounded-[3.5rem] border border-theme-border bg-theme-card glass-item shadow-sm space-y-8">
        <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50">Perfil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-theme-muted opacity-40 px-4">Como quer ser chamado(a)?</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-theme-bg/50 p-6 rounded-3xl text-theme-text font-bold outline-none border-2 border-transparent focus:border-theme-accent transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-theme-muted opacity-40 px-4">Seu Foco Principal</label>
            <input 
              type="text" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
              className="w-full bg-theme-bg/50 p-6 rounded-3xl text-theme-text font-bold outline-none border-2 border-transparent focus:border-theme-accent transition-all" 
            />
          </div>
        </div>
        <button 
          onClick={() => onUpdate({ name, focusGoal: goal })} 
          className="bg-theme-accent text-theme-card w-full py-6 rounded-3xl font-black text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="bg-rose-500/10 p-10 rounded-[3.5rem] border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-black text-rose-600 text-xl">Sair do iPlanner</p>
          <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Sua sessão será encerrada com segurança.</p>
        </div>
        <button 
          onClick={onLogout} 
          className="bg-rose-600 text-white px-10 py-5 rounded-3xl font-black shadow-lg hover:bg-rose-700 transition-all active:scale-95 w-full md:w-auto"
        >
          Encerrar Sessão
        </button>
      </div>
    </div>
  );
};

export default Settings;
