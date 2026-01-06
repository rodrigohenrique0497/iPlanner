
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/databaseService';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
            theme: 'light',
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
            const fallback: User = {
              id: authUser.id,
              name: authUser.name || authUser.email?.split('@')[0] || 'Usuário',
              email: authUser.email || '',
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
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-900 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl shadow-slate-200 mb-8 transform hover:rotate-6 transition-transform">
             <span className="material-symbols-outlined text-white !text-5xl">menu_book</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-800">iPlanner</h2>
          <p className="mt-4 text-slate-500 font-medium px-6 text-sm">Sua vida organizada em um só lugar.</p>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[4.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acessando...</p>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-center font-black text-slate-800 text-lg uppercase tracking-widest">
              {isRegistering ? 'Criar Conta' : 'Entrar no iPlanner'}
            </h3>

            <form onSubmit={handleAction} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nome Completo</label>
                  <input
                    required
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-5 bg-slate-50/80 rounded-[1.75rem] border-2 border-transparent outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white text-sm font-bold transition-all"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">E-mail</label>
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-5 bg-slate-50/80 rounded-[1.75rem] border-2 border-transparent outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white text-sm font-bold transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Senha</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-5 bg-slate-50/80 rounded-[1.75rem] border-2 border-transparent outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white text-sm font-bold transition-all"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-5 rounded-[1.75rem] font-black text-lg shadow-xl transition-all active:scale-[0.97] mt-6 ${
                  isRegistering 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' 
                    : 'bg-slate-900 text-white shadow-slate-200 hover:bg-black'
                }`}
              >
                {isRegistering ? 'Cadastrar' : 'Entrar Agora'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-6 py-2 rounded-full transition-all"
            >
              {isRegistering ? (
                'Já tem uma conta? Faça Login'
              ) : (
                <>Não tem uma conta? <span className="text-blue-600 underline underline-offset-4 ml-1 hover:text-blue-800">Criar Agora</span></>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-medium text-slate-400 opacity-60">
          Dados armazenados com segurança no seu navegador.
        </p>
      </div>
    </div>
  );
};

export default Auth;
