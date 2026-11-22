import React from 'react';
import { Target, BarChart2, List, Calendar, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';

export const PlanScreen: React.FC = () => {
  const {
    plan,
    profile,
    togglePlanStep,
    planCompletedStepsCount,
    planTotalStepsCount,
    planProgressPercentage,
    todayCompletedTasksCount,
    todayTotalTasksCount,
    setIsGoalModalOpen,
  } = useApp();

  return (
    <div className="space-y-3.5 pb-24">
      {/* Top Header */}
      <Header
        title="Meu plano"
        subtitle="Transforme o objetivo final em passos claros."
      />

      {/* Card 1: Goal Hero Card */}
      <div
        onClick={() => setIsGoalModalOpen(true)}
        className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 flex items-center gap-4 cursor-pointer hover:border-[rgba(120,160,190,0.25)] transition-all shadow-sm group"
      >
        {/* Left: Avatar */}
        <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-[#071017] border-2 border-[#122332] shrink-0 flex items-center justify-center">
          <img
            src={profile.avatarUrl}
            alt="Isaqui Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right: Goal info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#299BFF] mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Objetivo final</span>
          </div>

          <h2 className="text-[16px] font-bold text-[#F7F9FC] leading-snug line-clamp-2">
            {plan.title}
          </h2>

          <div className="flex items-center gap-1.5 text-[12px] text-[#91A8C4] mt-2 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#56687C]" />
            <span>{plan.deadline}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Evolução Geral do Plano */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[14px] font-bold text-[#F7F9FC]">
              Evolução geral do plano
            </h3>
          </div>
          <span className="text-[13px] text-[#299BFF] font-semibold tabular-nums">
            {planProgressPercentage}% concluído
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#10202B] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#24E4B4] transition-all duration-500 ease-out"
            style={{ width: `${planProgressPercentage}%` }}
          />
        </div>
      </div>

      {/* Card 3: Etapas para chegar lá */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[15px] font-bold text-[#F7F9FC]">
              Etapas para chegar lá
            </h3>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="text-xs text-[#299BFF] hover:underline"
          >
            Gerenciar
          </button>
        </div>

        {/* Vertical Stepper */}
        <div className="relative pl-1">
          {plan.steps.map((step, idx) => {
            const isLast = idx === plan.steps.length - 1;

            return (
              <div key={step.id} className="relative flex items-start gap-3.5 pb-5 last:pb-1 group">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[13px] top-[26px] bottom-0 w-[2px] ${
                      step.completed ? 'bg-[#24E4B4]/40' : 'bg-[#182836]'
                    }`}
                  />
                )}

                {/* Step Circle Button */}
                <button
                  onClick={() => togglePlanStep(step.id)}
                  title="Marcar etapa como concluída"
                  className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all active:scale-90 ${
                    step.completed
                      ? 'bg-[#24E4B4] text-[#05090D]'
                      : idx === 2 // Step 3 in screenshot is active blue
                      ? 'border-2 border-[#299BFF] text-[#299BFF] bg-[#0B141B]'
                      : 'border border-[#2C3F4F] text-[#56687C] bg-[#0D171F]'
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{step.stepNumber}</span>
                  )}
                </button>

                {/* Step content */}
                <div
                  onClick={() => togglePlanStep(step.id)}
                  className="flex-1 min-w-0 cursor-pointer pt-0.5"
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-[14px] font-semibold tracking-tight transition-colors ${
                        step.completed ? 'text-[#F7F9FC]' : 'text-[#F7F9FC]'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors shrink-0 ml-1" />
                  </div>
                  <p className="text-[12px] text-[#91A8C4] mt-0.5 line-clamp-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom 2 Cards Side-by-Side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Meta da semana */}
        <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#91A8C4] mb-2 font-medium">
              <div className="w-5 h-5 rounded-full bg-[#122332] text-[#299BFF] flex items-center justify-center shrink-0">
                <Target className="w-3 h-3" />
              </div>
              <span className="truncate">Meta da semana</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-extrabold text-[#F7F9FC]">
                4 de 5
              </span>
              <ChevronRight className="w-4 h-4 text-[#44596F]" />
            </div>
            <span className="text-[11px] text-[#91A8C4] block mt-0.5">
              tarefas concluídas
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#10202B] overflow-hidden mt-3">
            <div className="h-full rounded-full bg-[#299BFF] w-[80%]" />
          </div>
        </div>

        {/* Meta de hoje */}
        <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#91A8C4] mb-2 font-medium">
              <div className="w-5 h-5 rounded-full bg-[#122332] text-[#299BFF] flex items-center justify-center shrink-0">
                <Calendar className="w-3 h-3" />
              </div>
              <span className="truncate">Meta de hoje</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[18px] font-extrabold text-[#F7F9FC]">
                {todayCompletedTasksCount} de {todayTotalTasksCount}
              </span>
              <ChevronRight className="w-4 h-4 text-[#44596F]" />
            </div>
            <span className="text-[11px] text-[#91A8C4] block mt-0.5">
              tarefas concluídas
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#10202B] overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-[#299BFF] transition-all duration-300"
              style={{ width: `${(todayCompletedTasksCount / todayTotalTasksCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
