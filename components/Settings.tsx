
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
    { id: 'light', label: 'Modo Claro', icon: '☀️', description: 'Visual claro e arejado.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Modo Escuro', icon: '🌙', description: 'Minimalista e focado.', colorClass: 'bg-slate-900' },
    { id: 'glass', label: 'Glass Luxury', icon: '💎', description: 'Efeitos translúcidos.', colorClass: 'bg-gradient-to-br from-blue-100 to-white' },
    { id: 'sweet-pastel', label: 'Tons Pasteis', icon: '🌸', description: 'Visual em tons suaves e coloridos.', colorClass: 'bg-pink-100' },
    { id: 'midnight-slate', label: 'Tons Escuros', icon: '⚓', description: 'Visual profundo, sóbrio e moderno.', colorClass: 'bg-indigo-950' },
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
          <div className="px-3 py-1 bg-slate-500/10 rounded-lg border border-slate-500/20">
             <span className="text-[10px] font-black uppercase text-slate-600">Armazenamento: {storageUsage}</span>
          </div>
        </div>
      </div>
      
      {/* Temas */}
      <div className="space-y-8">
        <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50 px-4">Estilo Visual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => onUpdate({ theme: t.id })}
              className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col gap-4 active:scale-95 ${
                user.theme === t.id 
                ? 'border-theme-accent bg-theme-card shadow-xl shadow-theme-accent/10' 
                : 'border-theme-border bg-theme-card/50 hover:border-theme-accent/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${t.colorClass}`}>
                  {t.icon}
                </div>
                {user.theme === t.id && <span className="text-theme-accent">✓</span>}
              </div>
              <div>
                <p className="font-black text-theme-text text-sm uppercase tracking-widest">{t.label}</p>
                <p className="text-[10px] font-medium text-theme-muted mt-1">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Migração */}
      <div className="bg-theme-card p-10 rounded-[3.5rem] border border-theme-border space-y-8 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50">Dados & Backup</h3>
        </div>

        <div className="p-8 bg-slate-500/5 rounded-3xl border border-slate-500/10 space-y-4">
          <p className="text-xs font-bold text-slate-700">💾 Sincronização em Nuvem</p>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Seus dados são sincronizados automaticamente com o Supabase. Você pode baixar uma cópia local por segurança.
          </p>
        </div>

        <button 
          onClick={handleExportData}
          className="w-full flex flex-col items-start p-8 bg-theme-bg rounded-3xl border border-theme-border hover:border-theme-accent transition-all group"
        >
          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📥</span>
          <span className="font-black text-theme-text uppercase text-[10px] tracking-widest">Baixar Cópia de Segurança (.json)</span>
          <p className="text-[10px] text-theme-muted mt-1">Exporta todas as tarefas, hábitos e notas.</p>
        </button>
      </div>

      {/* Dados do Perfil */}
      <div className={`p-10 rounded-[3.5rem] border border-theme-border bg-theme-card shadow-sm space-y-8`}>
        <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50">Dados do Perfil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-theme-muted opacity-40 px-4">Nome Exibido</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-theme-bg p-6 rounded-3xl text-theme-text font-bold outline-none border-2 border-transparent focus:border-theme-accent transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-theme-muted opacity-40 px-4">Foco Principal</label>
            <input 
              type="text" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
              className="w-full bg-theme-bg p-6 rounded-3xl text-theme-text font-bold outline-none border-2 border-transparent focus:border-theme-accent transition-all" 
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
          <p className="text-rose-400 text-[10px] font-black uppercase">Sua sessão será encerrada.</p>
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
