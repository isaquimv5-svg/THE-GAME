import type { TaskWorkspace } from '../types';

export interface RoutineBlock {
  id: string;
  title: string;
  start: string; // HH:mm
  end: string; // HH:mm; the sleep block crosses midnight
  workspace: TaskWorkspace;
  protected: boolean;
}

const STORAGE_KEY = 'focus_app_routine_days_v1';

const WEEKDAY: RoutineBlock[] = [
  { id: 'morning', title: 'Manhã pessoal, Bíblia e café', start: '06:00', end: '08:00', workspace: 'Pessoal', protected: false },
  { id: 'commute-morning', title: 'Deslocamento até a GF', start: '08:00', end: '08:30', workspace: 'Pessoal', protected: true },
  { id: 'gf-morning', title: 'GF — conteúdos e prioridades', start: '08:30', end: '10:30', workspace: 'GF ATAKAREJO', protected: false },
  { id: 'mtr-deep', title: 'MTR7 — trabalho profundo', start: '10:30', end: '12:30', workspace: 'MTR7 Imports', protected: false },
  { id: 'operations', title: 'Mensagens e pendências', start: '12:30', end: '13:00', workspace: 'Geral', protected: false },
  { id: 'lunch', title: 'Almoço e recuperação', start: '13:00', end: '14:30', workspace: 'Pessoal', protected: true },
  { id: 'mtr-afternoon', title: 'MTR7 — execução', start: '14:30', end: '16:30', workspace: 'MTR7 Imports', protected: false },
  { id: 'gf-afternoon', title: 'GF — comercial e fechamento', start: '16:30', end: '18:30', workspace: 'GF ATAKAREJO', protected: false },
  { id: 'commute-evening', title: 'Volta para casa', start: '18:30', end: '19:00', workspace: 'Pessoal', protected: true },
  { id: 'family', title: 'Esposa, casa e jantar', start: '19:00', end: '21:30', workspace: 'Pessoal', protected: true },
  { id: 'wind-down', title: 'Desacelerar e preparar para dormir', start: '21:30', end: '22:00', workspace: 'Pessoal', protected: true },
  { id: 'sleep', title: 'Sono protegido', start: '22:00', end: '06:00', workspace: 'Pessoal', protected: true },
];

const SATURDAY: RoutineBlock[] = [
  { id: 'morning', title: 'Manhã pessoal sem pressa', start: '06:00', end: '09:00', workspace: 'Pessoal', protected: true },
  { id: 'batch', title: 'Gravações em lote — conforme necessidade', start: '09:00', end: '11:00', workspace: 'Geral', protected: false },
  { id: 'family', title: 'Tempo livre, família e descanso', start: '11:00', end: '22:00', workspace: 'Pessoal', protected: true },
  { id: 'sleep', title: 'Sono protegido', start: '22:00', end: '06:00', workspace: 'Pessoal', protected: true },
];

const SUNDAY: RoutineBlock[] = [
  { id: 'morning', title: 'Espiritualidade, café e descanso', start: '06:00', end: '12:00', workspace: 'Pessoal', protected: true },
  { id: 'family', title: 'Família, lazer e recuperação', start: '12:00', end: '21:30', workspace: 'Pessoal', protected: true },
  { id: 'wind-down', title: 'Preparar a semana sem trabalhar', start: '21:30', end: '22:00', workspace: 'Pessoal', protected: true },
  { id: 'sleep', title: 'Sono protegido', start: '22:00', end: '06:00', workspace: 'Pessoal', protected: true },
];

export const ROUTINE_AREAS: TaskWorkspace[] = ['Geral', 'GF ATAKAREJO', 'MTR7 Imports', 'Pessoal'];

export const defaultRoutineForDate = (date: string): RoutineBlock[] => {
  // Midday avoids UTC date rollover for yyyy-mm-dd.
  const day = new Date(date + 'T12:00:00').getDay();
  const template = day === 0 ? SUNDAY : day === 6 ? SATURDAY : WEEKDAY;
  return template.map(block => ({ ...block }));
};

const readOverrides = (): Record<string, RoutineBlock[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, RoutineBlock[]>
      : {};
  } catch {
    return {};
  }
};

export const getRoutineBlocksForDate = (date: string): RoutineBlock[] => {
  const saved = readOverrides()[date];
  if (!Array.isArray(saved)) return defaultRoutineForDate(date);
  return saved
    .filter(block => block && typeof block.id === 'string' && typeof block.start === 'string' && typeof block.end === 'string' && typeof block.title === 'string')
    .map(block => ({ ...block, workspace: ROUTINE_AREAS.includes(block.workspace) ? block.workspace : 'Geral' }))
    .sort((a, b) => a.start.localeCompare(b.start));
};

export const saveRoutineBlocksForDate = (date: string, blocks: RoutineBlock[]): boolean => {
  try {
    const all = readOverrides();
    all[date] = [...blocks].sort((a, b) => a.start.localeCompare(b.start));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
};

export const restoreRoutineBlocksForDate = (date: string): boolean => {
  try {
    const all = readOverrides();
    delete all[date];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
};
