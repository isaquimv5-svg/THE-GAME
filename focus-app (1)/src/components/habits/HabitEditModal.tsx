import React, { useState, useEffect } from 'react';
import { X, Droplets, Moon, Dumbbell, BookOpen, Plus, Minus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HabitEditModal: React.FC = () => {
  const {
    activeHabitModal,
    setActiveHabitModal,
    habits,
    updateWater,
    updateSleep,
    updateWorkout,
    updateReading,
  } = useApp();

  const [val, setVal] = useState<number>(0);

  useEffect(() => {
    if (activeHabitModal === 'water') setVal(habits.water.current);
    if (activeHabitModal === 'sleep') setVal(habits.sleep.current);
    if (activeHabitModal === 'workout') setVal(habits.workout.current);
    if (activeHabitModal === 'reading') setVal(habits.reading.current);
  }, [activeHabitModal, habits]);

  if (!activeHabitModal) return null;

  const handleSave = () => {
    if (activeHabitModal === 'water') updateWater(val);
    if (activeHabitModal === 'sleep') updateSleep(val);
    if (activeHabitModal === 'workout') updateWorkout(val);
    if (activeHabitModal === 'reading') updateReading(val);
    setActiveHabitModal(null);
  };

  const getDetails = () => {
    switch (activeHabitModal) {
      case 'water':
        return {
          title: 'Beber água',
          icon: Droplets,
          unit: 'litros',
          step: 0.25,
          color: '#299BFF',
          goal: habits.water.goal,
        };
      case 'sleep':
        return {
          title: 'Sono',
          icon: Moon,
          unit: 'horas',
          step: 0.5,
          color: '#299BFF',
          goal: habits.sleep.goal,
        };
      case 'workout':
        return {
          title: 'Treino',
          icon: Dumbbell,
          unit: 'minutos',
          step: 5,
          color: '#24E4B4',
          goal: habits.workout.goal,
        };
      case 'reading':
        return {
          title: 'Leitura',
          icon: BookOpen,
          unit: 'minutos',
          step: 5,
          color: '#299BFF',
          goal: habits.reading.goal,
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative text-center">
        <button
          onClick={() => setActiveHabitModal(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
          style={{ backgroundColor: `${details.color}20`, color: details.color }}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#F7F9FC]">{details.title}</h3>
        <p className="text-xs text-[#91A8C4] mt-0.5">
          Meta diária: {details.goal} {details.unit}
        </p>

        {/* Counter controls */}
        <div className="flex items-center justify-center gap-6 my-6">
          <button
            onClick={() => setVal((prev) => Math.max(0, parseFloat((prev - details.step).toFixed(2))))}
            className="w-12 h-12 rounded-2xl bg-[#0D171F] border border-[rgba(120,160,190,0.2)] text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="min-w-[120px]">
            <span className="text-3xl font-extrabold text-[#F7F9FC] font-mono">
              {val}
            </span>
            <span className="block text-xs text-[#91A8C4] mt-0.5 font-medium">
              {details.unit}
            </span>
          </div>

          <button
            onClick={() => setVal((prev) => parseFloat((prev + details.step).toFixed(2)))}
            className="w-12 h-12 rounded-2xl bg-[#0D171F] border border-[rgba(120,160,190,0.2)] text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Quick increments */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {activeHabitModal === 'water' && (
            <>
              <button
                onClick={() => setVal((prev) => parseFloat((prev + 0.25).toFixed(2)))}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                +250ml
              </button>
              <button
                onClick={() => setVal((prev) => parseFloat((prev + 0.5).toFixed(2)))}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                +500ml
              </button>
              <button
                onClick={() => setVal(2.0)}
                className="px-3 py-1 bg-[#24E4B4]/15 text-[#24E4B4] rounded-lg text-xs"
              >
                Meta (2L)
              </button>
            </>
          )}
          {activeHabitModal === 'workout' && (
            <>
              <button
                onClick={() => setVal(30)}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                30 min
              </button>
              <button
                onClick={() => setVal(45)}
                className="px-3 py-1 bg-[#24E4B4]/15 text-[#24E4B4] rounded-lg text-xs"
              >
                45 min (Meta)
              </button>
              <button
                onClick={() => setVal(60)}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                60 min
              </button>
            </>
          )}
          {activeHabitModal === 'reading' && (
            <>
              <button
                onClick={() => setVal((prev) => prev + 10)}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                +10 min
              </button>
              <button
                onClick={() => setVal(30)}
                className="px-3 py-1 bg-[#24E4B4]/15 text-[#24E4B4] rounded-lg text-xs"
              >
                Meta (30 min)
              </button>
            </>
          )}
          {activeHabitModal === 'sleep' && (
            <>
              <button
                onClick={() => setVal(7.5)}
                className="px-3 py-1 bg-[#121E28] rounded-lg text-xs text-[#91A8C4] hover:text-white"
              >
                7.5h
              </button>
              <button
                onClick={() => setVal(8.0)}
                className="px-3 py-1 bg-[#24E4B4]/15 text-[#24E4B4] rounded-lg text-xs"
              >
                Meta (8h)
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full h-11 rounded-xl bg-[#299BFF] hover:bg-[#1C8BE8] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#299BFF]/20"
        >
          <Check className="w-4 h-4" />
          Confirmar Registro
        </button>
      </div>
    </div>
  );
};
