import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';
import {
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  DollarSign,
  Euro,
  AlertTriangle,
  Percent,
  Calculator,
  ArrowRight,
  Zap,
  Lock,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface LiveRateDashboardProps {
  onNavigateToRecharge?: () => void;
}

export const LiveRateDashboard: React.FC<LiveRateDashboardProps> = ({ onNavigateToRecharge }) => {
  const { rates, isRefreshing, refreshRates, marginPercent, setMarginPercent } = useCurrency();
  const [simulationAmountUsd, setSimulationAmountUsd] = useState<number>(10);

  // Cálculos de simulación
  const costUsdt = simulationAmountUsd;
  const costBsAtP2p = simulationAmountUsd * rates.paraleloUsd;
  const costBsAtBcv = simulationAmountUsd * rates.bcvUsd;
  const protectedPriceBs = simulationAmountUsd * rates.paraleloUsd * (1 + marginPercent / 100);
  const grossProfitBs = protectedPriceBs - costBsAtP2p;
  const grossProfitUsd = grossProfitBs / rates.paraleloUsd;
  const lossIfSoldAtBcv = costBsAtP2p - costBsAtBcv;
  const lossPercentAtBcv = rates.spreadPercent;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn" id="dashboard-tasas">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#34d399] font-bold">
              Conexión en Tiempo Real • DolarApi Venezuela
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
            Monitor de Divisas & Motor de Margen Protegido
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Sincronización directa con cotizaciones oficiales BCV y de mercado (Binance P2P / Paralelo). Todos los precios en Bolívares se calculan algorítmicamente para blindar la rentabilidad del negocio.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase font-mono">Última Sincronización</span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">{rates.lastUpdated}</span>
          </div>

          <button
            type="button"
            onClick={refreshRates}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#a78bfa] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar Tasas'}</span>
          </button>
        </div>
      </div>

      {/* Grid de Cotizaciones en Vivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: USDT / Paralelo */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[var(--bg-card)] border-2 border-[#34d399]/40 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider">
              Tasa Reposición USDT (P2P)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#34d399]/15 flex items-center justify-center text-[#34d399]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              Bs. {rates.paraleloUsd.toFixed(2)}
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
              Costo real de compra en Binance P2P
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
            <span className="text-[#34d399] font-bold">Base de Liquidación</span>
            <span className="font-mono text-[var(--text-secondary)]">1.00 USDT</span>
          </div>
        </motion.div>

        {/* Card 2: Dólar Oficial BCV */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#a78bfa] uppercase tracking-wider">
              Dólar Oficial BCV
            </span>
            <div className="w-8 h-8 rounded-full bg-[#a78bfa]/15 flex items-center justify-center text-[#a78bfa]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              Bs. {rates.bcvUsd.toFixed(2)}
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
              Tasa oficial bancaria de referencia
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
            <span className="text-[#a78bfa]">Banco Central de Venezuela</span>
            <span className="font-mono text-[var(--text-secondary)]">1.00 USD</span>
          </div>
        </motion.div>

        {/* Card 3: Brecha Cambiaria (Spread) */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider">
              Brecha Cambiaria (Spread)
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b]">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#f59e0b] tracking-tight">
              +{rates.spreadPercent.toFixed(1)}%
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
              Diferencia de costo de reposición
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-muted)]">Riesgo si vendes a BCV:</span>
            <span className="font-mono text-[#ef4444] font-bold">-{rates.spreadPercent.toFixed(1)}% pérdida</span>
          </div>
        </motion.div>

        {/* Card 4: Euro Oficial & Paralelo */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider">
              Euro BCV / Paralelo
            </span>
            <div className="w-8 h-8 rounded-full bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8]">
              <Euro className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              Bs. {rates.paraleloEur.toFixed(2)}
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
              BCV Ref: Bs. {rates.bcvEur.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
            <span className="text-[#38bdf8]">Mercado Europeo</span>
            <span className="font-mono text-[var(--text-secondary)]">1.00 EUR</span>
          </div>
        </motion.div>
      </div>

      {/* MOTOR DE MARGEN DE GANANCIA (SIMULADOR INTERACTIVO) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Simulador de Protección de Margen Comercial</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
              Ajuste de Margen de Ganancia Neto
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
              Modifica el porcentaje de rentabilidad deseado. El sistema recalcula en tiempo real el precio en Bolívares que debe abonar el cliente para blindar la reposición en USDT.
            </p>
          </div>

          {/* Selector de Monto de Simulación */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] self-start md:self-auto">
            {[5, 10, 20, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  sound.playClick();
                  setSimulationAmountUsd(amt);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  simulationAmountUsd === amt
                    ? 'bg-[#a78bfa] text-[#09090b] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Control Deslizante de Margen */}
        <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
              Margen de Ganancia Configurado:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold font-mono text-[#34d399]">
                +{marginPercent}%
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">sobre costo P2P</span>
            </div>
          </div>

          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={marginPercent}
            onChange={(e) => {
              setMarginPercent(Number(e.target.value));
            }}
            className="w-full accent-[#a78bfa] cursor-pointer h-2 bg-[var(--border-color)] rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>5% (Mínimo / Mayorista)</span>
            <span>18% (Recomendado Retail)</span>
            <span>40% (Micro-recargas)</span>
          </div>
        </div>

        {/* Desglose Matemático de la Simulación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">Costo de Reposición</span>
            <div className="text-lg font-bold font-mono text-[var(--text-primary)] mt-1">
              Bs. {costBsAtP2p.toFixed(2)}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              Equivalente a ${costUsdt.toFixed(2)} USDT en Binance
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[#34d399]/40 bg-[#34d399]/5">
            <span className="text-[10px] font-mono uppercase text-[#34d399] font-bold block">Precio Venta al Cliente</span>
            <div className="text-lg font-bold font-mono text-[#34d399] mt-1">
              Bs. {protectedPriceBs.toFixed(2)}
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              Precio final con margen de {marginPercent}% blindado
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[#a78bfa]/40 bg-[#a78bfa]/5">
            <span className="text-[10px] font-mono uppercase text-[#a78bfa] font-bold block">Ganancia Neta Estimada</span>
            <div className="text-lg font-bold font-mono text-[#a78bfa] mt-1">
              Bs. {grossProfitBs.toFixed(2)} (~${grossProfitUsd.toFixed(2)} USDT)
            </div>
            <span className="text-[11px] text-[#34d399] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Libre de pérdidas cambiarias
            </span>
          </div>
        </div>

        {/* Alerta Educativa sobre la Realidad Venezolana */}
        <div className="p-4 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-[#ef4444]">
              ¿Por qué es inviable cobrar a tasa oficial BCV sin protección?
            </h4>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Si se vendiera una recarga de ${simulationAmountUsd} a tasa BCV (Bs. {rates.bcvUsd.toFixed(2)}), recibirías <strong>Bs. {costBsAtBcv.toFixed(2)}</strong>. Pero al ir a Binance P2P a reponer los ${simulationAmountUsd} USDT para comprar el código al mayor, necesitarías <strong>Bs. {costBsAtP2p.toFixed(2)}</strong>. Esto generaría una <strong>pérdida neta de Bs. {lossIfSoldAtBcv.toFixed(2)} ({lossPercentAtBcv.toFixed(1)}%) en cada transacción</strong>. Nuestro algoritmo previene esta quiebra automáticamente.
            </p>
          </div>
        </div>

        {/* Botón hacia el flujo de recarga */}
        {onNavigateToRecharge && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigateToRecharge();
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ir al Flujo de Recargas con Precios Protegidos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
