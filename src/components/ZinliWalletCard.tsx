import React from 'react';
import { GamePackage } from '../types';
import { sound } from '../utils/audio';
import { Wifi, CheckCircle2, ShieldCheck, Zap, Mail, ArrowRight } from 'lucide-react';
import { CURRENT_USDT_RATE_BS } from '../data/mockData';

interface ZinliWalletCardProps {
  packages: GamePackage[];
  selectedPackage: GamePackage;
  onSelectPackage: (pkg: GamePackage) => void;
  email: string;
  onEmailChange: (email: string) => void;
  onProceed: () => void;
}

export const ZinliWalletCard: React.FC<ZinliWalletCardProps> = ({
  packages,
  selectedPackage,
  onSelectPackage,
  email,
  onEmailChange,
  onProceed,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. REALISTIC VIRTUAL VISA CARD (Zinli Panamá) */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md h-56 sm:h-64 rounded-3xl p-6 sm:p-7 text-white shadow-[0_20px_50px_rgba(0,201,183,0.3)] border border-white/20 overflow-hidden flex flex-col justify-between select-none transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-tr from-[#00c9b7] via-[#7928ca] to-[#12002b]">
          {/* Glass overlay and shiny gradient highlights */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00c9b7]/20 rounded-full blur-xl pointer-events-none -ml-10 -mb-10"></div>

          {/* Top row: Brand & NFC Contactless */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tighter italic text-white flex items-center">
                zinli<span className="text-[#00c9b7] font-black not-italic text-sm ml-1 px-1.5 py-0.5 rounded bg-white/20">VISA</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                P2P Instant
              </span>
              <Wifi className="w-5 h-5 rotate-90 text-white/90" />
            </div>
          </div>

          {/* Middle row: Golden EMV Chip and Amount */}
          <div className="relative z-10 flex items-center justify-between my-auto">
            {/* Golden Chip */}
            <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-100 shadow-inner flex flex-col justify-around p-1.5 opacity-90">
              <div className="w-full h-[1px] bg-amber-700/50"></div>
              <div className="w-full h-[1px] bg-amber-700/50"></div>
              <div className="w-full h-[1px] bg-amber-700/50"></div>
            </div>

            {/* Live Balance to receive */}
            <div className="text-right">
              <span className="text-[10px] text-white/70 uppercase tracking-widest block font-medium">
                Monto a Recibir
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-md">
                ${selectedPackage.amount}.00 <span className="text-sm font-normal text-[#6ee7b7]">USD</span>
              </span>
            </div>
          </div>

          {/* Bottom row: User email recipient & Visa Logo */}
          <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/15">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                Cuenta de Destino (Correo Zinli)
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[220px] block">
                {email || 'tu-correo-zinli@gmail.com'}
              </span>
            </div>

            <div className="text-right">
              <span className="font-black italic text-xl tracking-tighter text-white drop-shadow">
                VISA
              </span>
              <span className="text-[8px] block -mt-1 text-white/70 font-mono tracking-widest">
                PREPAID
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RECIPIENT EMAIL INPUT & PACKAGES SELECTOR */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#00c9b7]" />
              Correo Electrónico Registrado en Zinli
            </span>
            <span className="text-[11px] text-[#34d399] font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Transferencia P2P en 60s
            </span>
          </label>

          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="ejemplo: tu-correo-zinli@gmail.com"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#7c3aed] transition-all"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Asegúrate de que este correo sea el mismo con el que te registraste en la app de Zinli. Los dólares caen al instante sin comisiones de red.
            </span>
          </p>
        </div>

        {/* Amount Selector Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Selecciona el Monto a Recargar
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectPackage(pkg);
                  }}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer btn-tactile flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#7c3aed]/20 to-[#00c9b7]/10 border-[#00c9b7] shadow-[0_0_20px_rgba(0,201,183,0.25)] scale-[1.02]'
                      : 'bg-[var(--bg-elevated)] border-[var(--border-color)] hover:border-[#00c9b7]/50'
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-base font-extrabold text-[var(--text-primary)] font-mono">
                      ${pkg.amount} <span className="text-xs font-normal">USD</span>
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#00c9b7]" />
                    )}
                  </div>
                  <div className="text-left w-full mt-2 pt-2 border-t border-[var(--border-color)]">
                    <span className="text-xs font-bold text-[#34d399] font-mono block">
                      Bs. {(pkg.priceUsdt * CURRENT_USDT_RATE_BS).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                      {pkg.priceUsdt.toFixed(2)} USDT
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Proceed */}
        <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[var(--text-muted)] block">Total a pagar con Pago Móvil:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#34d399] font-mono">
                Bs. {(selectedPackage.priceUsdt * CURRENT_USDT_RATE_BS).toFixed(2)}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                (${selectedPackage.priceUsdt.toFixed(2)} USDT)
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Tasa de reposición: Bs. {CURRENT_USDT_RATE_BS.toFixed(2)} / USDT
            </span>
          </div>

          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00c9b7] via-[#7c3aed] to-[#a78bfa] text-white font-extrabold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Pagar Recarga Zinli</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
