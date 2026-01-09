
import React, { useState, useEffect, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStorageUsage(db.getStorageUsage());
  }, []);

  const themes: { id: ThemeType; label: string; icon: string; description: string; colorClass: string }[] = [
    { id: 'light', label: 'Modo Claro', icon: 'light_mode', description: 'Visual limpo e profissional.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Modo Escuro', icon: 'dark_mode', description: 'Focado e elegante.', colorClass: 'bg-slate-900' },
    { id: 'rosa', label: 'Modo Rosa', icon: 'favorite', description: 'Suave e inspirador.', colorClass: 'bg-rose-500' },
    { id: 'azul', label: 'Modo Azul', icon: 'water_drop', description: 'Sereno e moderno.', colorClass: 'bg-blue-500' },
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
        
        if (json.user && (json.tasks || json.habits || json.notes)) {
          const confirmImport = window.confirm("Atenção: Restaurar este backup substituirá todos os seus dados atuais. Deseja prosseguir?");
          if (!confirmImport) return;

          const uid = user.id;
          const importedUser = { ...json.user, id: uid }; 

          localStorage.setItem(`iplanner_local_profile_${uid}`, JSON.stringify(importedUser));
          if (json.tasks) localStorage.setItem(`iplanner_local_tasks_${uid}`, JSON.stringify(json.tasks));
          if (json.habits) localStorage.setItem(`iplanner_local_habits_${uid}`, JSON.stringify(json.habits));
          if (json.goals) localStorage.setItem(`iplanner_local_goals_${uid}`, JSON.stringify(json.goals));
          if (json.notes) localStorage.setItem(`iplanner_local_notes_${uid}`, JSON.stringify(json.notes));
          if (json.finance) localStorage.setItem(`iplanner_local_finance_${uid}`, JSON.stringify(json.finance));

          db.setSession(importedUser);
          db.setGlobalTheme(importedUser.theme);

          alert("Backup restaurado com sucesso! Reiniciando o iPlanner...");
          window.location.reload();
        } else {
          alert("Erro: O arquivo não parece ser um backup válido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON.");
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12 page-transition pb-32">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-theme-text">Configurações</h2>
        <div className="flex items-center gap-2">
          <div className="px-4 py-1.5 bg-theme-accent-soft rounded-xl border border-theme-border">
             <span className="text-[10px] font-black uppercase text-theme-muted opacity-80 tracking-[0.2em]">Sincronização: Nuvem Supabase</span>
          </div>
        </div>
      </div>
      
      {/* Temas Premium */}
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
              className={`p-6 rounded-[2.25rem] border-2 transition-all text-left flex items-center gap-6 active:scale-95 ${
                user.theme === t.id 
                ? 'border-theme-accent bg-theme-card shadow-premium' 
                : 'border-theme-border bg-theme-card/50 hover:border-theme-accent/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${t.colorClass} border border-black/5`}>
                <span className={`material-symbols-outlined !text-2xl ${t.id === 'dark' ? 'text-white' : (t.id === 'light' ? 'text-slate-900' : 'text-white')}`}>
                  {t.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-black text-theme-text text-base tracking-tight leading-none">{t.label}</p>
                <p className="text-[10px] font-bold text-theme-muted mt-2 uppercase tracking-widest opacity-60 truncate">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 md:p-12 rounded-planner border border-theme-border bg-theme-card shadow-premium space-y-10">
        <header className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 px-4">Perfil Pessoal</h3>
          <div className="h-1 w-14 bg-theme-accent rounded-full ml-4 opacity-40"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-60">Seu Nome</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input-premium" 
              placeholder="Nome"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-theme-muted ml-5 tracking-widest opacity-60">Foco Principal</label>
            <input 
              type="text" 
              value={goal} 
              onChange={e => setGoal(e.target.value)} 
              className="input-premium" 
              placeholder="Ex: Minha produtividade"
            />
          </div>
        </div>

        <button 
          onClick={() => onUpdate({ name, focusGoal: goal })} 
          className="btn-action-primary"
        >
          Salvar Alterações
        </button>
      </div>

      <div className="bg-theme-card p-8 md:p-12 rounded-planner border border-theme-border space-y-10 shadow-premium">
        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-theme-muted opacity-50 px-4">Segurança & Dados</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={handleExportData}
            className="flex items-center gap-5 p-6 bg-theme-bg rounded-[2rem] border-2 border-theme-border hover:border-theme-accent transition-all group shadow-sm active:scale-[0.98] h-[5rem]"
          >
            <div className="w-12 h-12 bg-theme-card rounded-xl flex items-center justify-center border border-theme-border group-hover:bg-theme-accent group-hover:text-theme-card transition-all">
              <span className="material-symbols-outlined !text-2xl">download</span>
            </div>
            <div className="text-left">
              <span className="font-black text-theme-text uppercase text-[11px] tracking-widest block leading-none">Exportar Backup</span>
              <p className="text-[9px] text-theme-muted mt-2 font-bold uppercase opacity-40">Salvar cópia JSON</p>
            </div>
          </button>

          <button 
            onClick={handleImportClick}
            className="flex items-center gap-5 p-6 bg-theme-bg rounded-[2rem] border-2 border-theme-border hover:border-theme-accent transition-all group shadow-sm active:scale-[0.98] h-[5rem]"
          >
            <div className="w-12 h-12 bg-theme-card rounded-xl flex items-center justify-center border border-theme-border group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <span className="material-symbols-outlined !text-2xl">upload</span>
            </div>
            <div className="text-left">
              <span className="font-black text-theme-text uppercase text-[11px] tracking-widest block leading-none">Importar Backup</span>
              <p className="text-[9px] text-theme-muted mt-2 font-bold uppercase opacity-40">Restaurar dados</p>
            </div>
          </button>
        </div>
        
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      </div>

      <div className="bg-rose-500/5 p-10 md:p-12 rounded-planner border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="font-black text-rose-600 text-xl md:text-2xl tracking-tight leading-none">Encerrar Sessão</p>
          <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3 opacity-60">Sua conta permanecerá segura em nossos servidores.</p>
        </div>
        <button 
          onClick={onLogout} 
          className="bg-rose-600 text-white px-12 h-[4.5rem] rounded-2xl font-black shadow-premium hover:bg-rose-700 transition-all active:scale-95 w-full md:w-auto uppercase tracking-[0.2em] text-[11px]"
        >
          Sair do iPlanner
        </button>
      </div>
    </div>
  );
};

export default Settings;
