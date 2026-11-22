import React, { useState } from 'react';
import {
  Star,
  List,
  Plus,
  Calendar,
  Briefcase,
  Check,
  MoreHorizontal,
  ChevronRight,
  Play,
  Edit2,
  Trash2,
  Activity,
  Heart,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { Task, TaskCategory, PriorityLevel } from '../../types';
import { getTodayDateString } from '../../utils/date';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    toggleTask,
    deleteTask,
    setIsTaskModalOpen,
    setEditingTask,
    setIsFocusModalOpen,
    setActiveFocusTask,
  } = useApp();

  const [filter, setFilter] = useState<'Hoje' | 'Semana' | 'Importantes' | 'Trabalho' | 'Todas'>('Hoje');
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Filter tasks based on selected pill
  const todayDateStr = getTodayDateString();
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'Hoje') return t.date === todayDateStr || t.recurring;
    if (filter === 'Semana') return true;
    if (filter === 'Importantes') return t.isTopPriority || t.priority === 'Alta' || t.important;
    if (filter === 'Trabalho') return t.category === 'Trabalho';
    return true;
  });

  // Top 3 priorities
  const top3Tasks = tasks
    .filter((t) => t.isTopPriority || t.priority === 'Alta')
    .slice(0, 3);

  const getPriorityBadge = (priority: PriorityLevel) => {
    if (priority === 'Alta') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FF5B64]/10 text-[#FF5B64] border border-[#FF5B64]/30">
          <span>▲</span> Alta
        </span>
      );
    }
    if (priority === 'Média') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5B83D]/10 text-[#F5B83D] border border-[#F5B83D]/30">
          <span>=</span> Média
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#299BFF]/10 text-[#299BFF] border border-[#299BFF]/30">
        <span>-</span> Baixa
      </span>
    );
  };

  const getCategoryBadge = (category: TaskCategory) => {
    switch (category) {
      case 'Trabalho':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#142330] text-[#91A8C4] border border-[rgba(120,160,190,0.15)]">
            <Briefcase className="w-3 h-3 text-[#299BFF]" />
            Trabalho
          </span>
        );
      case 'Saúde':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#102B28] text-[#24E4B4] border border-[#24E4B4]/20">
            <Activity className="w-3 h-3 text-[#24E4B4]" />
            Saúde
          </span>
        );
      case 'Alimentação':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#142921] text-[#24E4B4] border border-[#24E4B4]/20">
            <span>🥗</span>
            Alimentação
          </span>
        );
      case 'Pessoal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#1C1E2F] text-[#A6B2FF] border border-[#A6B2FF]/20">
            <BookOpen className="w-3 h-3 text-[#A6B2FF]" />
            Pessoal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#142330] text-[#91A8C4]">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5 pb-28 relative min-h-screen">
      {/* Header */}
      <Header
        title="Minhas tarefas"
        subtitle="Organize por prioridade, horário e contexto."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setFilter('Hoje')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'Hoje'
              ? 'bg-[#299BFF] text-white shadow-md shadow-[#299BFF]/25'
              : 'bg-[#0B141B] text-[#91A8C4] border border-[rgba(120,160,190,0.18)] hover:bg-[#111F2A]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Hoje
        </button>

        <button
          onClick={() => setFilter('Semana')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'Semana'
              ? 'bg-[#299BFF] text-white shadow-md shadow-[#299BFF]/25'
              : 'bg-[#0B141B] text-[#91A8C4] border border-[rgba(120,160,190,0.18)] hover:bg-[#111F2A]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Semana
        </button>

        <button
          onClick={() => setFilter('Importantes')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'Importantes'
              ? 'bg-[#299BFF] text-white shadow-md shadow-[#299BFF]/25'
              : 'bg-[#0B141B] text-[#91A8C4] border border-[rgba(120,160,190,0.18)] hover:bg-[#111F2A]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Importantes
        </button>

        <button
          onClick={() => setFilter('Trabalho')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'Trabalho'
              ? 'bg-[#299BFF] text-white shadow-md shadow-[#299BFF]/25'
              : 'bg-[#0B141B] text-[#91A8C4] border border-[rgba(120,160,190,0.18)] hover:bg-[#111F2A]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Trabalho
        </button>
      </div>

      {/* Card: Top 3 prioridades */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#299BFF] fill-[#299BFF]" />
            <h3 className="text-[15px] font-bold text-[#F7F9FC]">
              Top 3 prioridades
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-[#44596F]" />
        </div>

        {top3Tasks.length === 0 ? (
          <div className="py-3 text-center text-xs text-[#91A8C4]">
            Marque tarefas com a estrela ou prioridade alta para fixá-las no Top 3.
          </div>
        ) : (
          <div className="space-y-2.5">
            {top3Tasks.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveFocusTask(t);
                  setIsFocusModalOpen(true);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D171F] border border-[rgba(120,160,190,0.1)] hover:border-[#299BFF]/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="w-6 h-6 rounded-full bg-[#142A3D] text-[#299BFF] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[13.5px] font-semibold text-[#F7F9FC] truncate">
                    {t.title}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {getCategoryBadge(t.category)}
                  <span className="text-xs text-[#91A8C4] font-medium font-mono">
                    {t.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card: Todas as tarefas */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-1">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[15px] font-bold text-[#F7F9FC]">
              Todas as tarefas
            </h3>
          </div>
          <span className="text-xs text-[#56687C] font-semibold">
            {filteredTasks.length} tarefas
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#91A8C4]">
            Nenhuma tarefa cadastrada neste filtro. Toque no botão (+) para criar.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(120,160,190,0.08)]">
            {filteredTasks.map((task) => {
              const isMenuOpen = activeMenuTaskId === task.id;

            return (
              <div
                key={task.id}
                className="py-3 flex items-center justify-between hover:bg-white/[0.01] transition-colors relative"
              >
                {/* Left: Checkbox + Title + Category */}
                <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-[22px] h-[22px] mt-0.5 rounded-[6px] flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                      task.completed
                        ? 'bg-[#24E4B4] text-[#05090D]'
                        : 'border-[1.8px] border-[#2C4356] bg-transparent hover:border-[#4B7394]'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-[14px] font-semibold truncate ${
                        task.completed ? 'text-[#F7F9FC]' : 'text-[#F7F9FC]'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <div className="mt-1 flex items-center gap-2">
                      {getCategoryBadge(task.category)}
                    </div>
                  </div>
                </div>

                {/* Right: Priority Badge + Time + Menu */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {getPriorityBadge(task.priority)}

                  <span className="text-xs text-[#91A8C4] font-medium whitespace-nowrap">
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

      {/* Floating Action Button (+) */}
      <button
        onClick={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        title="Criar nova tarefa"
        className="fixed bottom-[88px] right-5 z-40 w-13 h-13 rounded-full bg-[#299BFF] hover:bg-[#1B89E6] text-white flex items-center justify-center shadow-lg shadow-[#299BFF]/35 active:scale-90 transition-all cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
