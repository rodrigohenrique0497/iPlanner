
import { User, ThemeType } from '../types';
import { supabase } from '../lib/supabase';

const GLOBAL_THEME_KEY = 'iplanner_global_theme';

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
  },

  // Perfil do Usuário
  saveUser: async (user: User) => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        focus_goal: user.focusGoal,
        theme: user.theme,
        categories: user.categories,
        daily_energy: user.dailyEnergy,
        avatar: user.avatar
      });
    
    if (error) console.error("Erro ao salvar perfil:", error);
    db.setGlobalTheme(user.theme);
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
      xp: data.xp,
      level: data.level,
      focusGoal: data.focus_goal,
      theme: data.theme as ThemeType,
      categories: data.categories || [],
      dailyEnergy: data.daily_energy || {},
      avatar: data.avatar,
      joinedAt: data.created_at
    };
  },

  // Dados Genéricos (Tarefas, Hábitos, etc)
  saveData: async (userId: string, table: string, data: any[]) => {
    // No Supabase, idealmente cada item é uma linha, mas para manter compatibilidade:
    const { error } = await supabase
      .from('user_data')
      .upsert({ 
        user_id: userId, 
        data_type: table, 
        payload: data 
      }, { onConflict: 'user_id, data_type' });
    
    if (error) console.error(`Erro ao salvar ${table}:`, error);
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    const { data, error } = await supabase
      .from('user_data')
      .select('payload')
      .eq('user_id', userId)
      .eq('data_type', table)
      .single();
    
    if (error || !data) return defaultValue;
    return data.payload;
  },

  // Sessão Local (Cache para performance e UX)
  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem('iplanner_current_session', JSON.stringify(user));
      db.setGlobalTheme(user.theme);
    } else {
      localStorage.removeItem('iplanner_current_session');
    }
  },

  getSession: (): User | null => {
    const session = localStorage.getItem('iplanner_current_session');
    try { return session ? JSON.parse(session) : null; } catch { return null; }
  },

  // Tema Global (Persiste mesmo deslogado)
  setGlobalTheme: (theme: ThemeType) => {
    localStorage.setItem(GLOBAL_THEME_KEY, theme);
  },

  getGlobalTheme: (): ThemeType => {
    return (localStorage.getItem(GLOBAL_THEME_KEY) as ThemeType) || 'light';
  },

  getStorageUsage: () => "Nuvem (Supabase)"
};
