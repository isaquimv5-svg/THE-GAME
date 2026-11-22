import React, { useState, useRef } from 'react';
import {
  BarChart2,
  Target,
  Lightbulb,
  Settings,
  Check,
  Flame,
  Clock,
  ChevronRight,
  ArrowLeftRight,
  Calendar,
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  Crosshair,
  AlertTriangle,
  RotateCcw,
  Camera,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProgressRing } from '../common/ProgressRing';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { processAvatarImage } from '../../utils/image';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    weeklyCompletedTasksCount,
    todayCompletedTasksCount,
    todayTotalTasksCount,
    todayProgressPercentage,
    setIsProfileModalOpen,
    setIsNotificationModalOpen,
    setIsFocusModalOpen,
    clearAllData,
  } = useApp();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setPhotoMessage(null);
      const dataUrl = await processAvatarImage(file, 360);
      updateProfile({ avatarUrl: dataUrl });
      setPhotoMessage('Foto de perfil atualizada com sucesso!');
      setTimeout(() => setPhotoMessage(null), 3500);
    } catch (err: any) {
      console.error('Erro ao enviar foto:', err);
      setPhotoMessage(err.message || 'Erro ao carregar foto da galeria.');
      setTimeout(() => setPhotoMessage(null), 4000);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3.5 pb-24">
      {/* Hidden file input for gallery photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Toast / Feedback Message */}
      {photoMessage && (
        <div className="rounded-xl bg-[#0E2232] border border-[#299BFF]/40 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-[#F7F9FC] shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#24E4B4] shrink-0" />
          <span className="font-medium">{photoMessage}</span>
        </div>
      )}

      {/* Hero: User Profile Header */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0 pr-2">
          {/* Avatar circle with direct camera button */}
          <div
            onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
            className="relative cursor-pointer group shrink-0"
            title="Toque para trocar sua foto pela galeria"
          >
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#071017] border-2 border-[#122332] group-hover:border-[#299BFF]/70 transition-colors flex items-center justify-center relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#299BFF] animate-spin" />
                </div>
              )}
            </div>

            {/* Camera badge */}
            <button
              type="button"
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#299BFF] hover:bg-[#1E88E5] text-white flex items-center justify-center shadow-md border-2 border-[#0B141B] transition-transform active:scale-90"
              title="Trocar foto da galeria"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="min-w-0">
            <h2 className="text-[20px] font-bold text-[#F7F9FC] tracking-tight">
              {profile.name}
            </h2>
            <div className="flex items-start gap-1 text-[12px] text-[#91A8C4] mt-1 italic">
              <span className="text-[#299BFF] font-serif not-italic">“</span>
              <p className="line-clamp-2">{profile.quote}</p>
              <span className="text-[#299BFF] font-serif not-italic">”</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-3.5 py-1.5 rounded-full border border-[#1C588A] text-[#299BFF] hover:bg-[#299BFF]/10 text-xs font-semibold shrink-0 transition-colors active:scale-95"
        >
          Editar perfil
        </button>
      </div>

      {/* Card 1: Desempenho da semana */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[14.5px] font-bold text-[#F7F9FC]">
              Desempenho da semana
            </h3>
          </div>
          <button
            onClick={() => {}}
            className="flex items-center gap-0.5 text-xs text-[#299BFF] hover:underline font-medium"
          >
            <span>Ver mais</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Tarefas concluídas */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[105px]">
            <div className="w-7 h-7 rounded-full bg-[#24E4B4]/15 text-[#24E4B4] flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-[18px] font-extrabold text-[#F7F9FC]">
              {weeklyCompletedTasksCount}
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight">
              tarefas concluídas
            </span>
          </div>

          {/* Consistência */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[105px]">
            <div className="my-0.5">
              <ProgressRing
                progress={86}
                size={30}
                strokeWidth={3.5}
                strokeColor="#299BFF"
                trackColor="#162734"
              />
            </div>
            <span className="text-[18px] font-extrabold text-[#F7F9FC]">
              86%
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight">
              consistência
            </span>
          </div>

          {/* Dias seguidos */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[105px]">
            <div className="w-7 h-7 rounded-full bg-[#F5B83D]/15 text-[#F5B83D] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#F5B83D]" />
            </div>
            <span className="text-[18px] font-extrabold text-[#F7F9FC]">
              {profile.streakDays}
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight">
              dias seguidos
            </span>
          </div>

          {/* De foco */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.1)] rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[105px]">
            <div className="w-7 h-7 rounded-full bg-[#299BFF]/15 text-[#299BFF] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[18px] font-extrabold text-[#F7F9FC]">
              {Math.round(profile.focusHoursWeekly)}h
            </span>
            <span className="text-[9.5px] text-[#91A8C4] leading-tight">
              de foco
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Seu avanço */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[14.5px] font-bold text-[#F7F9FC]">
              Seu avanço
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#91A8C4] font-medium">
            <span>
              {todayCompletedTasksCount} de {todayTotalTasksCount} tarefas
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#56687C]" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#10202B] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#299BFF] transition-all duration-500 ease-out"
            style={{ width: `${todayProgressPercentage}%` }}
          />
        </div>

        <span className="text-[12px] text-[#91A8C4] mt-2 block font-medium">
          {todayProgressPercentage}% concluído
        </span>
      </div>

      {/* Card 3: Insights */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#299BFF]" />
            <h3 className="text-[14.5px] font-bold text-[#F7F9FC]">
              Insights
            </h3>
          </div>
          <button className="flex items-center gap-0.5 text-xs text-[#299BFF] hover:underline font-medium">
            <span>Ver mais</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Row 1 */}
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Reduza a troca de contexto
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  Mantenha o foco em uma tarefa por vez.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Prepare o dia seguinte à noite
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  Comece amanhã com mais clareza.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#112435] text-[#299BFF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Proteja seus horários de foco
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  Seu tempo de foco é valioso.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>
        </div>
      </div>

      {/* Card 4: Preferências */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3.5">
          <Settings className="w-4 h-4 text-[#299BFF]" />
          <h3 className="text-[14.5px] font-bold text-[#F7F9FC]">
            Preferências
          </h3>
        </div>

        <div className="space-y-3">
          {/* Foto de perfil */}
          <div
            onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121E28] text-[#24E4B4] flex items-center justify-center shrink-0">
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 text-[#24E4B4] animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC] flex items-center gap-1.5">
                  Foto de perfil
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#24E4B4]/15 text-[#24E4B4] border border-[#24E4B4]/25">
                    Galeria
                  </span>
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  {isUploadingPhoto ? 'Processando imagem...' : 'Toque para escolher da galeria do celular.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-[#24E4B4]/40 shrink-0">
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
            </div>
          </div>

          {/* Notificações */}
          <div
            onClick={() => setIsNotificationModalOpen(true)}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121E28] text-[#299BFF] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC] flex items-center gap-1.5">
                  Notificações
                  <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-[#299BFF]/15 text-[#299BFF] border border-[#299BFF]/25">
                    iOS / Celular
                  </span>
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  {profile.notificationsEnabled ? 'Ativadas para hábitos e rotinas.' : 'Toque para configurar e testar no celular.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>

          {/* Rotina matinal */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121E28] text-[#F5B83D] flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Rotina matinal
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  {profile.morningRoutine || 'Personalize sua rotina.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>

          {/* Horário de dormir */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121E28] text-[#6BAEFF] flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Horário de dormir
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  {profile.bedtime || 'Defina seu horário ideal.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>

          {/* Modo foco */}
          <div
            onClick={() => setIsFocusModalOpen(true)}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121E28] text-[#299BFF] flex items-center justify-center shrink-0">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#F7F9FC]">
                  Modo foco
                </h4>
                <p className="text-[11.5px] text-[#91A8C4]">
                  Sessões de {profile.focusSessionDuration} min. Toque para iniciar.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#44596F] group-hover:text-[#91A8C4] transition-colors" />
          </div>
        </div>

        {/* PWA Install Button row */}
        <div className="mt-4 pt-3 border-t border-[rgba(120,160,190,0.08)]">
          <PWAInstallButton variant="row" />
        </div>
      </div>

      {/* Card 5: Gerenciamento e Limpeza Geral */}
      <div className="rounded-[20px] bg-[#0B141B] border border-[rgba(120,160,190,0.14)] p-4 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-[13.5px] font-bold text-[#F7F9FC]">Reiniciar aplicativo</h4>
          <p className="text-[11.5px] text-[#91A8C4] mt-0.5">
            Zere todas as tarefas e histórico para começar 100% limpo.
          </p>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="px-3.5 py-1.5 rounded-full border border-[#FF5B64]/40 text-[#FF5B64] hover:bg-[#FF5B64]/10 text-xs font-semibold shrink-0 transition-colors active:scale-95 ml-2"
        >
          Zerar tudo
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[340px] rounded-2xl bg-[#0B141B] border border-[#FF5B64]/30 p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#FF5B64]/15 text-[#FF5B64] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-[#F7F9FC] mb-1">
              Reiniciar e limpar aplicativo?
            </h3>
            <p className="text-xs text-[#91A8C4] mb-5 leading-relaxed">
              Esta ação deixará seu aplicativo 100% zerado (tarefas, hábitos e histórico mensal limpos) para você começar do zero real.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowResetModal(false)}
                className="py-2.5 rounded-xl border border-[rgba(120,160,190,0.2)] text-xs font-semibold text-[#91A8C4] hover:bg-[#121E28]"
              >
                Cancelar
              </button>
              <button
                onClick={() => clearAllData()}
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
