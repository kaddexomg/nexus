import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, Loader2, Sparkles, X, Shield, Copy, ArrowRight, ExternalLink } from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onNewRecharge: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onNewRecharge,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  useEffect(() => {
    if (!order) return;
    setCurrentStep(1);

    // Step 1: Verificando Pago (0 -> 700ms)
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      sound.playClick();
    }, 800);

    // Step 2: Conectando con Servidor del Juego (700 -> 1600ms)
    const t2 = setTimeout(() => {
      setCurrentStep(3);
      sound.playClick();
    }, 1700);

    // Step 3: Diamantes Enviados (1600 -> 2400ms)
    const t3 = setTimeout(() => {
      setCurrentStep(4);
      sound.playSuccess();
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [order]);

  if (!order) return null;

  const steps = [
    {
      step: 1,
      title: 'Verificando Pago',
      desc: 'Conciliando referencia bancaria con pasarela...',
    },
    {
      step: 2,
      title: 'Conectando con Servidor',
      desc: `API Token Handshake con servidor de ${order.gameName}...`,
    },
    {
      step: 3,
      title: 'Diamantes Enviados',
      desc: `Inyección directa a UID: ${order.targetPlayerId}...`,
    },
    {
      step: 4,
      title: '¡Orden Completada!',
      desc: 'Entrega en 1.8s confirmada por webhook.',
    },
  ];

  const handleCopyReceipt = () => {
    sound.playClick();
    const receiptText = `NEXUS RECHARGE - COMPROBANTE OFICIAL\nOrden: ${order.id}\nJuego: ${order.gameName}\nNickname: ${order.verifiedNickname}\nUID: ${order.targetPlayerId}\nPaquete: ${order.packageName}\nMonto: Bs. ${order.amountBs.toFixed(2)} ($${order.amountUsdt.toFixed(2)} USDT)\nReferencia: ${order.paymentReference}\nEstado: COMPLETADO (100% Anti-Ban)`;
    navigator.clipboard.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#09090b]/85 backdrop-blur-md animate-fadeIn"
      id="order-tracking-modal-backdrop"
    >
      <div
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6"
        id="order-tracking-modal"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#34d399]/20 border border-[#34d399]/40 flex items-center justify-center text-[#34d399]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fafafa]">Rastreador de Despacho en Vivo</h3>
              <span className="text-[11px] text-[#a1a1aa] font-mono">
                Orden #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#a78bfa] font-bold">Progreso de Inyección:</span>
            <span className="text-[#34d399] font-bold">
              {currentStep === 1
                ? '25%'
                : currentStep === 2
                ? '50%'
                : currentStep === 3
                ? '75%'
                : '100% Completado'}
            </span>
          </div>

          <div className="w-full bg-[#1e1e22] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#27272a]">
            <div
              className="bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#34d399] h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  currentStep === 1
                    ? '25%'
                    : currentStep === 2
                    ? '50%'
                    : currentStep === 3
                    ? '75%'
                    : '100%',
              }}
            ></div>
          </div>
        </div>

        {/* 4 Steps Visual Timeline */}
        <div className="space-y-3 pt-1">
          {steps.map((s) => {
            const isFinished = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const isPending = currentStep < s.step;

            return (
              <div
                key={s.step}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isFinished
                    ? 'bg-[#065f46]/20 border-[#34d399]/30 text-[#fafafa]'
                    : isCurrent
                    ? 'bg-[#18181b] border-[#a78bfa] text-[#fafafa] ring-1 ring-[#a78bfa]'
                    : 'bg-[#0c0c0f] border-[#27272a]/70 text-[#71717a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isFinished
                        ? 'bg-[#34d399] text-[#09090b]'
                        : isCurrent
                        ? 'bg-[#a78bfa] text-[#09090b]'
                        : 'bg-[#1e1e22] text-[#71717a]'
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      s.step
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{s.title}</h4>
                    <p className="text-[11px] text-[#a1a1aa] leading-tight mt-0.5">{s.desc}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121215] border border-[#27272a] shrink-0">
                  {isFinished ? 'OK (0.4s)' : isCurrent ? 'En Proceso' : 'Pendiente'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Completion Digital Voucher Details */}
        {currentStep === 4 && (
          <div className="p-4 rounded-xl bg-[#18181b] border border-[#34d399]/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#34d399] font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Certificado Criptográfico Oficial</span>
              </div>
              <span className="text-[10px] text-[#a1a1aa] font-mono">100% Anti-Ban</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#a1a1aa] pt-1">
              <div>
                <span className="block text-[10px] text-[#71717a]">JUGADOR:</span>
                <span className="text-[#fafafa] font-bold">{order.verifiedNickname}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#71717a]">UID DESTINO:</span>
                <span className="text-[#fafafa]">{order.targetPlayerId}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#71717a]">PAQUETE:</span>
                <span className="text-[#a78bfa] font-bold">{order.packageName}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#71717a]">REFERENCIA:</span>
                <span className="text-[#34d399]">{order.paymentReference}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyReceipt}
              className="w-full py-2 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>{copiedReceipt ? '¡Comprobante Copiado al Portapapeles!' : 'Copiar Comprobante de Entrega'}</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-3 pt-2">
          {currentStep === 4 ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNewRecharge();
              }}
              className="flex-1 py-3 rounded-xl bg-[#a78bfa] text-[#09090b] font-bold text-xs tracking-wide shadow-md hover:bg-[#c4b5fd] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Hacer Otra Recarga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-full py-2.5 text-center text-xs text-[#a1a1aa] font-mono flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#a78bfa]" />
              <span>Inyectando datos vía Daemon v4.2...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
