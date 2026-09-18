import React, { useState } from 'react';
import { ZinliWalletCard } from './ZinliWalletCard';
import { GAMES_DATA } from '../data/mockData';
import { Game, GamePackage, PaymentMethodType, PlayerVerification } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';
import { CreditCard, Globe, Sparkles, Tv, Music, ArrowRight } from 'lucide-react';

interface ZinliWalletSectionProps {
  onOpenPaymentModal: (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => void;
}

export const ZinliWalletSection: React.FC<ZinliWalletSectionProps> = ({ onOpenPaymentModal }) => {
  const { rates, toProtectedBs } = useCurrency();
  const [activePlatform, setActivePlatform] = useState<'zinli' | 'steam' | 'netflix' | 'spotify' | 'shein'>('zinli');

  // Steam Denominations
  const STEAM_PACKAGES = [
    { id: 'steam-5', name: 'Steam Wallet $5.00 USD', priceUsd: 5.25, desc: 'Tarjeta de regalo digital canjeable en cuentas Steam USA o Global.' },
    { id: 'steam-10', name: 'Steam Wallet $10.00 USD', priceUsd: 10.50, desc: 'Saldo oficial para comprar videojuegos, pases de batalla y DLCs.' },
    { id: 'steam-20', name: 'Steam Wallet $20.00 USD', priceUsd: 21.00, desc: 'Denominación más vendida para ofertas de temporada Steam.' },
    { id: 'steam-50', name: 'Steam Wallet $50.00 USD', priceUsd: 52.50, desc: 'Entrega de código PIN inmediato para recarga de cartera.' },
  ];

  // Netflix
  const NETFLIX_PACKAGES = [
    { id: 'netflix-1m', name: 'Perfil Netflix 1 Mes (4K Ultra HD)', priceUsd: 4.00, desc: 'Pantalla privada con PIN personal en cuenta Premium 4K.' },
    { id: 'netflix-card-10', name: 'Tarjeta Regalo Netflix $10 USD', priceUsd: 10.50, desc: 'Código oficial para saldo de suscripción sin tarjeta internacional.' },
    { id: 'netflix-card-25', name: 'Tarjeta Regalo Netflix $25 USD', priceUsd: 26.00, desc: 'Saldo para varios meses de cuenta estándar o premium.' },
  ];

  // Spotify
  const SPOTIFY_PACKAGES = [
    { id: 'spotify-1m', name: 'Spotify Premium Individual 1 Mes', priceUsd: 3.00, desc: 'Música ilimitada sin anuncios y descargas offline en tu celular.' },
    { id: 'spotify-3m', name: 'Spotify Premium 3 Meses', priceUsd: 8.50, desc: '3 meses completos de servicio premium para tu cuenta.' },
    { id: 'spotify-card-10', name: 'Tarjeta Regalo Spotify $10 USD', priceUsd: 10.50, desc: 'PIN digital oficial canjeable en tu cuenta de Spotify.' },
  ];

  // Shein Denominations
  const SHEIN_PACKAGES = [
    { id: 'shein-10', name: 'Shein Gift Card $10.00 USD', priceUsd: 10.70, desc: 'Tarjeta canjeable con PIN de seguridad para comprar ropa y accesorios.' },
    { id: 'shein-25', name: 'Shein Gift Card $25.00 USD', priceUsd: 26.80, desc: 'Válida para compras y envíos puerta a puerta a Venezuela con casillero.' },
    { id: 'shein-50', name: 'Shein Gift Card $50.00 USD', priceUsd: 53.60, desc: 'Ideal para pedidos de ropa y calzado sin tarjeta de crédito.' },
  ];

  const handleSelectZinliPill = (amountUsd: number, email: string) => {
    const zinliGame = GAMES_DATA.find((g) => g.id === 'zinli') || GAMES_DATA[0];
    const priceBs = toProtectedBs(amountUsd * 1.08);
    const pkg: GamePackage = {
      id: `zinli-${amountUsd}`,
      gameSlug: 'zinli',
      name: `Recarga Zinli $${amountUsd}.00 USD (Visa Panamá)`,
      amount: amountUsd,
      bonusAmount: 0,
      unit: 'USD',
      priceBs,
      priceUsdt: amountUsd * 1.08,
      category: 'balance',
      description: `Transferencia instantánea P2P en dólares a tu tarjeta Visa Zinli (${email}).`,
    };

    onOpenPaymentModal({
      game: zinliGame,
      pkg,
      playerVerification: {
        uid: email,
        nickname: `Zinli_${email.split('@')[0]}`,
        level: 1,
        server: 'Zinli Panamá',
        verifiedAt: 'Ahora',
        isValid: true,
      },
      paymentMethod: 'pagomovil',
    });
  };

  const handleSelectCard = (name: string, amountUsd: number, service: 'steam' | 'shein' | 'netflix' | 'spotify') => {
    const game = GAMES_DATA.find((g) => g.id === service) || GAMES_DATA[0];
    const priceBs = toProtectedBs(amountUsd);
    const pkg: GamePackage = {
      id: `${service}-${amountUsd}`,
      gameSlug: service,
      name,
      amount: amountUsd,
      bonusAmount: 0,
      unit: 'USD',
      priceBs,
      priceUsdt: amountUsd,
      category: 'giftcards',
      description: `Código digital oficial despachado de inmediato para ${game.name}.`,
    };

    onOpenPaymentModal({
      game,
      pkg,
      playerVerification: {
        uid: 'entrega.digital@nexus.com',
        nickname: `Entrega_${service.toUpperCase()}`,
        level: 1,
        server: `${game.name} Oficial`,
        verifiedAt: 'Ahora',
        isValid: true,
      },
      paymentMethod: 'pagomovil',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn" id="billeteras-seccion">
      {/* Title & Platform Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold">
              Billeteras Digitales & Gift Cards Internacionales
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
            Zinli, Netflix, Spotify, Steam y Shein
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Ten acceso a compras y suscripciones en el exterior sin tener cuenta bancaria internacional. Paga con Pago Móvil o USDT.
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] overflow-x-auto self-start md:self-auto">
          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              setActivePlatform('zinli');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activePlatform === 'zinli'
                ? 'bg-[#34d399] text-[#09090b] shadow-md font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Zinli Visa (Panamá)</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              setActivePlatform('netflix');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activePlatform === 'netflix'
                ? 'bg-red-600 text-white shadow-md font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Netflix</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              setActivePlatform('spotify');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activePlatform === 'spotify'
                ? 'bg-emerald-500 text-black shadow-md font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Spotify</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              setActivePlatform('steam');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activePlatform === 'steam'
                ? 'bg-[#a78bfa] text-[#09090b] shadow-md font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Steam Wallet</span>
          </button>

          <button
            onClick={() => {
              try { sound.playClick(); } catch (e) {}
              setActivePlatform('shein');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activePlatform === 'shein'
                ? 'bg-[#ec4899] text-white shadow-md font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shein</span>
          </button>
        </div>
      </div>

      {/* PLATAFORMA 1: TARJETA VIRTUAL ZINLI VISA */}
      {activePlatform === 'zinli' && (
        <div className="space-y-6">
          <ZinliWalletCard
            currentUsdtRate={rates.paraleloUsd}
            onSelectRecharge={handleSelectZinliPill}
          />
        </div>
      )}

      {/* PLATAFORMA 2: NETFLIX */}
      {activePlatform === 'netflix' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {NETFLIX_PACKAGES.map((pkg) => {
            const priceBs = toProtectedBs(pkg.priceUsd);

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectCard(pkg.name, pkg.priceUsd, 'netflix')}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-red-500 transition-all cursor-pointer shadow-md flex flex-col justify-between group hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold text-lg">
                    🍿
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-red-400 transition-colors">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Total en Bs.</span>
                    <span className="text-base font-extrabold font-mono text-[var(--text-primary)]">
                      Bs. {priceBs.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>Comprar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLATAFORMA 3: SPOTIFY */}
      {activePlatform === 'spotify' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {SPOTIFY_PACKAGES.map((pkg) => {
            const priceBs = toProtectedBs(pkg.priceUsd);

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectCard(pkg.name, pkg.priceUsd, 'spotify')}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-emerald-500 transition-all cursor-pointer shadow-md flex flex-col justify-between group hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    🎧
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Total en Bs.</span>
                    <span className="text-base font-extrabold font-mono text-[var(--text-primary)]">
                      Bs. {priceBs.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>Comprar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLATAFORMA 4: STEAM WALLET */}
      {activePlatform === 'steam' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEAM_PACKAGES.map((pkg) => {
            const priceBs = toProtectedBs(pkg.priceUsd);

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectCard(pkg.name, pkg.priceUsd, 'steam')}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[#a78bfa] transition-all cursor-pointer shadow-md flex flex-col justify-between group hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/15 text-[#a78bfa] flex items-center justify-center font-bold text-lg">
                    🎮
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-[#a78bfa] transition-colors">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Total en Bs.</span>
                    <span className="text-base font-extrabold font-mono text-[var(--text-primary)]">
                      Bs. {priceBs.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#a78bfa] text-[#09090b] font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>Comprar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLATAFORMA 5: SHEIN */}
      {activePlatform === 'shein' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {SHEIN_PACKAGES.map((pkg) => {
            const priceBs = toProtectedBs(pkg.priceUsd);

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectCard(pkg.name, pkg.priceUsd, 'shein')}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[#ec4899] transition-all cursor-pointer shadow-md flex flex-col justify-between group hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#ec4899]/15 text-[#ec4899] flex items-center justify-center font-bold text-lg">
                    👗
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-[#ec4899] transition-colors">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Total en Bs.</span>
                    <span className="text-base font-extrabold font-mono text-[var(--text-primary)]">
                      Bs. {priceBs.toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#ec4899] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>Comprar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
