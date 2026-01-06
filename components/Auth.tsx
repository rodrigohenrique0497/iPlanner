
import React, { useState, useEffect } from 'react';
import { User, ThemeType } from '../types';
import { db } from '../services/databaseService';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(db.getGlobalTheme());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.className = `theme-${isRegistering ? selectedTheme : db.getGlobalTheme()}`;
  }, [isRegistering, selectedTheme]);

  const themes: { id: ThemeType; label: string; icon: string; bg: string; text: string }[] = [
    { id: 'light', label: 'Claro', icon: 'light_mode', bg: 'bg-white', text: 'text-slate-900' },
    { id: 'dark', label: 'Escuro', icon: 'dark_mode', bg: 'bg-slate-900', text: 'text-white' },
    { id: 'rosa', label: 'Rosa', icon: 'favorite', bg: 'bg-rose-100', text: 'text-rose-600' },
    { id: 'azul', label: 'Azul', icon: 'water_drop', bg: 'bg-blue-100', text: 'text-blue-600' },
  ];

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        const authUser = await db.signUp(email, password, name);
        if (authUser) {
          const newUser: User = {
            id: authUser.id,
            name: name.trim(),
            email: email.trim(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`,
            xp: 0,
            level: 1,
            joinedAt: new Date().toISOString(),
            focusGoal: 'Focar na minha produtividade',
            theme: selectedTheme,
            categories: ['Geral', 'Trabalho', 'Pessoal']
          };
          await db.saveUser(newUser);
          db.setSession(newUser);
          onLogin(newUser);
        }
      } else {
        const authUser = await db.signIn(email, password);
        if (authUser) {
          const profile = await db.loadProfile();
          if (profile) {
            db.setSession(profile);
            onLogin(profile);
          } else {
            const defaultUser: User = { 
              id: authUser.id, 
              name: authUser.user_metadata?.full_name || 'Usuário', 
              email: authUser.email || '', 
              avatar: '', 
              xp: 0, 
              level: 1, 
              joinedAt: new Date().toISOString(), 
              focusGoal: 'Produtividade', 
              theme: db.getGlobalTheme(), 
              categories: ['Geral'] 
            };
            onLogin(defaultUser);
          }
        }
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentThemeClass = isRegistering ? selectedTheme : db.getGlobalTheme();

  return (
    <div className={`min-h-screen transition-all duration-700 flex items-center justify-center p-6 theme-${currentThemeClass} bg-theme-bg`}>
      <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Logo Section - Mais Clean */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-theme-accent rounded-[2.5rem] mx-auto flex items-center justify-center shadow-premium transform hover:scale-105 transition-all">
             <span className="material-symbols-outlined !text-4xl text-theme-card">menu_book</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-theme-text transition-colors">iPlanner</h2>
        </div>

        {/* Card Principal - Refinado */}
        <div className="bg-theme-card p-10 md:p-12 rounded-[4rem] border border-theme-border shadow-premium relative overflow-hidden transition-all">
          {isLoading && (
            <div className="absolute inset-0 bg-theme-card/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-theme-border border-t-theme-accent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Conectando...</p>
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-6">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">Seu Nome</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-5 bg-theme-bg border border-theme-border rounded-[1.75rem] outline-none focus:ring-4 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-widest opacity-80">Estilo Visual</label>
                  <div className="grid grid-cols-4 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTheme(t.id)}
                        className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all ${
                          selectedTheme === t.id 
                          ? 'border-theme-accent bg-theme-accent-soft shadow-sm scale-110' 
                          : 'bg-theme-bg border-theme-border opacity-60 grayscale'
                        }`}
                        title={t.label}
                      >
                        <span className={`material-symbols-outlined !text-xl ${t.id === 'dark' ? 'text-white' : t.text}`}>
                          {t.icon}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-5 bg-theme-bg border border-theme-border rounded-[1.75rem] outline-none focus:ring-4 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">Senha</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 bg-theme-bg border border-theme-border rounded-[1.75rem] outline-none focus:ring-4 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text"
              />
            </div>

            <button
              type="submit"
              className="w-full py-6 rounded-[1.75rem] font-black text-lg shadow-premium transition-all active:scale-[0.98] mt-4 bg-theme-accent text-theme-card hover:opacity-90 uppercase tracking-widest"
            >
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-theme-border pt-8">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-black text-theme-muted hover:text-theme-text uppercase tracking-widest transition-all"
            >
              {isRegistering ? (
                'Já possui acesso? Clique aqui'
              ) : (
                'Primeira vez? Crie sua conta'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
