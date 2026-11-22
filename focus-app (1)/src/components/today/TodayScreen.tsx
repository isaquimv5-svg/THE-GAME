import React, { useState } from 'react';
import {
  Target,
  List,
  MoreHorizontal,
  Check,
  Plus,
  Edit2,
  Play,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { ProgressRing } from '../common/ProgressRing';
import { Task } from '../../types';
import {
  getTodayHeaderDate,
  getTodayDateString,
  getWeekDaysForSelector,
  getDayTitle,
} from '../../utils/date';

export const TodayScreen: React.FC = () => {
  const {
    tasks,
    profile,
    toggleTask,
    setIsTaskModalOpen,
    setEditingTask,
    setIsGoalModalOpen,
    setIsFocusModalOpen,
    setActiveFocusTask,
    deleteTask,
    selectedDate,
    setSelectedDate,
  } = useApp();

  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Today and selected date
  const todayDateStr = getTodayDateString();
  const currentSelectedDate = selectedDate || todayDateStr;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateStr = getTodayDateString(tomorrow);

  const isSelectedToday = currentSelectedDate === todayDateStr;
  const isSelectedTomorrow = currentSelectedDate === tomorrowDateStr;
  const isSelectedFuture = currentSelectedDate > todayDateStr;

  // Week days list for the selector block (starts from today up to Sunday, updates every Sunday)
  const weekDays = getWeekDaysForSelector(weekOffset);

  // Filter tasks for the selected date
  const displayedTasks = tasks.filter((t) => {
    if (t.recurring) {
      return true;
    }
    return t.date === currentSelectedDate;
  });

  // Determine completion status for selected date
  const isTaskCompletedForSelected = (t: Task) => {
    // If it's a future day (e.g. tomorrow), recurring tasks are pending for that day
    if (isSelectedFuture && t.recurring) {
      return false;
    }
    return t.completed;
  };

  const selectedCompletedTasksCount = displayedTasks.filter(isTaskCompletedForSelected).length;
  const selectedTotalTasksCount = displayedTasks.length;
  const selectedProgressPercentage = selectedTotalTasksCount > 0
    ? Math.round((selectedCompletedTasksCount / selectedTotalTasksCount) * 100)
    : 0;

  // Task count for day selector badges
  const getTaskCountForDay = (dateStr: string) => {
    return tasks.filter((t) => {
      if (t.recurring) return true;
      return t.date === dateStr;
    }).length;
  };

  const getCategoryVisual = (category: string, title: string) => {
    if (title.toLowerCase().includes('água') || category === 'Saúde' && title.toLowerCase().includes('água')) {
      return (
        <span className="w-8 h-8 rounded-full bg-[#299BFF]/15 text-[#299BFF] flex items-center justify-center text-sm shrink-0">
          💧
        </span>
      );
    }
    if (category === 'Alimentação') {
      return (
        <span className="w-8 h-8 rounded-full bg-[#24E4B4]/15 flex items-center justify-center text-sm shrink-0">
          🥗
        </span>
      );
    }
    if (title.toLowerCase().includes('treino') || title.toLowerCase().includes('academia')) {
      return (
        <span className="w-8 h-8 rounded-full bg-[#299BFF]/15 flex items-center justify-center text-sm shrink-0">
          🏋️
        </span>
      );
    }
    if (category === 'Trabalho') {
      return (
        <span className="w-8 h-8 rounded-full bg-[#91A8C4]/15 flex items-center justify-center text-sm shrink-0">
          💼
        </span>
      );
    }
    if (category === 'Planejamento' || title.toLowerCase().includes('planejamento')) {
      return (
        <span className="w-8 h-8 rounded-full bg-[#6BAEFF]/15 flex items-center justify-center text-sm shrink-0">
          📑
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full bg-[#91A8C4]/15 flex items-center justify-center text-sm shrink-0">
        📝
      </span>
    );
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Top Header */}
      <Header
        topKicker={getTodayHeaderDate()}
        title={`Bom foco, ${profile.name}`}
      />

      {/* Week Day Selector Block ("Bloco de Dias") */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 shadow-sm space-y-2.5">
        {/* Header of Block */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#299BFF]" />
            <span className="text-[13px] font-bold text-[#F7F9FC]">
              {weekOffset === 0 ? 'Semana Atual' : weekOffset > 0 ? 'Próxima Semana' : 'Semana Anterior'}
            </span>
            <span className="text-[11px] text-[#56687C] font-semibold">
              (até domingo)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSelectedToday && (
              <button
                onClick={() => {
                  setWeekOffset(0);
                  setSelectedDate(todayDateStr);
                }}
                className="px-2.5 py-1 rounded-full bg-[#102436] text-[#299BFF] hover:bg-[#163047] text-[11px] font-semibold flex items-center gap-1 transition-colors active:scale-95 border border-[#299BFF]/30"
                title="Voltar para Hoje"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Hoje</span>
              </button>
            )}

            <div className="flex items-center gap-0.5 bg-[#0D171F] p-0.5 rounded-lg border border-[rgba(120,160,190,0.1)]">
              <button
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#91A8C4] hover:text-white hover:bg-[#142330] transition-colors"
                title="Semana anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#91A8C4] hover:text-white hover:bg-[#142330] transition-colors"
                title="Próxima semana"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Day cards row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 pt-1">
          {weekDays.map((item) => {
            const isSelected = item.dateStr === currentSelectedDate;
            const taskCount = getTaskCountForDay(item.dateStr);

            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex-1 min-w-[50px] py-2 px-1 rounded-[14px] flex flex-col items-center justify-center transition-all active:scale-95 relative ${
                  isSelected
                    ? 'bg-[#299BFF] text-white shadow-md shadow-[#299BFF]/30 border border-[#60B5FF]'
                    : item.isToday
                    ? 'bg-[#0E1F2E] text-[#F7F9FC] border border-[#299BFF]/50 hover:border-[#299BFF]'
                    : 'bg-[#0D171F] text-[#91A8C4] border border-[rgba(120,160,190,0.12)] hover:border-[rgba(120,160,190,0.3)]'
                }`}
              >
                {/* Day name (e.g. TER, QUA) */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'text-white/90'
                      : item.isToday
                      ? 'text-[#299BFF]'
                      : 'text-[#6C839B]'
                  }`}
                >
                  {item.weekdayShort}
                </span>

                {/* Day number (e.g. 27, 28) */}
                <span
                  className={`text-[16px] font-extrabold my-0.5 tabular-nums ${
                    isSelected ? 'text-white' : 'text-[#F7F9FC]'
                  }`}
                >
                  {item.dayNumber}
                </span>

                {/* Bottom indicator badge / dot */}
                <div className="h-3 flex items-center justify-center">
                  {item.isToday && !isSelected ? (
                    <span className="text-[9px] font-extrabold text-[#299BFF] leading-none">
                      Hoje
                    </span>
                  ) : taskCount > 0 ? (
                    <div className="flex items-center gap-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-[#299BFF]'
                        }`}
                      />
                      {taskCount > 1 && (
                        <span
                          className={`text-[9px] font-bold leading-none ${
                            isSelected ? 'text-white/90' : 'text-[#7B95B3]'
                          }`}
                        >
                          {taskCount}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white/40' : 'bg-transparent'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 1: Daily Progress Card with Avatar and Ring */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 flex items-center justify-between shadow-sm">
        {/* Left: Avatar with Circular Ring */}
        <div className="relative flex flex-col items-center justify-center ml-1">
          <ProgressRing
            progress={selectedProgressPercentage}
            size={120}
            strokeWidth={9}
            strokeColor="#299BFF"
            trackColor="#101F2C"
          >
            <div className="w-[84px] h-[84px] rounded-full overflow-hidden flex items-center justify-center bg-[#071017]">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </ProgressRing>
          <span className="text-[14px] font-bold text-[#299BFF] mt-1 tabular-nums">
            {selectedProgressPercentage}%
          </span>
        </div>

        {/* Right: Metrics */}
        <div className="flex-1 pl-6 pr-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isSelectedToday
                  ? 'bg-[#24E4B4]'
                  : isSelectedTomorrow
                  ? 'bg-[#299BFF]'
                  : 'bg-[#91A8C4]'
              }`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#91A8C4]">
              {isSelectedToday
                ? 'Foco de Hoje'
                : isSelectedTomorrow
                ? 'Metas de Amanhã'
                : 'Progresso do Dia'}
            </span>
          </div>

          <h2 className="text-[17px] font-bold text-[#F7F9FC] leading-snug">
            {selectedTotalTasksCount === 0
              ? isSelectedToday
                ? 'Tudo limpo por hoje'
                : 'Nenhuma tarefa planejada'
              : `${selectedCompletedTasksCount} de ${selectedTotalTasksCount} tarefas concluídas`}
          </h2>
          <p className="text-[13px] text-[#91A8C4] mt-1 font-medium">
            {selectedTotalTasksCount === 0
              ? isSelectedTomorrow
                ? 'Planeje suas tarefas de amanhã'
                : 'Adicione suas metas para começar'
              : `${selectedProgressPercentage}% do dia concluído`}
          </p>
        </div>
      </div>

      {/* Card 2: Objetivo do dia */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#0E2233] text-[#299BFF] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-[#299BFF]" />
          </div>
          <div className="min-w-0 pr-2">
            <h3 className="text-[15px] font-bold text-[#F7F9FC]">Objetivo do dia</h3>
            <p className="text-[12.5px] text-[#91A8C4] truncate mt-0.5 font-normal">
              {profile.dailyGoal}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="px-4 py-1.5 rounded-full border border-[#1C588A] text-[#299BFF] hover:bg-[#299BFF]/10 text-xs font-semibold shrink-0 transition-colors active:scale-95"
        >
          Editar
        </button>
      </div>

      {/* Card 3: Afazeres Section */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3 pb-1">
          <div className="flex items-center gap-2.5">
            <List className="w-5 h-5 text-[#299BFF]" />
            <h3 className="text-[16px] font-bold text-[#F7F9FC]">
              {getDayTitle(currentSelectedDate)}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#56687C] font-semibold tabular-nums">
              {selectedCompletedTasksCount} de {selectedTotalTasksCount}
            </span>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              title="Adicionar tarefa"
              className="w-7 h-7 rounded-full bg-[#121F2B] text-[#299BFF] hover:bg-[#1A2C3D] flex items-center justify-center active:scale-90 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Items */}
        {displayedTasks.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#121F2B] text-[#299BFF] flex items-center justify-center mb-2.5">
              <List className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-semibold text-[#F7F9FC]">
              {isSelectedToday
                ? 'Nenhuma tarefa para hoje'
                : isSelectedTomorrow
                ? 'Nenhuma tarefa planejada para amanhã'
                : 'Nenhuma tarefa para este dia'}
            </p>
            <p className="text-[11.5px] text-[#91A8C4] mt-0.5 mb-3.5 max-w-[260px]">
              {isSelectedTomorrow
                ? 'Aproveite a noite para adiantar e organizar o seu dia seguinte com clareza.'
                : 'Seu dia está limpo. Comece adicionando seus focos prioritários.'}
            </p>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-[#299BFF] hover:bg-[#1C8BE8] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[#299BFF]/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              {isSelectedTomorrow ? 'Planejar Tarefa para Amanhã' : 'Nova Tarefa'}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(120,160,190,0.08)]">
            {displayedTasks.map((task) => {
              const isMenuOpen = activeMenuTaskId === task.id;
              const isCompleted = isTaskCompletedForSelected(task);

              return (
                <div
                  key={task.id}
                  className="relative py-3 flex items-center justify-between group hover:bg-white/[0.01] transition-colors"
                >
                  {/* Left: Checkbox + Icon + Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    {/* Custom Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                        isCompleted
                          ? 'bg-[#24E4B4] text-[#05090D]'
                          : 'border-[1.8px] border-[#2C4356] bg-transparent hover:border-[#4B7394]'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Category Emoji/Icon */}
                    {getCategoryVisual(task.category, task.title)}

                    {/* Task details */}
                    <div className="min-w-0">
                      <h4
                        className={`text-[14px] font-semibold tracking-tight transition-all truncate ${
                          isCompleted ? 'text-[#91A8C4] line-through' : 'text-[#F7F9FC]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[12px] text-[#91A8C4] truncate">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Time + Three dots */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[12px] text-[#91A8C4] font-medium whitespace-nowrap">
                      {task.time}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuTaskId(isMenuOpen ? null : task.id)
                        }
                        className="p-1 text-[#56687C] hover:text-[#91A8C4] active:scale-90 transition-transform"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-7 z-30 w-36 rounded-xl bg-[#0F1C26] border border-[rgba(120,160,190,0.2)] shadow-xl p-1 text-xs">
                          <button
                            onClick={() => {
                              setActiveFocusTask(task);
                              setIsFocusModalOpen(true);
                              setActiveMenuTaskId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#299BFF] hover:bg-[#152533]"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Focar agora
                          </button>
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskModalOpen(true);
                              setActiveMenuTaskId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#F7F9FC] hover:bg-[#152533]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              deleteTask(task.id);
                              setActiveMenuTaskId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#FF5B64] hover:bg-[#152533]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

