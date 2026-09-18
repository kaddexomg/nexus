import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trophy, Zap, ChevronRight } from 'lucide-react';
import { GameSlug } from '../types';
import { GAMES_DATA } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';

export interface HeroProps {
  onScrollToTerminal: (gameId?: GameSlug, packageId?: string) => void;
  onScrollToTournaments: () => void;
  onOpenArchitecture?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToTerminal }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { rates } = useCurrency();

  // Curated high-impact gaming promo banners matching Bonoxs screenshot
  const promoBanners = [
    {
      id: 'valorant' as GameSlug,
      badge: 'OFICIAL RIOT GAMES • ENTREGA 1.8s',
      title: 'VALORANT POINTS & SKINS',
      tagline: 'Nueva cápsula, pases de batalla y paquetes de VP al mejor precio de Venezuela.',
      highlights: ['Gun Buddies', 'Tarjetas Exclusivas', 'Pase de Batalla', 'Entrega por Riot ID'],
      bgImage: '/assets/banners/banner-valorant.jpg',
      logoImage: '/assets/logos/valorant.svg',
      ctaText: 'Comprar VP Ahora',
    },
    {
      id: 'free-fire' as GameSlug,
      badge: 'GARENA OFICIAL • RECARGA DIRECTA',
      title: 'DIAMANTES & PASE BOOYAH',
      tagline: 'Recarga por ID numérico en segundos. Bonificaciones activas y paquetes dobles.',
      highlights: ['Diamantes Dobles', 'Pase Booyah', 'Emotes Épicos', 'Sin Contraseñas'],
      bgImage: '/assets/banners/banner-freefire.jpg',
      logoImage: '/assets/logos/free-fire.svg',
      ctaText: 'Recargar Diamantes',
    },
    {
      id: 'fc-24' as GameSlug,
      badge: 'EA SPORTS • TORNEOS & POZOS',
      title: 'FC 24 - FC POINTS & ARENA',
      tagline: 'Puntos FC para tus sobres Ultimate Team y torneos de fútbol con premios en USDT.',
      highlights: ['Sobres Promo', 'FC Points', 'Torneo 1v1', 'Premios en $'],
      bgImage: '/assets/banners/banner-fc24.jpg',
      logoImage: '/assets/logos/fc-24.svg',
      ctaText: 'Ver Puntos & Torneo',
    },
    {
      id: 'mobile-legends' as GameSlug,
      badge: 'MOONTON • 5V5 COMPETITIVO',
      title: 'MOBILE LEGENDS: BANG BANG',
      tagline: 'Pases Starlight, skins legendarias y diamantes con entrega directa por ID y Server.',
      highlights: ['Starlight Pass', 'Verificación de Nickname', 'Diamantes Promo', 'Entrega 24/7'],
      bgImage: '/assets/banners/banner-mlbb.jpg',
      logoImage: '/assets/logos/mobile-legends.svg',
      ctaText: 'Recargar MLBB',
    },
    {
      id: 'zinli' as GameSlug,
      badge: 'BILLETERAS DIGITALES • VISA PANAMÁ',
      title: 'ZINLI DÓLARES & STEAM WALLET',
      tagline: 'Recarga saldo en dólares en tu tarjeta Visa Zinli y tarjetas Steam pagando en Bolívares.',
      highlights: ['Tarjeta Visa Internacional', 'Steam Wallet USD', 'Pago Móvil BDV', 'Cero Comisiones'],
      bgImage: '/assets/banners/banner-wallets.jpg',
      logoImage: '/assets/logos/zinli.svg',
      ctaText: 'Recargar Billetera',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [promoBanners.length]);

  const handleDotClick = (index: number) => {
    try { sound.playClick(); } catch (e) {}
    setCurrentSlide(index);
  };

  const handleBannerClick = (gameId: GameSlug) => {
    try { sound.playClick(); } catch (e) {}
    onScrollToTerminal(gameId);
  };

  const currentBanner = promoBanners[currentSlide];

  return (
    <div className="w-full bg-[var(--bg-primary)] pb-10">
      {/* Rate Chip Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 flex justify-end">
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
          <span className="text-xs font-medium text-[var(--text-secondary)] mr-2">Tasa del día:</span>
          <span className="text-sm font-black text-[var(--accent)] font-mono">1 USDT = Bs. {rates.paraleloUsd.toFixed(2)}</span>
        </div>
      </div>

      {/* Hero Carousel Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
        <div className="relative w-full h-[340px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-[#09090b]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => handleBannerClick(currentBanner.id)}
            >
              {/* Background Game Artwork Image */}
              <img
                src={currentBanner.bgImage}
                alt={currentBanner.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Ambient Gradients for Perfect Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              {/* Banner Content Layout */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-12 text-white">
                {/* Top Badge & Logo */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-400/90 text-black shadow-md backdrop-blur-md">
                    {currentBanner.badge}
                  </span>

                  {currentBanner.logoImage && (
                    <img
                      src={currentBanner.logoImage}
                      alt={currentBanner.title}
                      className="max-h-8 sm:max-h-12 max-w-[120px] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] opacity-90"
                    />
                  )}
                </div>

                {/* Center / Bottom Headline & CTAs */}
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 drop-shadow-md">
                    {currentBanner.title}
                  </h2>
                  <p className="text-xs sm:text-base text-zinc-200 mb-4 line-clamp-2 font-medium">
                    {currentBanner.tagline}
                  </p>

                  {/* Highlight Feature Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    {currentBanner.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-white/10 backdrop-blur-md text-zinc-100 border border-white/15"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(currentBanner.id);
                    }}
                    className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-7 py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{currentBanner.ctaText}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Bottom Footer Note inside banner */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                  <span className="tracking-widest uppercase text-amber-400/80 font-bold">
                    El mejor lugar para comprar en Venezuela
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Dots Indicator */}
          <div className="absolute bottom-4 right-6 sm:right-10 flex gap-2 z-10">
            {promoBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70 w-2'
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Value Proposition Strip (Matching image.png: Comprá, Temporada de Torres, Competí) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Col 1: Comprá */}
          <div className="bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-default)] flex items-center gap-4 hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-[var(--text-primary)]">Comprá</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Comprá y disfrutá los beneficios de Nexus con entrega en 1.8 segundos.
              </p>
            </div>
          </div>

          {/* Col 2: Temporada de Torres */}
          <div className="bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-default)] flex items-center gap-4 hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-[var(--text-primary)]">Temporada de Torres</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Disfruta de recompensas, cashback y beneficios VIP acumulando compras.
              </p>
            </div>
          </div>

          {/* Col 3: Competí */}
          <div className="bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-default)] flex items-center gap-4 hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Trophy size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-[var(--text-primary)]">Competí</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Torneos con premios reales en dólares de tus videojuegos favoritos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
