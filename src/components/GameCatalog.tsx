import React, { useState } from 'react';
import { GAMES_DATA, CURRENT_USDT_RATE_BS } from '../data/mockData';
import { GameSlug } from '../types';
import { sound } from '../utils/audio';
import { ShieldCheck, Zap, Lock, DollarSign, CheckCircle2, Gamepad2, CreditCard, Sparkles, Award } from 'lucide-react';

interface GameCatalogProps {
  onSelectGame: (gameId: GameSlug) => void;
}

export const GameCatalog: React.FC<GameCatalogProps> = ({ onSelectGame }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'game' | 'wallet'>('all');

  const getGameSpecificBadge = (gameId: GameSlug) => {
    switch (gameId) {
      case 'free-fire':
        return { text: 'UID de 8-12 Dígitos', icon: '💎', note: 'Sudamérica SAC / EE.UU.' };
      case 'cod-mobile':
        return { text: 'Activision Player ID', icon: '🎖️', note: 'Ruletas & Pases' };
      case 'fc-24':
        return { text: 'EA Sports UID', icon: '⚽', note: 'Ultimate Team Points' };
      case 'pubg-mobile':
        return { text: 'Character ID', icon: '🪖', note: 'Royale Pass & UC' };
      case 'roblox':
        return { text: '@Username Exacto', icon: '🧱', note: 'Robux a Inventario' };
      case 'mobile-legends':
        return { text: 'User ID + Zone ID', icon: '⚔️', note: 'Starlight & Diamantes' };
      case 'brawl-stars':
        return { text: 'Player Tag Supercell', icon: '🏆', note: 'Gemas & Brawl Pass Plus' };
      case 'zinli':
        return { text: 'Correo Registrado Zinli', icon: '💳', note: 'Transferencia P2P en 60s' };
      case 'binance-pay':
        return { text: 'Binance Pay ID / Correo', icon: '🪙', note: 'USDT Instantáneo sin red' };
      case 'steam':
        return { text: 'Correo / Código Canjeable', icon: '🎮', note: 'Steam Wallet USD Oficial' };
      case 'shein':
        return { text: 'Correo / Carrito Asistido', icon: '👗', note: 'Gift Cards y Puerta a Puerta' };
      default:
        return { text: 'Identificador Directo', icon: '⚡', note: 'Entrega en 1.8s' };
    }
  };

  const filteredGames = GAMES_DATA.filter((game) => {
    if (filterCategory === 'game') return game.serviceType === 'game';
    if (filterCategory === 'wallet') return game.serviceType === 'wallet';
    return true;
  });

  return (
    <section className="w-full px-3 sm:px-8 py-16 bg-[#0c0c0f] border-t border-[#27272a]" id="catalogo-juegos">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#a78bfa] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse"></span>
              Catálogo Oficial Nexus Recharge
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#fafafa] mt-1 tracking-tight">
              Títulos y Servicios Disponibles
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 max-w-xl">
              Imágenes oficiales, pases de batalla activos y protocolos de inyección directa sin contraseñas con Pago Móvil o USDT.
            </p>
          </div>

          {/* Category Selector Filter */}
          <div className="flex items-center gap-2 bg-[#121215] p-1.5 rounded-2xl border border-[#27272a]">
            <button
              onClick={() => {
                sound.playClick();
                setFilterCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#a78bfa] text-[#09090b] shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              Todos ({GAMES_DATA.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterCategory('game');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'game'
                  ? 'bg-[#a78bfa] text-[#09090b] shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Juegos (7)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterCategory('wallet');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'wallet'
                  ? 'bg-[#a78bfa] text-[#09090b] shadow-md'
                  : 'text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Billeteras (4)</span>
            </button>
          </div>
        </div>

        {/* Game Cards Grid with Visual Cover Art */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="games-grid">
          {filteredGames.map((game) => {
            const badgeInfo = getGameSpecificBadge(game.id);
            const estUsdt = (game.minPriceBs / CURRENT_USDT_RATE_BS).toFixed(2);

            return (
              <div
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  onSelectGame(game.id);
                }}
                className="rounded-3xl bg-[#121215] border border-[#27272a] hover:border-[#a78bfa]/60 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden cursor-pointer hover:scale-[1.015]"
              >
                {/* Visual Cover Art Header */}
                <div className="relative h-44 w-full overflow-hidden bg-[#18181b]">
                  <img
                    src={game.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'}
                    alt={game.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                  {/* Bottom Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/40 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#09090b]/85 backdrop-blur-md border border-[#3f3f46] text-[10px] font-mono text-[#34d399] font-bold flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3 text-[#34d399]" />
                      Anti-Ban Directo
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-[#a78bfa]/90 backdrop-blur-md text-[#09090b] text-[10px] font-bold shadow-md">
                      {game.publisher || game.category}
                    </span>
                  </div>

                  {/* Floating Game Icon & Title Over Cover */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#09090b]/90 backdrop-blur-md border border-[#3f3f46] flex items-center justify-center text-[#a78bfa] shadow-lg">
                        <span className="material-symbols-outlined text-2xl">{game.iconName}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#fafafa] group-hover:text-[#a78bfa] transition-colors leading-tight">
                          {game.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#a1a1aa] block">
                          {game.providerTag}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg">{badgeInfo.icon}</span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Active Battle Pass / Feature Pill */}
                    {game.activePassName && (
                      <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#7c3aed]/15 border border-[#a78bfa]/30 text-[11px] text-[#ede9fe] flex items-center gap-1.5 font-medium">
                        <Award className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                        <span className="truncate">Oficial: {game.activePassName}</span>
                      </div>
                    )}

                    <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-2">
                      {game.description}
                    </p>

                    {/* Specific recharge requirement chip */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#0c0c0f] border border-[#27272a] text-[11px] text-[#a1a1aa] flex items-center justify-between font-mono">
                      <span className="text-[#a78bfa] font-bold">Inyección vía:</span>
                      <span className="text-[#fafafa] font-bold truncate max-w-[170px]">{badgeInfo.text}</span>
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div className="pt-3.5 border-t border-[#27272a] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#a1a1aa] block">
                        Planes desde
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-[#fafafa] font-mono">
                          Bs. {game.minPriceBs.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#34d399] font-mono">
                          (~${estUsdt})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-[#1e1e24] group-hover:bg-[#a78bfa] group-hover:text-[#09090b] text-[#fafafa] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#3f3f46] group-hover:border-[#a78bfa] shadow-sm"
                    >
                      <span>Recargar</span>
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Reliability Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-[#121215] border border-[#27272a] space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#a78bfa]/20 text-[#a78bfa] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#fafafa]">Inyección Directa por UID</h4>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Nunca solicitamos contraseñas, códigos 2FA ni credenciales de Facebook o Google. Tu cuenta gamer permanece 100% segura.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121215] border border-[#27272a] space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#34d399]/20 text-[#34d399] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#fafafa]">Tasa Real de Mercado Transparente</h4>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Reposición basada en Binance P2P (1 USDT = Bs. {CURRENT_USDT_RATE_BS.toFixed(2)}) para garantizar disponibilidad continua sin pérdidas cambiarias.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#121215] border border-[#27272a] space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#fafafa]">Acreditación en 1.8 Segundos</h4>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              Daemon de procesamiento automático que verifica la transferencia y despacha tus diamantes, CP y saldo de inmediato.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
