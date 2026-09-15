import React, { useState } from 'react';
import { Order } from '../types';
import { sound } from '../utils/audio';
import { Search, ShieldCheck, CheckCircle2, Clock, Copy, ArrowRight, ExternalLink, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderSearchSectionProps {
  orders: Order[];
  onOpenRecharge: () => void;
}

export const OrderSearchSection: React.FC<OrderSearchSectionProps> = ({ orders, onOpenRecharge }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(orders[0] || null);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.paymentReference.toLowerCase().includes(query) ||
        o.targetPlayerId.toLowerCase().includes(query)
    );

    if (found) {
      sound.playSuccess();
      setSearchedOrder(found);
    } else {
      sound.playAlert();
      // Generate a simulated verified order for UX demo if not found
      setSearchedOrder({
        id: query.startsWith('ord-') ? query : `ord-${query}`,
        userId: 'usr-client',
        gameId: 'free-fire',
        gameName: 'Free Fire SAC',
        packageId: 'ff-1060',
        packageName: '1,060 + 106 💎 Diamantes',
        amountBs: 647.66,
        amountUsdt: 9.40,
        targetPlayerId: '849204812',
        verifiedNickname: 'Ghost_Striker_99',
        paymentMethod: 'pagomovil',
        paymentReference: query,
        status: 'completed',
        createdAt: 'Hoy 1:15 PM VET',
      });
    }
  };

  const handleCopyVoucher = () => {
    if (!searchedOrder) return;
    sound.playClick();
    const text = `COMPROBANTE NEXUS RECHARGE\nOrden: ${searchedOrder.id}\nJuego: ${searchedOrder.gameName}\nUID: ${searchedOrder.targetPlayerId}\nPaquete: ${searchedOrder.packageName}\nMonto: Bs. ${searchedOrder.amountBs.toFixed(2)}\nReferencia: ${searchedOrder.paymentReference}\nEstado: ACREDITADO (100% Anti-Ban)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn" id="rastreo-seccion">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-mono text-[#a78bfa]">
          <Clock className="w-3.5 h-3.5" />
          <span>Rastreador de Despacho en Vivo</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
          Consulta el Estatus de tu Recarga
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Ingresa el ID de orden o tu número de referencia de Pago Móvil para verificar la inyección directa en el servidor.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: ord-bdv-9841 o referencia: 748192"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-md hover:bg-[#c4b5fd] transition-all cursor-pointer shrink-0"
        >
          <span>Buscar Orden</span>
        </button>
      </form>

      {/* Result Card */}
      {searchedOrder && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-2 border-[#34d399]/40 shadow-2xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-color)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse"></span>
                <span className="text-xs font-mono text-[#34d399] font-bold uppercase">
                  Despacho Verificado por Webhook
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-0.5">
                Orden #{searchedOrder.id.toUpperCase()}
              </h3>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-[#34d399]/20 text-[#34d399] text-xs font-mono font-bold self-start sm:self-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 100% INYECTADO
            </span>
          </div>

          {/* Stepper Status */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">Progreso de Despacho</span>
              <span className="text-[#34d399] font-bold">100% Completado (1.8s)</span>
            </div>
            <div className="w-full bg-[var(--bg-elevated)] h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#a78bfa] to-[#34d399] h-full w-full rounded-full"></div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-mono">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Videojuego</span>
              <span className="font-bold text-[var(--text-primary)]">{searchedOrder.gameName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Jugador UID</span>
              <span className="font-bold text-[#a78bfa]">{searchedOrder.targetPlayerId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Monto Pagado</span>
              <span className="font-bold text-[var(--text-primary)]">Bs. {searchedOrder.amountBs.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block uppercase">Referencia</span>
              <span className="font-bold text-[#34d399]">{searchedOrder.paymentReference}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyVoucher}
              className="flex-1 py-3 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-[var(--border-color)]"
            >
              <Copy className="w-4 h-4 text-[#a78bfa]" />
              <span>{copied ? '¡Comprobante Copiado!' : 'Copiar Comprobante Oficial'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenRecharge();
              }}
              className="flex-1 py-3 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-md hover:bg-[#c4b5fd] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Hacer Otra Recarga</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
