import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Check, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanStep } from '../../types';

export const GoalModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, plan, updatePlan } = useApp();

  const [title, setTitle] = useState(plan.title);
  const [deadline, setDeadline] = useState(plan.deadline);
  const [steps, setSteps] = useState<PlanStep[]>(plan.steps);
  const [newStepTitle, setNewStepTitle] = useState('');

  useEffect(() => {
    setTitle(plan.title);
    setDeadline(plan.deadline);
    setSteps(plan.steps);
  }, [plan, isGoalModalOpen]);

  if (!isGoalModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlan({
      title,
      deadline,
      steps,
    });
    setIsGoalModalOpen(false);
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    const newStep: PlanStep = {
      id: `step-${Date.now()}`,
      stepNumber: steps.length + 1,
      title: newStepTitle.trim(),
      description: 'Etapa personalizada adicionada ao seu plano.',
      completed: false,
    };
    setSteps([...steps, newStep]);
    setNewStepTitle('');
  };

  const handleRemoveStep = (stepId: string) => {
    const filtered = steps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsGoalModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3 text-[#299BFF]">
          <Target className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Editar Plano & Metas</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Objetivo final
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-sm text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Prazo limite
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#91A8C4]" />
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="Ex: Até 31 de dezembro de 2026"
                className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Etapas para chegar lá ({steps.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {steps.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#0D171F] border border-[rgba(120,160,190,0.1)] text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-5 h-5 rounded-full bg-[#162734] text-[#299BFF] flex items-center justify-center font-bold text-[10px] shrink-0">
                      {st.stepNumber}
                    </span>
                    <span className="text-[#F7F9FC] truncate">{st.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(st.id)}
                    className="text-[#91A8C4] hover:text-[#FF5B64] p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Nova etapa..."
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="flex-1 bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 bg-[#162734] hover:bg-[#1E3445] text-[#299BFF] rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#299BFF] hover:bg-[#1C8BE8] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#299BFF]/20 mt-4"
          >
            <Check className="w-4 h-4" />
            Salvar Plano
          </button>
        </form>
      </div>
    </div>
  );
};
