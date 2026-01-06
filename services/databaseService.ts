
import { Task, Habit, Goal, Note, FinanceTransaction, User, ThemeType } from '../types';

const STORAGE_PREFIX = 'iplanner_local_';
const GLOBAL_THEME_KEY = 'iplanner_global_theme';

export const db = {
  // Simulação de autenticação local
  signUp: async (email: string, pass: string, name: string) => {
    const users = JSON.parse(localStorage.getItem('iplanner_users') || '[]');
    if (users.find((u: any) => u.email === email)) throw new Error("E-mail já cadastrado.");
    
    const newUser = { id: Math.random().toString(36).substr(2, 9), email, password: pass, name };
    users.push(newUser);
    localStorage.setItem('iplanner_users', JSON.stringify(users));
    return newUser;
  },

  signIn: async (email: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem('iplanner_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === pass);
    if (!user) throw new Error("Credenciais inválidas.");
    return user;
  },

  signOut: async () => {
    localStorage.removeItem('iplanner_current_session');
  },

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

  saveUser: async (user: User) => {
    localStorage.setItem(`${STORAGE_PREFIX}profile_${user.id}`, JSON.stringify(user));
    db.setGlobalTheme(user.theme);
  },

  loadProfile: async (userId: string): Promise<User | null> => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}profile_${userId}`);
    return data ? JSON.parse(data) : null;
  },

  saveData: async (userId: string, table: string, data: any[]) => {
    localStorage.setItem(`${STORAGE_PREFIX}${table}_${userId}`, JSON.stringify(data));
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${table}_${userId}`);
    return data ? JSON.parse(data) : defaultValue;
  },

  setGlobalTheme: (theme: ThemeType) => {
    localStorage.setItem(GLOBAL_THEME_KEY, theme);
  },

  getGlobalTheme: (): ThemeType => {
    return (localStorage.getItem(GLOBAL_THEME_KEY) as ThemeType) || 'light';
  },

  getStorageUsage: () => "Local (Navegador)"
};
