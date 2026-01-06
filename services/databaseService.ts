
import { Task, Habit, Goal, Note, FinanceTransaction, User } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_PREFIX = 'iplanner_v1_';

export const db = {
  // Autenticação Supabase
  signUp: async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
    return data.user;
  },

  signIn: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
    return data.user;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(`${STORAGE_PREFIX}session`);
  },

  // Sessão
  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}session`);
    }
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(`${STORAGE_PREFIX}session`);
    try {
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  // Perfil do Usuário
  saveUser: async (user: User) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        focus_goal: user.focusGoal,
        theme: user.theme,
        categories: user.categories,
        daily_energy: user.dailyEnergy
      });
    if (error) console.error("Erro ao salvar perfil no Cloud:", error);
  },

  loadProfile: async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      xp: data.xp,
      level: data.level,
      joinedAt: data.created_at,
      focusGoal: data.focus_goal,
      theme: data.theme,
      categories: data.categories,
      dailyEnergy: data.daily_energy
    };
  },

  // Dados Genéricos (Tasks, Habits, etc)
  saveData: async (userId: string, table: string, data: any[]) => {
    // Sincronização em lote: Remove antigos e insere novos (estratégia simples)
    // Em produção real, o ideal é usar upsert por ID individual
    const { error } = await supabase
      .from(table)
      .upsert(data.map(item => ({ ...item, user_id: userId })));
    
    if (error) console.error(`Erro ao sincronizar ${table}:`, error);
    
    // Fallback Local
    localStorage.setItem(`${STORAGE_PREFIX}${table}_${userId}`, JSON.stringify(data));
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      // Se falhar a nuvem, tenta local
      const local = localStorage.getItem(`${STORAGE_PREFIX}${table}_${userId}`);
      return local ? JSON.parse(local) : defaultValue;
    }
    return data || defaultValue;
  },

  getStorageUsage: () => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    return (total / 1024).toFixed(2);
  }
};
