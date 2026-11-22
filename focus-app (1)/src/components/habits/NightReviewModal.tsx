import React, { useState } from 'react';
import { X, CheckCircle2, Moon, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NightReviewModal: React.FC = () => {
  const {
    isNightReviewModalOpen,
    setIsNightReviewModalOpen,
    setNightReview,
    todayCompletedTasksCount,
    todayTotalTasksCount,
    todayProgressPercentage,
    mealsCompletedCount,
  } = useApp();

  const [reflection, setReflection] = useState('');
  const [tomorrowTopPriority, setTomorrowTopPriority] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  if (!isNightReviewModalOpen) return null;

  const handleFinish = () => {
    setNightReview(true);
    setIsNightReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative">
        <button
          onClick={() => setIsNightReviewModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#299BFF]">
          <Moon className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Revisão Noturna</span>
        </div>

        {step === 1 ? (
          <div>
            <h3 className="text-lg font-bold text-[#F7F9FC]">Fechamento do Dia</h3>
            <p className="text-xs text-[#91A8C4] mt-1">
              Excelente dia de execução! Veja seu balanço de hoje:
            </p>

            <div className="my-5 p-4 rounded-2xl bg-[#0D171F] border border-[rgba(120,160,190,0.14)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#91A8C4]">Tarefas cumpridas:</span>
                <span className="font-bold text-[#24E4B4]">
                  {todayCompletedTasksCount} de {todayTotalTasksCount} ({todayProgressPercentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#91A8C4]">Refeições saudáveis:</span>
                <span className="font-bold text-[#299BFF]">{mealsCompletedCount} de 5</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#91A8C4]">Consistência diária:</span>
                <span className="font-bold text-[#F7F9FC]">Positiva</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#91A8C4] block mb-1.5 font-medium">
                O que você aprendeu ou conquistou hoje?
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Bom foco na parte da manhã, consegui cumprir o treino sem enrolar."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl p-3 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF] placeholder-[#56687C]"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-5 w-full h-11 rounded-xl bg-[#299BFF] hover:bg-[#1C8BE8] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#299BFF]/20"
            >
              Próximo: Preparar Amanhã
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-[#F7F9FC]">Comece amanhã com clareza</h3>
            <p className="text-xs text-[#91A8C4] mt-1">
              Defina sua prioridade número um para acordar com foco imediato.
            </p>

            <div className="my-5">
              <label className="text-xs text-[#91A8C4] block mb-1.5 font-medium">
                Principal meta ou tarefa de amanhã:
              </label>
              <input
                type="text"
                placeholder="Ex: Entregar relatório de métricas às 10h"
                value={tomorrowTopPriority}
                onChange={(e) => setTomorrowTopPriority(e.target.value)}
                className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2.5 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF] placeholder-[#56687C]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#24E4B4]/10 border border-[#24E4B4]/20 text-[11px] text-[#24E4B4] flex items-center gap-2.5 mb-5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                "Começar o dia já sabendo o primeiro passo elimina a procrastinação matinal."
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full h-11 rounded-xl bg-[#24E4B4] hover:bg-[#1CD1A5] text-[#05090D] font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#24E4B4]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Concluir Revisão Noturna
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
