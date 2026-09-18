import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GAMES_DATA } from '../data/mockData';
import { Game, GameSlug } from '../types';
import { sound } from '../utils/audio';
import { useCurrency } from '../context/CurrencyContext';
import { ChevronRight, Sparkles, Gamepad2, CreditCard, Tv, Gift, ShieldCheck } from 'lucide-react';

interface ProductCatalogProps {
  onSelectGame: (gameId: GameSlug) => void;
  onHoverGame?: (game: Game | null) => void;
}

export function ProductCatalog({ onSelectGame, onHoverGame }: ProductCatalogProps) {
  const { toProtectedBs } = useCurrency();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'game' | 'wallet' | 'subscription' | 'giftcard'>('all');
  const [showFullCatalog, setShowFullCatalog] = useState(false);

  // Featured 3 large cards exactly like Bonoxs image 1
  const recommendedSlugs: GameSlug[] = ['mobile-legends', 'free-fire', 'valorant'];
  const recommendedGames = recommendedSlugs
    .map((slug) => GAMES_DATA.find((g) => g.id === slug))
    .filter((g): g is NonNullable<typeof g> => g != null);

  const filteredGames = GAMES_DATA.filter(g => {
    if (selectedFilter === 'all') return true;
    return g.serviceType === selectedFilter;
  });

  const handleSelect = (slug: GameSlug) => {
    try { sound.playClick(); } catch (e) {}
    onSelectGame(slug);
  };

  const filterTabs = [
    { id: 'all', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'game', label: 'Videojuegos (FF/COD/VAL)', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'wallet', label: 'Billeteras (Zinli Visa)', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'subscription', label: 'Streaming & Apps (Netflix/Spotify/Discord)', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'giftcard', label: 'Tarjetas (PlayStation/Xbox/Google/Apple/Steam)', icon: <Gift className="w-3.5 h-3.5" /> },
  ];

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <section className="py-6 sm:py-10" id="store-catalog-section">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <span>Tienda de productos</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
              En Vivo
            </span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Recargas oficiales, cuentas en dólares y tarjetas digitales verificadas al instante.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#121216]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                try { sound.playClick(); } catch (e) {}
                setSelectedFilter(tab.id as any);
                setShowFullCatalog(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ BONOXS STYLE MAIN CONTAINER WITH HIGH GLASS TRANSPARENCY ═══ */}
      <div className="bg-[#0b0b0e]/90 border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle top ambient rim light */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ═══ SECCIÓN 1: RECOMENDADOS PARA TI (BONOXS STYLE) ═══ */}
        {selectedFilter === 'all' && (
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>Recomendados para ti</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedGames.map((game) => {
                const isHovered = hoveredSlug === game.id;
                const brandColor = game.themeColor || '#fbbf24';
                const brandGlow = game.glowColor || 'rgba(251, 191, 36, 0.4)';

                return (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => {
                      setHoveredSlug(game.id);
                      onHoverGame?.(game);
                    }}
                    onMouseLeave={() => {
                      setHoveredSlug(null);
                      onHoverGame?.(null);
                    }}
                    onClick={() => handleSelect(game.id as GameSlug)}
                    className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 bg-[#121216]"
                    style={{
                      borderColor: isHovered ? brandColor : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isHovered ? `0 16px 45px -8px ${brandGlow}` : '0 8px 24px -6px rgba(0,0,0,0.5)',
                    }}
                  >
                    {/* Background Official Key-Art Image with Zoom */}
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Ambient deep dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/15 pointer-events-none" />

                    {/* Prominent Official iOS Squircle Logo Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
                      <div className="relative">
                        <img
                          src={game.logoImage}
                          alt={game.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22%] shadow-[0_8px_25px_rgba(0,0,0,0.85)] border-2 border-white/20 object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                        <div 
                          className="absolute inset-0 rounded-[22%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            boxShadow: `0 0 20px 2px ${brandGlow}`
                          }}
                        />
                      </div>
                      <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                        {game.deliveryTime}
                      </span>
                    </div>

                    {/* Sleek Dark Bar at Bottom with Centered Name & Price */}
                    <div className="absolute bottom-0 inset-x-0 bg-[#0d0d10]/95 backdrop-blur-md py-3 px-4 flex items-center justify-between border-t border-white/10 pointer-events-none">
                      <div>
                        <span className="text-white font-black text-xs sm:text-sm tracking-wide uppercase truncate block group-hover:text-amber-400 transition-colors">
                          {game.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-medium">
                          {game.badgeText || game.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 block font-mono">Desde</span>
                        <span 
                          className="text-xs sm:text-sm font-black font-mono"
                          style={{ color: isHovered ? brandColor : '#ffffff' }}
                        >
                          Bs. {game.minPriceBs.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SECCIÓN 2: POPULARES EN LA TIENDA (BONOXS STYLE) ═══ */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
              {selectedFilter === 'all' ? 'Populares en la tienda' : 'Resultados de la categoría'}
            </h3>
            <span className="text-xs text-zinc-400 font-medium">
              {filteredGames.length} opciones disponibles
            </span>
          </div>

          {/* Dynamic Grid: Unified cards with official iOS Squircle App Icon & Cover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {(showFullCatalog || selectedFilter !== 'all' ? filteredGames : filteredGames.slice(0, 8)).map((game) => {
              const isHovered = hoveredSlug === game.id;
              const brandColor = game.themeColor || '#fbbf24';
              const brandGlow = game.glowColor || 'rgba(251, 191, 36, 0.4)';

              return (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -6, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => {
                    setHoveredSlug(game.id);
                    onHoverGame?.(game);
                  }}
                  onMouseLeave={() => {
                    setHoveredSlug(null);
                    onHoverGame?.(null);
                  }}
                  onClick={() => handleSelect(game.id as GameSlug)}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-[#131317] border transition-all duration-300 cursor-pointer relative"
                  style={{
                    borderColor: isHovered ? brandColor : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isHovered ? `0 12px 35px -5px ${brandGlow}` : '0 4px 15px -3px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Top visual section: Cover background with Centered Official iOS Squircle */}
                  <div className="aspect-square relative overflow-hidden bg-black/70 flex items-center justify-center p-3">
                    {/* Background Cover Key-Art */}
                    <img
                      src={game.coverImage}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131317] via-black/40 to-black/20" />

                    {/* Official iOS Squircle App Icon in center */}
                    <div className="relative z-10">
                      <img
                        src={game.logoImage}
                        alt={game.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22%] shadow-[0_8px_25px_rgba(0,0,0,0.9)] border-2 border-white/20 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div 
                        className="absolute inset-0 rounded-[22%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          boxShadow: `0 0 16px 2px ${brandGlow}`
                        }}
                      />
                    </div>

                    <span className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded text-[8px] font-black bg-black/80 backdrop-blur-sm text-amber-400 border border-amber-400/20">
                      {game.deliveryTime}
                    </span>
                  </div>

                  {/* Dark bottom bar with game name centered */}
                  <div className="py-2.5 px-2 bg-[#121215] border-t border-white/5 flex flex-col items-center justify-center">
                    <span 
                      className="font-black text-[10px] sm:text-[11px] text-zinc-100 tracking-wider uppercase truncate w-full text-center transition-colors"
                      style={{ color: isHovered ? brandColor : undefined }}
                    >
                      {game.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 mt-0.5">
                      Desde Bs. {game.minPriceBs.toFixed(0)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Centered Neon Yellow CTA Button (Matches image 1) */}
        {selectedFilter === 'all' && (
          <div className="flex justify-center mt-10 pt-4">
            <button
              onClick={() => {
                try { sound.playClick(); } catch (e) {}
                setShowFullCatalog(!showFullCatalog);
              }}
              className="px-10 py-3 rounded-xl border-2 border-amber-400 bg-transparent hover:bg-amber-400 text-amber-400 hover:text-black font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.15)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] cursor-pointer active:scale-95"
            >
              {showFullCatalog ? 'VER MENOS' : 'VER TIENDA COMPLETA'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
