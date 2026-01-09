
import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewState, User, Habit, Goal, Note, FinanceTransaction } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import DailyView from './components/DailyView';
import TaskList from './components/TaskList';
import Auth from './components/Auth';
import HabitTracker from './components/HabitTracker';
import NotesView from './components/NotesView';
import FinanceView from './components/FinanceView';
import Insights from './components/Insights';
import Settings from './components/Settings';
import WeeklyView from './components/WeeklyView';
import GoalView from './components/GoalView';
import FocusTimer from './components/FocusTimer';
import CalendarView from './components/CalendarView';
import { db } from './services/databaseService';
import { supabase } from './lib/supabase';
import { notificationService } from './services/notificationService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeTimer, setActiveTimer] = useState<boolean>(false);

  // Monitora tarefas para agendar notificações
  useEffect(() => {
    tasks.forEach(task => {
      if (task.reminder && !task.completed && !task.notified) {
        const [hours, minutes] = task.reminder.split(':').map(Number);
        const reminderDate = new Date(task.dueDate);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        if (reminderDate > new Date()) {
          notificationService.scheduleNotification(task.title, reminderDate, task.id);
        }
      }
    });
  }, [tasks]);

  const loadUserContent = useCallback(async (userId: string) => {
    try {
      const [t, h, g, n, f] = await Promise.all([
        db.loadData('tasks', []),
        db.loadData('habits', []),
        db.loadData('goals', []),
        db.loadData('notes', []),
        db.loadData('finance', [])
      ]);
      setTasks(t);
      setHabits(h);
      setGoals(g);
      setNotes(n);
      setTransactions(f);
      const profile = await db.loadProfile();
      if (profile) setCurrentUser(profile);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserContent(session.user.id);
      setIsReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserContent(session.user.id);
      else setCurrentUser(null);
    });
    return () => subscription.unsubscribe();
  }, [loadUserContent]);

  useEffect(() => {
    if (!currentUser || !isReady) return;
    const sync = async () => {
      await Promise.all([
        db.saveData('tasks', tasks),
        db.saveData('habits', habits),
        db.saveData('goals', goals),
        db.saveData('notes', notes),
        db.saveData('finance', transactions),
        db.saveUser(currentUser)
      ]);
    };
    const timeout = setTimeout(sync, 2000);
    return () => clearTimeout(timeout);
  }, [tasks, habits, goals, notes, transactions, currentUser, isReady]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    setTasks(prev => [{ ...taskData, id: crypto.randomUUID() }, ...prev]);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser!} setView={setView} />;
      case 'daily': return <DailyView date={selectedDate} tasks={tasks.filter(t => t.dueDate === selectedDate)} onToggle={toggleTask} onSetEnergy={(level) => setCurrentUser(u => u ? {...u, dailyEnergy: {...u.dailyEnergy, [selectedDate]: level}} : null)} currentEnergy={currentUser?.dailyEnergy?.[selectedDate] || 0} onStartFocus={() => setActiveTimer(true)} onSchedule={(id, h) => setTasks(prev => prev.map(t => t.id === id ? {...t, scheduledHour: h === -1 ? undefined : h} : t))} onAddTask={addTask} setView={setView} />;
      case 'tasks': return <TaskList tasks={tasks} onToggle={toggleTask} onDelete={(id) => setTasks(p => p.filter(t => t.id !== id))} onAdd={addTask} userCategories={currentUser!.categories} onUpdateCategories={(cats) => setCurrentUser(u => u ? {...u, categories: cats} : null)} onNavigate={(d) => { setSelectedDate(d); setView('daily'); }} />;
      case 'habits': return <HabitTracker habits={habits} onToggle={(id) => setHabits(p => p.map(h => h.id === id ? {...h, streak: h.streak + 1, lastCompleted: new Date().toISOString().split('T')[0]} : h))} onAdd={(h) => setHabits(p => [h, ...p])} onDelete={(id) => setHabits(p => p.filter(h => h.id !== id))} />;
      case 'notes': return <NotesView notes={notes} onAdd={(n) => setNotes(p => [n, ...p])} onUpdate={(id, up) => setNotes(p => p.map(n => n.id === id ? {...n, ...up} : n))} onDelete={(id) => setNotes(p => p.filter(n => n.id !== id))} />;
      case 'finance': return <FinanceView transactions={transactions} onAdd={(t) => setTransactions(p => [t, ...p])} onDelete={(id) => setTransactions(p => p.filter(t => t.id !== id))} />;
      case 'calendar': return <CalendarView tasks={tasks} onToggle={toggleTask} onNavigate={(d) => { setSelectedDate(d); setView('daily'); }} setView={setView} />;
      case 'weekly': return <WeeklyView tasks={tasks} onToggle={toggleTask} onNavigate={(d) => { setSelectedDate(d); setView('daily'); }} setView={setView} />;
      case 'insights': return <Insights tasks={tasks} habits={habits} user={currentUser!} />;
      case 'settings': return <Settings user={currentUser!} onUpdate={(up) => setCurrentUser(u => u ? {...u, ...up} : null)} onLogout={() => db.signOut()} onExport={() => {}} />;
      default: return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser!} setView={setView} />;
    }
  };

  if (!isReady) return <div className="min-h-screen bg-theme-bg flex items-center justify-center"><div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div></div>;
  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  return (
    <div className="flex min-h-screen bg-theme-bg relative">
      <Sidebar currentView={view} setView={setView} user={currentUser} onLogout={() => db.signOut()} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto relative pb-32">
        <div className="md:hidden px-6 py-4 flex justify-between items-center sticky top-0 z-50 glass-header-mobile">
          <h1 className="text-2xl font-black text-theme-text tracking-tighter">iPlanner</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-theme-card/40 border border-theme-border/20"><span className="material-symbols-outlined">menu</span></button>
        </div>
        {renderView()}
      </main>
      <MobileNav currentView={view} setView={setView} />
      {activeTimer && <FocusTimer onClose={() => setActiveTimer(false)} onComplete={() => setActiveTimer(false)} />}
    </div>
  );
};

export default App;
