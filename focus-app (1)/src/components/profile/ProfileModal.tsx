import React, { useState, useEffect, useRef } from 'react';
import { X, User, Check, RotateCcw, Camera, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_AVATAR } from '../../utils/storage';
import { processAvatarImage } from '../../utils/image';

export const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, profile, updateProfile, resetAllData } = useApp();

  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [quote, setQuote] = useState(profile.quote);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);
  const [morningRoutine, setMorningRoutine] = useState(profile.morningRoutine);
  const [bedtime, setBedtime] = useState(profile.bedtime);
  const [notifications, setNotifications] = useState(profile.notificationsEnabled);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setAvatarUrl(profile.avatarUrl);
    setQuote(profile.quote);
    setDailyGoal(profile.dailyGoal);
    setMorningRoutine(profile.morningRoutine);
    setBedtime(profile.bedtime);
    setNotifications(profile.notificationsEnabled);
    setImageError(null);
  }, [profile, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      setImageError(null);
      const processedDataUrl = await processAvatarImage(file, 360);
      setAvatarUrl(processedDataUrl);
      // Immediately save avatar so the app updates in real-time
      updateProfile({ avatarUrl: processedDataUrl });
    } catch (err: any) {
      console.error('Erro ao processar foto:', err);
      setImageError(err.message || 'Não foi possível carregar a imagem da galeria.');
    } finally {
      setIsProcessingImage(false);
      // Reset input value so user can pick the same file again if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetToDefaultAvatar = () => {
    setAvatarUrl(DEFAULT_AVATAR);
    updateProfile({ avatarUrl: DEFAULT_AVATAR });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      avatarUrl,
      quote,
      dailyGoal,
      morningRoutine,
      bedtime,
      notificationsEnabled: notifications,
    });
    setIsProfileModalOpen(false);
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    resetAllData();
    setShowConfirmReset(false);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-[#299BFF]">
          <User className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#F7F9FC]">Editar Perfil</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Edit Section */}
          <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.14)] rounded-2xl p-3.5 flex flex-col items-center text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="relative mb-3">
              <div
                onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden bg-[#071017] border-2 border-[#299BFF]/60 cursor-pointer group shadow-lg flex items-center justify-center relative"
                title="Toque para trocar a foto"
              >
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {isProcessingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#299BFF] animate-spin" />
                  </div>
                )}
                {!isProcessingImage && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white drop-shadow" />
                  </div>
                )}
              </div>

              {/* Camera badge button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#299BFF] hover:bg-[#1E88E5] text-white flex items-center justify-center shadow-md border-2 border-[#0B141B] transition-transform active:scale-90"
                title="Trocar foto da galeria"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className="px-3 py-1.5 rounded-xl bg-[#1C588A]/30 hover:bg-[#1C588A]/50 text-[#299BFF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{isProcessingImage ? 'Carregando...' : 'Trocar da galeria'}</span>
              </button>

              {avatarUrl !== DEFAULT_AVATAR && (
                <button
                  type="button"
                  onClick={handleResetToDefaultAvatar}
                  disabled={isProcessingImage}
                  className="px-2.5 py-1.5 rounded-xl bg-[#121A22] hover:bg-[#18232E] text-[#91A8C4] hover:text-[#F7F9FC] text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Restaurar foto padrão"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Padrão</span>
                </button>
              )}
            </div>

            {imageError && (
              <p className="text-[11px] text-[#FF5B64] mt-2">{imageError}</p>
            )}
            <p className="text-[10.5px] text-[#91A8C4] mt-2">
              Toque para selecionar qualquer foto da galeria do seu celular.
            </p>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">Seu Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-sm text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">Frase de Lema / Inspiração</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">Objetivo diário padrão</label>
            <input
              type="text"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">Rotina matinal</label>
            <input
              type="text"
              value={morningRoutine}
              onChange={(e) => setMorningRoutine(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#91A8C4] block mb-1">Horário de dormir ideal</label>
            <input
              type="text"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] rounded-xl px-3 py-2 text-xs text-[#F7F9FC] focus:outline-none focus:border-[#299BFF]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#91A8C4]">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-[rgba(120,160,190,0.3)] text-[#299BFF] bg-[#0D171F] focus:ring-0"
              />
              <span>Ativar lembretes de hábitos e foco</span>
            </label>
          </div>

          <div className="pt-3 space-y-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#299BFF] hover:bg-[#1E88E5] text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#299BFF]/20"
            >
              <Check className="w-4 h-4" />
              Salvar Perfil
            </button>

            {showConfirmReset ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 h-10 rounded-xl bg-[#FF453A] hover:bg-[#D9382E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Confirmar Zerar
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 h-10 rounded-xl bg-[#121A22] text-[#91A8C4] text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full h-10 rounded-xl bg-[#121A22] hover:bg-[#18232E] text-[#91A8C4] text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-[rgba(120,160,190,0.12)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Dados Iniciais
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
