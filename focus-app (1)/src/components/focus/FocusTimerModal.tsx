import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, RotateCcw, Clock, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProgressRing } from '../common/ProgressRing';

export const FocusTimerModal: React.FC = () => {
  const {
    isFocusModalOpen,
    setIsFocusModalOpen,
    activeFocusTask,
    setActiveFocusTask,
    tasks,
    recordFocusTime,
    profile,
  } = useApp();

  const [durationMinutes, setDurationMinutes] = useState(profile.focusSessionDuration || 25);
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSecondsRemaining(durationMinutes * 60);
  }, [durationMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            recordFocusTime(durationMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, durationMinutes, recordFocusTime]);

  if (!isFocusModalOpen) return null;

  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    const timeSpentMinutes = Math.round((totalSeconds - secondsRemaining) / 60);
    if (timeSpentMinutes > 0) {
      recordFocusTime(timeSpentMinutes);
    }
    setIsRunning(false);
    setIsFocusModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={() => {
            setIsRunning(false);
            setIsFocusModalOpen(false);
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#299BFF]">
          <Target className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide uppercase">Modo Foco</span>
        </div>

        {/* Task selector */}
        <div className="w-full mb-6">
          <label className="text-[12px] text-[#91A8C4] mb-1.5 block text-center">
            {activeFocusTask ? 'Tarefa focada:' : 'Escolha uma tarefa:'}
          </label>
          <select
            value={activeFocusTask?.id || ''}
            onChange={(e) => {
              const selected = tasks.find((t) => t.id === e.target.value) || null;
              setActiveFocusTask(selected);
            }}
            className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
          >
            <option value="">Sem tarefa específica (Foco livre)</option>
            {tasks
              .filter((t) => !t.completed)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.time})
                </option>
              ))}
          </select>
        </div>

        {/* Big circular timer */}
        <div className="relative my-4 flex items-center justify-center">
          <ProgressRing
            progress={progressPercent}
            size={190}
            strokeWidth={12}
            strokeColor="#299BFF"
            trackColor="#101F2B"
          >
            <div className="text-center">
              <span className="text-[34px] font-bold tracking-tight text-[#F7F9FC] font-mono">
                {formatTime(secondsRemaining)}
              </span>
              <span className="block text-[11px] text-[#91A8C4] mt-1">
                {isRunning ? 'Em andamento' : secondsRemaining === 0 ? 'Concluído!' : 'Pausado'}
              </span>
            </div>
          </ProgressRing>
        </div>

        {/* Duration pills */}
        <div className="flex items-center gap-2 mb-6">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              disabled={isRunning}
              onClick={() => {
                setDurationMinutes(mins);
                setSecondsRemaining(mins * 60);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                durationMinutes === mins
                  ? 'bg-[#299BFF] text-white'
                  : 'bg-[#121E28] text-[#91A8C4] hover:bg-[#182936]'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => {
              setSecondsRemaining(durationMinutes * 60);
              setIsRunning(false);
            }}
            title="Reiniciar timer"
            className="w-12 h-12 rounded-xl bg-[#121E28] text-[#91A8C4] hover:text-white flex items-center justify-center active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 h-12 rounded-xl bg-[#299BFF] hover:bg-[#1C8BE8] text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#299BFF]/20"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                {secondsRemaining < totalSeconds ? 'Continuar' : 'Iniciar Foco'}
              </>
            )}
          </button>

          <button
            onClick={handleFinishEarly}
            title="Finalizar e salvar sessão"
            className="w-12 h-12 rounded-xl bg-[#121E28] text-[#24E4B4] hover:bg-[#162734] flex items-center justify-center active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
