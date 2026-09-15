import React, { useState } from 'react';
import { CURRENT_USDT_RATE_BS, BCV_RATE_BS, RATE_LAST_UPDATED } from '../data/mockData';
import { sound } from '../utils/audio';
import { RefreshCw, Calculator, ShieldCheck, Zap, Info } from 'lucide-react';

export const RateCalculatorBanner: React.FC = () => {
  const [calcAmountUsd, setCalcAmountUsd] = useState<string>('10');
  const [calcAmountBs, setCalcAmountBs] = useState<string>((10 * CURRENT_USDT_RATE_BS).toFixed(2));
  const [activeCalcMode, setActiveCalcMode] = useState<'usd' | 'bs'>('usd');

  const handleUsdChange = (val: string) => {
    setCalcAmountUsd(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setCalcAmountBs((num * CURRENT_USDT_RATE_BS).toFixed(2));
    } else {
      setCalcAmountBs('');
    }
  };

  const handleBsChange = (val: string) => {
    setCalcAmountBs(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setCalcAmountUsd((num / CURRENT_USDT_RATE_BS).toFixed(2));
    } else {
      setCalcAmountUsd('');
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm relative overflow-hidden mb-8 transition-colors duration-250">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#7c3aed]/8 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Column: Transparency & Venezuelan Reality */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
            <span className="px-2.5 py-1 rounded-full bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
              Tasa del Día en Vivo
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {RATE_LAST_UPDATED}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Transparencia Total: Tasa de Reposición Real Binance P2P
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            En Venezuela, el costo real para fondear cuentas y comprar diamantes/saldo se rige por el mercado <strong>Binance P2P (USDT)</strong>, el cual cotiza por encima del dólar común. En Nexus Recharge liquidamos a tasa real para garantizarte <strong>despacho en menos de 2 minutos</strong> sin comisiones sorpresa ni cancelaciones por devaluación.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">Tasa Nexus P2P:</span>
              <strong className="text-emerald-500 font-black text-sm">Bs. {CURRENT_USDT_RATE_BS.toFixed(2)}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <span>Ref. Oficial BCV:</span>
              <span className="font-semibold">Bs. {BCV_RATE_BS.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-[#a78bfa]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantía Anti-Devaluación</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mini-Calculator */}
        <div className="w-full lg:w-80 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#a78bfa]" />
              Calculadora Rápida
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              1 USDT = Bs. {CURRENT_USDT_RATE_BS.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] mb-1">
                Dólares / USDT
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-bold text-[var(--text-muted)]">$</span>
                <input
                  type="number"
                  step="any"
                  value={calcAmountUsd}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  placeholder="10.00"
                  className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[var(--text-muted)] mb-1">
                Bolívares (Pago Móvil)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-bold text-[#34d399]">Bs.</span>
                <input
                  type="number"
                  step="any"
                  value={calcAmountBs}
                  onChange={(e) => handleBsChange(e.target.value)}
                  placeholder="689.00"
                  className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono font-bold text-[#34d399] focus:outline-none focus:border-[#34d399]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
            <span>Conversión automática al instante</span>
            <span className="text-[#34d399] font-bold">Pago Móvil BDV / Otros</span>
          </div>
        </div>
      </div>
    </div>
  );
};
