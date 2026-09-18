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

  // Create banners from GAMES_DATA
  const banners = GAMES_DATA.slice(0, 5).map(game => ({
    id: game.id,
    name: game.name,
    coverImage: game.coverImage,
    tagline: game.description.split('.')[0],
    ctaText: 'Recargar ahora'
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleDotClick = (index: number) => {
    try { sound.playClick(); } catch (e) {}
    setCurrentSlide(index);
  };

  const handleBannerClick = (gameId: string) => {
    try { sound.playClick(); } catch (e) {}
    onScrollToTerminal(gameId as GameSlug);
  };

  return (
    <div className="w-full bg-[var(--bg-primary)] pb-12">
      {/* Rate Chip Overlay (Absolute position over hero or top right) */}
      <div className="max-w-7xl mx-auto px-4 pt-4 flex justify-end">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-sm">
          <span className="text-xs font-medium text-[var(--text-secondary)] mr-2">Tasa del día:</span>
          <span className="text-sm font-bold text-[var(--accent)]">1 USDT = Bs. {rates.paraleloUsd.toFixed(2)}</span>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image full bleed */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banners[currentSlide].coverImage})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 md:p-12 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg"
                >
                  <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                    {banners[currentSlide].name}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200 mb-6 font-medium">
                    {banners[currentSlide].tagline}
                  </p>
                  <button 
                    onClick={() => handleBannerClick(banners[currentSlide].id)}
                    className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95"
                  >
                    {banners[currentSlide].ctaText}
                    <ChevronRight size={20} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 mt-12 text-center">
        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-8">
          El mejor lugar para recargar en Venezuela
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Col 1 */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] flex flex-col items-center text-center hover:border-[var(--accent)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
              <ShoppingCart size={24} />
            </div>
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Comprá y disfruta</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              El catálogo más grande de juegos y tarjetas de regalo al mejor precio.
            </p>
          </div>

          {/* Col 2 */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] flex flex-col items-center text-center hover:border-[var(--accent)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
              <Trophy size={24} />
            </div>
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Compite en torneos</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Participa en eventos exclusivos y gana premios increíbles.
            </p>
          </div>

          {/* Col 3 */}
          <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] flex flex-col items-center text-center hover:border-[var(--accent)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Recibe al instante</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Tus recargas procesadas y entregadas en segundos, 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
