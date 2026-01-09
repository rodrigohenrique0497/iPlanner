
import React, { useState, useEffect, useRef } from 'react';
import { User, ThemeType } from '../types';
import { db } from '../services/databaseService';
import { notificationService } from '../services/notificationService';

interface SettingsProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  onLogout: () => void;
  onExport: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onLogout, onExport }) => {
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.focusGoal);
  const [pushEnabled, setPushEnabled] = useState(notificationService.hasPermission());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const themes: { id: ThemeType; label: string; icon: string; description: string; colorClass: string }[] = [
    { id: 'light', label: 'Modo Claro', icon: 'light_mode', description: 'Visual limpo e profissional.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Modo Escuro', icon: 'dark_mode', description: 'Focado e elegante.', colorClass: 'bg-slate-900' },
    { id: 'rosa', label: 'Modo Rosa', icon: 'favorite', description: 'Suave e inspirador.', colorClass: 'bg-rose-500' },
    { id: 'azul', label: 'Modo Azul', icon: 'water_drop', description: 'Sereno e moderno.', colorClass: 'bg-blue-500' },
  ];

  const handleTogglePush = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      const success = await notificationService.subscribeUserToPush(user.id);
      if (success) {
        setPushEnabled(true);
        alert("Notificações Push ativadas com sucesso!");
      }
    } else {
      alert("Permissão de notificação negada.");
    }
  };

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.user) {
          const confirmImport = window.confirm("Substituir todos os dados atuais?");
          if (!confirmImport) return;
          const uid = user.id;
          localStorage.setItem(`iplanner_local_profile_${uid}`, JSON.stringify({ ...json.user, id: uid }));
          if (json.tasks) localStorage.setItem(`iplanner_local_tasks_${uid}`, JSON.stringify(json.tasks));
          if (json.habits) localStorage.setItem(`iplanner_local_habits_${uid}`, JSON.stringify(json.habits));
          if (json.goals) localStorage.setItem(`iplanner_local_goals_${uid}`, JSON.stringify(json.goals));
          if (json.notes) localStorage.setItem(`iplanner_local_notes_${uid}`, JSON.stringify(json.notes));
          if (json.finance) localStorage.setItem(`iplanner_local_finance_${uid}`, JSON.stringify(json.finance));
          window.location.reload();
        }
      } catch (err) {
        alert("Erro ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-theme-text">Configurações</h2>
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-1.5 bg-theme-accent-soft rounded-xl border border-theme-border">
             <span className="text-[10px] font-black uppercase text-theme-muted opacity-80 tracking-[0.2em]">Sincronização: Nuvem Supabase</span>
          </div>
          <div className={`px-4 py-1.5 rounded-xl border transition-all ${pushEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'}`}>
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Push: {pushEnabled ? 'Ativo' : 'Inativo'}</span>
          </div>
        </div>
      </div>
      
      {/* Notificações Push */}
      <div className="bg-theme-card p-8 md:p-12 rounded-planner border border-theme-border shadow-premium space-y-8">
        <header className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 px-4">Centro de Notificações</h3>
          <div className="h-1 w-14 bg-theme-accent rounded-full ml-4 opacity-40"></div>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-theme-bg p-8 rounded-[2rem] border border-theme-border">
          <div className="text-center md:text-left">
            <p className="font-black text-theme-text text-lg">Alertas em Tempo Real</p>
            <p className="text-theme-muted text-[10px] font-bold uppercase tracking-widest mt-1">Receba lembretes mesmo com o iPlanner fechado.</p>
          </div>
          <button 
            onClick={handleTogglePush}
            disabled={pushEnabled}
            className={`px-8 h-[3.75rem] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${pushEnabled ? 'bg-emerald-500 text-white cursor-default' : 'bg-theme-accent text-theme-card hover:shadow-glow active:scale-95'}`}
          >
            {pushEnabled ? 'ATIVADO' : 'ATIVAR WEB PUSH'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 px-4">Estilo Visual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => {
                onUpdate({ theme: t.id });
                db.setGlobalTheme(t.id);
              }}
              className={`p-6 rounded-[2.25rem] border-2 transition-all text-left flex items-center gap-6 ${user.theme === t.id ? 'border-theme-accent bg-theme-card shadow-premium' : 'border-theme-border bg-theme-card/50 hover:border-theme-accent/30'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${t.colorClass} border border-black/5`}>
                <span className={`material-symbols-outlined !text-2xl ${t.id === 'dark' || t.id === 'rosa' || t.id === 'azul' ? 'text-white' : 'text-slate-900'}`}>{t.icon}</span>
              </div>
              <div>
                <p className="font-black text-theme-text text-base tracking-tight leading-none">{t.label}</p>
                <p className="text-[10px] font-bold text-theme-muted mt-2 uppercase tracking-widest opacity-60">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 md:p-12 rounded-planner border border-theme-border bg-theme-card shadow-premium space-y-10">
        <header className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 px-4">Perfil Pessoal</h3>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-premium" placeholder="Nome" />
          <input type="text" value={goal} onChange={e => setGoal(e.target.value)} className="input-premium" placeholder="Foco Principal" />
        </div>
        <button onClick={() => onUpdate({ name, focusGoal: goal })} className="btn-action-primary">Salvar Alterações</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button onClick={handleExportData} className="btn-action-secondary h-[4.5rem] flex items-center justify-center gap-3">
          <span className="material-symbols-outlined">download</span> EXPORTAR
        </button>
        <button onClick={handleImportClick} className="btn-action-secondary h-[4.5rem] flex items-center justify-center gap-3">
          <span className="material-symbols-outlined">upload</span> IMPORTAR
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      </div>

      <div className="bg-rose-500/5 p-10 rounded-planner border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="font-black text-rose-600 text-xl tracking-tight leading-none">Encerrar Sessão</p>
          <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Sua conta permanecerá segura na nuvem.</p>
        </div>
        <button onClick={onLogout} className="bg-rose-600 text-white px-12 h-[4.5rem] rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-premium">Sair</button>
      </div>
    </div>
  );
};

export default Settings;
