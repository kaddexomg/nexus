import React from 'react';
import { sound } from '../utils/audio';
import { ShieldCheck, Lock, Award, Heart } from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  onOpenCommunity: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitecture, onOpenCommunity }) => {
  return (
    <footer className="w-full bg-[#09090b] border-t border-[#27272a] py-14 px-4 sm:px-8 text-xs text-[#a1a1aa]" id="app-footer">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Core Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1e1e22] border border-[#3f3f46] flex items-center justify-center text-[#a78bfa]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <span className="font-bold text-sm tracking-wider text-[#fafafa]">
                NEXUS<span className="text-[#a78bfa]">RECHARGE</span>
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] max-w-sm leading-relaxed">
              Plataforma de alta velocidad para inyección de diamantes, CP y moneda virtual para juegos competitivos en Venezuela y América Latina. Cero intermediarios, 100% libre de bloqueos.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#34d399]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantía Oficial Anti-Ban por UID Directo</span>
            </div>
          </div>

          {/* Col 2: Plataforma & Herramientas */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#fafafa] uppercase tracking-wider block">
              Plataforma
            </span>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="#terminal-recharge"
                  onClick={() => sound.playClick()}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  Terminal de Recargas
                </a>
              </li>
              <li>
                <a
                  href="#torneos-arena"
                  onClick={() => sound.playClick()}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  Nexus Arena (Torneos)
                </a>
              </li>
              <li>
                <a
                  href="#catalogo-juegos"
                  onClick={() => sound.playClick()}
                  className="hover:text-[#fafafa] transition-colors"
                >
                  Títulos Oficiales
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenCommunity();
                  }}
                  className="hover:text-[#fafafa] transition-colors text-left"
                >
                  Comunidad Gamer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Lineamientos & Seguridad */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#fafafa] uppercase tracking-wider block">
              Arquitectura
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenArchitecture();
                  }}
                  className="text-[#a78bfa] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Esquema SQL & Anti-Error</span>
                </button>
              </li>
              <li>
                <span className="text-[#71717a]">Pago Móvil BDV / Interbancario</span>
              </li>
              <li>
                <span className="text-[#71717a]">Binance Pay USDT Merchant</span>
              </li>
              <li>
                <span className="text-[#71717a]">Daemon Bot v4.2 Worker</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#71717a]">
          <p>
            © 2026 Nexus Recharge C.A. Todos los derechos reservados. Diseñado bajo los lineamientos oficiales de arquitectura escalable y experiencia gamer interactiva.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-[#a1a1aa]">
              <Lock className="w-3 h-3 text-[#34d399]" /> SSL 256-Bit
            </span>
            <span>•</span>
            <span className="text-[#34d399] font-mono">Tasa Oficial BDV: Bs. 62.50</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
