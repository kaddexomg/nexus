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
import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* ═══ Sticky Header ═══ */}
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

      {/* ═══ Main Content ═══ */}
      <main className="pt-20 sm:pt-24 pb-8">
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
                <ProductCatalog onSelectGame={(gameId) => navigateToProduct(gameId)} />
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
