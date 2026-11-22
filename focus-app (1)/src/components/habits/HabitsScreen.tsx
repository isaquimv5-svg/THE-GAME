import React from 'react';
import {
  Droplets,
  Moon,
  Dumbbell,
  BookOpen,
  List,
  ChevronRight,
  Check,
  Feather,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { SegmentedBar } from '../common/SegmentedBar';

export const HabitsScreen: React.FC = () => {
  const {
    habits,
    toggleMeal,
    mealsCompletedCount,
    mealsPercentage,
    setActiveHabitModal,
    setIsNightReviewModalOpen,
  } = useApp();

  // Habit percentages
  const waterPct = Math.round((habits.water.current / habits.water.goal) * 100);
  const sleepPct = Math.round((habits.sleep.current / habits.sleep.goal) * 100);
  const workoutPct = Math.round((habits.workout.current / habits.workout.goal) * 100);
  const readingPct = Math.round((habits.reading.current / habits.reading.goal) * 100);

  const mealItems: { key: keyof typeof habits.meals; label: string }[] = [
    { key: 'breakfast', label: 'Café da manhã' },
    { key: 'morningSnack', label: 'Lanche da manhã' },
    { key: 'lunch', label: 'Almoço' },
    { key: 'afternoonSnack', label: 'Lanche da tarde' },
    { key: 'dinner', label: 'Jantar' },
  ];

  return (
    <div className="space-y-3.5 pb-24">
      {/* Header */}
      <Header
        title="Hábitos & energia"
        subtitle="Corpo alinhado, mente produtiva."
      />

      {/* Card 1: Alimentação */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        {/* Top line of Alimentação */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#12241F] flex items-center justify-center text-lg shrink-0">
              🥗
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#F7F9FC]">
                Alimentação
              </h3>
              <p className="text-[12px] text-[#91A8C4]">
                {mealsCompletedCount} de 5 refeições registradas
              </p>
            </div>
          </div>
          <span className="text-[15px] font-bold text-[#299BFF] tabular-nums">
            {mealsPercentage}%
          </span>
        </div>

        {/* Stepper with connecting line */}
        <div className="relative flex items-start justify-between px-2 pt-2">
          {/* Background horizontal line */}
          <div className="absolute top-[18px] left-6 right-6 h-[1.5px] bg-[#162734] -z-0" />

          {mealItems.map((meal) => {
            const isDone = habits.meals[meal.key];
            return (
              <button
                key={meal.key}
                onClick={() => toggleMeal(meal.key)}
                className="flex flex-col items-center z-10 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-[#24E4B4] text-[#05090D] shadow-sm shadow-[#24E4B4]/20'
                      : 'border-[1.8px] border-[#31475A] bg-[#0B141B] hover:border-[#4B7394]'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-[10px] font-medium text-[#91A8C4] text-center mt-2 max-w-[54px] leading-tight group-hover:text-white transition-colors">
                  {meal.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2x2 Grid of Habit Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Beber água */}
        <div
          onClick={() => setActiveHabitModal('water')}
          className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 shadow-sm hover:border-[rgba(120,160,190,0.25)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4 fill-[#299BFF]/30 text-[#299BFF]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">
                    Beber água
                  </h4>
                  <span className="text-[10.5px] text-[#91A8C4]">
                    {waterPct}% da meta
                  </span>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#299BFF] tabular-nums">
                {waterPct}%
              </span>
            </div>

            {/* Segmented bar */}
            <div className="my-3.5">
              <SegmentedBar percentage={waterPct} activeColor="#299BFF" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#91A8C4] font-medium pt-1">
            <span>
              {habits.water.current.toString().replace('.', ',')} de {habits.water.goal} litros
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#56687C]" />
          </div>
        </div>

        {/* Sono */}
        <div
          onClick={() => setActiveHabitModal('sleep')}
          className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 shadow-sm hover:border-[rgba(120,160,190,0.25)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1A1F36] text-[#6BAEFF] flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4 fill-[#6BAEFF]/30 text-[#6BAEFF]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">
                    Sono
                  </h4>
                  <span className="text-[10.5px] text-[#91A8C4]">
                    {sleepPct}% da meta
                  </span>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#299BFF] tabular-nums">
                {sleepPct}%
              </span>
            </div>

            {/* Segmented bar */}
            <div className="my-3.5">
              <SegmentedBar percentage={sleepPct} activeColor="#299BFF" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#91A8C4] font-medium pt-1">
            <span>
              {habits.sleep.current.toString().replace('.', ',')} de {habits.sleep.goal} horas
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#56687C]" />
          </div>
        </div>

        {/* Treino */}
        <div
          onClick={() => setActiveHabitModal('workout')}
          className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 shadow-sm hover:border-[rgba(120,160,190,0.25)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F2B26] text-[#24E4B4] flex items-center justify-center shrink-0">
                  <Dumbbell className="w-4 h-4 text-[#24E4B4]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">
                    Treino
                  </h4>
                  <span className="text-[10.5px] text-[#91A8C4]">
                    {workoutPct}% da meta
                  </span>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#24E4B4] tabular-nums">
                {workoutPct}%
              </span>
            </div>

            {/* Segmented bar in green */}
            <div className="my-3.5">
              <SegmentedBar percentage={workoutPct} activeColor="#24E4B4" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#91A8C4] font-medium pt-1">
            <span>
              {habits.workout.current} de {habits.workout.goal} minutos
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#56687C]" />
          </div>
        </div>

        {/* Leitura */}
        <div
          onClick={() => setActiveHabitModal('reading')}
          className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-3.5 shadow-sm hover:border-[rgba(120,160,190,0.25)] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-[#299BFF]" />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">
                    Leitura
                  </h4>
                  <span className="text-[10.5px] text-[#91A8C4]">
                    {readingPct}% da meta
                  </span>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#299BFF] tabular-nums">
                {readingPct}%
              </span>
            </div>

            {/* Segmented bar */}
            <div className="my-3.5">
              <SegmentedBar percentage={readingPct} activeColor="#299BFF" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#91A8C4] font-medium pt-1">
            <span>
              {habits.reading.current} de {habits.reading.goal} minutos
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#56687C]" />
          </div>
        </div>
      </div>

      {/* Card: Revisão noturna */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
            <List className="w-5 h-5 text-[#299BFF]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[14.5px] font-bold text-[#F7F9FC]">
              Revisão noturna
            </h4>
            <p className="text-[12px] text-[#91A8C4] line-clamp-1">
              Concluir minha rotina do dia e me preparar para amanhã.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNightReviewModalOpen(true)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 ${
            habits.nightReviewCompleted
              ? 'bg-[#24E4B4]/20 border border-[#24E4B4] text-[#24E4B4]'
              : 'border border-[#1C588A] text-[#299BFF] hover:bg-[#299BFF]/10'
          }`}
        >
          {habits.nightReviewCompleted ? 'Concluída' : 'Iniciar'}
        </button>
      </div>

      {/* Card: Quote Card */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl font-serif text-[#299BFF] leading-none shrink-0 mt-0.5">
            “
          </span>
          <p className="text-[12.5px] italic text-[#91A8C4] leading-relaxed">
            “Hábitos consistentes hoje constroem uma vida extraordinária amanhã.”
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
          <Feather className="w-4 h-4 text-[#299BFF]" />
        </div>
      </div>
    </div>
  );
};
