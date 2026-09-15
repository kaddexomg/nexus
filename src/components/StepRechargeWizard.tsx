import React, { useState, useEffect } from 'react';
import { GAMES_DATA, PACKAGES_DATA } from '../data/mockData';
import { Game, GamePackage, GameSlug, PaymentMethodType, PlayerVerification, PackageCategory } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Award,
  Sparkles,
  Flame,
  Star,
  Copy,
  Check,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Gamepad2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StepRechargeWizardProps {
  initialGameId?: GameSlug;
  initialPackageId?: string;
  onOpenPaymentModal: (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => void;
  isKillSwitchActive: boolean;
  userBalance: number;
}

export const StepRechargeWizard: React.FC<StepRechargeWizardProps> = ({
  initialGameId = 'free-fire',
  initialPackageId,
  onOpenPaymentModal,
  isKillSwitchActive,
  userBalance,
}) => {
  const { rates, toProtectedBs } = useCurrency();

  // Stepper State: 1 = Game, 2 = Player Data, 3 = Package Selection, 4 = Payment Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected State
  const [selectedGameId, setSelectedGameId] = useState<GameSlug>(initialGameId);
  const [selectedRegion, setSelectedRegion] = useState<string>('Sudamérica (SAC)');
  const [playerIdInput, setPlayerIdInput] = useState<string>('849204812');
  const [verifiedPlayer, setVerifiedPlayer] = useState<PlayerVerification | null>({
    uid: '849204812',
    nickname: 'Ghost_Striker_99',
    level: 48,
    server: 'Sudamérica (SAC)',
    verifiedAt: 'Ahora',
    isValid: true,
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Package Category & Selected Package
  const [activePackageTab, setActivePackageTab] = useState<PackageCategory | 'all'>('all');
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);

  // Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('pagomovil');
  const [hasConfirmedAccount, setHasConfirmedAccount] = useState<boolean>(false);

  // Game filter in Step 1
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'game' | 'wallet'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedGame = GAMES_DATA.find((g) => g.id === selectedGameId) || GAMES_DATA[0];

  // Update selected game if initialGameId changes
  useEffect(() => {
    if (initialGameId) {
      setSelectedGameId(initialGameId);
    }
  }, [initialGameId]);

  // Update selected package if initialPackageId changes or game changes
  useEffect(() => {
    const available = PACKAGES_DATA[selectedGameId] || [];
    if (initialPackageId) {
      const found = available.find((p) => p.id === initialPackageId);
      if (found) {
        setSelectedPackage(found);
        return;
      }
    }
    if (available.length > 0 && (!selectedPackage || selectedPackage.gameSlug !== selectedGameId)) {
      setSelectedPackage(available[0]);
    }
  }, [selectedGameId, initialPackageId]);

  // Real-time calculated price in Bs using the Currency Engine
  const getPackagePriceBs = (pkg: GamePackage): number => {
    return toProtectedBs(pkg.priceUsdt);
  };

  // Validation Handler
  const handleValidateId = () => {
    if (!playerIdInput.trim()) {
      setValidationError('Por favor ingresa un identificador válido.');
      sound.playAlert();
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    sound.playClick();

    setTimeout(() => {
      setIsValidating(false);
      sound.playSuccess();
      setVerifiedPlayer({
        uid: playerIdInput.trim(),
        nickname:
          selectedGame.serviceType === 'wallet'
            ? playerIdInput.trim()
            : `${selectedGame.name.replace(/\s+/g, '_')}_Pro_${Math.floor(Math.random() * 89 + 10)}`,
        level: Math.floor(Math.random() * 40 + 20),
        server: selectedRegion,
        verifiedAt: 'Ahora',
        isValid: true,
      });
      setHasConfirmedAccount(true);
    }, 700);
  };

  // Proceed from Step 1 to Step 2
  const handleSelectGameAndProceed = (gameId: GameSlug) => {
    sound.playClick();
    setSelectedGameId(gameId);
    const game = GAMES_DATA.find((g) => g.id === gameId);
    if (game?.serverRegions && game.serverRegions.length > 0) {
      setSelectedRegion(game.serverRegions[0]);
    }
    setCurrentStep(2);
  };

  // Dispatch payment
  const handleDispatchOrder = () => {
    if (!selectedPackage || !verifiedPlayer) return;
    sound.playClick();

    // Create package with updated Bs price
    const evaluatedPackage: GamePackage = {
      ...selectedPackage,
      priceBs: getPackagePriceBs(selectedPackage),
    };

    onOpenPaymentModal({
      game: selectedGame,
      pkg: evaluatedPackage,
      playerVerification: verifiedPlayer,
      paymentMethod: selectedPaymentMethod,
    });
  };

  const currentPackages = (PACKAGES_DATA[selectedGameId] || []).filter((pkg) => {
    if (activePackageTab === 'all') return true;
    return pkg.category === activePackageTab;
  });

  const STEPS_CONFIG = [
    { num: 1, label: 'Juego o Servicio', icon: 'sports_esports' },
    { num: 2, label: 'Datos & UID', icon: 'badge' },
    { num: 3, label: 'Combos & Pases', icon: 'diamond' },
    { num: 4, label: 'Liquidación', icon: 'payments' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8" id="flujo-recarga">
      {/* STEPPER HEADER MOTION */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0">
          {STEPS_CONFIG.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num <= currentStep || (s.num === 2 && selectedGameId)) {
                      sound.playClick();
                      setCurrentStep(s.num);
                    }
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#a78bfa] text-[#09090b] font-bold shadow-lg scale-102'
                      : isCompleted
                      ? 'bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30 font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                      isCurrent
                        ? 'bg-[#09090b] text-[#a78bfa]'
                        : isCompleted
                        ? 'bg-[#34d399] text-[#09090b]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-xs tracking-tight hidden md:inline">{s.label}</span>
                </button>

                {idx < STEPS_CONFIG.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 min-w-[20px] rounded-full transition-colors ${
                      currentStep > s.num ? 'bg-[#34d399]' : 'bg-[var(--border-color)]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER CON MOTION TRANSITIONS */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {/* =========================================================================
              PASO 1: SELECCIÓN DE VIDEOJUEGO O BILLETERA
              ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.24 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                    Paso 1: Selecciona el Juego o Billetera
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                    Elige el título al que deseas inyectar saldo. Todos cuentan con entrega inmediata por UID.
                  </p>
                </div>

                {/* Filtros de Categoría */}
                <div className="flex items-center gap-2 bg-[var(--bg-elevated)] p-1.5 rounded-2xl border border-[var(--border-color)] self-start sm:self-auto">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCatalogFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      catalogFilter === 'all' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCatalogFilter('game');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      catalogFilter === 'game' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    🎮 Videojuegos
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCatalogFilter('wallet');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      catalogFilter === 'wallet' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    💳 Billeteras
                  </button>
                </div>
              </div>

              {/* Grid de Juegos con Portadas de Alta Estética */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {GAMES_DATA.filter((g) => {
                  if (catalogFilter === 'game') return g.serviceType === 'game';
                  if (catalogFilter === 'wallet') return g.serviceType === 'wallet';
                  return true;
                }).map((game) => {
                  const isCurrent = selectedGameId === game.id;
                  const estBs = toProtectedBs(game.minPriceBs / 68.90);

                  return (
                    <motion.div
                      key={game.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectGameAndProceed(game.id)}
                      className={`group rounded-3xl bg-[var(--bg-card)] border-2 transition-all p-4 cursor-pointer relative overflow-hidden shadow-lg flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#a78bfa] ring-2 ring-[#a78bfa]/30 shadow-[0_0_30px_rgba(167,139,250,0.2)]'
                          : 'border-[var(--border-color)] hover:border-[#a78bfa]/50'
                      }`}
                    >
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-[var(--bg-elevated)] mb-3">
                        <img
                          src={game.coverImage}
                          alt={game.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#34d399] border border-white/10 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Anti-Ban
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#a78bfa] text-[#09090b] text-[10px] font-bold">
                            {game.publisher}
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                          <span className="font-extrabold text-sm truncate">{game.name}</span>
                          <span className="text-xs font-mono text-[#34d399] font-bold">{game.deliveryTime}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {game.activePassName && (
                          <div className="text-[11px] font-medium text-[#a78bfa] flex items-center gap-1 bg-[#a78bfa]/10 px-2 py-1 rounded-xl">
                            <Award className="w-3 h-3" />
                            <span className="truncate">{game.activePassName}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {game.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-mono text-[var(--text-muted)] block">Desde</span>
                          <span className="text-xs sm:text-sm font-extrabold font-mono text-[var(--text-primary)]">
                            Bs. {estBs.toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="px-3.5 py-1.5 rounded-xl bg-[#a78bfa] text-[#09090b] text-xs font-bold flex items-center gap-1 group-hover:bg-[#c4b5fd] transition-all"
                        >
                          <span>Elegir</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 2: DATOS DEL JUGADOR / IDENTIFICADOR
              ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.24 }}
              className="space-y-6"
            >
              {/* Resumen del juego seleccionado */}
              <div className="p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                    <img src={selectedGame.coverImage} alt={selectedGame.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#a78bfa] uppercase font-bold block">Juego Seleccionado</span>
                    <h4 className="text-base font-extrabold text-[var(--text-primary)]">{selectedGame.name}</h4>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">{selectedGame.providerTag}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
                >
                  Cambiar Juego
                </button>
              </div>

              {/* Formulario de Identificación Anti-Error */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                    Paso 2: Ingresa tu Identificador Oficial
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                    {selectedGame.serviceType === 'wallet'
                      ? 'Ingresa el correo electrónico o ID registrado en tu billetera virtual.'
                      : 'Ingresa tu UID o Player ID numérico. Nunca solicitamos contraseñas ni claves de acceso.'}
                  </p>
                </div>

                {/* Selector de Servidor / Región */}
                {selectedGame.serverRegions && selectedGame.serverRegions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)]">
                      Región o Servidor del Jugador:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedGame.serverRegions.map((reg) => (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedRegion(reg);
                          }}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-left ${
                            selectedRegion === reg
                              ? 'bg-[#a78bfa]/15 border-[#a78bfa] text-[#a78bfa] shadow-sm'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <span className="block">{reg}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-normal block mt-0.5">
                            Conexión directa SAC
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input UID / ID con Botón de Validación */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] flex items-center justify-between">
                    <span>{selectedGame.serviceType === 'wallet' ? 'Correo de la Billetera:' : 'UID / ID del Jugador:'}</span>
                    <span className="text-[10px] text-[#34d399] font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Inyección 100% Anti-Ban
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={playerIdInput}
                        onChange={(e) => {
                          setPlayerIdInput(e.target.value);
                          setVerifiedPlayer(null);
                        }}
                        placeholder={selectedGame.idPlaceholder}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[#a78bfa] transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleValidateId}
                      disabled={isValidating}
                      className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-md hover:bg-[#c4b5fd] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{isValidating ? 'Validando con Servidor...' : 'Verificar Cuenta'}</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-[var(--text-muted)] block">
                    {selectedGame.idFormatHint}
                  </span>
                </div>

                {/* Tarjeta de Cuenta Verificada */}
                {verifiedPlayer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-[#065f46]/20 border border-[#34d399]/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#34d399] text-[#09090b] flex items-center justify-center font-bold font-mono">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)]">
                            {verifiedPlayer.nickname}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#34d399]/20 text-[#34d399] font-bold font-mono">
                            VERIFICADO
                          </span>
                        </div>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                          UID: {verifiedPlayer.uid} • Región: {verifiedPlayer.region}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#34d399] font-mono block">Servidor Online</span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">Ping: 32ms</span>
                    </div>
                  </motion.div>
                )}

                {/* Botones de Navegación del Paso 2 */}
                <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(1);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a Juegos</span>
                  </button>

                  <button
                    type="button"
                    disabled={!verifiedPlayer}
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(3);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Continuar a Selección de Combos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 3: CATÁLOGO DE PAQUETES, PASES DE BATALLA Y EMOTES
              ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.24 }}
              className="space-y-6"
            >
              {/* Header con Tabs de Categorías */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                    Paso 3: Elige tu Combo, Pase o Emote
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                    Paquetes activos para <strong>{selectedGame.name}</strong> • Entrega a: <span className="text-[#a78bfa] font-mono font-bold">{verifiedPlayer?.nickname}</span>
                  </p>
                </div>

                {/* Tabs de paquetes */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] overflow-x-auto self-start sm:self-auto">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePackageTab('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePackageTab === 'all' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePackageTab('diamonds');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePackageTab === 'diamonds' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    💎 Diamantes
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePackageTab('passes');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePackageTab === 'passes' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    ⚔️ Pases de Batalla
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePackageTab('emotes_skins');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePackageTab === 'emotes_skins' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    🎭 Emotes & Skins
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePackageTab('neon');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      activePackageTab === 'neon' ? 'bg-[#a78bfa] text-[#09090b]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    🌟 Membresías & Combos
                  </button>
                </div>
              </div>

              {/* Grid de Paquetes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPackages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  const priceBs = getPackagePriceBs(pkg);

                  return (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPackage(pkg);
                      }}
                      className={`p-5 rounded-3xl bg-[var(--bg-card)] border-2 transition-all cursor-pointer shadow-lg flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-[#a78bfa] ring-2 ring-[#a78bfa]/30 bg-[#a78bfa]/5 shadow-[0_0_25px_rgba(167,139,250,0.2)]'
                          : 'border-[var(--border-color)] hover:border-[#a78bfa]/40'
                      }`}
                    >
                      {pkg.tag && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#ef4444] text-white text-[10px] font-bold font-mono uppercase flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-white" /> {pkg.tag}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[#a78bfa] font-bold">
                          {pkg.category === 'passes' ? '⚔️' : pkg.category === 'emotes_skins' ? '🎭' : '💎'}
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-[var(--text-primary)] leading-tight">
                            {pkg.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#34d399] font-semibold block mt-0.5">
                            {pkg.amount} {pkg.unit} {pkg.bonusAmount ? `+ ${pkg.bonusAmount}` : ''}
                          </span>
                        </div>

                        {pkg.description && (
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {pkg.description}
                          </p>
                        )}
                      </div>

                      {/* Precios en Bs y USDT */}
                      <div className="mt-5 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div>
                          <div className="text-base font-extrabold font-mono text-[var(--text-primary)]">
                            Bs. {priceBs.toFixed(2)}
                          </div>
                          <span className="text-[11px] font-mono text-[#34d399]">
                            ${pkg.priceUsdt.toFixed(2)} USDT
                          </span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-[#a78bfa] border-[#a78bfa] text-[#09090b]'
                              : 'border-[var(--border-color)] bg-[var(--bg-elevated)]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botones de Navegación del Paso 3 */}
              <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(2);
                  }}
                  className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Modificar Datos</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedPackage}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(4);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <span>Ir a Método de Pago</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 4: REVISIÓN DE ORDEN Y SELECCIÓN DE MÉTODO DE PAGO
              ========================================================================= */}
          {currentStep === 4 && selectedPackage && verifiedPlayer && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.24 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                  Paso 4: Confirma tu Orden y Método de Pago
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  Verifica todos los datos antes de emitir la orden. Recibirás tu inyección en menos de 1.8 segundos.
                </p>
              </div>

              {/* Resumen Completo de la Orden */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda: Desglose */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Selector de Método de Pago */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl space-y-4">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase font-mono">
                      Selecciona la Vía de Liquidación:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedPaymentMethod('pagomovil');
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPaymentMethod === 'pagomovil'
                            ? 'bg-[#a78bfa]/15 border-[#a78bfa] text-[var(--text-primary)] shadow-sm'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-[#a78bfa] mb-2" />
                        <span className="font-bold text-xs block">Pago Móvil BDV</span>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                          Banesco, Provincial, Mercantil
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedPaymentMethod('binance');
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPaymentMethod === 'binance'
                            ? 'bg-[#34d399]/15 border-[#34d399] text-[var(--text-primary)] shadow-sm'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <Zap className="w-5 h-5 text-[#34d399] mb-2" />
                        <span className="font-bold text-xs block">Binance Pay USDT</span>
                        <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                          Zero Fee • Pay ID Instantáneo
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedPaymentMethod('wallet');
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPaymentMethod === 'wallet'
                            ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[var(--text-primary)] shadow-sm'
                            : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <Sparkles className="w-5 h-5 text-[#38bdf8] mb-2" />
                        <span className="font-bold text-xs block">Saldo Nexus Wallet</span>
                        <span className="text-[10px] text-[#34d399] font-mono block mt-0.5">
                          Disponible: ${userBalance.toFixed(2)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Verificación de Confirmación de Jugador */}
                  <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirm-account-check"
                      checked={hasConfirmedAccount}
                      onChange={(e) => setHasConfirmedAccount(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#a78bfa] rounded cursor-pointer"
                    />
                    <label htmlFor="confirm-account-check" className="text-xs text-[var(--text-secondary)] leading-relaxed cursor-pointer">
                      Confirmo que el UID <strong className="text-[var(--text-primary)]">{verifiedPlayer.uid}</strong> y Nickname <strong className="text-[var(--text-primary)]">{verifiedPlayer.nickname}</strong> corresponden exactamente a mi cuenta de {selectedGame.name}. Entiendo que las recargas por UID son finales e irreversibles.
                    </label>
                  </div>
                </div>

                {/* Columna Derecha: Voucher de Pago */}
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                      <span className="text-xs font-mono uppercase font-bold text-[#a78bfa]">Voucher Oficial</span>
                      <span className="text-[10px] font-mono text-[#34d399] bg-[#34d399]/15 px-2 py-0.5 rounded-full font-bold">
                        100% Anti-Ban
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Videojuego:</span>
                        <span className="font-bold text-[var(--text-primary)]">{selectedGame.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Jugador:</span>
                        <span className="font-bold text-[var(--text-primary)]">{verifiedPlayer.nickname}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">UID Destino:</span>
                        <span className="text-[var(--text-primary)]">{verifiedPlayer.uid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Paquete:</span>
                        <span className="text-[#a78bfa] font-bold">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Tasa USDT Aplicada:</span>
                        <span className="text-[#34d399]">Bs. {rates.paraleloUsd.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border-color)] space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs uppercase font-mono text-[var(--text-muted)]">Total Bolívares:</span>
                        <span className="text-2xl font-extrabold font-mono text-[var(--text-primary)]">
                          Bs. {getPackagePriceBs(selectedPackage).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-[#34d399]">
                        <span>Equivalente en Cripto:</span>
                        <span>${selectedPackage.priceUsdt.toFixed(2)} USDT</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!hasConfirmedAccount}
                    onClick={handleDispatchOrder}
                    className="w-full py-4 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-xl hover:bg-[#c4b5fd] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Proceder al Pago & Acreditación</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Botones de Navegación del Paso 4 */}
              <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(3);
                  }}
                  className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Cambiar Paquete</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
