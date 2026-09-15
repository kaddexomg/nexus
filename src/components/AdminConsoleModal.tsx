import React, { useState } from 'react';
import { Order } from '../types';
import { sound } from '../utils/audio';
import { Smartphone, Check, X, AlertOctagon, ShieldAlert, DollarSign, BellRing, RefreshCw } from 'lucide-react';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingOrders: Order[];
  onApproveOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  isKillSwitchActive: boolean;
  onToggleKillSwitch: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  pendingOrders,
  onApproveOrder,
  onRejectOrder,
  isKillSwitchActive,
  onToggleKillSwitch,
}) => {
  const [rejectReason, setRejectReason] = useState<string>('Referencia bancaria no encontrada en BDV');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09090b]/90 backdrop-blur-md animate-fadeIn"
      id="admin-console-modal"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-8 rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1e1e22] border border-[#3f3f46] flex items-center justify-center text-[#34d399]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#fafafa]">Consola Operador Móvil / PWA</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#065f46] text-[#bbf7d0] text-[10px] font-bold font-mono">
                  Online
                </span>
              </div>
              <span className="text-[11px] text-[#a1a1aa]">
                Control de caja en tiempo real, conciliación y parada de emergencia (Kill-Switch)
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

        {/* Live Cash Registers Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
            <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">BDV / Pago Móvil</span>
            <span className="text-lg font-bold text-[#fafafa] font-mono mt-1 block">Bs. 38,420.00</span>
            <span className="text-[10px] text-[#34d399] font-mono">14 órdenes hoy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
            <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">Binance Merchant</span>
            <span className="text-lg font-bold text-[#34d399] font-mono mt-1 block">$614.72 USDT</span>
            <span className="text-[10px] text-[#a1a1aa] font-mono">Zero fee liquidado</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0c0f] border border-[#27272a]">
            <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">Ganancia Neta Estimada</span>
            <span className="text-lg font-bold text-[#a78bfa] font-mono mt-1 block">$82.40 USD</span>
            <span className="text-[10px] text-[#a78bfa] font-mono">+18.5% vs ayer</span>
          </div>
        </div>

        {/* KILL-SWITCH EMERGENCY STOP BANNER */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            isKillSwitchActive
              ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#fafafa]'
              : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isKillSwitchActive ? 'bg-[#ef4444] text-white animate-pulse' : 'bg-[#27272a] text-[#71717a]'
              }`}
            >
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#fafafa]">
                {isKillSwitchActive ? '¡KILL SWITCH ACTIVADO!' : 'Parada de Emergencia (Kill Switch)'}
              </h4>
              <p className="text-[11px] text-[#a1a1aa]">
                {isKillSwitchActive
                  ? 'Todas las compras están pausadas temporalmente por mantenimiento o inestabilidad de API de juego.'
                  : 'Pausa instantánea para proteger fondos si la pasarela de pagos o API de juego falla.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playAlert();
              onToggleKillSwitch();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isKillSwitchActive
                ? 'bg-[#34d399] hover:bg-[#6ee7b7] text-[#09090b]'
                : 'bg-[#ef4444] hover:bg-[#f87171] text-white'
            }`}
          >
            {isKillSwitchActive ? 'Reanudar Operaciones' : 'Detener Todo (Kill-Switch)'}
          </button>
        </div>

        {/* Pending Approvals Section (Push Notification Simulation) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#a78bfa]" />
              <h4 className="text-xs font-bold text-[#fafafa] uppercase tracking-wider">
                Pagos Pendientes de Conciliación ({pendingOrders.length})
              </h4>
            </div>
            <span className="text-[11px] text-[#34d399] font-mono">
              Push Notif: Activo
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0c0c0f] border border-[#27272a] text-center space-y-1">
              <Check className="w-8 h-8 text-[#34d399] mx-auto" />
              <p className="text-xs font-semibold text-[#fafafa]">¡Bandeja al día!</p>
              <p className="text-[11px] text-[#a1a1aa]">No hay órdenes en espera de revisión manual.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#fafafa]">
                          {order.gameName} • {order.packageName}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-[#7c3aed]/30 text-[#ede9fe] font-mono">
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#a1a1aa] font-mono block mt-0.5">
                        UID: {order.targetPlayerId} ({order.verifiedNickname}) • Ref:{' '}
                        <strong className="text-[#34d399]">{order.paymentReference}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#fafafa] font-mono block">
                        Bs. {order.amountBs.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#a1a1aa] font-mono block">
                        ${order.amountUsdt.toFixed(2)} USDT
                      </span>
                    </div>
                  </div>

                  {/* Operator Actions */}
                  {activeRejectId === order.id ? (
                    <div className="p-3 rounded-lg bg-[#0c0c0f] border border-[#ef4444]/40 space-y-2">
                      <label className="block text-[11px] text-[#ef4444] font-semibold">
                        Razón del rechazo para notificar al cliente:
                      </label>
                      <select
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa]"
                      >
                        <option value="Referencia bancaria no encontrada en BDV">
                          Referencia bancaria no encontrada en BDV
                        </option>
                        <option value="Monto recibido menor al precio del paquete">
                          Monto recibido menor al precio del paquete
                        </option>
                        <option value="Comprobante duplicado / captura alterada">
                          Comprobante duplicado / captura alterada
                        </option>
                        <option value="UID de jugador no coincide con servidor seleccionado">
                          UID de jugador no coincide con servidor seleccionado
                        </option>
                      </select>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setActiveRejectId(null)}
                          className="px-3 py-1 rounded bg-[#27272a] text-xs text-[#a1a1aa]"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            sound.playAlert();
                            onRejectOrder(order.id, rejectReason);
                            setActiveRejectId(null);
                          }}
                          className="px-3 py-1 rounded bg-[#ef4444] text-white text-xs font-bold"
                        >
                          Confirmar Rechazo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#27272a]">
                      {/* One-Touch Approval Button */}
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onApproveOrder(order.id);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-[#34d399] hover:bg-[#6ee7b7] text-[#09090b] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprobar y Despachar en 1 Toque</span>
                      </button>

                      {/* Reject Button */}
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveRejectId(order.id);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-[#1e1e22] hover:bg-[#ef4444]/20 border border-[#27272a] hover:border-[#ef4444] text-[#ef4444] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Rechazar</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
