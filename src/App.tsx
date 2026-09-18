import React, { useState, useEffect } from 'react';
import { Header, MainNavTab } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { TournamentSection } from './components/TournamentSection';
import { ZinliWalletSection } from './components/ZinliWalletSection';
import { InteractiveTournamentHub } from './components/InteractiveTournamentHub';
import { OrderSearchSection } from './components/OrderSearchSection';
import { NexusBotWidget } from './components/NexusBotWidget';
import { SocialProofToast } from './components/SocialProofToast';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { CommunityDiscord } from './components/CommunityDiscord';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { supabase } from './services/supabase';

import { Game, GamePackage, GameSlug, Order, PaymentMethodType, PlayerVerification } from './types';
import { GAMES_DATA } from './data/mockData';
import { sound } from './utils/audio';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// ═══════════════════════════════════════════════════════════════
// APP — Nexus Recharge
// Navigation: Homepage (scroll) / Product Detail / Tournaments / Wallets / Tracking
// ═══════════════════════════════════════════════════════════════

type AppView = 'home' | 'product' | 'tournaments' | 'wallets' | 'tracking';

export default function App() {
  // ── View state ──
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [appView, setAppView] = useState<AppView>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>();
  const [hoveredGame, setHoveredGame] = useState<Game | null>(null);

  // ── Auth & Supabase state ──
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin'>('login');

  // ── Modal states ──
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);

  // ── Transaction state ──
  const [paymentOrderData, setPaymentOrderData] = useState<{
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  } | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // ── System state ──
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [userBalance, setUserBalance] = useState(142.50);

  // ── Orders ──
  const [pendingOrders, setPendingOrders] = useState<Order[]>([
    {
      id: 'ord-bdv-9841',
      userId: 'usr-9281',
      gameId: 'free-fire',
      gameName: 'Free Fire SAC',
      packageId: 'ff-1060',
      packageName: '1,060 + 106 💎 Doble Recarga',
      amountBs: 647.66,
      amountUsdt: 9.40,
      targetPlayerId: '849204812',
      verifiedNickname: 'Ghost_Striker_99',
      paymentMethod: 'pagomovil',
      paymentReference: '748192',
      status: 'completed',
      createdAt: 'Hace 3 min',
    },
    {
      id: 'ord-binance-3912',
      userId: 'usr-4109',
      gameId: 'cod-mobile',
      gameName: 'Call of Duty: Mobile',
      packageId: 'cod-420',
      packageName: '420 CP Battle Pass Points',
      amountBs: 343.81,
      amountUsdt: 4.99,
      targetPlayerId: '918237190',
      verifiedNickname: 'Vortex_Sniper',
      paymentMethod: 'binance',
      paymentReference: 'BIN-PAY-98102',
      status: 'completed',
      createdAt: 'Hace 8 min',
    },
    {
      id: 'ord-zinli-1049',
      userId: 'usr-8821',
      gameId: 'zinli',
      gameName: 'Zinli Dólares Visa',
      packageId: 'zin-10',
      packageName: 'Recarga $10.00 USD Visa Panamá',
      amountBs: 744.12,
      amountUsdt: 10.80,
      targetPlayerId: 'carlos.gamer@gmail.com',
      verifiedNickname: 'Zinli_Carlos',
      paymentMethod: 'pagomovil',
      paymentReference: 'BDV-391820',
      status: 'completed',
      createdAt: 'Hace 15 min',
    },
  ]);

  // ── Admin shortcut Ctrl+Shift+A ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Navigate to a game's product detail page ──
  const navigateToProduct = (gameId: GameSlug, packageId?: string) => {
    try { sound.playClick(); } catch {}
    const game = GAMES_DATA.find((g) => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setSelectedPackageId(packageId);
      setAppView('product');
      setActiveTab('recharge');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Navigate to tournaments ──
  const navigateToTournaments = () => {
    try { sound.playClick(); } catch {}
    setAppView('tournaments');
    setActiveTab('tournaments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Go back to homepage ──
  const goHome = () => {
    try { sound.playClick(); } catch {}
    setSelectedGame(null);
    setSelectedPackageId(undefined);
    setAppView('home');
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Payment Modal ──
  const handleOpenPaymentModal = (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => {
    setPaymentOrderData(data);
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPaymentOrder = (referenceNumber: string) => {
    if (!paymentOrderData) return;

    if (paymentOrderData.paymentMethod === 'wallet') {
      setUserBalance((prev) => Math.max(0, prev - paymentOrderData.pkg.priceUsdt));
    }

    const newOrder: Order = {
      id: `ord-${Math.floor(Math.random() * 899999 + 100000)}`,
      userId: 'usr-current',
      gameId: paymentOrderData.game.id,
      gameName: paymentOrderData.game.name,
      packageId: paymentOrderData.pkg.id,
      packageName: paymentOrderData.pkg.name,
      amountBs: paymentOrderData.pkg.priceBs,
      amountUsdt: paymentOrderData.pkg.priceUsdt,
      targetPlayerId: paymentOrderData.playerVerification.uid,
      verifiedNickname: paymentOrderData.playerVerification.nickname,
      paymentMethod: paymentOrderData.paymentMethod,
      paymentReference: referenceNumber,
      status: 'completed',
      createdAt: 'Ahora mismo',
    };

    setIsPaymentModalOpen(false);
    setActiveOrder(newOrder);
    setIsOrderTrackingOpen(true);

    if (paymentOrderData.paymentMethod !== 'wallet') {
      setPendingOrders((prev) => [newOrder, ...prev]);
    }
  };

  // ── Admin handlers ──
  const handleApproveOrder = (orderId: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    try { sound.playSuccess(); } catch {}
  };

  const handleRejectOrder = (_orderId: string, _reason: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== _orderId));
    try { sound.playAlert(); } catch {}
  };

  // ── Header tab handler (maps tabs to views) ──
  const handleSetActiveTab = (tab: MainNavTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      goHome();
    } else if (tab === 'tournaments') {
      navigateToTournaments();
    } else if (tab === 'wallets') {
      try { sound.playClick(); } catch {}
      setAppView('wallets');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'tracking') {
      try { sound.playClick(); } catch {}
      setAppView('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'recharge') {
      if (!selectedGame) {
        navigateToProduct('free-fire');
      } else {
        setAppView('product');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // ── Reactive Illumination & Dynamic Ambient Lighting ──
  const activeGame = selectedGame || hoveredGame;
  const activeThemeColor = activeGame?.themeColor || '#f59e0b';
  const activeGlowColor = activeGame?.glowColor || 'rgba(245, 158, 11, 0.25)';

  // ── Scroll Parallax Depth ──
  const { scrollY } = useScroll();
  const orb1Y = useTransform(scrollY, [0, 2000], [0, 420]);
  const orb2Y = useTransform(scrollY, [0, 2000], [0, -320]);
  const orb3Y = useTransform(scrollY, [0, 2000], [0, 250]);

  return (
    <div 
      className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased overflow-x-hidden transition-colors duration-300 relative"
      style={{
        // @ts-ignore
        '--brand-current': activeThemeColor,
        '--brand-glow': activeGlowColor,
      }}
    >
      {/* ═══ Dynamic Reactive Breathing Ambient Illumination Engine ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700">
        {/* Dynamic morphing radial spotlight directly behind view */}
        <motion.div
          animate={{
            background: `radial-gradient(ellipse 90% 65% at 50% -10%, ${activeThemeColor}35, transparent 75%)`,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
        />

        {/* Dynamic Horizontal Laser / Neon Ray across top banner */}
        <motion.div
          animate={{
            backgroundColor: activeThemeColor,
            opacity: activeGame ? 0.85 : 0.3,
            boxShadow: `0 0 40px 10px ${activeGlowColor}`,
          }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 inset-x-0 h-[2px] transition-all"
        />

        {/* Fluid Breathing Luminous Orb 1 (Left Top / Hero focus) */}
        <motion.div
          style={{ y: orb1Y }}
          animate={{
            backgroundColor: activeThemeColor,
            opacity: activeGame ? 0.35 : 0.12,
            scale: activeGame ? [1.25, 1.45, 1.25] : [1, 1.15, 1],
            x: [0, 50, -40, 0],
          }}
          transition={{
            backgroundColor: { duration: 0.35, ease: 'easeOut' },
            opacity: { duration: 0.35 },
            scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -top-36 -left-36 w-[620px] h-[620px] rounded-full blur-[140px] transform-gpu will-change-transform"
        />

        {/* Fluid Breathing Luminous Orb 2 (Right Mid / Catalog focus) */}
        <motion.div
          style={{ y: orb2Y }}
          animate={{
            backgroundColor: activeThemeColor,
            opacity: activeGame ? 0.30 : 0.10,
            scale: activeGame ? [1.2, 1.42, 1.2] : [0.95, 1.12, 0.95],
            y: [0, -60, 45, 0],
          }}
          transition={{
            backgroundColor: { duration: 0.35, ease: 'easeOut' },
            opacity: { duration: 0.35 },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 13, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute top-1/3 -right-44 w-[560px] h-[560px] rounded-full blur-[150px] transform-gpu will-change-transform"
        />

        {/* Fluid Breathing Luminous Orb 3 (Bottom Center / Pulse Aura) */}
        <motion.div
          style={{ y: orb3Y }}
          animate={{
            backgroundColor: activeThemeColor,
            opacity: activeGame ? 0.28 : 0.08,
            scale: activeGame ? [1.1, 1.35, 1.1] : [0.9, 1.1, 0.9],
            x: [0, -35, 30, 0],
          }}
          transition={{
            backgroundColor: { duration: 0.35, ease: 'easeOut' },
            opacity: { duration: 0.35 },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute bottom-16 left-1/3 w-[480px] h-[480px] rounded-full blur-[140px] transform-gpu will-change-transform"
        />

        {/* Cyber micro-grid layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* ═══ Sticky Header ═══ */}
      <div className="relative z-30">
        <Header
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          onOpenArchitecture={() => {}}
          onOpenCommunity={() => setIsCommunityOpen(true)}
          onSelectGame={(gameId) => navigateToProduct(gameId)}
          onOpenAuth={(tab) => {
            setAuthModalTab(tab);
            setIsAuthModalOpen(true);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isKillSwitchActive={isKillSwitchActive}
          userBalance={profile?.walletBalanceUsd ?? userBalance}
        />
      </div>

      {/* ═══ Main Content ═══ */}
      <main className="relative z-10 pt-20 sm:pt-24 pb-8">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════
              HOME — Continuous scroll landing page
              ═══════════════════════════════════════════════ */}
          {appView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hero Banner Carousel */}
              <Hero
                onScrollToTerminal={navigateToProduct}
                onScrollToTournaments={navigateToTournaments}
              />

              {/* Product Catalog — Recomendados + Populares */}
              <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12">
                <ProductCatalog 
                  onSelectGame={(gameId) => navigateToProduct(gameId)} 
                  onHoverGame={setHoveredGame}
                />
              </div>

              {/* Tournaments Section — Portadas + Community Banner */}
              <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-16">
                <TournamentSection
                  onViewTournaments={navigateToTournaments}
                  onOpenCommunity={() => setIsCommunityOpen(true)}
                />
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              PRODUCT DETAIL — Single-page checkout
              ═══════════════════════════════════════════════ */}
          {appView === 'product' && selectedGame && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ProductDetailPage
                game={selectedGame}
                onGoBack={goHome}
                onOpenPaymentModal={handleOpenPaymentModal}
                isKillSwitchActive={isKillSwitchActive}
                userBalance={userBalance}
                initialPackageId={selectedPackageId}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              TOURNAMENTS — Full tournament hub
              ═══════════════════════════════════════════════ */}
          {appView === 'tournaments' && (
            <motion.div
              key="tournaments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <InteractiveTournamentHub />
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              WALLETS — Zinli, Steam, Shein
              ═══════════════════════════════════════════════ */}
          {appView === 'wallets' && (
            <motion.div
              key="wallets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ZinliWalletSection onOpenPaymentModal={handleOpenPaymentModal} />
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              TRACKING — Order search
              ═══════════════════════════════════════════════ */}
          {appView === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <OrderSearchSection
                orders={pendingOrders}
                onOpenRecharge={goHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══ Social Proof Toast (replaces DynamicIsland) ═══ */}
      <SocialProofToast />

      {/* ═══ NexusBot Widget ═══ */}
      <NexusBotWidget
        onScrollToRecharge={goHome}
        onScrollToTournaments={navigateToTournaments}
      />

      {/* ═══ Footer ═══ */}
      <Footer
        onOpenArchitecture={() => {}}
        onOpenCommunity={() => setIsCommunityOpen(true)}
      />

      {/* ═══ Modals ═══ */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={paymentOrderData}
        onSubmitOrder={handleSubmitPaymentOrder}
      />

      <OrderTrackingModal
        order={activeOrder}
        onClose={() => setIsOrderTrackingOpen(false)}
        onNewRecharge={() => {
          setIsOrderTrackingOpen(false);
          goHome();
        }}
      />

      <AdminConsoleModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pendingOrders={pendingOrders}
        onApproveOrder={handleApproveOrder}
        onRejectOrder={handleRejectOrder}
        isKillSwitchActive={isKillSwitchActive}
        onToggleKillSwitch={() => setIsKillSwitchActive((prev) => !prev)}
      />

      <CommunityDiscord
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onOpenAdminConsole={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
