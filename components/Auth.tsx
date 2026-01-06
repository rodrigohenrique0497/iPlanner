
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
          const profile = await db.loadProfile(authUser.id);
          if (profile) {
            db.setSession(profile);
            onLogin(profile);
          } else {
            // Caso o profile ainda não exista por algum erro de sincronismo inicial
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
    <div className={`min-h-screen transition-all duration-1000 flex items-center justify-center p-6 theme-${currentThemeClass} bg-theme-bg`}>
      <div className="max-w-lg w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-theme-accent rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all border-4 border-white/20">
             <span className="material-symbols-outlined !text-5xl text-theme-card leading-none">menu_book</span>
          </div>
          <div>
            <h2 className="text-6xl font-black tracking-tighter text-theme-accent transition-colors duration-700">iPlanner</h2>
            <p className="mt-2 text-theme-accent font-black px-6 text-[10px] uppercase tracking-[0.4em] opacity-50 transition-colors duration-700">
              A EXCELÊNCIA EM ORGANIZAÇÃO
            </p>
          </div>
        </div>

        <div className="bg-theme-card p-10 md:p-14 rounded-[5rem] border border-theme-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all duration-700">
          {isLoading && (
            <div className="absolute inset-0 bg-theme-card/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center space-y-6">
              <div className="w-14 h-14 border-4 border-theme-border border-t-theme-accent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-muted text-center">Conectando ao Supabase Cloud...</p>
            </div>
          )}

          <div className="space-y-10">
            <h3 className="text-center font-black text-theme-text text-xl uppercase tracking-[0.3em] transition-colors">
              {isRegistering ? 'Nova Experiência' : 'Acesse seu Plano'}
            </h3>

            <form onSubmit={handleAction} className="space-y-8">
              {isRegistering && (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest transition-colors">Seu nome de usuário</label>
                    <input
                      required
                      type="text"
                      placeholder="Como deseja ser chamado(a)?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-6 bg-theme-bg border-2 border-theme-border rounded-[2.25rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:bg-theme-card focus:border-theme-accent text-base font-bold transition-all text-theme-text placeholder:text-theme-muted/40"
                    />
                  </div>

                  <div className="space-y-6 py-2">
                    <label className="text-[10px] font-black uppercase text-theme-muted text-center block tracking-[0.2em] transition-colors">Escolha sua Identidade Visual</label>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTheme(t.id)}
                          className={`group flex items-center gap-4 p-5 rounded-[2.5rem] transition-all duration-500 border-2 ${
                            selectedTheme === t.id 
                            ? 'bg-theme-card border-theme-accent ring-8 ring-theme-accent-soft shadow-2xl scale-[1.05] z-10' 
                            : 'bg-theme-bg border-theme-border hover:border-theme-accent/30 opacity-60'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12 ${t.bg} border border-black/5 shrink-0`}>
                            <span className={`material-symbols-outlined !text-2xl ${t.id === 'dark' ? 'text-white' : t.text}`}>
                              {t.icon}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className={`text-[9px] font-black uppercase tracking-widest block ${selectedTheme === t.id ? 'text-theme-text' : 'text-theme-muted'}`}>
                              {t.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest transition-colors">E-mail</label>
                <input
                  required
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-6 bg-theme-bg border-2 border-theme-border rounded-[2.25rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:bg-theme-card focus:border-theme-accent text-base font-bold transition-all text-theme-text placeholder:text-theme-muted/40"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-theme-muted ml-6 tracking-widest transition-colors">Senha</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-6 bg-theme-bg border-2 border-theme-border rounded-[2.25rem] outline-none focus:ring-8 focus:ring-theme-accent-soft focus:bg-theme-card focus:border-theme-accent text-base font-bold transition-all text-theme-text placeholder:text-theme-muted/40"
                />
              </div>

              <button
                type="submit"
                className="w-full py-7 rounded-[2.25rem] font-black text-xl shadow-2xl transition-all active:scale-[0.97] mt-8 bg-theme-accent text-theme-card hover:opacity-90 uppercase tracking-[0.2em]"
              >
                {isRegistering ? 'Criar Minha Conta' : 'Entrar Agora'}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center border-t border-theme-border pt-10">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-theme-muted hover:text-theme-accent px-8 py-3 rounded-full transition-all"
            >
              {isRegistering ? (
                'Já possui uma conta? Faça o Login'
              ) : (
                <>Primeira vez no iPlanner? <span className="text-theme-text underline underline-offset-4 ml-1 font-black">Criar Conta</span></>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-black text-theme-muted opacity-40 tracking-[0.2em] transition-colors">
          iPlanner • Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Auth;
