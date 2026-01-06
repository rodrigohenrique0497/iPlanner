import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewState, Priority, User, Habit, Goal, Note, FinanceTransaction } from './types';
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
// Imported AIPlanner to integrate the iCoach feature
import AIPlanner from './components/AIPlanner';
import { db } from './services/databaseService';
import { supabase } from './lib/supabase';

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

  const loadUserContent = useCallback(async (userId: string) => {
    try {
      const profile = await db.loadProfile();
      if (profile) setCurrentUser(profile);

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
    } catch (e) {
      console.error("Erro ao carregar dados da nuvem:", e);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserContent(session.user.id);
      } else {
        document.body.className = `theme-${db.getGlobalTheme()}`;
      }
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserContent(session.user.id);
      } else {
        setCurrentUser(null);
        document.body.className = `theme-${db.getGlobalTheme()}`;
      }
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
      db.setSession(currentUser);
    };

    const timeout = setTimeout(sync, 1000); 
    return () => clearTimeout(timeout);
  }, [tasks, habits, goals, notes, transactions, currentUser, isReady]);

  useEffect(() => {
    document.body.className = `theme-${currentUser?.theme || db.getGlobalTheme()}`;
  }, [currentUser?.theme]);

  const addXP = (amount: number) => {
    if (!currentUser) return;
    const newXP = currentUser.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    handleUpdateProfile({ xp: newXP, level: newLevel });
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: crypto.randomUUID() };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) addXP(20);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const scheduleTask = (taskId: string, hour: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, scheduledHour: hour === -1 ? undefined : hour } : t));
  };

  const navigateToDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setView('daily');
  };

  const handleLogout = () => {
    db.signOut();
    setCurrentUser(null);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={(user) => {
      setCurrentUser(user);
      loadUserContent(user.id);
    }} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser} setView={setView} />;
      case 'daily': return <DailyView date={selectedDate} tasks={tasks.filter(t => t.dueDate === selectedDate)} onToggle={toggleTask} onSetEnergy={(level) => { const currentEnergies = currentUser.dailyEnergy || {}; handleUpdateProfile({ dailyEnergy: { ...currentEnergies, [selectedDate]: level } }); addXP(10); }} currentEnergy={currentUser.dailyEnergy?.[selectedDate] || 0} onStartFocus={() => setActiveTimer(true)} onSchedule={scheduleTask} onAddTask={addTask} setView={setView} />;
      case 'tasks': return <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onAdd={addTask} userCategories={currentUser.categories} onUpdateCategories={(cats) => handleUpdateProfile({ categories: cats })} onNavigate={navigateToDate} />;
      case 'habits': return <HabitTracker habits={habits} onToggle={(id) => { const today = new Date().toISOString().split('T')[0]; setHabits(prev => prev.map(h => { if (h.id === id && h.lastCompleted !== today) { addXP(15); return { ...h, streak: h.streak + 1, lastCompleted: today }; } return h; })); }} onAdd={(h) => setHabits(prev => [h, ...prev])} onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))} />;
      case 'notes': return <NotesView notes={notes} onAdd={(n) => setNotes(prev => [n, ...prev])} onUpdate={(id, up) => setNotes(prev => prev.map(n => n.id === id ? { ...n, ...up } : n))} onDelete={(id) => setNotes(prev => prev.filter(n => n.id !== id))} />;
      case 'finance': return <FinanceView transactions={transactions} onAdd={(t) => setTransactions(prev => [t, ...prev])} onDelete={(id) => setTransactions(prev => prev.filter(t => t.id !== id))} />;
      case 'calendar': return <CalendarView tasks={tasks} onToggle={toggleTask} onNavigate={navigateToDate} setView={setView} />;
      case 'weekly': return <WeeklyView tasks={tasks} onToggle={toggleTask} onNavigate={navigateToDate} setView={setView} />;
      case 'monthly':
      case 'annual': return <GoalView type={view === 'monthly' ? 'monthly' : 'annual'} goals={goals.filter(g => g.type === (view === 'monthly' ? 'monthly' : 'annual'))} onAdd={(g) => setGoals(prev => [g, ...prev])} onUpdate={setGoals} />;
      case 'insights': return <Insights tasks={tasks} habits={habits} user={currentUser} />;
      case 'ai-planner': return (
        <AIPlanner 
          onAddTasks={(newTasks) => { 
            const tasksWithIds = newTasks.map(t => ({ ...t, id: crypto.randomUUID() }));
            setTasks(prev => [...tasksWithIds, ...prev]); 
            setView('tasks'); 
            addXP(100); 
          }} 
        />
      );
      case 'settings': return <Settings user={currentUser} onUpdate={handleUpdateProfile} onLogout={handleLogout} onExport={() => {}} />;
      default: return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser} setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-theme-bg overflow-hidden relative">
      <Sidebar currentView={view} setView={setView} user={currentUser} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto no-scrollbar relative md:pb-0 pb-32">
        <div className="md:hidden p-6 flex justify-between items-center sticky top-0 bg-theme-bg/80 backdrop-blur-md z-50">
           <h1 className="text-2xl font-black text-theme-text tracking-tighter">iPlanner</h1>
           <button 
             onClick={() => setIsSidebarOpen(true)} 
             className="w-14 h-14 flex items-center justify-center rounded-2xl bg-theme-card border border-theme-border shadow-sm active:scale-95 transition-transform"
           >
             <span className="material-symbols-outlined !text-3xl leading-none flex items-center justify-center">menu</span>
           </button>
        </div>
        {renderView()}
      </main>
      <MobileNav currentView={view} setView={setView} />
      {activeTimer && <FocusTimer onClose={() => setActiveTimer(false)} onComplete={() => { addXP(50); setActiveTimer(false); }} />}
    </div>
  );
};

export default App;