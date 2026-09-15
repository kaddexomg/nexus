import React, { useState, useEffect } from 'react';
import { Game, GamePackage, GameSlug, PackageCategory, PaymentMethodType, PlayerVerification } from '../types';
import { GAMES_DATA, PACKAGES_DATA, KNOWN_PLAYER_PROFILES, CURRENT_USDT_RATE_BS } from '../data/mockData';
import { sound } from '../utils/audio';
import { RateCalculatorBanner } from './RateCalculatorBanner';
import { ZinliWalletCard } from './ZinliWalletCard';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Search,
  Flame,
  Save,
  Trophy,
  Smartphone,
  RefreshCw,
  Zap,
  Star,
  Info,
  Check,
  CreditCard,
  Sparkles,
  Gamepad2,
  Wallet,
  ArrowRight,
  ChevronRight,
  Award,
} from 'lucide-react';

interface RechargeTerminalProps {
  onOpenPaymentModal: (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => void;
  isKillSwitchActive: boolean;
  userBalance: number;
  preselectedGameId?: GameSlug;
  preselectedPackageId?: string;
}

export const RechargeTerminal: React.FC<RechargeTerminalProps> = ({
  onOpenPaymentModal,
  isKillSwitchActive,
  userBalance,
  preselectedGameId,
  preselectedPackageId,
}) => {
  // Main Section Split: Games vs Digital Platforms / Wallets
  const [activeSection, setActiveSection] = useState<'games' | 'platforms'>('games');

  // Selected Game/Platform
  const [selectedGameId, setSelectedGameId] = useState<GameSlug>(preselectedGameId || 'free-fire');
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory>('diamonds');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(preselectedPackageId || 'ff-1060');

  // Input states tailored to each game
  const [selectedServerRegion, setSelectedServerRegion] = useState<string>('Sudamérica (SAC)');
  const [playerUid, setPlayerUid] = useState<string>('849204812');
  const [zoneId, setZoneId] = useState<string>('2041'); // For Mobile Legends
  const [robloxUsername, setRobloxUsername] = useState<string>('@NeonGamer_Caracas');
  const [codServerType, setCodServerType] = useState<string>('Activision Latam');

  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Player verification state (Pre-flight check)
  const [playerVerification, setPlayerVerification] = useState<PlayerVerification>({
    isValid: true,
    nickname: 'Ghost_Striker_99',
    level: 68,
    server: 'Sudamérica (SAC)',
    uid: '849204812',
    verifiedAt: 'Reciente',
  });

  // Layer 1 Anti-Error: Mandatory checkbox
  const [hasConfirmedNickname, setHasConfirmedNickname] = useState<boolean>(true);

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pagomovil');

  // React to preselected props from hero banners or catalog
  useEffect(() => {
    if (preselectedGameId) {
      setSelectedGameId(preselectedGameId);
      const game = GAMES_DATA.find((g) => g.id === preselectedGameId);
      if (game) {
        if (game.serviceType === 'wallet' || game.serviceType === 'giftcard') {
          setActiveSection('platforms');
        } else {
          setActiveSection('games');
        }
        if (game.serverRegions.length > 0) {
          setSelectedServerRegion(game.serverRegions[0]);
        }
      }
    }
  }, [preselectedGameId]);

  useEffect(() => {
    if (preselectedPackageId) {
      setSelectedPackageId(preselectedPackageId);
    }
  }, [preselectedPackageId]);

  // Current selected game and packages
  const currentGame = GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];
  const allGamePackages = PACKAGES_DATA[selectedGameId] || PACKAGES_DATA['free-fire'];
  const filteredPackages = allGamePackages.filter((p) => p.category === selectedCategory);
  const packagesToDisplay = filteredPackages.length > 0 ? filteredPackages : allGamePackages;

  // Current selected package
  const currentPackage =
    allGamePackages.find((p) => p.id === selectedPackageId) ||
    packagesToDisplay[0] ||
    allGamePackages[0];

  // Separate games from platforms
  const videoGamesList = GAMES_DATA.filter((g) => g.serviceType === 'game' || !g.serviceType);
  const platformsList = GAMES_DATA.filter((g) => g.serviceType === 'wallet' || g.serviceType === 'giftcard');

  const handleGameSelect = (gameId: GameSlug) => {
    sound.playClick();
    setSelectedGameId(gameId);

    const game = GAMES_DATA.find((g) => g.id === gameId);
    if (game && game.serverRegions.length > 0) {
      setSelectedServerRegion(game.serverRegions[0]);
    }

    const pkgs = PACKAGES_DATA[gameId] || [];
    if (pkgs.length > 0) {
      setSelectedCategory(pkgs[0].category);
      setSelectedPackageId(pkgs[0].id);
    } else {
      setSelectedCategory('diamonds');
    }

    // Adapt default UID based on game or platform
    if (gameId === 'free-fire') {
      setPlayerUid('849204812');
      setPlayerVerification({
        isValid: true,
        nickname: 'Ghost_Striker_99',
        level: 68,
        server: 'Sudamérica (SAC)',
        uid: '849204812',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'cod-mobile') {
      setPlayerUid('691048201');
      setPlayerVerification({
        isValid: true,
        nickname: 'Vortex_Sniper_VE',
        level: 150,
        server: 'Activision Latam',
        uid: '691048201',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'fc-24') {
      setPlayerUid('712948123');
      setPlayerVerification({
        isValid: true,
        nickname: 'Maracaibo_FC_King',
        level: 82,
        server: 'América Latina',
        uid: '712948123',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'pubg-mobile') {
      setPlayerUid('512948019');
      setPlayerVerification({
        isValid: true,
        nickname: 'Shadow_Hunter_99',
        level: 74,
        server: 'Global SAC',
        uid: '512948019',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'roblox') {
      setRobloxUsername('@NeonGamer_Caracas');
      setPlayerVerification({
        isValid: true,
        nickname: '@NeonGamer_Caracas',
        level: 45,
        server: 'Global',
        uid: '381029481',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'mobile-legends') {
      setPlayerUid('491028301');
      setZoneId('2041');
      setPlayerVerification({
        isValid: true,
        nickname: 'Slayer_2026',
        level: 91,
        server: 'Zone 2041',
        uid: '491028301 (2041)',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'brawl-stars') {
      setPlayerUid('#8Y9QL2VP');
      setPlayerVerification({
        isValid: true,
        nickname: 'Supercell_Star_VE',
        level: 35,
        server: 'Global Supercell',
        uid: '#8Y9QL2VP',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'zinli') {
      setPlayerUid('tu-correo-zinli@gmail.com');
      setPlayerVerification({
        isValid: true,
        nickname: 'Juan Pérez (Zinli P2P)',
        level: 1,
        server: 'Zinli Panamá P2P',
        uid: 'tu-correo-zinli@gmail.com',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'binance-pay') {
      setPlayerUid('198401293');
      setPlayerVerification({
        isValid: true,
        nickname: 'Vortex_Pay_VE',
        level: 99,
        server: 'Binance Pay Latam',
        uid: '198401293',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'steam') {
      setPlayerUid('tu-correo-recibir-codigo@gmail.com');
      setPlayerVerification({
        isValid: true,
        nickname: 'Steam PC Gamer',
        level: 1,
        server: 'Steam Latam',
        uid: 'tu-correo-recibir-codigo@gmail.com',
        verifiedAt: 'Automático',
      });
    } else if (gameId === 'shein') {
      setPlayerUid('tu-correo-shein@gmail.com');
      setPlayerVerification({
        isValid: true,
        nickname: 'Shein Cliente Activo',
        level: 1,
        server: 'Shein Latam',
        uid: 'tu-correo-shein@gmail.com',
        verifiedAt: 'Automático',
      });
    }

    setHasConfirmedNickname(true);
    setVerificationError(null);
  };

  const handleVerifyUid = () => {
    sound.playClick();
    let targetIdentifier = playerUid.trim();

    if (selectedGameId === 'roblox') {
      targetIdentifier = robloxUsername.trim();
      if (!targetIdentifier) {
        setVerificationError('Por favor introduce tu nombre de usuario de Roblox');
        return;
      }
    } else if (selectedGameId === 'mobile-legends') {
      if (!playerUid.trim() || !zoneId.trim()) {
        setVerificationError('Para Mobile Legends debes ingresar User ID y Server Zone ID');
        return;
      }
      targetIdentifier = `${playerUid.trim()} (${zoneId.trim()})`;
    } else {
      if (!targetIdentifier) {
        setVerificationError('Por favor introduce tu ID de cuenta / Correo / UID');
        return;
      }
    }

    setIsVerifying(true);
    setVerificationError(null);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanKey = playerUid.trim();
      const known = KNOWN_PLAYER_PROFILES[cleanKey];

      if (known) {
        setPlayerVerification({
          isValid: true,
          nickname: known.nickname,
          level: known.level,
          server: selectedGameId === 'mobile-legends' ? `Zone ${zoneId}` : selectedServerRegion,
          uid: targetIdentifier,
          verifiedAt: new Date().toLocaleTimeString(),
        });
        setHasConfirmedNickname(false);
        sound.playVerified();
      } else {
        let generatedNick = '';
        if (selectedGameId === 'roblox') {
          generatedNick = targetIdentifier.startsWith('@') ? targetIdentifier : `@${targetIdentifier}`;
        } else if (selectedGameId === 'zinli') {
          generatedNick = `${targetIdentifier.split('@')[0]} (Zinli P2P)`;
        } else if (selectedGameId === 'binance-pay') {
          generatedNick = `Binance_Trader_${cleanKey.slice(-4)}`;
        } else if (selectedGameId === 'mobile-legends') {
          generatedNick = `MLBB_Champion_${cleanKey.slice(-4)}`;
        } else {
          generatedNick = `${currentGame.name.replace(/\s+/g, '')}_Pro_${cleanKey.slice(-4)}`;
        }

        setPlayerVerification({
          isValid: true,
          nickname: generatedNick,
          level: Math.floor(Math.random() * 50) + 25,
          server: selectedGameId === 'mobile-legends' ? `Zone ${zoneId}` : selectedServerRegion,
          uid: targetIdentifier,
          verifiedAt: new Date().toLocaleTimeString(),
        });
        setHasConfirmedNickname(false);
        sound.playVerified();
      }
    }, 450);
  };

  const handleProceedToPayment = () => {
    if (isKillSwitchActive) {
      sound.playAlert();
      alert('EL BOT ESTÁ EN MODO PARADA DE EMERGENCIA. Las recargas están pausadas temporalmente.');
      return;
    }

    if (!playerVerification.isValid) {
      sound.playAlert();
      setVerificationError('Debes verificar el ID de jugador antes de proceder');
      return;
    }

    if (!hasConfirmedNickname) {
      sound.playAlert();
      setVerificationError('Protocolo Anti-Error: Debes marcar la casilla confirmando que el Nickname en pantalla te pertenece.');
      return;
    }

    sound.playClick();
    onOpenPaymentModal({
      game: currentGame,
      pkg: currentPackage,
      playerVerification,
      paymentMethod,
    });
  };

  return (
    <section className="w-full px-3 sm:px-8 py-12 sm:py-16 transition-colors duration-250" id="terminal-recharge">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. LIVE EXCHANGE RATE ENGINE (Venezuelan Reality Transparency) */}
        <RateCalculatorBanner />

        {/* 2. SECTION HEADER & MAIN HUB SWITCHER (Videojuegos vs Plataformas/Billeteras) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-2 text-[#a78bfa] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
              Plataforma de Despacho Oficial • Liquid Gaming Core
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mt-1 tracking-tight">
              Terminal de Recargas & Saldo
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Selecciona tu videojuego favorito o recarga billeteras virtuales (Zinli, Binance) pagando en Bolívares.
            </p>
          </div>

          {/* TWO MAIN HUBS: Videojuegos VS Billeteras & Plataformas */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveSection('games');
                if (videoGamesList.length > 0 && currentGame.serviceType !== 'game') {
                  handleGameSelect(videoGamesList[0].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer btn-tactile ${
                activeSection === 'games'
                  ? 'bg-[#7c3aed] text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Videojuegos ({videoGamesList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveSection('platforms');
                if (platformsList.length > 0 && currentGame.serviceType === 'game') {
                  handleGameSelect('zinli');
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer btn-tactile ${
                activeSection === 'platforms'
                  ? 'bg-[#00c9b7] text-slate-950 font-black shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Billeteras & Plataformas ({platformsList.length})</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono">
                Zinli
              </span>
            </button>
          </div>
        </div>

        {/* 3. A. HUB: ZONA BILLETERAS & PLATAFORMAS (Zinli, Binance, Steam, Shein) */}
        {activeSection === 'platforms' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Platform selector buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {platformsList.map((platform) => {
                const isSelected = selectedGameId === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => handleGameSelect(platform.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer btn-tactile flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[var(--bg-surface)] border-[#00c9b7] shadow-[0_0_25px_rgba(0,201,183,0.2)] ring-2 ring-[#00c9b7]/30'
                        : 'bg-[var(--bg-elevated)] border-[var(--border-color)] hover:border-[#a78bfa]/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed]/20 to-[#00c9b7]/20 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl text-[var(--text-primary)]">
                        {platform.iconName}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-sm font-extrabold text-[var(--text-primary)] block truncate">
                        {platform.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#34d399] block">
                        {platform.badgeText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DEDICATED ZINLI VISA VIRTUAL CARD EXPERIENCE */}
            {selectedGameId === 'zinli' && (
              <ZinliWalletCard
                packages={allGamePackages}
                selectedPackage={currentPackage}
                onSelectPackage={(pkg) => setSelectedPackageId(pkg.id)}
                email={playerUid}
                onEmailChange={(newEmail) => {
                  setPlayerUid(newEmail);
                  setPlayerVerification((prev) => ({
                    ...prev,
                    uid: newEmail,
                    nickname: `${newEmail.split('@')[0]} (Zinli P2P)`,
                  }));
                }}
                onProceed={handleProceedToPayment}
              />
            )}

            {/* OTHER PLATFORMS (Binance, Steam, Shein) */}
            {selectedGameId !== 'zinli' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#34d399] tracking-wider font-bold">
                      Servicio Verificado • Despacho Seguro
                    </span>
                    <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">
                      {currentGame.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
                      {currentGame.description}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)]">
                    Entrega: <strong>{currentGame.deliveryTime}</strong>
                  </div>
                </div>

                {/* Input Destino */}
                <div className="max-w-xl">
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {currentGame.accountIdentifierLabel || 'Identificador de la Cuenta Destino'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={playerUid}
                      onChange={(e) => {
                        setPlayerUid(e.target.value);
                        setPlayerVerification((prev) => ({ ...prev, uid: e.target.value }));
                      }}
                      placeholder={currentGame.idPlaceholder}
                      className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyUid}
                      disabled={isVerifying}
                      className="px-5 py-3 rounded-xl bg-[#7c3aed] text-white font-bold text-xs cursor-pointer hover:bg-[#6d28d9] transition-all shrink-0 flex items-center gap-1.5"
                    >
                      {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Verificar</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                    {currentGame.idFormatHint}
                  </p>
                </div>

                {/* Packages Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                    Paquetes Disponibles de {currentGame.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {allGamePackages.map((pkg) => {
                      const isSelected = currentPackage.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedPackageId(pkg.id);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[var(--bg-elevated)] border-[#a78bfa] shadow-md ring-2 ring-[#a78bfa]/30'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-color)] hover:border-[#a78bfa]/50'
                          }`}
                        >
                          <div>
                            <span className="text-sm font-extrabold text-[var(--text-primary)] block">
                              {pkg.name}
                            </span>
                            {pkg.description && (
                              <span className="text-[11px] text-[var(--text-muted)] block mt-1">
                                {pkg.description}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-baseline justify-between">
                            <span className="text-base font-black text-[#34d399] font-mono">
                              Bs. {(pkg.priceUsdt * CURRENT_USDT_RATE_BS).toFixed(2)}
                            </span>
                            <span className="text-xs font-mono text-[var(--text-muted)]">
                              ${pkg.priceUsdt.toFixed(2)} USDT
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Proceed */}
                <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-black text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Continuar al Pago</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. B. HUB: ZONA GAMER (Tarjetas con Imágenes Oficiales, Pases de Batalla y Emotes) */}
        {activeSection === 'games' && (
          <div className="space-y-8 animate-fadeIn">
            {/* GRID DE VIDEOJUEGOS CON IMÁGENES OFICIALES */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  Elige tu Videojuego (Toca la tarjeta para abrir combos y pases)
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  7 Títulos Activos Hoy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {videoGamesList.map((game) => {
                  const isSelected = selectedGameId === game.id;
                  return (
                    <div
                      key={game.id}
                      onClick={() => handleGameSelect(game.id)}
                      className={`relative rounded-3xl border overflow-hidden cursor-pointer game-card-hover select-none group flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#a78bfa] shadow-[0_10px_30px_rgba(124,58,237,0.3)] ring-2 ring-[#a78bfa]/50'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[#a78bfa]/50'
                      }`}
                    >
                      {/* Game Cover Art with overlay gradient */}
                      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-transparent to-black/30"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-wider border border-white/10 font-bold">
                            {game.publisher || 'Oficial'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-mono font-black shadow-sm">
                            {game.deliveryTime}
                          </span>
                        </div>

                        {/* Selection checkmark indicator */}
                        {isSelected && (
                          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-lg border border-white/30">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Card Content & Benefits */}
                      <div className="p-4 space-y-2.5 bg-[var(--bg-surface)]">
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-tight group-hover:text-[#a78bfa] transition-colors">
                            {game.name}
                          </h3>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono block">
                            {game.category}
                          </span>
                        </div>

                        {/* Battle Pass chip */}
                        {game.activePassName && (
                          <div className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[10px] font-mono text-[#a78bfa] font-bold flex items-center gap-1.5 truncate">
                            <Award className="w-3 h-3 shrink-0 text-amber-400" />
                            <span className="truncate">{game.activePassName}</span>
                          </div>
                        )}

                        {/* Price footer */}
                        <div className="pt-2 border-t border-[var(--border-color)] flex items-baseline justify-between text-xs">
                          <span className="text-[var(--text-muted)] font-mono">Desde:</span>
                          <span className="font-extrabold text-[#34d399] font-mono">
                            Bs. {game.minPriceBs.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETALLE Y PANEL DE RECARGA DEL JUEGO SELECCIONADO */}
            <div className="p-6 sm:p-9 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-xl space-y-8">
              {/* Header of selected game */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#34d399]/20 border border-[#a78bfa]/30 flex items-center justify-center text-[#a78bfa] shadow-md">
                    <span className="material-symbols-outlined text-3xl">
                      {currentGame.iconName}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                        {currentGame.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        100% Anti-Ban
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-lg">
                      {currentGame.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)]">
                    Servidor: <strong>{selectedServerRegion}</strong>
                  </span>
                </div>
              </div>

              {/* PASO 2: DATOS DE LA CUENTA & PRE-FLIGHT CHECK */}
              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    Identificador de Jugador ({currentGame.name})
                  </span>
                  <span className="text-[11px] text-[#34d399] font-mono flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Validación en Tiempo Real
                  </span>
                </div>

                {/* Input Fields based on game */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentGame.serverRegions && currentGame.serverRegions.length > 1 && (
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                        Región / Servidor
                      </label>
                      <select
                        value={selectedServerRegion}
                        onChange={(e) => {
                          setSelectedServerRegion(e.target.value);
                          sound.playClick();
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                      >
                        {currentGame.serverRegions.map((reg) => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={currentGame.serverRegions && currentGame.serverRegions.length > 1 ? 'sm:col-span-2' : 'sm:col-span-3'}>
                    <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1 flex justify-between">
                      <span>{currentGame.accountIdentifierLabel || 'ID de Jugador (UID)'}</span>
                      <span className="text-[var(--text-muted)] font-mono">{currentGame.idFormatHint}</span>
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedGameId === 'roblox' ? robloxUsername : playerUid}
                        onChange={(e) => {
                          if (selectedGameId === 'roblox') {
                            setRobloxUsername(e.target.value);
                          } else {
                            setPlayerUid(e.target.value);
                          }
                          setVerificationError(null);
                        }}
                        placeholder={currentGame.idPlaceholder}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyUid}
                        disabled={isVerifying}
                        className="px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white font-bold text-xs cursor-pointer hover:bg-[#6d28d9] transition-all shrink-0 flex items-center gap-1.5"
                      >
                        {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                        <span>Validar ID</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pre-Flight Handshake Result Card */}
                {playerVerification.isValid && (
                  <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)] font-mono">
                            {playerVerification.nickname}
                          </span>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
                            Nvl {playerVerification.level}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">
                          Servidor: {playerVerification.server} • ID: {playerVerification.uid}
                        </span>
                      </div>
                    </div>

                    {/* Anti-Error Checkbox */}
                    <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] bg-[var(--bg-elevated)] px-3 py-2 rounded-lg border border-[var(--border-color)] cursor-pointer hover:border-[#a78bfa] transition-colors">
                      <input
                        type="checkbox"
                        checked={hasConfirmedNickname}
                        onChange={(e) => {
                          setHasConfirmedNickname(e.target.checked);
                          sound.playClick();
                        }}
                        className="rounded border-[var(--border-color)] text-[#7c3aed] focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[11px]">
                        Confirmo que <strong>{playerVerification.nickname}</strong> es mi cuenta
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* PASO 3: COMBOS, PASES DE BATALLA Y EMOTES OFICIALES */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    Catálogo de Paquetes Activos en {currentGame.name}
                  </span>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory('diamonds');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedCategory === 'diamonds'
                          ? 'bg-[#7c3aed] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      💎 Monedas / Diamantes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory('passes');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedCategory === 'passes'
                          ? 'bg-[#7c3aed] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      🎟️ Pases de Batalla
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory('emotes_skins');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedCategory === 'emotes_skins'
                          ? 'bg-[#7c3aed] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      🔥 Emotes & Skins
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory('neon');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        selectedCategory === 'neon'
                          ? 'bg-[#7c3aed] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      ⚡ Combos Neón
                    </button>
                  </div>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {packagesToDisplay.map((pkg) => {
                    const isSelected = currentPackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedPackageId(pkg.id);
                        }}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none btn-tactile relative overflow-hidden ${
                          isSelected
                            ? 'bg-[var(--bg-elevated)] border-[#a78bfa] shadow-lg ring-2 ring-[#a78bfa]/40'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-color)] hover:border-[#a78bfa]/50'
                        }`}
                      >
                        {pkg.tag && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#7c3aed] text-white text-[10px] font-mono font-bold shadow-sm">
                            {pkg.tag}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-1 pr-14">
                            <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)]">
                              {pkg.name}
                            </span>
                          </div>

                          {pkg.description && (
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2">
                              {pkg.description}
                            </p>
                          )}

                          {pkg.bonusAmount > 0 && (
                            <span className="text-[11px] text-[#34d399] font-mono font-semibold block mt-1">
                              +{pkg.bonusAmount} {pkg.unit} extra hoy
                            </span>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-baseline justify-between">
                          <div>
                            <span className="text-base sm:text-lg font-black text-[#34d399] font-mono block">
                              Bs. {(pkg.priceUsdt * CURRENT_USDT_RATE_BS).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono">
                              ${pkg.priceUsdt.toFixed(2)} USDT
                            </span>
                          </div>

                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-[#a78bfa] text-white' : 'border border-[var(--border-color)] text-transparent'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PASO 4: MÉTODO DE PAGO Y RESUMEN FINAL */}
              <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] block">
                  Método de Liquidación en Venezuela
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod('pagomovil');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'pagomovil'
                        ? 'bg-[var(--bg-surface)] border-[#34d399] shadow-sm'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[#34d399]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#34d399]/15 text-[#34d399] flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[var(--text-primary)] block">
                          Pago Móvil BDV / Otros
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Tasa Binance P2P • Conciliación 3s
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'pagomovil' && <CheckCircle2 className="w-4 h-4 text-[#34d399]" />}
                  </div>

                  <div
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod('binance');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'binance'
                        ? 'bg-[var(--bg-surface)] border-[#f59e0b] shadow-sm'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[#f59e0b]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[var(--text-primary)] block">
                          Binance Pay (USDT)
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Cero comisiones • Despacho Bot
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'binance' && <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />}
                  </div>

                  <div
                    onClick={() => {
                      sound.playClick();
                      setPaymentMethod('wallet');
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-[var(--bg-surface)] border-[#a78bfa] shadow-sm'
                        : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[#a78bfa]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#7c3aed]/15 text-[#a78bfa] flex items-center justify-center">
                        <Save className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[var(--text-primary)] block">
                          Billetera Nexus
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          Saldo disp: ${userBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'wallet' && <CheckCircle2 className="w-4 h-4 text-[#a78bfa]" />}
                  </div>
                </div>

                {/* Final CTA Bar */}
                <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Total a liquidar:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#34d399] font-mono">
                        Bs. {(currentPackage.priceUsdt * CURRENT_USDT_RATE_BS).toFixed(2)}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        (${currentPackage.priceUsdt.toFixed(2)} USDT)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white font-black text-sm shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    id="btn-recharge-submit"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Continuar con la Recarga</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
