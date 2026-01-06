
import React, { useState } from 'react';
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
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(false);

  const themes: { id: ThemeType; label: string; icon: string; bg: string; text: string }[] = [
    { id: 'light', label: 'Claro', icon: 'light_mode', bg: 'bg-white', text: 'text-slate-900' },
    { id: 'dark', label: 'Escuro', icon: 'dark_mode', bg: 'bg-slate-900', text: 'text-white' },
    { id: 'rosa', label: 'Rosa', icon: 'favorite', bg: 'bg-pink-100', text: 'text-pink-600' },
    { id: 'glass', label: 'Glass', icon: 'blur_on', bg: 'bg-gradient-to-br from-blue-100 to-indigo-100', text: 'text-blue-700' },
  ];

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        const authUser = await db.signUp(email, password, name);
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
      } else {
        const authUser = await db.signIn(email, password);
        const profile = await db.loadProfile(authUser.id);
        if (profile) {
          db.setSession(profile);
          onLogin(profile);
        } else {
          const fallback: User = {
            id: authUser.id,
            name: authUser.name || 'Usuário',
            email: authUser.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
            xp: 0,
            level: 1,
            joinedAt: new Date().toISOString(),
            focusGoal: 'Seja bem-vindo!',
            theme: 'light',
            categories: ['Geral']
          };
          onLogin(fallback);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 flex items-center justify-center p-6 theme-${isRegistering ? selectedTheme : 'light'} bg-theme-bg`}>
      <div className="max-w-lg w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl mb-6 transform hover:rotate-6 transition-all border-4 border-white/20">
             <span className="material-symbols-outlined !text-5xl text-white leading-none flex items-center justify-center">menu_book</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-theme-text transition-colors duration-500">iPlanner</h2>
          <p className="mt-2 text-theme-muted font-medium px-6 text-sm transition-colors duration-500">A experiência definitiva em organização pessoal.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[4.5rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all duration-500">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preparando seu espaço...</p>
            </div>
          )}

          <div className="space-y-8">
            <h3 className="text-center font-black text-slate-800 text-xl uppercase tracking-[0.2em]">
              {isRegistering ? 'Nova Jornada' : 'Acesse seu Plano'}
            </h3>

            <form onSubmit={handleAction} className="space-y-6">
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Como quer ser chamado(a)?</label>
                    <input
                      required
                      type="text"
                      placeholder="Seu nome ou apelido"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:ring-8 focus:ring-slate-100 focus:bg-white focus:border-slate-200 text-sm font-bold transition-all text-slate-900 placeholder:text-slate-300"
                    />
                  </div>

                  <div className="space-y-4 py-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest text-center block">Escolha seu estilo visual</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTheme(t.id)}
                          className={`group flex flex-col items-center gap-3 p-4 rounded-[2.5rem] transition-all duration-500 ${
                            selectedTheme === t.id 
                            ? 'bg-slate-50 ring-2 ring-slate-900 shadow-xl scale-105' 
                            : 'bg-white border border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${t.bg} border border-black/5`}>
                            <span className={`material-symbols-outlined !text-2xl ${t.id === 'dark' ? 'text-white' : t.text}`}>
                              {t.icon}
                            </span>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedTheme === t.id ? 'text-slate-900' : 'text-slate-400'}`}>
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">E-mail Corporativo ou Pessoal</label>
                <input
                  required
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:ring-8 focus:ring-slate-100 focus:bg-white focus:border-slate-200 text-sm font-bold transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Senha de Acesso</label>
                <input
                  required
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none focus:ring-8 focus:ring-slate-100 focus:bg-white focus:border-slate-200 text-sm font-bold transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-[0.97] mt-6 bg-slate-900 text-white hover:bg-black uppercase tracking-widest"
              >
                {isRegistering ? 'Iniciar Experiência' : 'Entrar Agora'}
              </button>
            </form>
          </div>

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 rounded-full transition-all"
            >
              {isRegistering ? (
                'Já possui uma conta premium? Faça Login'
              ) : (
                <>Primeira vez no iPlanner? <span className="text-slate-900 underline underline-offset-4 ml-1 font-black">Criar Conta Premium</span></>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-medium text-theme-muted opacity-60 transition-colors duration-500 uppercase tracking-[0.2em]">
          Ecriptação de Ponta-a-Ponta • Dados Locais Seguros
        </p>
      </div>
    </div>
  );
};

export default Auth;
