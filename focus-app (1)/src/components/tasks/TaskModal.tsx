import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, Tag, Flag, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityLevel, TaskCategory } from '../../types';
import { getTodayDateString } from '../../utils/date';

const CATEGORIES: TaskCategory[] = [
  'Trabalho',
  'Saúde',
  'Alimentação',
  'Pessoal',
  'Estudo',
  'Planejamento',
  'Outros',
];

const PRIORITIES: PriorityLevel[] = ['Alta', 'Média', 'Baixa'];

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    deleteTask,
    selectedDate,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('08:00');
  const [date, setDate] = useState(selectedDate || getTodayDateString());
  const [category, setCategory] = useState<TaskCategory>('Trabalho');
  const [priority, setPriority] = useState<PriorityLevel>('Média');
  const [recurring, setRecurring] = useState(false);
  const [isTopPriority, setIsTopPriority] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setTime(editingTask.time || '08:00');
      setDate(editingTask.date || selectedDate || getTodayDateString());
      setCategory(editingTask.category || 'Trabalho');
      setPriority(editingTask.priority || 'Média');
      setRecurring(!!editingTask.recurring);
      setIsTopPriority(!!editingTask.isTopPriority);
    } else {
      setTitle('');
      setDescription('');
      setTime('09:00');
      setDate(selectedDate || getTodayDateString());
      setCategory('Trabalho');
      setPriority('Média');
      setRecurring(false);
      setIsTopPriority(false);
    }
  }, [editingTask, isTaskModalOpen, selectedDate]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        time,
        date,
        category,
        priority,
        recurring,
        isTopPriority,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        time,
        date,
        completed: false,
        category,
        priority,
        recurring,
        isTopPriority,
      });
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      setIsTaskModalOpen(false);
      setEditingTask(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(120,160,190,0.1)]">
          <h2 className="text-base font-bold text-[#F7F9FC]">
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Title */}
          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Título da tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Treino na academia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-sm text-[#F7F9FC] placeholder-[#56687C] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Descrição ou subtítulo
            </label>
            <input
              type="text"
              placeholder="Ex: 45 minutos de musculação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-sm text-[#F7F9FC] placeholder-[#56687C] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
                Horário
              </label>
              <input
                type="text"
                placeholder="Ex: 10:00 ou Todo o dia"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Categoria
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-[#299BFF]/20 text-[#299BFF] border border-[#299BFF]/40'
                      : 'bg-[#0D171F] text-[#91A8C4] border border-transparent hover:border-[rgba(120,160,190,0.18)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('Alta')}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  priority === 'Alta'
                    ? 'bg-[#FF5B64]/15 border-[#FF5B64] text-[#FF5B64]'
                    : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#91A8C4]'
                }`}
              >
                ▲ Alta
              </button>
              <button
                type="button"
                onClick={() => setPriority('Média')}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  priority === 'Média'
                    ? 'bg-[#F5B83D]/15 border-[#F5B83D] text-[#F5B83D]'
                    : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#91A8C4]'
                }`}
              >
                = Média
              </button>
              <button
                type="button"
                onClick={() => setPriority('Baixa')}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  priority === 'Baixa'
                    ? 'bg-[#299BFF]/15 border-[#299BFF] text-[#299BFF]'
                    : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#91A8C4]'
                }`}
              >
                - Baixa
              </button>
            </div>
          </div>

          {/* Checkboxes: Top 3 & Recurring */}
          <div className="pt-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#91A8C4]">
              <input
                type="checkbox"
                checked={isTopPriority}
                onChange={(e) => setIsTopPriority(e.target.checked)}
                className="w-4 h-4 rounded border-[rgba(120,160,190,0.3)] text-[#299BFF] bg-[#0D171F] focus:ring-0"
              />
              <span>Destacar no <strong>Top 3 prioridades do dia</strong></span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#91A8C4]">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-[rgba(120,160,190,0.3)] text-[#299BFF] bg-[#0D171F] focus:ring-0"
              />
              <span>Tarefa recorrente (repetir automaticamente)</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-3">
            {editingTask && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-11 h-11 rounded-xl bg-[#FF5B64]/10 text-[#FF5B64] hover:bg-[#FF5B64]/20 flex items-center justify-center transition-colors"
                title="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#299BFF] hover:bg-[#1E88E5] text-white text-sm font-semibold transition-all shadow-md shadow-[#299BFF]/20"
            >
              {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
