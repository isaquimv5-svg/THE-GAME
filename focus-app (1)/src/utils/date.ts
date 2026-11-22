/**
 * Utility functions for formatting, calendar generation and synchronizing current dates in PT-BR
 */

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const getTodayDateString = (d = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayHeaderDate = (d = new Date()): string => {
  const day = d.getDate();
  return `Hoje, ${day} de ${MONTH_NAMES[d.getMonth()]}`;
};

export const getMonthName = (monthIndex: number): string => {
  return MONTH_NAMES[monthIndex] || '';
};

export const getMonthYearTitle = (year: number, monthIndex: number): string => {
  return `${MONTH_NAMES[monthIndex]} ${year}`;
};

export interface CalendarDayItem {
  day: number;
  month: 'prev' | 'curr' | 'next';
  dateStr: string; // YYYY-MM-DD
}

/**
 * Generates an accurate 35 or 42 day matrix for any given month and year starting on Sunday (DOM)
 */
export const getCalendarDaysForMonth = (year: number, monthIndex: number): CalendarDayItem[] => {
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Domingo
  const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days: CalendarDayItem[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    days.push({ day, month: 'prev', dateStr });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, month: 'curr', dateStr });
  }

  // Next month leading days to complete the weeks grid (35 or 42 cells)
  const remainingCells = (7 - (days.length % 7)) % 7;
  const targetTotal = days.length + remainingCells < 35 ? 35 : days.length + remainingCells;
  let nextDay = 1;
  while (days.length < targetTotal) {
    const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
    const nextYear = monthIndex === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
    days.push({ day: nextDay, month: 'next', dateStr });
    nextDay++;
  }

  return days;
};

export interface WeekSelectorDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number; // e.g. 27
  weekdayShort: string; // "TER", "QUA", etc.
  weekdayFull: string; // "Terça-feira", etc.
  monthNameShort: string; // "Out", "Nov", etc.
  isToday: boolean;
  isTomorrow: boolean;
}

const WEEKDAY_NAMES_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const WEEKDAY_NAMES_FULL = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];
const MONTH_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Generates days for the week selector block.
 * When weekOffset === 0:
 * - Generates from today up to upcoming Sunday (e.g. 27, 28, 29, 30, 31, 1).
 * - On Sunday, automatically updates for the next week cycle (Sunday through following Sunday).
 * When weekOffset !== 0:
 * - Generates full 7 days (Monday through Sunday) for that offset week.
 */
export const getWeekDaysForSelector = (weekOffset: number = 0, referenceDate = new Date()): WeekSelectorDay[] => {
  const todayStr = getTodayDateString(referenceDate);
  const tomorrow = new Date(referenceDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getTodayDateString(tomorrow);

  const days: WeekSelectorDay[] = [];

  if (weekOffset === 0) {
    const dayOfWeek = referenceDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // If today is Sunday (0), show Sunday + full upcoming week until next Sunday (8 days total)
    // Otherwise show from today until this coming Sunday
    const daysAhead = dayOfWeek === 0 ? 7 : (7 - dayOfWeek);

    for (let i = 0; i <= daysAhead; i++) {
      const cur = new Date(referenceDate);
      cur.setDate(referenceDate.getDate() + i);
      const dateStr = getTodayDateString(cur);
      const dow = cur.getDay();

      days.push({
        dateStr,
        dayNumber: cur.getDate(),
        weekdayShort: WEEKDAY_NAMES_SHORT[dow],
        weekdayFull: WEEKDAY_NAMES_FULL[dow],
        monthNameShort: MONTH_SHORT[cur.getMonth()],
        isToday: dateStr === todayStr,
        isTomorrow: dateStr === tomorrowStr,
      });
    }
  } else {
    // Offset week: calculate from Monday of that target week to Sunday
    const base = new Date(referenceDate);
    const currentDow = base.getDay();
    // Monday of current week:
    const diffToMonday = currentDow === 0 ? -6 : 1 - currentDow;
    const targetMonday = new Date(base);
    targetMonday.setDate(base.getDate() + diffToMonday + (weekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const cur = new Date(targetMonday);
      cur.setDate(targetMonday.getDate() + i);
      const dateStr = getTodayDateString(cur);
      const dow = cur.getDay();

      days.push({
        dateStr,
        dayNumber: cur.getDate(),
        weekdayShort: WEEKDAY_NAMES_SHORT[dow],
        weekdayFull: WEEKDAY_NAMES_FULL[dow],
        monthNameShort: MONTH_SHORT[cur.getMonth()],
        isToday: dateStr === todayStr,
        isTomorrow: dateStr === tomorrowStr,
      });
    }
  }

  return days;
};

/**
 * Returns dynamic title for the Afazeres section based on selected date
 */
export const getDayTitle = (dateStr: string): string => {
  const todayStr = getTodayDateString();
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return 'Afazeres';

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getTodayDateString(tomorrow);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getTodayDateString(yesterday);

  if (dateStr === todayStr) {
    return 'Afazeres de hoje';
  }
  if (dateStr === tomorrowStr) {
    return `Afazeres de amanhã (${d.getDate()} de ${MONTH_NAMES[d.getMonth()]})`;
  }
  if (dateStr === yesterdayStr) {
    return `Afazeres de ontem (${d.getDate()} de ${MONTH_NAMES[d.getMonth()]})`;
  }
  return `Afazeres de ${WEEKDAY_NAMES_FULL[d.getDay()]}, ${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

