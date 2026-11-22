export type PriorityLevel = 'Alta' | 'Média' | 'Baixa';

// Optional so previously saved tasks remain readable without migration.
export type TaskWorkspace = 'Geral' | 'GF ATAKAREJO' | 'MTR7 Imports' | 'Pessoal';

export type TaskCategory = 
  | 'Trabalho' 
  | 'Saúde' 
  | 'Alimentação' 
  | 'Pessoal' 
  | 'Estudo' 
  | 'Planejamento'
  | 'Outros';

export interface Task {
  id: string;
  title: string;
  description: string;
  workspace?: TaskWorkspace;
  routineBlockId?: string; // Optional time block; old tasks remain unassigned
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:00", "14:00", "Todo o dia"
  completed: boolean;
  completedAt?: string;
  category: TaskCategory;
  priority: PriorityLevel;
  recurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'weekdays';
  important?: boolean;
  isTopPriority?: boolean; // Top 3 priorities
  createdAt: string;
  updatedAt: string;
}

export interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface PlanGoal {
  id: string;
  title: string;
  deadline: string;
  targetDescription?: string;
  steps: PlanStep[];
  weeklyTarget: {
    target: number;
    description: string;
  };
  dailyTarget: {
    target: number;
    description: string;
  };
}

export interface HabitMeals {
  breakfast: boolean; // Café da manhã
  morningSnack: boolean; // Lanche da manhã
  lunch: boolean; // Almoço
  afternoonSnack: boolean; // Lanche da tarde
  dinner: boolean; // Jantar
}

export interface HabitItem {
  id: string;
  name: string;
  type: 'counter' | 'boolean' | 'meals' | 'duration';
  goal: number;
  currentValue: number;
  unit: string;
  category: string;
}

export interface HabitsState {
  meals: HabitMeals;
  water: {
    current: number; // liters
    goal: number;
  };
  sleep: {
    current: number; // hours
    goal: number;
  };
  workout: {
    current: number; // minutes
    goal: number;
  };
  reading: {
    current: number; // minutes
    goal: number;
  };
  nightReviewCompleted: boolean;
}

export interface DayPerformance {
  date: string; // YYYY-MM-DD
  status: 'complete' | 'partial' | 'incomplete';
  completedTaskIds: string[];
  missingTaskIds: string[];
  completedHabitIds: string[];
  percentage: number;
}

export interface UserProfile {
  name: string;
  quote: string;
  avatarUrl: string;
  dailyGoal: string;
  streakDays: number;
  focusHoursWeekly: number;
  morningRoutine: string;
  bedtime: string;
  notificationsEnabled: boolean;
  focusSessionDuration: number; // in minutes
}
