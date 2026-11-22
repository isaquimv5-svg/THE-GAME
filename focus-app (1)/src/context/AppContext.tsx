import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, PlanGoal, HabitsState, UserProfile, DayPerformance, PriorityLevel, TaskCategory } from '../types';
import { Storage } from '../utils/storage';
import { getTodayDateString } from '../utils/date';

export type TabType = 'today' | 'plan' | 'tasks' | 'habits' | 'monthly' | 'profile';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tasks: Task[];
  habits: HabitsState;
  plan: PlanGoal;
  profile: UserProfile;
  monthlyPerformance: Record<string, DayPerformance>;
  
  // Task Actions
  toggleTask: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Plan Actions
  togglePlanStep: (stepId: string) => void;
  updatePlan: (updates: Partial<PlanGoal>) => void;
  
  // Habits Actions
  toggleMeal: (mealKey: keyof HabitsState['meals']) => void;
  updateWater: (liters: number) => void;
  updateSleep: (hours: number) => void;
  updateWorkout: (minutes: number) => void;
  updateReading: (minutes: number) => void;
  setNightReview: (completed: boolean) => void;
  
  // Profile Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Calendar Actions
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  setDayStatus: (dateStr: string, status: 'complete' | 'partial' | 'incomplete' | null) => void;
  cycleDayStatus: (dateStr: string) => void;
  clearMonthData: (year: number, monthIndex: number) => void;
  clearMonthlyPerformance: () => void;
  
  // Focus Mode
  isFocusModalOpen: boolean;
  setIsFocusModalOpen: (open: boolean) => void;
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;
  recordFocusTime: (minutes: number) => void;
  
  // Modals
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  isNightReviewModalOpen: boolean;
  setIsNightReviewModalOpen: (open: boolean) => void;
  activeHabitModal: 'water' | 'sleep' | 'workout' | 'reading' | null;
  setActiveHabitModal: (habit: 'water' | 'sleep' | 'workout' | 'reading' | null) => void;
  
  // Computed metrics
  todayCompletedTasksCount: number;
  todayTotalTasksCount: number;
  todayProgressPercentage: number;
  planCompletedStepsCount: number;
  planTotalStepsCount: number;
  planProgressPercentage: number;
  mealsCompletedCount: number;
  mealsPercentage: number;
  weeklyCompletedTasksCount: number;
  resetAllData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [tasks, setTasks] = useState<Task[]>(Storage.getTasks());
  const [habits, setHabits] = useState<HabitsState>(Storage.getHabits());
  const [plan, setPlan] = useState<PlanGoal>(Storage.getPlan());
  const [profile, setProfile] = useState<UserProfile>(Storage.getProfile());
  const [monthlyPerformance, setMonthlyPerformance] = useState<Record<string, DayPerformance>>(Storage.getMonthlyPerformance());
  
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  
  // Modals state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isNightReviewModalOpen, setIsNightReviewModalOpen] = useState(false);
  const [activeHabitModal, setActiveHabitModal] = useState<'water' | 'sleep' | 'workout' | 'reading' | null>(null);
  
  // Focus Mode
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Sync state changes with storage
  const syncTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    Storage.setTasks(newTasks);
    
    // Automatically update today's performance in monthly calendar if tasks exist
    const todayStr = getTodayDateString();
    const todayTasks = newTasks.filter(t => t.date === todayStr || t.recurring);
    if (todayTasks.length > 0) {
      const completed = todayTasks.filter(t => t.completed);
      const percentage = Math.round((completed.length / todayTasks.length) * 100);
      
      let status: 'complete' | 'partial' | 'incomplete' = 'incomplete';
      if (percentage >= 80) status = 'complete';
      else if (percentage >= 35) status = 'partial';
      
      const updatedPerformance = {
        ...monthlyPerformance,
        [todayStr]: {
          date: todayStr,
          status,
          percentage,
          completedTaskIds: completed.map(t => t.id),
          missingTaskIds: todayTasks.filter(t => !t.completed).map(t => t.id),
          completedHabitIds: [],
        }
      };
      setMonthlyPerformance(updatedPerformance);
      Storage.setMonthlyPerformance(updatedPerformance);
    }
  };

  // Automatic midnight and daily rollover check
  useEffect(() => {
    const checkRollover = () => {
      const todayStr = getTodayDateString();
      const lastDate = localStorage.getItem('focus_last_active_date_v3');

      if (lastDate && lastDate !== todayStr) {
        // Midnight passed / A new day arrived!
        // 1. Ensure previous day's performance is archived in monthly calendar
        const dateTasks = tasks.filter(t => t.date === lastDate || t.recurring);
        if (dateTasks.length > 0 && !monthlyPerformance[lastDate]) {
          const completed = dateTasks.filter(t => t.completed);
          const percentage = Math.round((completed.length / dateTasks.length) * 100);
          let status: 'complete' | 'partial' | 'incomplete' = 'incomplete';
          if (percentage >= 80) status = 'complete';
          else if (percentage >= 35) status = 'partial';

          const nextPerf = {
            ...monthlyPerformance,
            [lastDate]: {
              date: lastDate,
              status,
              percentage,
              completedTaskIds: completed.map(t => t.id),
              missingTaskIds: dateTasks.filter(t => !t.completed).map(t => t.id),
              completedHabitIds: [],
            }
          };
          setMonthlyPerformance(nextPerf);
          Storage.setMonthlyPerformance(nextPerf);
        }

        // 2. Reset daily recurring tasks & habits for the fresh new day
        const resetTasks = tasks.map(t => (t.recurring ? { ...t, completed: false } : t));
        setTasks(resetTasks);
        Storage.setTasks(resetTasks);

        const resetHabits: HabitsState = {
          ...habits,
          meals: {
            breakfast: false,
            morningSnack: false,
            lunch: false,
            afternoonSnack: false,
            dinner: false,
          },
          water: { ...habits.water, current: 0 },
          sleep: { ...habits.sleep, current: 0 },
          workout: { ...habits.workout, current: 0 },
          reading: { ...habits.reading, current: 0 },
          nightReviewCompleted: false,
        };
        setHabits(resetHabits);
        Storage.setHabits(resetHabits);
      }

      localStorage.setItem('focus_last_active_date_v3', todayStr);
    };

    checkRollover();
    // Check every 30 seconds for midnight transition
    const interval = setInterval(checkRollover, 30000);
    document.addEventListener('visibilitychange', checkRollover);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', checkRollover);
    };
  }, [tasks, habits, monthlyPerformance]);

  const syncPlan = (newPlan: PlanGoal) => {
    setPlan(newPlan);
    Storage.setPlan(newPlan);
  };

  const syncHabits = (newHabits: HabitsState) => {
    setHabits(newHabits);
    Storage.setHabits(newHabits);
  };

  const syncProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    Storage.setProfile(newProfile);
  };

  // Task methods
  const toggleTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    syncTasks(updated);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    syncTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    syncTasks(updated);
  };

  const deleteTask = (id: string) => {
    const filtered = tasks.filter(t => t.id !== id);
    syncTasks(filtered);
  };

  // Plan methods
  const togglePlanStep = (stepId: string) => {
    const updatedSteps = plan.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });
    syncPlan({ ...plan, steps: updatedSteps });
  };

  const updatePlan = (updates: Partial<PlanGoal>) => {
    syncPlan({ ...plan, ...updates });
  };

  // Habits methods
  const toggleMeal = (mealKey: keyof HabitsState['meals']) => {
    const nextMeals = {
      ...habits.meals,
      [mealKey]: !habits.meals[mealKey],
    };
    syncHabits({
      ...habits,
      meals: nextMeals,
    });
  };

  const updateWater = (liters: number) => {
    syncHabits({
      ...habits,
      water: { ...habits.water, current: Math.max(0, parseFloat(liters.toFixed(1))) },
    });
  };

  const updateSleep = (hours: number) => {
    syncHabits({
      ...habits,
      sleep: { ...habits.sleep, current: Math.max(0, parseFloat(hours.toFixed(1))) },
    });
  };

  const updateWorkout = (minutes: number) => {
    syncHabits({
      ...habits,
      workout: { ...habits.workout, current: Math.max(0, Math.round(minutes)) },
    });
  };

  const updateReading = (minutes: number) => {
    syncHabits({
      ...habits,
      reading: { ...habits.reading, current: Math.max(0, Math.round(minutes)) },
    });
  };

  const setNightReview = (completed: boolean) => {
    syncHabits({
      ...habits,
      nightReviewCompleted: completed,
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    syncProfile({ ...profile, ...updates });
  };

  const recordFocusTime = (minutes: number) => {
    const hours = minutes / 60;
    syncProfile({
      ...profile,
      focusHoursWeekly: parseFloat((profile.focusHoursWeekly + hours).toFixed(1)),
    });
  };

  // Calendar Day Status Actions (Direct toggle by user)
  const setDayStatus = (dateStr: string, status: 'complete' | 'partial' | 'incomplete' | null) => {
    const nextPerf = { ...monthlyPerformance };
    if (!status) {
      delete nextPerf[dateStr];
    } else {
      const pct = status === 'complete' ? 100 : status === 'partial' ? 60 : 20;
      nextPerf[dateStr] = {
        date: dateStr,
        status,
        percentage: pct,
        completedTaskIds: nextPerf[dateStr]?.completedTaskIds || [],
        missingTaskIds: nextPerf[dateStr]?.missingTaskIds || [],
        completedHabitIds: nextPerf[dateStr]?.completedHabitIds || [],
      };
    }
    setMonthlyPerformance(nextPerf);
    Storage.setMonthlyPerformance(nextPerf);
  };

  const cycleDayStatus = (dateStr: string) => {
    const current = monthlyPerformance[dateStr];
    let nextStatus: 'complete' | 'partial' | 'incomplete' | null = null;
    if (!current) {
      nextStatus = 'complete';
    } else if (current.status === 'complete') {
      nextStatus = 'partial';
    } else if (current.status === 'partial') {
      nextStatus = 'incomplete';
    } else if (current.status === 'incomplete') {
      nextStatus = null;
    }
    setDayStatus(dateStr, nextStatus);
  };

  const clearMonthData = (year: number, monthIndex: number) => {
    const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}-`;
    const nextPerf: Record<string, DayPerformance> = {};
    Object.keys(monthlyPerformance).forEach((key) => {
      if (!key.startsWith(monthPrefix)) {
        nextPerf[key] = monthlyPerformance[key];
      }
    });
    setMonthlyPerformance(nextPerf);
    Storage.setMonthlyPerformance(nextPerf);
  };

  const clearMonthlyPerformance = () => {
    setMonthlyPerformance({});
    Storage.clearMonthlyPerformance();
  };

  // Computed metrics (clean calculations)
  const todayStr = getTodayDateString();
  const todayTasks = tasks.filter(t => t.date === todayStr || t.recurring);
  const todayCompletedTasksCount = todayTasks.filter(t => t.completed).length;
  const todayTotalTasksCount = todayTasks.length;
  const todayProgressPercentage = todayTotalTasksCount > 0
    ? Math.round((todayCompletedTasksCount / todayTotalTasksCount) * 100)
    : 0;

  const planCompletedStepsCount = plan.steps.filter(s => s.completed).length;
  const planTotalStepsCount = plan.steps.length || 5;
  const planProgressPercentage = Math.round((planCompletedStepsCount / planTotalStepsCount) * 100);

  const mealValues = Object.values(habits.meals);
  const mealsCompletedCount = mealValues.filter(Boolean).length;
  const mealsPercentage = Math.round((mealsCompletedCount / 5) * 100);

  const weeklyCompletedTasksCount = tasks.filter(t => t.completed).length;

  const resetAllData = () => {
    Storage.clearAllData();
  };

  const clearAllData = () => {
    Storage.clearAllData();
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        habits,
        plan,
        profile,
        monthlyPerformance,
        toggleTask,
        addTask,
        updateTask,
        deleteTask,
        togglePlanStep,
        updatePlan,
        toggleMeal,
        updateWater,
        updateSleep,
        updateWorkout,
        updateReading,
        setNightReview,
        updateProfile,
        selectedDate,
        setSelectedDate,
        setDayStatus,
        cycleDayStatus,
        clearMonthData,
        clearMonthlyPerformance,
        isFocusModalOpen,
        setIsFocusModalOpen,
        activeFocusTask,
        setActiveFocusTask,
        recordFocusTime,
        editingTask,
        setEditingTask,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        isNightReviewModalOpen,
        setIsNightReviewModalOpen,
        activeHabitModal,
        setActiveHabitModal,
        todayCompletedTasksCount,
        todayTotalTasksCount,
        todayProgressPercentage,
        planCompletedStepsCount,
        planTotalStepsCount,
        planProgressPercentage,
        mealsCompletedCount,
        mealsPercentage,
        weeklyCompletedTasksCount,
        resetAllData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
