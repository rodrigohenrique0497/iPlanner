import { Task, Habit, Goal, Note, FinanceTransaction, User } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_PREFIX = 'iplanner_session_';

const mappers = {
  task: (t: any) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    priority: t.priority,
    category: t.category,
    description: t.description,
    due_date: t.dueDate,
    scheduled_hour: t.scheduledHour,
    notified: t.notified
  }),
  habit: (h: any) => ({
    id: h.id,
    title: h.title,
    streak: h.streak,
    last_completed: h.lastCompleted,
    color: h.color
  }),
  goal: (g: any) => ({
    id: g.id,
    title: g.title,
    target_date: g.targetDate,
    progress: g.progress,
    type: g.type,
    completed: g.completed
  }),
  note: (n: any) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    last_edited: n.lastEdited,
    color: n.color
  }),
  finance: (f: any) => ({
    id: f.id,
    description: f.description,
    amount: f.amount,
    type: f.type,
    category: f.category,
    date: f.date,
    installments: f.installments
  })
};

const reverseMappers = {
  task: (row: any): Task => ({
    id: row.id,
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    category: row.category,
    description: row.description,
    dueDate: row.due_date,
    scheduledHour: row.scheduled_hour,
    notified: row.notified
  }),
  habit: (row: any): Habit => ({
    id: row.id,
    title: row.title,
    streak: row.streak,
    lastCompleted: row.last_completed,
    color: row.color
  }),
  goal: (row: any): Goal => ({
    id: row.id,
    title: row.title,
    targetDate: row.target_date,
    progress: row.progress,
    type: row.type,
    completed: row.completed
  }),
  note: (row: any): Note => ({
    id: row.id,
    title: row.title,
    content: row.content,
    lastEdited: row.last_edited,
    color: row.color
  }),
  finance: (row: any): FinanceTransaction => ({
    id: row.id,
    description: row.description,
    amount: row.amount,
    type: row.type,
    category: row.category,
    date: row.date,
    installments: row.installments
  })
};

export const db = {
  signUp: async (email: string, pass: string, name: string) => {
    if (!supabase) throw new Error("Supabase não inicializado.");
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } }
    });
    if (error) throw error;
    return data.user ? { id: data.user.id, email: data.user.email, name } : null;
  },

  signIn: async (email: string, pass: string) => {
    if (!supabase) throw new Error("Supabase não inicializado.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data.user ? { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name } : null;
  },

  signOut: async () => {
    if (supabase) await supabase.auth.signOut();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
    });
  },

  setSession: (user: User | null) => {
    if (user) localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
    else localStorage.removeItem(`${STORAGE_PREFIX}user`);
  },

  getSession: (): User | null => {
    const session = localStorage.getItem(`${STORAGE_PREFIX}user`);
    try { return session ? JSON.parse(session) : null; } catch { return null; }
  },

  saveUser: async (user: User) => {
    if (!supabase) return;
    const { error } = await supabase.from('profiles').upsert({
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
    if (error) console.error("Erro perfil:", error.message);
  },

  loadProfile: async (userId: string): Promise<User | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
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

  saveData: async (userId: string, table: string, data: any[]) => {
    if (!supabase) return;
    
    // CRÍTICO: Se o array estiver vazio, precisamos deletar no banco para refletir o estado do front
    if (data.length === 0) {
      const { error: delError } = await supabase.from(table).delete().eq('user_id', userId);
      if (delError) console.error(`Erro ao limpar ${table}:`, delError.message);
      return;
    }

    const dataToUpsert = data.map(item => {
      let mapped: any;
      switch(table) {
        case 'tasks': mapped = mappers.task(item); break;
        case 'habits': mapped = mappers.habit(item); break;
        case 'goals': mapped = mappers.goal(item); break;
        case 'notes': mapped = mappers.note(item); break;
        case 'finance': mapped = mappers.finance(item); break;
        default: mapped = { ...item };
      }
      return { ...mapped, user_id: userId };
    });

    const { error } = await supabase.from(table).upsert(dataToUpsert);
    if (error) console.error(`Erro sync ${table}:`, error.message);
  },

  loadData: async (userId: string, table: string, defaultValue: any) => {
    if (!supabase) return defaultValue;
    const { data, error } = await supabase.from(table).select('*').eq('user_id', userId);
    if (error || !data) return defaultValue;

    return data.map(row => {
      switch(table) {
        case 'tasks': return reverseMappers.task(row);
        case 'habits': return reverseMappers.habit(row);
        case 'goals': return reverseMappers.goal(row);
        case 'notes': return reverseMappers.note(row);
        case 'finance': return reverseMappers.finance(row);
        default: return row;
      }
    });
  },

  getStorageUsage: () => (supabase ? "Cloud" : "Local")
};