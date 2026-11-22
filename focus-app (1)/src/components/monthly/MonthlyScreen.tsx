import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { ProgressRing } from '../common/ProgressRing';
import {
  getCalendarDaysForMonth,
  getMonthYearTitle,
  getMonthName,
  getTodayDateString,
} from '../../utils/date';

export const MonthlyScreen: React.FC = () => {
  const {
    monthlyPerformance,
    selectedDate,
    setSelectedDate,
    setDayStatus,
    cycleDayStatus,
    clearMonthData,
    clearMonthlyPerformance,
    clearAllData,
  } = useApp();

  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [showClearMonthModal, setShowClearMonthModal] = useState(false);
  const [showResetAppModal, setShowResetAppModal] = useState(false);

  const currentYear = viewDate.getFullYear();
  const currentMonthIndex = viewDate.getMonth();
  const calendarDays = getCalendarDaysForMonth(currentYear, currentMonthIndex);

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(getTodayDateString());
  };

  // Metrics for the current viewed month
  const currMonthDays = calendarDays.filter((d) => d.month === 'curr');
  const monthRecords = currMonthDays
    .map((d) => monthlyPerformance[d.dateStr])
    .filter(Boolean);

  const completeDays = monthRecords.filter((p) => p.status === 'complete').length;
  const partialDays = monthRecords.filter((p) => p.status === 'partial').length;
  const incompleteDays = monthRecords.filter((p) => p.status === 'incomplete').length;
  const totalRecorded = completeDays + partialDays + incompleteDays;

  const consistencyRate =
    totalRecorded > 0
      ? Math.round(((completeDays + partialDays * 0.5) / totalRecorded) * 100)
      : 0;

  // Selected Day Details
  const selectedDayPerformance = monthlyPerformance[selectedDate];
  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const selectedDayNum = !isNaN(selectedDateObj.getDate()) ? selectedDateObj.getDate() : 1;
  const selectedMonthName = !isNaN(selectedDateObj.getMonth())
    ? getMonthName(selectedDateObj.getMonth())
    : '';
  const isToday = selectedDate === getTodayDateString();

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    cycleDayStatus(dateStr);
  };

  const handleSetStatus = (status: 'complete' | 'partial' | 'incomplete' | null) => {
    setDayStatus(selectedDate, status);
  };

  const confirmClearMonth = () => {
    clearMonthData(currentYear, currentMonthIndex);
    setShowClearMonthModal(false);
  };

  const confirmResetApp = () => {
    clearAllData();
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Header */}
      <Header
        title="Resumo mensal"
        subtitle="Toque em qualquer dia para alterar seu status diretamente."
      />

      {/* Calendar Card */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        {/* Month Selector & Controls */}
        <div className="flex items-center justify-between px-1 mb-3">
          <button
            onClick={handlePrevMonth}
            title="Mês anterior"
            className="w-8 h-8 rounded-full bg-[#121E28] hover:bg-[#182936] text-[#299BFF] flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#F7F9FC]">
              {getMonthYearTitle(currentYear, currentMonthIndex)}
            </span>
            <button
              onClick={handleGoToToday}
              className="px-2 py-0.5 rounded-md bg-[#122332] text-[#299BFF] text-[10px] font-semibold hover:bg-[#183045] transition-colors"
            >
              Hoje
            </button>
          </div>

          <button
            onClick={handleNextMonth}
            title="Próximo mês"
            className="w-8 h-8 rounded-full bg-[#121E28] hover:bg-[#182936] text-[#299BFF] flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Action Bar for Month: Quick hint & Clear Month */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[rgba(120,160,190,0.08)] px-1 text-[11px] text-[#91A8C4]">
          <span className="flex items-center gap-1 text-[10.5px] text-[#91A8C4]">
            <Info className="w-3 h-3 text-[#299BFF]" />
            Toque no dia para alternar status
          </span>

          <button
            onClick={() => setShowClearMonthModal(true)}
            className="flex items-center gap-1 text-[10.5px] font-medium text-[#91A8C4] hover:text-[#FF5B64] transition-colors px-1.5 py-0.5 rounded hover:bg-[#152330]"
            title="Limpar todos os pontos deste mês"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar mês</span>
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center mb-2.5">
          {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((d) => (
            <span key={d} className="text-[10px] font-bold text-[#56687C]">
              {d}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2.5 text-center">
          {calendarDays.map((item, idx) => {
            const isCurrentMonth = item.month === 'curr';
            const isSelected = selectedDate === item.dateStr;
            const perf = monthlyPerformance[item.dateStr];
            const isCurrentToday = item.dateStr === getTodayDateString();

            return (
              <button
                key={idx}
                onClick={() => handleDayClick(item.dateStr)}
                className="flex flex-col items-center justify-center relative py-0.5 group focus:outline-none cursor-pointer"
                title={`${item.dateStr} - Toque para alternar status`}
              >
                {/* Number circle container */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all active:scale-90 ${
                    isSelected
                      ? 'border-2 border-[#299BFF] text-white shadow-md shadow-[#299BFF]/30 bg-[#12202E]'
                      : isCurrentToday
                      ? 'border border-[#24E4B4]/50 text-[#24E4B4] bg-[#0E1E1C]'
                      : isCurrentMonth
                      ? 'text-[#F7F9FC] hover:bg-[#121E28]'
                      : 'text-[#3E4F61] hover:bg-[#0E1720]'
                  }`}
                >
                  {item.day}
                </div>

                {/* Status Dot (Only shows if there is an authentic record) */}
                {perf ? (
                  <div
                    className={`w-2 h-2 rounded-full mt-1 transition-all shadow-sm ${
                      perf.status === 'complete'
                        ? 'bg-[#24E4B4] shadow-[#24E4B4]/50'
                        : perf.status === 'partial'
                        ? 'bg-[#299BFF] shadow-[#299BFF]/50'
                        : 'bg-[#FF5B64] shadow-[#FF5B64]/50'
                    }`}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full mt-1 bg-transparent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-[rgba(120,160,190,0.08)] text-[11px] text-[#91A8C4]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#24E4B4]" />
            <span>Completo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#299BFF]" />
            <span>Parcial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5B64]" />
            <span>Incompleto</span>
          </div>
        </div>
      </div>

      {/* Card 2: Resumo do mês dinâmico */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <h3 className="text-[14px] font-bold text-[#F7F9FC] mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-[#299BFF]" />
            Resumo de {getMonthName(currentMonthIndex)}
          </div>
          <span className="text-[11px] text-[#56687C] font-normal">
            {totalRecorded} {totalRecorded === 1 ? 'dia registrado' : 'dias registrados'}
          </span>
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Dias completos */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[92px]">
            <div className="w-6 h-6 rounded-full bg-[#24E4B4]/15 text-[#24E4B4] flex items-center justify-center mb-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[17px] font-extrabold text-[#F7F9FC]">
              {completeDays}
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight mt-0.5">
              Dias completos
            </span>
          </div>

          {/* Dias parciais */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[92px]">
            <div className="w-6 h-6 rounded-full bg-[#299BFF]/15 text-[#299BFF] flex items-center justify-center mb-1">
              <span className="w-3 h-3 rounded-full border-2 border-r-transparent border-[#299BFF]" />
            </div>
            <span className="text-[17px] font-extrabold text-[#F7F9FC]">
              {partialDays}
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight mt-0.5">
              Dias parciais
            </span>
          </div>

          {/* Dias incompletos */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[92px]">
            <div className="w-6 h-6 rounded-full bg-[#FF5B64]/15 text-[#FF5B64] flex items-center justify-center mb-1">
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[17px] font-extrabold text-[#F7F9FC]">
              {incompleteDays}
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight mt-0.5">
              Dias incompletos
            </span>
          </div>

          {/* Taxa de consistência */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-xl p-2.5 flex flex-col items-center justify-between min-h-[92px]">
            <div className="my-0.5">
              <ProgressRing
                progress={consistencyRate}
                size={26}
                strokeWidth={3}
                strokeColor="#24E4B4"
                trackColor="#162734"
              />
            </div>
            <span className="text-[17px] font-extrabold text-[#F7F9FC]">
              {consistencyRate}%
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight mt-0.5">
              Taxa de consistência
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Detalhe & Edição do dia selecionado */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[14.5px] font-bold text-[#F7F9FC]">
              Detalhe do dia selecionado
            </h3>
          </div>
          {isToday && (
            <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#24E4B4]/15 text-[#24E4B4] border border-[#24E4B4]/25">
              Hoje
            </span>
          )}
        </div>

        {/* Selected Day Header Display */}
        <div className="flex items-center gap-4 bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-2xl p-3.5 mb-3.5">
          <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-[rgba(120,160,190,0.1)] pr-3">
            <span className="text-[32px] font-extrabold text-[#F7F9FC] font-mono leading-none">
              {selectedDayNum}
            </span>
            <span className="text-[11px] text-[#91A8C4] mt-1 font-medium capitalize">
              de {selectedMonthName}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-[#91A8C4] block mb-1">Status atual:</span>
            {selectedDayPerformance ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  selectedDayPerformance.status === 'complete'
                    ? 'bg-[#24E4B4]/15 border border-[#24E4B4]/30 text-[#24E4B4]'
                    : selectedDayPerformance.status === 'partial'
                    ? 'bg-[#299BFF]/15 border border-[#299BFF]/30 text-[#299BFF]'
                    : 'bg-[#FF5B64]/15 border border-[#FF5B64]/30 text-[#FF5B64]'
                }`}
              >
                {selectedDayPerformance.status === 'complete' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {selectedDayPerformance.status === 'partial' && <span className="w-2 h-2 rounded-full bg-[#299BFF]" />}
                {selectedDayPerformance.status === 'incomplete' && <X className="w-3.5 h-3.5 stroke-[3]" />}
                {selectedDayPerformance.status === 'complete'
                  ? 'Completo'
                  : selectedDayPerformance.status === 'partial'
                  ? 'Parcial'
                  : 'Incompleto'}
              </span>
            ) : (
              <span className="inline-block text-xs text-[#56687C] italic">
                Nenhum registro marcado
              </span>
            )}
          </div>
        </div>

        {/* Direct Status Selector Buttons */}
        <div>
          <span className="text-[12px] font-semibold text-[#F7F9FC] block mb-2">
            Alterar status deste dia:
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleSetStatus('complete')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 flex flex-col items-center gap-1 ${
                selectedDayPerformance?.status === 'complete'
                  ? 'bg-[#24E4B4] text-[#05090D] border-[#24E4B4] shadow-md shadow-[#24E4B4]/25'
                  : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#24E4B4] hover:bg-[#122421]'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Completo</span>
            </button>

            <button
              onClick={() => handleSetStatus('partial')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 flex flex-col items-center gap-1 ${
                selectedDayPerformance?.status === 'partial'
                  ? 'bg-[#299BFF] text-white border-[#299BFF] shadow-md shadow-[#299BFF]/25'
                  : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#299BFF] hover:bg-[#112435]'
              }`}
            >
              <span className="w-3 h-3 rounded-full border-2 border-r-transparent border-current" />
              <span>Parcial</span>
            </button>

            <button
              onClick={() => handleSetStatus('incomplete')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 flex flex-col items-center gap-1 ${
                selectedDayPerformance?.status === 'incomplete'
                  ? 'bg-[#FF5B64] text-white border-[#FF5B64] shadow-md shadow-[#FF5B64]/25'
                  : 'bg-[#0D171F] border-[rgba(120,160,190,0.18)] text-[#FF5B64] hover:bg-[#2A1618]'
              }`}
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              <span>Incompleto</span>
            </button>

            <button
              onClick={() => handleSetStatus(null)}
              className="py-2 px-1 rounded-xl text-[11px] font-medium border border-[rgba(120,160,190,0.14)] bg-[#0D171F] text-[#91A8C4] hover:text-white hover:bg-[#152330] transition-all active:scale-95 flex flex-col items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 4: Botão Rápido para Reiniciar e Deixar Limpo */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">Reiniciar e limpar dados</h4>
          <p className="text-[11.5px] text-[#91A8C4] mt-0.5">
            Zere todas as tarefas, hábitos e calendário para começar limpo.
          </p>
        </div>
        <button
          onClick={() => setShowResetAppModal(true)}
          className="px-3 py-1.5 rounded-full border border-[#FF5B64]/40 text-[#FF5B64] hover:bg-[#FF5B64]/10 text-xs font-semibold shrink-0 transition-colors active:scale-95 ml-2"
        >
          Zerar tudo
        </button>
      </div>

      {/* Modal: Confirm Clear Month */}
      {showClearMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[340px] rounded-2xl bg-[#0B141B] border border-[rgba(120,160,190,0.2)] p-5 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#122332] text-[#299BFF] flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#F7F9FC] mb-1">
              Limpar mês de {getMonthName(currentMonthIndex)}?
            </h3>
            <p className="text-xs text-[#91A8C4] mb-5">
              Todos os registros e pontos deste mês serão removidos.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowClearMonthModal(false)}
                className="py-2.5 rounded-xl border border-[rgba(120,160,190,0.2)] text-xs font-semibold text-[#91A8C4] hover:bg-[#121E28]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmClearMonth}
                className="py-2.5 rounded-xl bg-[#299BFF] text-white text-xs font-bold hover:bg-[#2084db] shadow-md shadow-[#299BFF]/20"
              >
                Limpar mês
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Reset All App Data */}
      {showResetAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[340px] rounded-2xl bg-[#0B141B] border border-[#FF5B64]/30 p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#FF5B64]/15 text-[#FF5B64] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F7F9FC] mb-1">
              Reiniciar aplicativo?
            </h3>
            <p className="text-xs text-[#91A8C4] mb-5 leading-relaxed">
              O aplicativo ficará 100% limpo, zerando histórico do calendário, tarefas e hábitos para você começar do zero.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowResetAppModal(false)}
                className="py-2.5 rounded-xl border border-[rgba(120,160,190,0.2)] text-xs font-semibold text-[#91A8C4] hover:bg-[#121E28]"
              >
                Cancelar
              </button>
              <button
                onClick={confirmResetApp}
                className="py-2.5 rounded-xl bg-[#FF5B64] text-white text-xs font-bold hover:bg-[#e0454e] shadow-md shadow-[#FF5B64]/25"
              >
                Zerar tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
