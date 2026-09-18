import React, { useState } from 'react';
import { Game, GamePackage, PaymentMethodType, PlayerVerification } from '../types';
import { sound } from '../utils/audio';
import { Copy, Check, X, QrCode, ArrowRight, UploadCloud, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  } | null;
  onSubmitOrder: (referenceNumber: string, receiptNote?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onSubmitOrder,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [mockReceiptName, setMockReceiptName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !orderData) return null;

  const { game, pkg, playerVerification, paymentMethod } = orderData;

  const handleCopy = (text: string, key: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSimulateDropReceipt = () => {
    sound.playClick();
    setMockReceiptName(`comprobante_banco_${Math.floor(Math.random() * 89999 + 10000)}.jpg`);
    if (!referenceNumber) {
      setReferenceNumber(String(Math.floor(Math.random() * 899999 + 100000)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod !== 'wallet' && !referenceNumber.trim()) {
      sound.playAlert();
      setErrorMsg('Por favor ingresa el número de referencia bancaria.');
      return;
    }

    sound.playClick();
    onSubmitOrder(referenceNumber || 'WALLET-AUTOPAY', mockReceiptName || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#09090b]/85 backdrop-blur-md animate-fadeIn"
      id="payment-modal-backdrop"
    >
      <div
        className="relative w-full max-w-lg p-5 sm:p-8 rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6 max-h-[92vh] overflow-y-auto"
        id="payment-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#7c3aed] text-[#ede9fe] flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#fafafa]">Datos de Liquidación Rápida</h3>
              <span className="text-[11px] text-[#a1a1aa]">
                {paymentMethod === 'pagomovil'
                  ? 'Pago Móvil BDV / Interbancario'
                  : paymentMethod === 'binance'
                  ? 'Binance Pay USDT (Red BSC / Pay ID)'
                  : paymentMethod === 'banesco'
                  ? 'Transferencia Bancaria Nacional'
                  : 'Billetera Virtual Nexus'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] transition-all cursor-pointer"
            id="close-pay-modal-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Preview Strip */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold tracking-wider">Destinatario / Cuenta</span>
            <span className="text-[var(--text-primary)] font-bold">
              {game.name} • {playerVerification.nickname}
            </span>
            <span className="text-[var(--text-secondary)] text-[10px] block">ID: {playerVerification.uid}</span>
          </div>
          <div className="text-right">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold tracking-wider">Paquete</span>
            <span className="text-[var(--accent)] font-bold">{pkg.name}</span>
            <span className="text-[var(--color-success)] text-[10px] block font-medium">Recarga Oficial 100%</span>
          </div>
        </div>

        {/* Datos Bancarios Copy-Paste */}
        {paymentMethod === 'pagomovil' && (
          <div className="space-y-2 p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a] font-mono text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Banco Receptor:</span>
              <span className="text-[#fafafa] font-semibold">0102 - Banco de Venezuela</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Teléfono:</span>
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-bold">04128941092</span>
                <button
                  type="button"
                  onClick={() => handleCopy('04128941092', 'phone')}
                  className="p-1 text-[#a78bfa] hover:text-[#fafafa] transition-all cursor-pointer"
                  title="Copiar Teléfono"
                >
                  {copiedKey === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Cédula / RIF:</span>
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-bold">V-28491820</span>
                <button
                  type="button"
                  onClick={() => handleCopy('28491820', 'id')}
                  className="p-1 text-[#a78bfa] hover:text-[#fafafa] transition-all cursor-pointer"
                  title="Copiar Cédula"
                >
                  {copiedKey === 'id' ? (
                    <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-[#a78bfa] font-bold">
              <span>Monto exacto en Bolívares:</span>
              <span className="text-sm sm:text-base font-mono">Bs. {pkg.priceBs.toFixed(2)}</span>
            </div>
          </div>
        )}

        {paymentMethod === 'binance' && (
          <div className="space-y-2 p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a] font-mono text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Binance Pay ID:</span>
              <div className="flex items-center gap-2">
                <span className="text-[#34d399] font-bold text-sm">92841029</span>
                <button
                  type="button"
                  onClick={() => handleCopy('92841029', 'binance')}
                  className="p-1 text-[#34d399] hover:text-[#fafafa] transition-all cursor-pointer"
                  title="Copiar Binance ID"
                >
                  {copiedKey === 'binance' ? (
                    <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Nombre del Merchant:</span>
              <span className="text-[#fafafa] font-semibold">NexusRecharge_Official</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-[#34d399] font-bold">
              <span>Monto exacto en USDT:</span>
              <span className="text-sm sm:text-base font-mono">${pkg.priceUsdt.toFixed(2)} USDT</span>
            </div>
          </div>
        )}

        {paymentMethod === 'banesco' && (
          <div className="space-y-2 p-4 rounded-xl bg-[#0c0c0f] border border-[#27272a] font-mono text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Banesco Cuenta Corriente:</span>
              <div className="flex items-center gap-2">
                <span className="text-[#fafafa] font-bold truncate max-w-[150px]">
                  0134-0941-8201-9284-1029
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('01340941820192841029', 'banesco')}
                  className="p-1 text-[#a78bfa] hover:text-[#fafafa] transition-all cursor-pointer"
                >
                  {copiedKey === 'banesco' ? (
                    <Check className="w-3.5 h-3.5 text-[#34d399]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#1e1e22]">
              <span className="text-[#a1a1aa]">Titular / RIF:</span>
              <span className="text-[#fafafa] font-semibold">Nexus Recharge C.A. (J-50192841-0)</span>
            </div>

            <div className="flex justify-between items-center pt-2 text-[#a78bfa] font-bold">
              <span>Monto exacto:</span>
              <span className="text-sm sm:text-base font-mono">Bs. {pkg.priceBs.toFixed(2)}</span>
            </div>
          </div>
        )}

        {paymentMethod === 'wallet' && (
          <div className="p-4 rounded-xl bg-[#065f46]/20 border border-[#34d399]/30 text-xs text-[#fafafa] space-y-2">
            <div className="flex items-center gap-2 text-[#34d399] font-bold">
              <Check className="w-4 h-4" />
              <span>Saldo de Billetera Virtual Disponible</span>
            </div>
            <p className="text-[#a1a1aa] leading-relaxed">
              El pago se descontará de forma instantánea sin esperas bancarias. Tu saldo se actualizará y el bot iniciará la inyección en milisegundos.
            </p>
          </div>
        )}

        {/* Formulario para ingresar referencia / comprobante */}
        <form onSubmit={handleSubmit} className="space-y-4" id="payment-confirm-form">
          {paymentMethod !== 'wallet' && (
            <div>
              <label className="block text-xs font-medium text-[#fafafa] mb-1.5 flex justify-between">
                <span>Número de Referencia Bancaria (Últimos 6 a 8 dígitos)</span>
                <span className="text-[#a1a1aa] text-[10px]">Autoverificable</span>
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => {
                  setReferenceNumber(e.target.value);
                  setErrorMsg(null);
                }}
                maxLength={8}
                placeholder="Ej: 940182"
                className="w-full px-3.5 py-3 rounded-xl bg-[#1e1e22] border border-[#27272a] text-xs font-mono text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#a78bfa]"
                required
                id="ref-input-field"
              />
            </div>
          )}

          {/* Screenshot Drop Area Simulator */}
          {paymentMethod !== 'wallet' && (
            <div>
              <div
                onClick={handleSimulateDropReceipt}
                className="p-3.5 rounded-xl border border-dashed border-[#3f3f46] hover:border-[#a78bfa] bg-[#0c0c0f] flex items-center justify-between cursor-pointer transition-all"
                title="Adjuntar captura o comprobante"
              >
                <div className="flex items-center gap-2.5 text-xs text-[#a1a1aa]">
                  <UploadCloud className="w-4 h-4 text-[#a78bfa]" />
                  <span className="truncate max-w-[220px]">
                    {mockReceiptName ? mockReceiptName : 'Adjuntar captura de pago (opcional)'}
                  </span>
                </div>
                <span className="text-[10px] bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded text-[#a78bfa] shrink-0 font-medium">
                  {mockReceiptName ? 'Cargado ✓' : 'Examinar'}
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center gap-2 text-xs text-[#ef4444]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] font-extrabold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            id="btn-submit-ref"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Pago y Despachar Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
