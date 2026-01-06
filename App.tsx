
import React, { useState, useEffect, useCallback } from 'react';
import { Task, ViewState, Priority, User, Habit, Goal, Note, FinanceTransaction } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import DailyView from './components/DailyView';
import AIPlanner from './components/AIPlanner';
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTimer, setActiveTimer] = useState<boolean>(false);

  // Inicializa a sessão
  useEffect(() => {
    const savedUser = db.getSession();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setIsReady(true);
  }, []);

  // Carrega dados de forma assíncrona ao logar
  const loadUserContent = useCallback(async (userId: string) => {
    setIsSyncing(true);
    const [t, h, g, n, f] = await Promise.all([
      db.loadData(userId, 'tasks', []),
      db.loadData(userId, 'habits', []),
      db.loadData(userId, 'goals', []),
      db.loadData(userId, 'notes', []),
      db.loadData(userId, 'finance', [])
    ]);
    setTasks(t);
    setHabits(h);
    setGoals(g);
    setNotes(n);
    setTransactions(f);
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserContent(currentUser.id);
    }
  }, [currentUser?.id, loadUserContent]);

  // Sincronização automática para o "Backend" local
  useEffect(() => {
    const syncData = async () => {
      if (currentUser && isReady) {
        setIsSyncing(true);
        try {
          await Promise.all([
            db.saveData(currentUser.id, 'tasks', tasks),
            db.saveData(currentUser.id, 'habits', habits),
            db.saveData(currentUser.id, 'goals', goals),
            db.saveData(currentUser.id, 'notes', notes),
            db.saveData(currentUser.id, 'finance', transactions),
            db.saveUser(currentUser)
          ]);
          db.setSession(currentUser);
        } catch (e) {
          console.error("Erro na sincronização", e);
        } finally {
          setTimeout(() => setIsSyncing(false), 500);
        }
      }
    };

    const timer = setTimeout(syncData, 1000); 
    return () => clearTimeout(timer);
  }, [tasks, habits, goals, notes, transactions, currentUser, isReady]);

  // Sincroniza o tema com o DOM
  useEffect(() => {
    if (currentUser) {
      document.body.className = `theme-${currentUser.theme}`;
    } else {
      document.body.className = 'theme-light';
    }
  }, [currentUser?.theme]);

  const addXP = (amount: number) => {
    if (!currentUser) return;
    const newXP = currentUser.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    handleUpdateProfile({ xp: newXP, level: newLevel });
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9)
    };
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
    db.setSession(null);
    setCurrentUser(null);
    setView('dashboard');
  };

  if (!isReady) return null;

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser} setView={setView} />;
      case 'daily':
        return (
          <DailyView 
            date={selectedDate} 
            tasks={tasks.filter(t => t.dueDate === selectedDate)}
            onToggle={toggleTask}
            onSetEnergy={(level) => {
              const currentEnergies = currentUser.dailyEnergy || {};
              handleUpdateProfile({ dailyEnergy: { ...currentEnergies, [selectedDate]: level } });
              addXP(10);
            }}
            currentEnergy={currentUser.dailyEnergy?.[selectedDate] || 0}
            onStartFocus={() => setActiveTimer(true)}
            onSchedule={scheduleTask}
            onAddTask={addTask}
          />
        );
      case 'tasks':
        return (
          <TaskList 
            tasks={tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
            onAdd={addTask}
            userCategories={currentUser.categories}
            onUpdateCategories={(cats) => handleUpdateProfile({ categories: cats })}
            onNavigate={navigateToDate}
          />
        );
      case 'habits':
        return (
          <HabitTracker 
            habits={habits} 
            onToggle={(id) => {
              const today = new Date().toISOString().split('T')[0];
              setHabits(prev => prev.map(h => {
                if (h.id === id && h.lastCompleted !== today) {
                  addXP(15);
                  return { ...h, streak: h.streak + 1, lastCompleted: today };
                }
                return h;
              }));
            }}
            onAdd={(h) => setHabits(prev => [h, ...prev])}
            onDelete={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
          />
        );
      case 'notes':
        return (
          <NotesView 
            notes={notes} 
            onAdd={(n) => setNotes(prev => [n, ...prev])}
            onUpdate={(id, up) => setNotes(prev => prev.map(n => n.id === id ? { ...n, ...up } : n))}
            onDelete={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
          />
        );
      case 'finance':
        return (
          <FinanceView 
            transactions={transactions} 
            onAdd={(t) => setTransactions(prev => [t, ...prev])}
            onDelete={(id) => setTransactions(prev => prev.filter(t => t.id !== id))}
          />
        );
      case 'ai-assistant':
        return <AIPlanner onAddTasks={(newTasks) => {
          newTasks.forEach(t => addTask(t));
          setView('tasks');
        }} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onToggle={toggleTask} onNavigate={navigateToDate} />;
      case 'weekly':
        return <WeeklyView tasks={tasks} onToggle={toggleTask} onNavigate={navigateToDate} />;
      case 'monthly':
      case 'annual':
        return (
          <GoalView 
            type={view === 'monthly' ? 'monthly' : 'annual'} 
            goals={goals.filter(g => g.type === (view === 'monthly' ? 'monthly' : 'annual'))}
            onAdd={(g) => setGoals(prev => [g, ...prev])}
            onUpdate={setGoals}
          />
        );
      case 'insights':
        return <Insights tasks={tasks} habits={habits} user={currentUser} />;
      case 'settings':
        return (
          <Settings 
            user={currentUser} 
            onUpdate={handleUpdateProfile} 
            onLogout={handleLogout}
            onExport={() => {}} 
          />
        );
      default:
        return <Dashboard tasks={tasks} habits={habits} goals={goals} user={currentUser} setView={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-theme-bg overflow-hidden relative">
      {/* Indicador de Sync Global */}
      <div className={`fixed top-6 right-10 z-[100] transition-all duration-500 ${isSyncing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-theme-accent/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-2xl border border-white/10">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">Sincronizando...</span>
        </div>
      </div>

      <Sidebar 
        currentView={view} 
        setView={setView} 
        user={currentUser} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto no-scrollbar relative md:pb-0 pb-32">
        {/* Mobile Header */}
        <div className="md:hidden p-6 flex justify-between items-center sticky top-0 bg-theme-bg/80 backdrop-blur-md z-50">
           <h1 className="text-xl font-black text-theme-text tracking-tighter">iPlanner</h1>
           <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-theme-card border border-theme-border shadow-sm">
             <span className="text-xl">☰</span>
           </button>
        </div>

        {renderView()}
      </main>

      <MobileNav currentView={view} setView={setView} />

      {activeTimer && (
        <FocusTimer 
          onClose={() => setActiveTimer(false)} 
          onComplete={() => {
            addXP(50);
            setActiveTimer(false);
          }} 
        />
      )}
    </div>
  );
};

export default App;
