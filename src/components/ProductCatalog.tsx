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

  return (
    <section className="py-6 sm:py-10" id="store-catalog-section">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Tienda de productos
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Recargas directas, cuentas en dólares y tarjetas de regalo pagando en Bolívares o USDT.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)]">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                try { sound.playClick(); } catch (e) {}
                setSelectedFilter(tab.id as any);
                setShowFullCatalog(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ BONOXS STYLE MAIN CONTAINER (Matching image 1) ═══ */}
      <div className="bg-[#0c0c0e]/95 border border-[#27272a] rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* ═══ SECCIÓN 1: RECOMENDADOS PARA TI (BONOXS STYLE) ═══ */}
        {selectedFilter === 'all' && (
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Recomendados para ti
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedGames.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => onHoverGame?.(game)}
                  onMouseLeave={() => onHoverGame?.(null)}
                  onClick={() => handleSelect(game.id as GameSlug)}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-[#27272a] hover:border-amber-400/80 shadow-2xl transition-all bg-[#121215]"
                >
                  {/* Background Image with Zoom */}
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Ambient dark gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Big Centered Game Logo Overlay */}
                  {game.logoImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 pb-10 pointer-events-none">
                      <img
                        src={game.logoImage}
                        alt={game.name}
                        className="max-h-16 sm:max-h-20 max-w-[80%] object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Sleek Dark Bar at Bottom with Centered Name */}
                  <div className="absolute bottom-0 inset-x-0 bg-[#121215]/95 backdrop-blur-md py-3 px-4 flex items-center justify-center border-t border-white/5 pointer-events-none">
                    <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase truncate text-center">
                      {game.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SECCIÓN 2: POPULARES EN LA TIENDA (BONOXS STYLE) ═══ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
              {selectedFilter === 'all' ? 'Populares en la tienda' : 'Resultados de la categoría'}
            </h3>
            <span className="text-xs text-zinc-400 font-medium">
              {filteredGames.length} opciones disponibles
            </span>
          </div>

          {/* Dynamic Grid: Unified square cards with centered logo and dark bottom bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
            {(showFullCatalog || selectedFilter !== 'all' ? filteredGames : filteredGames.slice(0, 8)).map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => onHoverGame?.(game)}
                onMouseLeave={() => onHoverGame?.(null)}
                onClick={() => handleSelect(game.id as GameSlug)}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#141418] hover:bg-[#18181f] border border-[#27272a] hover:border-amber-400/80 transition-all cursor-pointer shadow-lg"
              >
                {/* Image thumbnail with centered logo */}
                <div className="aspect-square relative overflow-hidden bg-black/60">
                  <img
                    src={game.coverImage}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />

                  {/* Centered official game logo if available */}
                  {game.logoImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                      <img
                        src={game.logoImage}
                        alt={game.name}
                        className="max-h-10 max-w-[85%] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/80 backdrop-blur-sm text-amber-400 border border-amber-400/20">
                    {game.deliveryTime}
                  </span>
                </div>

                {/* Dark bottom bar with game name centered */}
                <div className="py-2.5 px-2 bg-[#121215] border-t border-white/5 flex flex-col items-center justify-center">
                  <span className="font-black text-[10px] sm:text-[11px] text-zinc-100 tracking-wider uppercase truncate w-full text-center group-hover:text-amber-400 transition-colors">
                    {game.name}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-zinc-400 mt-0.5">
                    Desde Bs. {game.minPriceBs.toFixed(0)}
                  </span>
                </div>
              </motion.div>
            ))}
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
