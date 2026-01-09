
import React, { useState, useEffect } from 'react';
import { User, ThemeType } from '../types';
import { db } from '../services/databaseService';

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

  const themes: { id: ThemeType; label: string; icon: string; description: string; colorClass: string }[] = [
    { id: 'light', label: 'Modo Claro', icon: 'light_mode', description: 'Limpo e profissional.', colorClass: 'bg-white' },
    { id: 'dark', label: 'Modo Escuro', icon: 'dark_mode', description: 'Focado e elegante.', colorClass: 'bg-slate-900' },
    { id: 'rosa', label: 'Modo Rosa', icon: 'favorite', description: 'Suave e inspirador.', colorClass: 'bg-rose-500' },
    { id: 'azul', label: 'Modo Azul', icon: 'water_drop', description: 'Sereno e moderno.', colorClass: 'bg-blue-500' },
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
    <div className={`min-h-screen transition-all duration-700 flex items-center justify-center p-4 md:p-6 theme-${currentThemeClass} bg-theme-bg overflow-x-hidden`}>
      <div className="max-w-xl w-full space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-theme-accent rounded-[2rem] mx-auto flex items-center justify-center shadow-premium transform hover:rotate-3 transition-all">
             <span className="material-symbols-outlined !text-3xl md:!text-4xl text-theme-card">menu_book</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-theme-text leading-none">iPlanner</h2>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-80">Excelência em Organização</p>
        </div>

        <div className="bg-theme-card p-6 md:p-12 rounded-[3rem] border-2 border-theme-border shadow-premium relative overflow-hidden transition-all">
          {isLoading && (
            <div className="absolute inset-0 bg-theme-card/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-theme-border border-t-theme-accent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">Conectando...</p>
            </div>
          )}

          <form onSubmit={handleAction} className="space-y-6 w-full">
            {isRegistering && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">Nome Completo</label>
                  <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria Silva" className="input-premium" />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <label className="text-[9px] font-black uppercase text-theme-muted text-center tracking-widest opacity-80">Escolha seu Estilo</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTheme(t.id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedTheme === t.id ? 'border-theme-accent bg-theme-card' : 'border-theme-border bg-theme-bg/50 opacity-60'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl shrink-0 ${t.colorClass} border border-black/5`}></div>
                        <p className="font-black text-theme-text text-[11px] uppercase tracking-widest">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">E-mail</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@email.com" className="input-premium" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-theme-muted ml-4 tracking-widest opacity-80">Senha</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-premium" />
              </div>
            </div>

            <button type="submit" className="btn-action-primary mt-4">
              {isRegistering ? 'CRIAR MINHA CONTA' : 'ENTRAR NO IPLANNER'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-theme-border pt-6 flex flex-col items-center space-y-4">
            <p className="text-[10px] font-black text-theme-muted uppercase tracking-widest opacity-70">
              {isRegistering ? 'Já possui conta?' : 'Novo por aqui?'}
            </p>
            <button onClick={() => setIsRegistering(!isRegistering)} className="px-10 py-4 bg-theme-bg border-2 border-theme-border rounded-full text-[10px] font-black text-theme-text uppercase tracking-widest transition-all hover:bg-theme-accent hover:text-theme-card">
              {isRegistering ? 'CLIQUE PARA ENTRAR' : 'CRIE SUA CONTA GRÁTIS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
