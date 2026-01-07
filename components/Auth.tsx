
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

  // Temas com a mesma estrutura e textos das Configurações
  const themes: { id: ThemeType; label: string; icon: string; description: string; colorClass: string; iconColor: string }[] = [
    { id: 'light', label: 'Modo Claro', icon: 'light_mode', description: 'Visual limpo e profissional.', colorClass: 'bg-white', iconColor: 'text-slate-900' },
    { id: 'dark', label: 'Modo Escuro', icon: 'dark_mode', description: 'Focado e elegante.', colorClass: 'bg-slate-900', iconColor: 'text-white' },
    { id: 'rosa', label: 'Modo Rosa', icon: 'favorite', description: 'Suave, inspirador e alegre.', colorClass: 'bg-rose-500', iconColor: 'text-white' },
    { id: 'azul', label: 'Modo Azul', icon: 'water_drop', description: 'Sereno, produtivo e moderno.', colorClass: 'bg-blue-500', iconColor: 'text-white' },
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
      <div className="max-w-2xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Header Visual com Slogan */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-theme-accent rounded-[2.5rem] mx-auto flex items-center justify-center shadow-premium transform hover:scale-105 transition-all">
             <span className="material-symbols-outlined !text-4xl text-theme-card">menu_book</span>
          </div>
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-theme-text transition-colors leading-none">iPlanner</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-60 mt-3">Excelência em Organização</p>
          </div>
        </div>

        {/* Card Principal de Autenticação */}
        <div className="bg-theme-card p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] border border-theme-border shadow-premium relative overflow-hidden transition-all">
          {isLoading && (
            <div className="absolute inset-0 bg-theme-card/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-theme-border border-t-theme-accent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Conectando...</p>
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-8">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest opacity-80">Como quer ser chamado(a)?</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full p-6 bg-theme-bg border border-theme-border rounded-[2rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text placeholder:opacity-20"
                  />
                </div>

                <div className="space-y-6 pt-2">
                  <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-widest opacity-80">Escolha seu Estilo Visual</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTheme(t.id)}
                        className={`p-5 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-4 active:scale-95 ${
                          selectedTheme === t.id 
                          ? 'border-theme-accent bg-theme-card shadow-premium ring-4 ring-theme-accent-soft' 
                          : 'border-theme-border bg-theme-bg/50 hover:border-theme-accent/30 opacity-70'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${t.colorClass} border border-black/5`}>
                          <span className={`material-symbols-outlined !text-2xl ${t.id === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {t.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-theme-text text-[13px] tracking-tight truncate">{t.label}</p>
                          <p className="text-[9px] font-medium text-theme-muted mt-0.5 leading-tight line-clamp-1">{t.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest opacity-80">E-mail</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full p-6 bg-theme-bg border border-theme-border rounded-[2rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text placeholder:opacity-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest opacity-80">Senha</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-6 bg-theme-bg border border-theme-border rounded-[2rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:border-theme-accent text-sm font-bold transition-all text-theme-text placeholder:opacity-20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-8 rounded-[2.5rem] font-black text-xl shadow-premium transition-all active:scale-[0.98] mt-4 bg-theme-accent text-theme-card hover:opacity-95 uppercase tracking-[0.2em]"
            >
              {isRegistering ? 'Criar minha Conta' : 'Entrar no iPlanner'}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-theme-border pt-10">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-black text-theme-muted hover:text-theme-text uppercase tracking-widest transition-all px-8 py-4 hover:bg-theme-bg rounded-full border border-transparent hover:border-theme-border"
            >
              {isRegistering ? (
                'Já possui conta? Clique para entrar'
              ) : (
                'Novo por aqui? Crie sua conta grátis'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
