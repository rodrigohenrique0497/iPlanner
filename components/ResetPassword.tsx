
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [sessionValid, setSessionValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecoverySession = async () => {
      // O Supabase injeta o token de recuperação no fragmento (hash) da URL
      const hash = window.location.hash;

      if (hash && (hash.includes('type=recovery') || hash.includes('access_token='))) {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setSessionValid(false);
          setIsLoading(false);
          return;
        }

        setSessionValid(true);
        setIsLoading(false);
      } else {
        // Se não houver hash válido, verificamos se já existe uma sessão ativa (caso o usuário tenha acabado de clicar)
        const { data: { session } } = await supabase.auth.getSession();
        setSessionValid(!!session);
        setIsLoading(false);
      }
    };

    handleRecoverySession();
  }, []);

  const validatePassword = (pass: string) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasMinLength = pass.length >= 8;
    return { hasUpperCase, hasNumber, hasMinLength };
  };

  const { hasUpperCase, hasNumber, hasMinLength } = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
  const isFormValid = hasUpperCase && hasNumber && hasMinLength && passwordsMatch;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setMessage({ type: 'error', text: 'A senha não atende aos requisitos de segurança.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Senha atualizada com sucesso! Redirecionando...' });
      
      // Logout global para forçar novo login com a nova credencial
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/'); // Redireciona para a tela inicial (onde o Auth reside)
      }, 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao atualizar senha.' });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-theme-card p-10 rounded-[3rem] border border-theme-border shadow-premium text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <span className="material-symbols-outlined !text-4xl">link_off</span>
          </div>
          <h2 className="text-2xl font-black text-theme-text tracking-tighter">Link inválido ou expirado</h2>
          <p className="text-theme-muted font-medium">O link de recuperação de senha não é mais válido ou já foi utilizado.</p>
          <button onClick={() => navigate('/')} className="btn-action-primary">VOLTAR PARA LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-theme-accent rounded-[2rem] mx-auto flex items-center justify-center shadow-premium">
             <span className="material-symbols-outlined !text-4xl text-theme-card">lock_reset</span>
          </div>
          <h2 className="text-4xl font-black text-theme-text tracking-tighter">Nova Senha</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted opacity-80">Redefina seu acesso com segurança</p>
        </div>

        <div className="bg-theme-card p-8 md:p-12 rounded-[3.5rem] border border-theme-border shadow-premium relative overflow-hidden">
          {isSubmitting && (
            <div className="absolute inset-0 bg-theme-card/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-theme-muted ml-4 tracking-widest">Sua Nova Senha</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-premium"
              />
              
              <div className="grid grid-cols-1 gap-2 px-4 pt-2">
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${hasMinLength ? 'text-emerald-500' : 'text-theme-muted opacity-40'}`}>
                  <span className="material-symbols-outlined !text-sm">{hasMinLength ? 'check_circle' : 'circle'}</span> Mínimo 8 caracteres
                </div>
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${hasNumber ? 'text-emerald-500' : 'text-theme-muted opacity-40'}`}>
                  <span className="material-symbols-outlined !text-sm">{hasNumber ? 'check_circle' : 'circle'}</span> Pelo menos 1 número
                </div>
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors ${hasUpperCase ? 'text-emerald-500' : 'text-theme-muted opacity-40'}`}>
                  <span className="material-symbols-outlined !text-sm">{hasUpperCase ? 'check_circle' : 'circle'}</span> 1 letra maiúscula
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-theme-muted ml-4 tracking-widest">Confirme a Senha</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`input-premium ${confirmPassword && !passwordsMatch ? 'border-rose-500' : ''}`}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 ml-4">As senhas não coincidem</p>
              )}
            </div>

            {message && (
              <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in ${
                message.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`btn-action-primary transition-all ${(!isFormValid || isSubmitting) ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:scale-[1.02] shadow-glow'}`}
            >
              {isSubmitting ? 'ATUALIZANDO...' : 'ATUALIZAR SENHA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
