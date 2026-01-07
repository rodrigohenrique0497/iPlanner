
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type ThemeType = 'light' | 'dark' | 'rosa' | 'azul';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string;
  description?: string;
  dueDate: string; 
  reminder?: string; 
  scheduledHour?: number; 
  notified?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
  color: string;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  lastCompleted?: string; 
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  progress: number; 
  type: 'monthly' | 'annual';
  completed: boolean;
}

export type FinanceCategory = 'Salário' | 'Casa' | 'Assinatura' | 'Parcela' | 'Reserva' | 'Lazer' | 'Alimentação' | 'Outros';

export interface FinanceTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: FinanceCategory;
  date: string;
  installments?: {
    current: number;
    total: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  focusGoal: string;
  theme: ThemeType;
  dailyEnergy?: Record<string, number>;
  categories: string[];
}

export type ViewState = 
  | 'dashboard' 
  | 'daily' 
  | 'weekly' 
  | 'calendar'
  | 'monthly' 
  | 'annual' 
  | 'tasks' 
  | 'habits' 
  | 'notes'
  | 'finance'
  | 'insights' 
  | 'settings';

export interface AIPlanResponse {
  insight: string;
  tasks: {
    title: string;
    description: string;
    priority: string;
    category: string;
    estimatedDuration: string;
  }[];
}
