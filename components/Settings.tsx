
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
    { id: 'light', label: 'Light Clean', icon: '☀️', description: 'Visual claro e arejado.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Dark Pro', icon: '🌙', description: 'Minimalista e focado.', colorClass: 'bg-slate-900' },
    { id: 'glass', label: 'Glass Luxury', icon: '💎', description: 'Efeitos translúcidos.', colorClass: 'bg-gradient-to-br from-blue-100 to-white' },
    { id: 'sweet-pastel', label: 'Tons Pasteis', icon: '🌸', description: 'Visual em tons suaves e coloridos.', colorClass: 'bg-pink-100' },
    { id: 'midnight-slate', label: 'Tons Escuros', icon: '⚓', description: 'Visual profundo, sóbrio e moderno.', colorClass: 'bg-indigo-950' },
  ];

  const handleExportData = () => {
    const allData = {
      user,
      tasks: db.loadData(user.id, 'tasks', []),
      habits: db.loadData(user.id, 'habits', []),
      goals: db.loadData(user.id, 'goals', []),
      notes: db.loadData(user.id, 'notes', []),
      finance: db.loadData(user.id, 'finance', [])
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iplanner_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <div className="space-y-4">
        <h2 className="text-5xl font-black tracking-tighter text-theme-text">Configurações</h2>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
             <span className="text-[10px] font-black uppercase text-blue-600">Cloud Sync: Ativo (Supabase)</span>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 rounded-lg">
             <span className="text-[10px] font-black uppercase text-emerald-600">Servidor: Netlify</span>
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
          <h3 className="text-xl font-black uppercase tracking-widest text-theme-muted opacity-50">Cloud Sincronização</h3>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-theme-muted">Status</p>
            <p className="text-xs font-bold text-emerald-500">Sincronizado na Nuvem</p>
          </div>
        </div>

        <div className="p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10 space-y-4">
          <p className="text-xs font-bold text-blue-700">🚀 Nuvem Ativada</p>
          <p className="text-[11px] text-blue-600 leading-relaxed font-medium">
            Seus dados estão sendo salvos automaticamente no **Supabase**. Você pode acessar sua conta de qualquer lugar. Use o botão abaixo apenas se quiser uma cópia offline por segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <button 
            onClick={handleExportData}
            className="flex flex-col items-start p-8 bg-theme-bg rounded-3xl border border-theme-border hover:border-theme-accent transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📥</span>
            <span className="font-black text-theme-text uppercase text-[10px] tracking-widest">Download da Cópia de Segurança</span>
            <p className="text-[10px] text-theme-muted mt-1">Gera um arquivo JSON com todos os dados da nuvem.</p>
          </button>
        </div>
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
          Salvar Perfil na Nuvem
        </button>
      </div>

      <div className="bg-rose-500/10 p-10 rounded-[3.5rem] border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-black text-rose-600 text-xl">Encerrar Sessão</p>
          <p className="text-rose-400 text-[10px] font-black uppercase">Você precisará logar novamente para acessar seus dados.</p>
        </div>
        <button 
          onClick={onLogout} 
          className="bg-rose-600 text-white px-10 py-5 rounded-3xl font-black shadow-lg hover:bg-rose-700 transition-all active:scale-95 w-full md:w-auto"
        >
          Sair do iPlanner
        </button>
      </div>
    </div>
  );
};

export default Settings;
