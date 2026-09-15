import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Zap, Trophy, ShieldCheck, Clock, CreditCard, ChevronRight, Sparkles, Flame, Star, Tag } from 'lucide-react';
import { GameSlug } from '../types';
import { useCurrency } from '../context/CurrencyContext';

interface HeroProps {
  onScrollToTerminal: (gameId?: GameSlug, packageId?: string) => void;
  onScrollToTournaments: () => void;
  onOpenArchitecture?: () => void;
}

interface GameBanner {
  id: string;
  gameSlug: GameSlug;
  gameName: string;
  packageId: string;
  packageName: string;
  categoryTag: string;
  priceUsdt: number;
  gradient: string;
  borderGlow: string;
  badge: string;
  icon: string;
  description: string;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToTerminal,
  onScrollToTournaments,
}) => {
  const { rates, toProtectedBs } = useCurrency();
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const FEATURED_BANNERS: GameBanner[] = [
    {
      id: 'ff-banner',
      gameSlug: 'free-fire',
      gameName: 'Free Fire',
      packageId: 'ff-1060',
      packageName: '1,060 + 106 💎 Doble Recarga',
      categoryTag: 'Battle Royale',
      priceUsdt: 9.40,
      gradient: 'from-[#ef4444]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#ef4444]/60 border-[#ef4444]/30',
      badge: 'COMBO MÁS VENDIDO HOY',
      icon: 'local_fire_department',
      description: 'Inyección en 1.8s a tu UID numérico. Válido para Pase Booyah y Ruleta.',
    },
    {
      id: 'cod-banner',
      gameSlug: 'cod-mobile',
      gameName: 'Call of Duty: Mobile',
      packageId: 'cod-420',
      packageName: '420 CP + Bonus de Ruleta',
      categoryTag: 'FPS Táctico',
      priceUsdt: 4.99,
      gradient: 'from-[#38bdf8]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#38bdf8]/60 border-[#38bdf8]/30',
      badge: 'PASE ASEGURADO',
      icon: 'save_as',
      description: 'Acreditación por Player ID. Para Ruletas Míticas y Cajas de Temporada.',
    },
    {
      id: 'ml-banner',
      gameSlug: 'mobile-legends',
      gameName: 'Mobile Legends: Bang Bang',
      packageId: 'ml-pass',
      packageName: 'Pase Starlight Premium + 500💎',
      categoryTag: 'MOBA 5v5',
      priceUsdt: 5.40,
      gradient: 'from-[#a78bfa]/25 via-transparent to-transparent',
      borderGlow: 'hover:border-[#a78bfa]/60 border-[#a78bfa]/30',
      badge: 'STARLIGHT MENSUAL',
      icon: 'swords',
      description: 'Requiere User ID + Server Zone ID. Inyección oficial Moonton Smile.',
    },
    {
      id: 'fc-banner',
      gameSlug: 'fc-24',
      gameName: 'EA SPORTS FC 24',
      packageId: 'fc-1050',
      packageName: '1,050 FC Points + Joyas',
      categoryTag: 'Deportes / Ultimate Team',
      priceUsdt: 9.90,
      gradient: 'from-[#34d399]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#34d399]/60 border-[#34d399]/30',
      badge: 'EVENTO ESPECIAL',
      icon: 'sports_soccer',
      description: 'Mejora tu plantilla competitiva en minutos con Pago Móvil directo.',
    },
    {
      id: 'pubg-banner',
      gameSlug: 'pubg-mobile',
      gameName: 'PUBG Mobile',
      packageId: 'pubg-660',
      packageName: '660 UC Royale Pass Elite',
      categoryTag: 'Battle Royale',
      priceUsdt: 9.80,
      gradient: 'from-[#f59e0b]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#f59e0b]/60 border-[#f59e0b]/30',
      badge: 'MÁXIMO AHORRO',
      icon: 'military_tech',
      description: 'Por Character ID oficial de Midasbuy. Despacho directo.',
    },
    {
      id: 'roblox-banner',
      gameSlug: 'roblox',
      gameName: 'Roblox',
      packageId: 'rbx-800',
      packageName: '800 Robux Inmediato',
      categoryTag: 'Sandbox & Blox Fruits',
      priceUsdt: 9.99,
      gradient: 'from-[#ec4899]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#ec4899]/60 border-[#ec4899]/30',
      badge: 'INVENTARIO DIRECTO',
      icon: 'token',
      description: 'Sólo con tu @Username verificado sin intermediarios.',
    },
    {
      id: 'zinli-banner',
      gameSlug: 'zinli',
      gameName: 'Zinli Dólares Visa',
      packageId: 'zin-10',
      packageName: 'Recarga $10.00 USD (P2P)',
      categoryTag: 'Billetera Digital',
      priceUsdt: 10.80,
      gradient: 'from-[#34d399]/20 via-transparent to-transparent',
      borderGlow: 'hover:border-[#34d399]/60 border-[#34d399]/30',
      badge: 'P2P DIRECTO EN 60s',
      icon: 'credit_card',
      description: 'Dólares a tu tarjeta virtual Zinli (Panamá). Paga Netflix, Shein y suscripciones.',
    },
  ];

  const handleSelectBanner = (banner: GameBanner) => {
    sound.playClick();
    onScrollToTerminal(banner.gameSlug, banner.packageId);
  };

  return (
    <section className="relative w-full px-4 sm:px-8 py-10 sm:py-16 overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-[#a78bfa]/12 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#34d399]/8 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Real-time Rate Chip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#121215] border border-[#27272a] text-xs text-[#a1a1aa] mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
          <span>Tasa Reposición P2P:</span>
          <strong className="text-[#fafafa] font-mono">1 USDT = Bs. {rates.paraleloUsd.toFixed(2)}</strong>
          <span className="text-[10px] bg-[#27272a] text-[#34d399] px-2 py-0.5 rounded-full font-mono">
            DolarApi Activa
          </span>
        </div>

        {/* Hero Headline exact to user's requirement */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#fafafa] max-w-4xl leading-[1.12]" id="hero-title">
          Recarga instantáneamente en{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] via-[#6ee7b7] to-[#38bdf8]">
            Bolívares (Pago Móvil)
          </span>{' '}
          o{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#f43f5e]">
            USDT
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#a1a1aa] max-w-2xl font-normal leading-relaxed" id="hero-description">
          Inyección directa por UID sin contraseñas ni intermediarios. Elige tu juego favorito, selecciona tu combo activo y recibe tus monedas en segundos.
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5" id="hero-cta-buttons">
          <button
            onClick={() => {
              sound.playClick();
              onScrollToTerminal();
            }}
            className="px-6 py-3.5 rounded-full bg-[#a78bfa] text-[#09090b] font-bold text-sm shadow-[0_4px_25px_rgba(167,139,250,0.35)] hover:bg-[#c4b5fd] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            id="hero-recharge-cta"
          >
            <Zap className="w-4 h-4 text-[#09090b] fill-[#09090b]" />
            <span>Ir al Área de Recarga</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onScrollToTournaments();
            }}
            className="px-6 py-3.5 rounded-full bg-[#18181b] border border-[#27272a] text-[#fafafa] font-semibold text-sm hover:bg-[#27272a] hover:border-[#3f3f46] transition-all flex items-center gap-2 cursor-pointer"
            id="hero-tournaments-cta"
          >
            <Trophy className="w-4 h-4 text-[#34d399]" />
            <span>Nexus Arena (Torneos)</span>
          </button>
        </div>

        {/* ANIMATED GAME BANNERS CAROUSEL / GRID (Exact user requirement) */}
        <div className="w-full mt-12 sm:mt-16 text-left" id="hero-game-banners">
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              <h3 className="text-sm sm:text-base font-bold text-[#fafafa] tracking-wide uppercase">
                Combos y Banners Activos Hoy en Juegos Top
              </h3>
            </div>
            <span className="text-xs text-[#a1a1aa] hidden sm:inline">
              Haz clic en cualquier combo para recargarlo al instante
            </span>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_BANNERS.map((banner) => (
              <div
                key={banner.id}
                onClick={() => handleSelectBanner(banner)}
                className={`relative group p-5 rounded-2xl bg-gradient-to-br ${banner.gradient} border ${banner.borderGlow} backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-lg flex flex-col justify-between overflow-hidden`}
              >
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10 transition-all"></div>

                {/* Top bar with badge */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#09090b]/80 border border-[#3f3f46] text-[10px] font-mono font-bold text-[#34d399] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#34d399]" />
                      {banner.badge}
                    </span>
                    <span className="text-[11px] text-[#a1a1aa] font-medium font-mono">
                      {banner.categoryTag}
                    </span>
                  </div>

                  {/* Title & Game */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#121215] border border-[#27272a] flex items-center justify-center text-[#a78bfa] shadow-inner group-hover:border-[#a78bfa] transition-colors">
                      <span className="material-symbols-outlined text-2xl">
                        {banner.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#fafafa] group-hover:text-[#a78bfa] transition-colors">
                        {banner.gameName}
                      </h4>
                      <p className="text-xs font-semibold text-[#ede9fe]">
                        {banner.packageName}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#a1a1aa] leading-relaxed line-clamp-2 mt-2">
                    {banner.description}
                  </p>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="mt-5 pt-3 border-t border-[#27272a]/80 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-[#fafafa] font-mono">
                      Bs. {toProtectedBs(banner.priceUsdt).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#34d399] font-mono">
                      ${banner.priceUsdt.toFixed(2)} USDT
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-[#1e1e24] group-hover:bg-[#a78bfa] group-hover:text-[#09090b] text-[#fafafa] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#3f3f46] group-hover:border-[#a78bfa]"
                  >
                    <span>Recargar</span>
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Trust Highlights Bento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-5xl mt-12" id="hero-metrics-bento">
          <div className="p-4 rounded-xl bg-[#121215]/80 border border-[#27272a] backdrop-blur-xl flex flex-col text-left">
            <div className="flex items-center justify-between text-[#a1a1aa]">
              <span className="text-[11px] font-medium uppercase tracking-wider">Acreditación</span>
              <Clock className="w-3.5 h-3.5 text-[#34d399]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 tracking-tight font-mono">1.8 seg</span>
            <span className="text-[10px] text-[#34d399] mt-0.5">Automático por UID</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121215]/80 border border-[#27272a] backdrop-blur-xl flex flex-col text-left">
            <div className="flex items-center justify-between text-[#a1a1aa]">
              <span className="text-[11px] font-medium uppercase tracking-wider">Moneda Local</span>
              <CreditCard className="w-3.5 h-3.5 text-[#a78bfa]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 tracking-tight">Pago Móvil BDV</span>
            <span className="text-[10px] text-[#a1a1aa] mt-0.5">Banesco, Mercantil & Prov</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121215]/80 border border-[#27272a] backdrop-blur-xl flex flex-col text-left">
            <div className="flex items-center justify-between text-[#a1a1aa]">
              <span className="text-[11px] font-medium uppercase tracking-wider">Cripto Merchant</span>
              <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 tracking-tight font-mono">Binance Pay</span>
            <span className="text-[10px] text-[#34d399] mt-0.5">Zero Fee • USDT Instant</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121215]/80 border border-[#27272a] backdrop-blur-xl flex flex-col text-left">
            <div className="flex items-center justify-between text-[#a1a1aa]">
              <span className="text-[11px] font-medium uppercase tracking-wider">Seguridad Gamer</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#fafafa] mt-1 tracking-tight font-mono">100% Anti-Ban</span>
            <span className="text-[10px] text-[#a1a1aa] mt-0.5">Sin contraseñas de cuentas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
