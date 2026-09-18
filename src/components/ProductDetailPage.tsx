import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, Building2, 
  Wallet, ShieldCheck, Gamepad2, Mail, User, Hash, Check,
  Sparkles, CreditCard, Tv, Music, ShoppingBag, ChevronRight
} from 'lucide-react';
import { Game, GamePackage, GameSlug, PlayerVerification, PaymentMethodType } from '../types';
import { PACKAGES_DATA, KNOWN_PLAYER_PROFILES } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';

interface ProductDetailPageProps {
  game: Game;
  onGoBack: () => void;
  onOpenPaymentModal: (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => void;
  isKillSwitchActive: boolean;
  userBalance: number;
  initialPackageId?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  game,
  onGoBack,
  onOpenPaymentModal,
  isKillSwitchActive,
  userBalance,
  initialPackageId,
}) => {
  const { toProtectedBs } = useCurrency();
  
  // Section 1: Account Identification inputs
  const [identifier, setIdentifier] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PlayerVerification | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isAccountConfirmed, setIsAccountConfirmed] = useState(false);
  
  // Section 2: Package selection
  const packages = PACKAGES_DATA[game.id as GameSlug] || [];
  const categories = useMemo(() => {
    const cats = new Set(packages.map(p => p.category || 'Recargas'));
    return ['Todos', ...Array.from(cats)];
  }, [packages]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedPackage, setSelectedPackage] = useState<GamePackage | null>(null);
  
  // Section 3: Payment method
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('pagomovil');

  // Determine what kind of product this is
  const isWalletOrZinli = game.id === 'zinli';
  const isStreaming = game.id === 'netflix' || game.id === 'spotify';
  const isGiftCard = game.id === 'steam' || game.id === 'shein';
  const isMLBB = game.id === 'mobile-legends';
  const isRoblox = game.id === 'roblox';
  const isSupercell = game.id === 'brawl-stars';

  // Initialize selected package
  useEffect(() => {
    if (initialPackageId) {
      const pkg = packages.find(p => p.id === initialPackageId);
      if (pkg) {
        setSelectedPackage(pkg);
        if (pkg.category) {
          setSelectedCategory(pkg.category);
        }
      }
    } else if (packages.length > 0 && !selectedPackage) {
      // Preselect popular or first package
      const popular = packages.find(p => p.tag?.toLowerCase().includes('popular') || p.tag?.toLowerCase().includes('master'));
      setSelectedPackage(popular || packages[0]);
    }
  }, [initialPackageId, packages]);

  // Account identifier validation & verification
  const handleVerify = () => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      setVerificationError('Por favor completa este campo.');
      try { sound.playAlert(); } catch (e) {}
      return;
    }

    if (isMLBB && !zoneId.trim()) {
      setVerificationError('Debes ingresar tu Server Zone ID de 4 dígitos.');
      try { sound.playAlert(); } catch (e) {}
      return;
    }
    
    // Validate format
    if (game.regexPattern) {
      const regex = new RegExp(game.regexPattern);
      if (!regex.test(cleanId)) {
        setVerificationError(game.idFormatHint || 'El formato ingresado no es válido.');
        try { sound.playAlert(); } catch (e) {}
        return;
      }
    }
    
    setVerificationError(null);
    setIsVerifying(true);
    try { sound.playClick(); } catch (e) {}
    
    setTimeout(() => {
      setIsVerifying(false);
      const cleanKey = cleanId.toLowerCase();
      const profile = KNOWN_PLAYER_PROFILES[cleanId] || KNOWN_PLAYER_PROFILES[cleanKey];
      
      if (profile) {
        setVerificationResult({
          isValid: true,
          nickname: profile.nickname,
          level: profile.level,
          server: isMLBB ? `Zona ${zoneId.trim()} (${profile.server})` : profile.server,
          uid: isMLBB ? `${cleanId} (${zoneId.trim()})` : cleanId,
          verifiedAt: 'Verificado ahora'
        });
        setIsAccountConfirmed(true);
        try { sound.playSuccess(); } catch (e) {}
      } else {
        // Generate realistic verified identity based on category
        let nickname = `Usuario_${cleanId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 7)}`;
        let server = game.serverRegions[0] || 'Oficial';

        if (isWalletOrZinli) {
          nickname = `Zinli: ${cleanId.split('@')[0].toUpperCase()}`;
          server = 'Zinli Visa (Panamá) - Activa';
        } else if (isStreaming) {
          nickname = `Entrega Digital a: ${cleanId}`;
          server = `${game.name} Oficial`;
        } else if (isGiftCard) {
          nickname = `Código PIN a: ${cleanId}`;
          server = `${game.name} Global`;
        } else if (isRoblox) {
          nickname = cleanId.startsWith('@') ? cleanId : `@${cleanId}`;
          server = 'Roblox Global';
        } else if (isMLBB) {
          nickname = `Player_${cleanId.slice(0, 6)}`;
          server = `Servidor Zona ${zoneId.trim() || '2041'}`;
        }

        setVerificationResult({
          isValid: true,
          nickname,
          level: isWalletOrZinli || isStreaming || isGiftCard ? 1 : Math.floor(Math.random() * 45 + 25),
          server,
          uid: isMLBB ? `${cleanId} (${zoneId.trim()})` : cleanId,
          verifiedAt: 'Verificado ahora'
        });
        setIsAccountConfirmed(true);
        try { sound.playSuccess(); } catch (e) {}
      }
    }, 1200);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (verificationResult || verificationError) {
      setVerificationResult(null);
      setVerificationError(null);
      setIsAccountConfirmed(false);
    }
  };

  const filteredPackages = useMemo(() => {
    if (selectedCategory === 'Todos') return packages;
    return packages.filter(p => (p.category || 'Recargas') === selectedCategory);
  }, [packages, selectedCategory]);

  const canSubmit = isAccountConfirmed && selectedPackage && selectedPayment && !isKillSwitchActive;

  const handleSubmit = () => {
    if (canSubmit && verificationResult && selectedPackage) {
      try { sound.playClick(); } catch (e) {}
      onOpenPaymentModal({
        game,
        pkg: selectedPackage,
        playerVerification: verificationResult,
        paymentMethod: selectedPayment,
      });
    }
  };

  const paymentMethods: { id: PaymentMethodType; label: string; icon: React.ReactNode; subtitle: string; badge?: string }[] = [
    { 
      id: 'pagomovil', 
      label: 'Pago Móvil BDV', 
      icon: <Building2 className="w-5 h-5 text-[#34d399]" />, 
      subtitle: 'Banco de Venezuela / Interbancario', 
      badge: 'Más Usado' 
    },
    { 
      id: 'banesco', 
      label: 'Pago Móvil Banesco', 
      icon: <Building2 className="w-5 h-5 text-[#38bdf8]" />, 
      subtitle: 'Banesco Banco Universal' 
    },
    { 
      id: 'binance', 
      label: 'Binance Pay (USDT)', 
      icon: <span className="text-base font-bold text-[#f59e0b]">₿</span>, 
      subtitle: 'Pay ID / Red BSC (0% comisión)', 
      badge: 'Instantáneo' 
    },
    { 
      id: 'wallet', 
      label: 'Saldo Nexus Wallet', 
      icon: <Wallet className="w-5 h-5 text-[#a78bfa]" />, 
      subtitle: `Saldo disponible: $${userBalance.toFixed(2)} USD` 
    },
  ];

  // Dynamic icon and placeholder for the input
  const getIdentifierIcon = () => {
    if (isWalletOrZinli) return <CreditCard className="w-5 h-5 text-[var(--accent)]" />;
    if (isStreaming) return <Tv className="w-5 h-5 text-[var(--accent)]" />;
    if (isGiftCard) return <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />;
    if (isRoblox) return <User className="w-5 h-5 text-[var(--accent)]" />;
    return <Gamepad2 className="w-5 h-5 text-[var(--accent)]" />;
  };

  const getSectionTitle = () => {
    if (isWalletOrZinli) return '1. Correo de tu cuenta Zinli';
    if (isStreaming) return '1. Correo de entrega de PIN / Cuenta';
    if (isGiftCard) return '1. Correo para recibir tu Código Digital';
    if (isRoblox) return '1. Usuario oficial de Roblox';
    if (isMLBB) return '1. User ID y Server Zone ID';
    return '1. Ingresa tu ID de Jugador';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-28 text-[var(--text-primary)]">
      {/* Top Breadcrumb & Product Banner */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                try { sound.playClick(); } catch (e) {}
                onGoBack();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Tienda</span>
            </button>
            
            <div className="h-6 w-px bg-[var(--border-default)] hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <img 
                src={game.coverImage} 
                alt={game.name} 
                className="w-12 h-12 rounded-xl object-cover border border-[var(--border-default)] shadow-sm" 
              />
              <div>
                <h1 className="font-extrabold text-xl leading-tight text-[var(--text-primary)]">{game.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--accent)] font-semibold">
                    {game.providerTag}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">•</span>
                  <span className="text-xs text-[var(--color-success)] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Entrega {game.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs">
            <span className="text-[var(--text-muted)]">Categoría:</span>
            <span className="font-semibold text-[var(--text-primary)]">{game.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* ═══════════════════════════════════════════════════════════════
            PASO 1: DATOS DE LA CUENTA (ADAPTADO POR TIPO DE PRODUCTO)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-default)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center text-sm font-extrabold">1</span>
              <span>{getSectionTitle()}</span>
            </h2>
            <span className="text-xs text-[var(--text-muted)]">Paso obligatorio</span>
          </div>

          {/* Contextual advice banner */}
          <div className="mb-5 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <div>
              {isWalletOrZinli ? (
                <p>Transferencia instantánea en dólares directos a tu app Zinli con <strong>0% de comisión de red</strong>. Solo necesitas el correo asociado a tu cuenta.</p>
              ) : isStreaming ? (
                <p>Recibirás tu código PIN oficial de {game.name} en el correo especificado inmediatamente tras confirmar el pago.</p>
              ) : isGiftCard ? (
                <p>Tu código digital oficial canjeable en {game.name} se enviará a este correo electrónico con instrucciones de canje paso a paso.</p>
              ) : isMLBB ? (
                <p>Ingresa tu User ID y los 4 dígitos de tu Server Zone ID (ej: 491028301 y Zona 2041). Lo encuentras pulsando en tu avatar dentro del juego.</p>
              ) : isRoblox ? (
                <p>Ingresa tu @username oficial de Roblox. <strong>Nunca te pediremos contraseñas</strong> ni acceso a tu cuenta.</p>
              ) : (
                <p>Ingresa tu ID numérico de jugador (UID). Nuestro sistema verificará tu Nickname antes de pagar para garantizar que los diamantes lleguen a tu cuenta correcta.</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                {game.accountIdentifierLabel || 'ID de Jugador o Cuenta'}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Main input */}
                <div className={`relative ${isMLBB ? 'sm:col-span-8' : 'sm:col-span-9'}`}>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    {getIdentifierIcon()}
                  </div>
                  <input
                    type={isWalletOrZinli || isStreaming || isGiftCard ? 'email' : 'text'}
                    value={identifier}
                    onChange={handleIdChange}
                    placeholder={game.idPlaceholder}
                    className="w-full pl-11 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-sm transition-all"
                  />
                </div>

                {/* Additional Zone ID input for Mobile Legends */}
                {isMLBB && (
                  <div className="relative sm:col-span-4">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      value={zoneId}
                      onChange={(e) => {
                        setZoneId(e.target.value);
                        setVerificationResult(null);
                        setIsAccountConfirmed(false);
                      }}
                      placeholder={game.zonePlaceholder || 'Zona: 2041'}
                      className="w-full pl-9 pr-3 py-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none text-sm transition-all"
                    />
                  </div>
                )}

                {/* Verify action button */}
                <div className="sm:col-span-3">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!identifier.trim() || isVerifying || !!verificationResult}
                    className="w-full py-3 bg-[var(--accent)] text-[var(--text-inverse)] font-bold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verificando...</span>
                      </>
                    ) : verificationResult ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                        <span>Verificado</span>
                      </>
                    ) : (
                      <span>Verificar Cuenta</span>
                    )}
                  </button>
                </div>
              </div>

              {game.idFormatHint && (
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  💡 {game.idFormatHint}
                </p>
              )}

              {verificationError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-medium mt-2.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{verificationError}</span>
                </div>
              )}
            </div>

            {/* Verification Success Card */}
            {verificationResult && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                          {isWalletOrZinli ? 'Cuenta Zinli Encontrada' : isStreaming || isGiftCard ? 'Destino Confirmado' : 'Cuenta de Jugador Verificada'}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[var(--text-primary)]">
                        {verificationResult.nickname}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {isWalletOrZinli || isStreaming || isGiftCard 
                          ? `Destino: ${verificationResult.uid}` 
                          : `UID: ${verificationResult.uid} • Servidor: ${verificationResult.server} • Nivel: ${verificationResult.level}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mandatory confirmation checkbox */}
                <label className="flex items-start gap-2.5 pt-2 border-t border-emerald-500/20 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAccountConfirmed}
                    onChange={(e) => setIsAccountConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 accent-[var(--accent)] cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text-primary)] font-medium">
                    {isWalletOrZinli 
                      ? 'Confirmo que este correo pertenece a mi cuenta Zinli activa.'
                      : isStreaming || isGiftCard
                      ? 'Confirmo que tengo acceso a este correo para recibir el código PIN.'
                      : 'Confirmo que este Nickname y servidor corresponden a mi cuenta de juego.'}
                  </span>
                </label>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PASO 2: SELECCIÓN DE RECARGA / PAQUETE
            ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-default)] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center text-sm font-extrabold">2</span>
              <span>Selecciona tu Recarga o Paquete</span>
            </h2>

            {/* Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      try { sound.playClick(); } catch (e) {}
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[var(--accent)] text-[var(--text-inverse)] shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                    }`}
                  >
                    {cat === 'diamonds' ? '💎 Monedas' : cat === 'passes' ? '🎟️ Pases' : cat === 'giftcards' ? '🎁 Gift Cards' : cat === 'balance' ? '💵 Saldo' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid of Packages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              const priceBs = toProtectedBs(pkg.priceUsdt);

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    try { sound.playClick(); } catch (e) {}
                    setSelectedPackage(pkg);
                  }}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_18px_rgba(167,139,250,0.25)] scale-[1.01]' 
                      : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {/* Tag badge */}
                  {pkg.tag && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)] text-[var(--text-inverse)] shadow-sm">
                      {pkg.tag}
                    </span>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-base text-[var(--text-primary)] leading-snug">
                        {pkg.name}
                      </h4>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {pkg.description && (
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="pt-3 border-t border-[var(--border-default)] mt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Total en Bolívares:</span>
                      <span className="text-base font-extrabold text-[var(--text-primary)] font-mono">
                        Bs. {priceBs.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[var(--accent)] font-mono bg-[var(--accent)]/10 px-2 py-1 rounded-md">
                        ${pkg.priceUsdt.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PASO 3: MÉTODO DE PAGO EN VENEZUELA
            ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-default)] shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center text-sm font-extrabold">3</span>
              <span>Elige tu Medio de Pago</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 ml-9.5">
              Aceptamos pagos en Bolívares con conciliación rápida o en USDT sin comisiones de red.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;

              return (
                <div
                  key={method.id}
                  onClick={() => {
                    try { sound.playClick(); } catch (e) {}
                    setSelectedPayment(method.id);
                  }}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_15px_rgba(167,139,250,0.2)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-emphasis)]'
                  }`}
                >
                  {method.badge && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--color-success)] text-emerald-950">
                      {method.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center justify-center flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{method.label}</h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {method.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            RESUMEN DE ORDEN & CTA FLOTANTE
            ═══════════════════════════════════════════════════════════════ */}
        {selectedPackage && (
          <div className="bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--accent)]/50 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Order Summary text */}
              <div className="space-y-1.5 text-center md:text-left w-full md:w-auto">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                    Resumen del Pedido
                  </span>
                  {isAccountConfirmed ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cuenta confirmada
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Falta verificar cuenta en el Paso 1
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-[var(--text-primary)]">
                  {selectedPackage.name} — {game.name}
                </h3>

                <p className="text-sm text-[var(--text-secondary)]">
                  Total a pagar:{' '}
                  <strong className="text-[var(--text-primary)] font-mono text-base">
                    Bs. {toProtectedBs(selectedPackage.priceUsdt).toFixed(2)}
                  </strong>{' '}
                  <span className="text-xs font-mono text-[var(--accent)]">
                    (${selectedPackage.priceUsdt.toFixed(2)} USD)
                  </span>
                  {' '}• Vía:{' '}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {paymentMethods.find(m => m.id === selectedPayment)?.label}
                  </span>
                </p>
              </div>

              {/* Action Button */}
              <div className="w-full md:w-auto flex flex-col items-center md:items-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full md:w-auto px-8 py-4 bg-[var(--cta-bg)] hover:bg-[var(--cta-hover)] text-[var(--cta-text)] font-extrabold text-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>CONTINUAR AL PAGO</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-[11px] text-[var(--text-muted)] mt-1.5 text-center">
                  Despacho directo en menos de 2 minutos
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
