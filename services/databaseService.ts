
import { Task, Habit, Goal, Note, FinanceTransaction, User } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_PREFIX = 'iplanner_session_';

export const db = {
  // Autenticação Real via Supabase
  signUp: async (email: string, pass: string, name: string) => {
    if (!supabase) {
      throw new Error("Supabase não pôde ser inicializado. Verifique a URL e a Chave no arquivo supabaseClient.ts.");
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name }
      }
    });

    if (error) throw error;
    return data.user ? { id: data.user.id, email: data.user.email, name } : null;
  },

  signIn: async (email: string, pass: string) => {
    if (!supabase) {
      throw new Error("Supabase não pôde ser inicializado. Verifique a URL e a Chave no arquivo supabaseClient.ts.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    return data.user ? { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name } : null;
  },

  signOut: async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem(`${STORAGE_PREFIX}user`);
  },

  // Sessão (Persistência rápida para evitar flickering)
  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}user`);
    }
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(`${STORAGE_PREFIX}user`);
    try {
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  // Perfil do Usuário (Tabela 'profiles')
  saveUser: async (user: User) => {
    if (!supabase) return;
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
        daily_energy: user.dailyEnergy,
        updated_at: new Date().toISOString()
      });
    if (error) console.error("Erro ao salvar perfil no Supabase:", error);
  },

  loadProfile: async (userId: string): Promise<User | null> => {
    if (!supabase) return null;
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
      categories: data.categories || ['Geral'],
      dailyEnergy: data.daily_energy || {}
    };
  },

  // Sincronização de Dados Genéricos (Tasks, Habits, etc)
  saveData: async (userId: string, table: string, data: any[]) => {
    if (!supabase) return;

    if (data.length === 0) {
      // Se não há dados localmente, garantimos que o banco reflita isso 
      // mas apenas para esta tabela específica do usuário.
      await supabase.from(table).delete().eq('user_id', userId);
      return;
    }

    // Preparamos os dados garantindo que o user_id esteja presente
    const dataToUpsert = data.map(item => ({
      ...item,
      user_id: userId
    }));

    // O upsert é muito mais seguro: ele atualiza se o ID já existir ou insere se for novo.
    // Isso evita o ciclo de deletar tudo e reinserir, que é instável.
    const { error } = await supabase
      .from(table)
      .upsert(dataToUpsert, { onConflict: 'id' });

    if (error) console.error(`Erro ao sincronizar ${table}:`, error);
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    if (!supabase) return defaultValue;
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Erro ao carregar dados de ${table}:`, error);
      return defaultValue;
    }
    return data || defaultValue;
  },

  getStorageUsage: () => {
    return supabase ? "Conectado à Nuvem (Supabase)" : "Offline";
  }
};
