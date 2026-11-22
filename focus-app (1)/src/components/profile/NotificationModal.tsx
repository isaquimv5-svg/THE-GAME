import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  Smartphone,
  Share2,
  PlusSquare,
  Sparkles,
  Send,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  checkNotificationSupport,
  requestNotificationPermission,
  sendAppNotification,
  playNotificationChime,
  NotificationStatus,
} from '../../utils/notifications';

export const NotificationModal: React.FC = () => {
  const { isNotificationModalOpen, setIsNotificationModalOpen, profile, updateProfile } = useApp();

  const [status, setStatus] = useState<NotificationStatus>({
    isSupported: true,
    permission: 'default',
    isIOS: false,
    isStandalone: false,
  });

  const [testSent, setTestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'tutorial'>('config');

  useEffect(() => {
    if (isNotificationModalOpen) {
      const s = checkNotificationSupport();
      setStatus(s);
      setTestSent(false);
    }
  }, [isNotificationModalOpen]);

  if (!isNotificationModalOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    const updated = checkNotificationSupport();
    setStatus({ ...updated, permission: perm });
    if (perm === 'granted') {
      updateProfile({ notificationsEnabled: true });
      await sendAppNotification(
        '🔔 Focus App Ativado!',
        'As notificações foram configuradas com sucesso no seu dispositivo.'
      );
      setTestSent(true);
    }
  };

  const handleSendTest = async () => {
    playNotificationChime();
    const success = await sendAppNotification(
      '🎯 Lembrete Focus App',
      'Hora de focar no seu objetivo diário! Mantenha a consistência hoje.'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
    if (!success && status.permission !== 'granted') {
      // Prompt user to enable
      handleRequestPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-[24px] bg-[#0B141B] border border-[rgba(120,160,190,0.18)] p-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsNotificationModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#121E28] flex items-center justify-center text-[#91A8C4] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3 text-[#299BFF]">
          <div className="w-8 h-8 rounded-xl bg-[#299BFF]/15 flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#299BFF]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#F7F9FC]">Notificações no Celular</h2>
            <p className="text-[11px] text-[#91A8C4]">iPhone (iOS 16.4+) e Dispositivos Móveis</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#071017] rounded-xl border border-[rgba(120,160,190,0.1)] mb-3.5">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-[#299BFF] text-white shadow-sm'
                : 'text-[#91A8C4] hover:text-white'
            }`}
          >
            Configurar & Testar
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tutorial'
                ? 'bg-[#299BFF] text-white shadow-sm'
                : 'text-[#91A8C4] hover:text-white'
            }`}
          >
            Como Funciona no iOS
          </button>
        </div>

        {activeTab === 'config' ? (
          <div className="space-y-3.5">
            {/* Status card */}
            <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.12)] rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#91A8C4] font-medium">Status no Sistema</span>
                {status.permission === 'granted' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#24E4B4]/15 text-[#24E4B4] border border-[#24E4B4]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Autorizadas
                  </span>
                ) : status.permission === 'denied' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30">
                    <ShieldAlert className="w-3 h-3" />
                    Bloqueadas no iOS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5B83D]/15 text-[#F5B83D] border border-[#F5B83D]/30">
                    <AlertCircle className="w-3 h-3" />
                    Pendente
                  </span>
                )}
              </div>

              {/* iOS Standalone Check */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(120,160,190,0.08)]">
                <span className="text-xs text-[#91A8C4]">Modo Tela Inicial (PWA)</span>
                {status.isStandalone ? (
                  <span className="text-[11px] font-semibold text-[#24E4B4]">Ativo (Ícone Inicial)</span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#91A8C4]">Aberto no Navegador</span>
                )}
              </div>
            </div>

            {/* iOS Important note */}
            {status.permission !== 'granted' && (
              <div className="bg-[#121E28]/60 border border-[#299BFF]/30 rounded-2xl p-3 text-left">
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#299BFF] shrink-0 mt-0.5" />
                  <div className="text-[11.5px] leading-relaxed text-[#91A8C4]">
                    <strong className="text-[#F7F9FC] block mb-0.5">Regra da Apple no iPhone:</strong>
                    Para notificações funcionarem com banner, você precisa adicionar o Focus à <strong className="text-white">Tela de Início pelo Safari</strong> e tocar no botão abaixo para autorizar.
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              {status.permission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#299BFF] hover:bg-[#1E88E5] active:scale-[0.98] text-sm font-bold text-white shadow-lg transition-all"
                >
                  <Bell className="w-4 h-4" />
                  Ativar Notificações no Celular
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#24E4B4] hover:bg-[#1fcf9e] active:scale-[0.98] text-sm font-bold text-[#05090D] shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  Testar Notificação Agora
                </button>
              )}

              <button
                type="button"
                onClick={handleSendTest}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0D171F] hover:bg-[#13222E] border border-[rgba(120,160,190,0.18)] text-xs font-semibold text-[#91A8C4] hover:text-white transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#299BFF]" />
                Testar Som e Chime de Foco
              </button>
            </div>

            {testSent && (
              <div className="p-2.5 bg-[#24E4B4]/10 border border-[#24E4B4]/30 rounded-xl text-center text-xs text-[#24E4B4] animate-in fade-in">
                🔔 Notificação disparada com sucesso! Verifique a barra de notificações.
              </div>
            )}

            {/* Preferences Switches */}
            <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.12)] rounded-2xl p-3.5 space-y-3 text-left">
              <h4 className="text-xs font-bold text-[#F7F9FC] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#299BFF]" />
                Lembretes Automáticos
              </h4>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12.5px] font-medium text-[#F7F9FC]">Lembrete Matinal</div>
                  <div className="text-[11px] text-[#91A8C4]">
                    {profile.morningRoutine || 'Rotina e 3 tarefas prioritárias'}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#299BFF]">08:00</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(120,160,190,0.06)]">
                <div>
                  <div className="text-[12.5px] font-medium text-[#F7F9FC]">Revisão Noturna</div>
                  <div className="text-[11px] text-[#91A8C4]">Registrar desempenho do dia</div>
                </div>
                <span className="text-xs font-bold text-[#299BFF]">
                  {profile.bedtime || '21:30'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Tutorial Tab: Direct answer about iPhone, Safari vs Google, App closed */
          <div className="space-y-3 text-left">
            {/* Crucial clarification 1: Safari vs Google Chrome */}
            <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.15)] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#F5B83D]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-[13px] font-bold text-[#F7F9FC]">
                  Atenção: Adicionar pelo Safari, não pelo Google
                </h4>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#91A8C4]">
                Você mencionou que adicionaria aos favoritos pelo Google. No iPhone, se você só salvar nos favoritos do Google Chrome, a Apple <strong className="text-white">não libera notificações</strong>.
              </p>
              <div className="bg-[#071017] p-2.5 rounded-xl border border-[rgba(120,160,190,0.08)] text-[11px] text-[#91A8C4] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#F7F9FC]">
                  <span className="w-4 h-4 rounded-full bg-[#299BFF] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Abra o link no navegador <strong>Safari</strong> do iPhone.
                </div>
                <div className="flex items-center gap-1.5 text-[#F7F9FC]">
                  <span className="w-4 h-4 rounded-full bg-[#299BFF] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Toque em <strong>Compartilhar</strong> <Share2 className="w-3 h-3 text-[#299BFF]" /> e em <strong>Adicionar à Tela de Início</strong> <PlusSquare className="w-3 h-3 text-[#299BFF]" />.
                </div>
                <div className="flex items-center gap-1.5 text-[#F7F9FC]">
                  <span className="w-4 h-4 rounded-full bg-[#299BFF] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Abra pelo ícone na tela do iPhone e toque em <strong>Ativar Notificações</strong>.
                </div>
              </div>
            </div>

            {/* Crucial clarification 2: App closed on iPhone */}
            <div className="bg-[#0D171F] border border-[rgba(120,160,190,0.15)] rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#299BFF]">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-[13px] font-bold text-[#F7F9FC]">
                  E com o app 100% FECHADO, chega?
                </h4>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#91A8C4]">
                No iPhone, quando você encerra um app completamente (arrasta para cima para fechar), o iOS <strong className="text-white">congela todos os scripts internos</strong> para economizar bateria.
              </p>
              <p className="text-[11.5px] leading-relaxed text-[#91A8C4]">
                Para um app web tocar na tela de bloqueio com o app fechado, a Apple exige envio via <strong className="text-white">Web Push da Apple (APNs)</strong> através de um servidor na nuvem.
              </p>
            </div>

            {/* Pro Tip: iPhone Shortcuts Automation */}
            <div className="bg-[#121E28]/70 border border-[#24E4B4]/30 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#24E4B4]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <h4 className="text-[13px] font-bold text-[#F7F9FC]">
                  Dica de Ouro no iPhone (Atalhos do iOS)
                </h4>
              </div>
              <p className="text-[11.5px] leading-relaxed text-[#91A8C4]">
                Se você quiser que o iPhone te lembre todo dia sem depender de servidor externo:
              </p>
              <ol className="text-[11px] text-[#91A8C4] list-decimal list-inside space-y-1">
                <li>Abra o aplicativo nativo <strong>Atalhos (Shortcuts)</strong> do seu iPhone.</li>
                <li>Toque na aba <strong>Automação</strong> &gt; <strong>Criar Automação Pessoal</strong>.</li>
                <li>Escolha <strong>Hora do Dia</strong> (ex: 08:00 todo dia).</li>
                <li>Adicione a ação: <strong>Abrir App &gt; Focus</strong>.</li>
              </ol>
              <p className="text-[10.5px] text-[#24E4B4] font-medium mt-1">
                Com isso, todo dia no horário escolhido o iPhone abre o Focus automaticamente na sua tela!
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsNotificationModalOpen(false)}
          className="mt-4 w-full rounded-xl bg-[#121E28] hover:bg-[#162734] py-2.5 text-xs font-semibold text-[#91A8C4] hover:text-white transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
