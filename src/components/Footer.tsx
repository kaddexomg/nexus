import React from 'react';
import { ShieldCheck, Clock, MessageCircle, CreditCard, Zap, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  onOpenCommunity: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCommunity }) => {
  return (
    <footer className="w-full border-t border-[var(--border-default)] bg-[var(--bg-surface)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Top: Brand + Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <span className="font-bold text-base text-[var(--text-primary)] tracking-wider">
                NEXUS<span className="text-[var(--accent)]">RECHARGE</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Plataforma de recargas para videojuegos y billeteras digitales en Venezuela y Latinoamérica.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Tienda de Productos</li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Torneos</li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Cómo Funciona</li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Rastrear Pedido</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Soporte</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp de Atención
              </li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Preguntas Frecuentes</li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors" onClick={onOpenCommunity}>
                Comunidad
              </li>
              <li className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Términos y Condiciones</li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Garantías</h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-success)]" />
                <span>Recargas 100% oficiales</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-info)]" />
                <span>Entrega en menos de 2 minutos</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[var(--accent)]" />
                <span>Pago Móvil y Binance Pay</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[var(--color-warning)]" />
                <span>Atención en español 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Strip */}
        <div className="border-t border-[var(--border-default)] pt-6 mb-6">
          <p className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider font-medium">Métodos de Pago Aceptados</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { name: 'Pago Móvil BDV', icon: '🏦' },
              { name: 'Banesco', icon: '🏦' },
              { name: 'Mercantil', icon: '🏦' },
              { name: 'Binance Pay', icon: '₿' },
              { name: 'Zinli', icon: '💳' },
              { name: 'USDT', icon: '💲' },
            ].map((method) => (
              <span
                key={method.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)] font-medium"
              >
                <span>{method.icon}</span>
                {method.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[var(--border-default)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 Nexus Recharge. Todos los derechos reservados. Desarrollado para la comunidad gamer de Venezuela.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors flex items-center gap-1">
              Privacidad <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition-colors flex items-center gap-1">
              Términos <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
