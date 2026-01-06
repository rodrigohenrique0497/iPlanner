
import { Task, Habit, Goal, Note, FinanceTransaction, User } from '../types';

const STORAGE_PREFIX = 'iplanner_local_';

export const db = {
  // Autenticação Local (Simulada para persistência de perfil)
  signUp: async (email: string, pass: string, name: string) => {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sanitizedEmail = email.trim().toLowerCase();
    const userId = Math.random().toString(36).substr(2, 9);
    
    const users = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}registered_users`) || '[]');
    
    // Verifica duplicidade
    if (users.find((u: any) => u.email === sanitizedEmail)) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const user = { id: userId, email: sanitizedEmail, name: name.trim() };
    users.push({ ...user, password: pass });
    localStorage.setItem(`${STORAGE_PREFIX}registered_users`, JSON.stringify(users));
    
    return user;
  },

  signIn: async (email: string, pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sanitizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}registered_users`) || '[]');
    const user = users.find((u: any) => u.email === sanitizedEmail && u.password === pass);
    
    if (!user) throw new Error("E-mail ou senha incorretos.");
    return user;
  },

  signOut: async () => {
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
    localStorage.setItem(`${STORAGE_PREFIX}profile_${user.id}`, JSON.stringify(user));
  },

  loadProfile: async (userId: string): Promise<User | null> => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}profile_${userId}`);
    return data ? JSON.parse(data) : null;
  },

  // Dados Genéricos
  saveData: async (userId: string, table: string, data: any[]) => {
    localStorage.setItem(`${STORAGE_PREFIX}${table}_${userId}`, JSON.stringify(data));
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    const local = localStorage.getItem(`${STORAGE_PREFIX}${table}_${userId}`);
    return local ? JSON.parse(local) : defaultValue;
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
