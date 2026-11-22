import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'row' }> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'row' ? (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between py-3.5 px-4 bg-[#0D171F] hover:bg-[#12202B] active:scale-[0.99] rounded-[14px] border border-[rgba(120,160,190,0.14)] text-left transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#299BFF]/10 text-[#299BFF] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#F7F9FC]">Instalar Focus App</div>
              <div className="text-[12px] text-[#91A8C4]">Adicionar à tela inicial (PWA)</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#299BFF]/20 text-[#299BFF] border border-[#299BFF]/30">
            Instalar
          </span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          title="Instalar no celular / PWA"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D171F] border border-[rgba(120,160,190,0.18)] text-[11px] font-medium text-[#299BFF] hover:bg-[#13222E] transition-colors"
        >
          <Download className="w-3 h-3 text-[#299BFF]" />
          <span>Instalar</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[22px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-[#91A8C4] hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#299BFF]/15 text-[#299BFF] mx-auto flex items-center justify-center mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F7F9FC]">Instalar no iPhone / iPad</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#91A8C4] text-left space-y-2">
              <span className="block">1. No navegador Safari, toque no ícone de <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#299BFF]" /> na barra inferior.</span>
              <span className="block">2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#299BFF]" />.</span>
              <span className="block">3. Toque em <strong>Adicionar</strong> no canto superior direito.</span>
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#299BFF] hover:bg-[#1E88E5] py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};
