import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { sound } from '../utils/audio';
import { CheckCircle2, Loader2, Sparkles, X, Shield, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

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

    // Step 1 -> 2: Verificando Pago (0 -> 900ms)
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      try { sound.playClick(); } catch (e) {}
    }, 900);

    // Step 2 -> 3: Conexión y Despacho (900 -> 1800ms)
    const t2 = setTimeout(() => {
      setCurrentStep(3);
      try { sound.playClick(); } catch (e) {}
    }, 1900);

    // Step 3 -> 4: Completado (1800 -> 2800ms)
    const t3 = setTimeout(() => {
      setCurrentStep(4);
      try { sound.playSuccess(); } catch (e) {}
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [order]);

  if (!order) return null;

  const isZinli = order.gameId === 'zinli';
  const isStreaming = order.gameId === 'netflix' || order.gameId === 'spotify';
  const isGiftCard = order.gameId === 'steam' || order.gameId === 'shein';

  const getSteps = () => {
    if (isZinli) {
      return [
        { step: 1, title: 'Verificando Pago', desc: 'Conciliando referencia bancaria con Pago Móvil BDV / Banesco...' },
        { step: 2, title: 'Conectando con Red Zinli', desc: 'Preparando transferencia P2P directa en USD (Panamá)...' },
        { step: 3, title: 'Dólares Transferidos', desc: `Envío P2P completado a: ${order.targetPlayerId} con 0% comisión.` },
        { step: 4, title: '¡Recarga Exitosa!', desc: 'Saldo acreditado en tu tarjeta Zinli. Comprobante generado.' },
      ];
    }
    if (isStreaming || isGiftCard) {
      return [
        { step: 1, title: 'Verificando Pago', desc: 'Conciliando referencia bancaria del pago...' },
        { step: 2, title: 'Generando Código Oficial', desc: `Emisión de PIN digital oficial de ${order.gameName}...` },
        { step: 3, title: 'Código Entregado', desc: `PIN enviado al correo: ${order.targetPlayerId}` },
        { step: 4, title: '¡Entrega Completada!', desc: 'Tu código está listo para ser canjeado de inmediato.' },
      ];
    }
    return [
      { step: 1, title: 'Verificando Pago', desc: 'Conciliando referencia bancaria de Pago Móvil / Binance...' },
      { step: 2, title: 'Conectando con Servidor', desc: `Conexión oficial con servidores de ${order.gameName}...` },
      { step: 3, title: 'Recarga Acreditada', desc: `Entrega directa a UID: ${order.targetPlayerId} (${order.verifiedNickname}).` },
      { step: 4, title: '¡Orden Completada!', desc: 'Monedas y beneficios acreditados con éxito en 1.8 segundos.' },
    ];
  };

  const steps = getSteps();

  const handleCopyReceipt = () => {
    try { sound.playClick(); } catch (e) {}
    const receiptText = `⚡ NEXUS RECHARGE — COMPROBANTE OFICIAL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🧾 Orden: #${order.id.toUpperCase()}\n🎮 Servicio: ${order.gameName}\n👤 Cuenta/Destino: ${order.targetPlayerId} (${order.verifiedNickname})\n📦 Paquete: ${order.packageName}\n💵 Monto: Bs. ${order.amountBs.toFixed(2)} ($${order.amountUsdt.toFixed(2)} USD)\n🏦 Referencia: ${order.paymentReference}\n⏱️ Despacho: Confirmado en 1.8s\n🛡️ Garantía: Recarga Oficial Verificada`;
    navigator.clipboard.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Hola, acabo de recargar ${order.packageName} de ${order.gameName} en Nexus Recharge.\nComprobante #${order.id.toUpperCase()} - Referencia: ${order.paymentReference}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      id="order-tracking-modal-backdrop"
    >
      <div
        className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
        id="order-tracking-modal"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-success)]/20 border border-[var(--color-success)]/40 flex items-center justify-center text-[var(--color-success)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Rastreador de Despacho en Vivo</h3>
              <span className="text-xs text-[var(--text-secondary)] font-mono">
                Orden #{order.id.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[var(--accent)] font-bold">Estado de Despacho:</span>
            <span className="text-[var(--color-success)] font-bold">
              {currentStep === 1
                ? '25% Verificando'
                : currentStep === 2
                ? '50% Conectando'
                : currentStep === 3
                ? '75% Despachando'
                : '100% Completado'}
            </span>
          </div>

          <div className="w-full bg-[var(--bg-elevated)] h-2 rounded-full overflow-hidden p-0.5 border border-[var(--border-default)]">
            <div
              className="bg-gradient-to-r from-[var(--accent)] to-[var(--color-success)] h-full rounded-full transition-all duration-700 ease-out"
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
            />
          </div>
        </div>

        {/* 4-Step Timeline */}
        <div className="space-y-3">
          {steps.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isCurrent
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--bg-surface)] border-[var(--border-default)] opacity-40'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[var(--border-default)] flex items-center justify-center text-[10px] text-[var(--text-muted)] font-mono">
                      {s.step}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm font-bold leading-tight ${
                      isCompleted ? 'text-emerald-300' : isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Receipt Card (when completed) */}
        {currentStep === 4 && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-default)]">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Comprobante Oficial de Entrega
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Ref: {order.paymentReference}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[var(--text-muted)] block">Producto:</span>
                <strong className="text-[var(--text-primary)]">{order.gameName}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Paquete:</span>
                <strong className="text-[var(--text-primary)]">{order.packageName}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Destino / Cuenta:</span>
                <strong className="text-[var(--text-primary)] truncate block">{order.targetPlayerId}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Monto Pagado:</span>
                <strong className="text-[var(--color-success)] font-mono">
                  Bs. {order.amountBs.toFixed(2)} (${order.amountUsdt.toFixed(2)} USD)
                </strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={handleCopyReceipt}
                className="flex-1 py-2 px-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] border border-[var(--border-default)] text-xs font-semibold text-[var(--text-primary)] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReceipt ? '¡Copiado!' : 'Copiar Comprobante'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex justify-between items-center">
          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              onClose();
            }}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Cerrar ventana
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              onNewRecharge();
            }}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Hacer otra recarga
          </button>
        </div>
      </div>
    </div>
  );
};
