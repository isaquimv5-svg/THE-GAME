import { Task, PlanGoal, HabitsState, UserProfile, DayPerformance } from '../types';

const STORAGE_KEYS = {
  TASKS: 'focus_app_tasks_v3',
  PLAN: 'focus_app_plan_v3',
  HABITS: 'focus_app_habits_v3',
  PROFILE: 'focus_app_profile_v3',
  PERFORMANCE: 'focus_app_performance_v3',
  FOCUS_HISTORY: 'focus_app_focus_history_v3',
};

// Automatic cleanup of legacy cached versions so the app starts 100% clean
try {
  const legacyKeys = [
    'focus_app_tasks_v1',
    'focus_app_tasks_v2',
    'focus_app_plan_v1',
    'focus_app_plan_v2',
    'focus_app_habits_v1',
    'focus_app_habits_v2',
    'focus_app_performance_v1',
    'focus_app_performance_v2',
    'focus_app_profile_v1',
    'focus_app_profile_v2',
  ];
  legacyKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
} catch {
  // Ignore in SSR / restricted iframe environments
}

export const DEFAULT_AVATAR = '/avatar.png';

export const INITIAL_PROFILE: UserProfile = {
  name: 'Isaqui',
  quote: 'Disciplina hoje, liberdade amanhã.',
  avatarUrl: DEFAULT_AVATAR,
  dailyGoal: 'Manter o foco e seguir minha rotina.',
  streakDays: 0,
  focusHoursWeekly: 0,
  morningRoutine: '06:30 - Água, meditação e planejamento rápido.',
  bedtime: '23:00 - Desconexão de telas às 22:30.',
  notificationsEnabled: true,
  focusSessionDuration: 25,
};

// Starts completely clean with no pre-checked tasks
export const INITIAL_TASKS: Task[] = [];

export const INITIAL_PLAN: PlanGoal = {
  id: 'goal-main-1',
  title: 'Aumentar minha produtividade e consistência.',
  deadline: 'Até 31 de dezembro de 2026',
  targetDescription: 'Alcançar um sistema de vida com alta clareza, saúde blindada e execução diária.',
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Organizar rotina',
      description: 'Definir minha rotina base e horários principais.',
      completed: false,
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Padronizar hábitos',
      description: 'Estabelecer hábitos essenciais e mantê-los.',
      completed: false,
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Executar com constância',
      description: 'Colocar o plano em prática todos os dias.',
      completed: false,
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Revisar resultados',
      description: 'Analisar meu progresso regularmente.',
      completed: false,
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Ajustar e evoluir',
      description: 'Fazer melhorias e elevar o nível.',
      completed: false,
    },
  ],
  weeklyTarget: {
    target: 5,
    description: 'tarefas concluídas',
  },
  dailyTarget: {
    target: 5,
    description: 'tarefas concluídas',
  },
};

// Clean habits: all unchecked, values at 0
export const INITIAL_HABITS: HabitsState = {
  meals: {
    breakfast: false,
    morningSnack: false,
    lunch: false,
    afternoonSnack: false,
    dinner: false,
  },
  water: {
    current: 0,
    goal: 2.0,
  },
  sleep: {
    current: 0,
    goal: 8.0,
  },
  workout: {
    current: 0,
    goal: 45,
  },
  reading: {
    current: 0,
    goal: 30,
  },
  nightReviewCompleted: false,
};

// Starts completely empty: no fake dots on past days
export const INITIAL_MONTHLY_PERFORMANCE: Record<string, DayPerformance> = {};

export const Storage = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  setTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      window.dispatchEvent(new Event('focus_tasks_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  getPlan: (): PlanGoal => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(INITIAL_PLAN));
        return INITIAL_PLAN;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PLAN;
    }
  },

  setPlan: (plan: PlanGoal): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
      window.dispatchEvent(new Event('focus_plan_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  getHabits: (): HabitsState => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
        return INITIAL_HABITS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  },

  setHabits: (habits: HabitsState): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      window.dispatchEvent(new Event('focus_habits_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
        return INITIAL_PROFILE;
      }
      const parsed = JSON.parse(data);
      if (!parsed.avatarUrl || parsed.avatarUrl.includes('isaqui_avatar_3d')) {
        parsed.avatarUrl = DEFAULT_AVATAR;
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_PROFILE;
    }
  },

  setProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      window.dispatchEvent(new Event('focus_profile_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  getMonthlyPerformance: (): Record<string, DayPerformance> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERFORMANCE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PERFORMANCE, JSON.stringify(INITIAL_MONTHLY_PERFORMANCE));
        return INITIAL_MONTHLY_PERFORMANCE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MONTHLY_PERFORMANCE;
    }
  },

  setMonthlyPerformance: (data: Record<string, DayPerformance>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERFORMANCE, JSON.stringify(data));
      window.dispatchEvent(new Event('focus_performance_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  clearMonthlyPerformance: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERFORMANCE, JSON.stringify(INITIAL_MONTHLY_PERFORMANCE));
      window.dispatchEvent(new Event('focus_performance_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  clearMonthPerformance: (year: number, monthIndex: number): void => {
    try {
      const current = Storage.getMonthlyPerformance();
      const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}-`;
      const filtered: Record<string, DayPerformance> = {};
      Object.keys(current).forEach((key) => {
        if (!key.startsWith(monthPrefix)) {
          filtered[key] = current[key];
        }
      });
      Storage.setMonthlyPerformance(filtered);
    } catch (e) {
      console.error(e);
    }
  },

  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      // Remove any legacy keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('focus_app_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  },

  resetToDefault: (): void => {
    Storage.clearAllData();
  },
};
