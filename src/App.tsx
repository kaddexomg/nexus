import React, { useState, useEffect } from 'react';
import { Header, MainNavTab } from './components/Header';
import { DynamicIsland } from './components/DynamicIsland';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { StepRechargeWizard } from './components/StepRechargeWizard';
import { ZinliWalletSection } from './components/ZinliWalletSection';
import { InteractiveTournamentHub } from './components/InteractiveTournamentHub';
import { LiveRateDashboard } from './components/LiveRateDashboard';
import { OrderSearchSection } from './components/OrderSearchSection';
import { GameCatalog } from './components/GameCatalog';
import { NexusBotWidget } from './components/NexusBotWidget';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { ArchitectureGuideModal } from './components/ArchitectureGuideModal';
import { CommunityDiscord } from './components/CommunityDiscord';
import { Footer } from './components/Footer';

import { Game, GamePackage, GameSlug, Order, PaymentMethodType, PlayerVerification } from './types';
import { sound } from './utils/audio';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Multi-Screen Router with Motion Transitions (User's primary requirement)
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');

  // Preselection states for linking Banners and Catalog directly to Recharge Wizard
  const [preselectedGameId, setPreselectedGameId] = useState<GameSlug>('free-fire');
  const [preselectedPackageId, setPreselectedPackageId] = useState<string>('ff-1060');

  // Modal visibility states
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);

  // Active transaction states
  const [paymentOrderData, setPaymentOrderData] = useState<{
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  } | null>(null);

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // System & Operator States
  const [isKillSwitchActive, setIsKillSwitchActive] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(142.50);

  // Initial orders for internal testing and order lookup
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

  // Secret keyboard combo (Ctrl+Shift+A) for internal operators only - NO client-visible buttons
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

  // Handler to open Payment Modal from Terminal / Wizard
  const handleOpenPaymentModal = (data: {
    game: Game;
    pkg: GamePackage;
    playerVerification: PlayerVerification;
    paymentMethod: PaymentMethodType;
  }) => {
    setPaymentOrderData(data);
    setIsPaymentModalOpen(true);
  };

  // Handler when user submits payment reference or wallet pay
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

  // Operator approvals & rejections
  const handleApproveOrder = (orderId: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    sound.playSuccess();
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
    sound.playAlert();
  };

  const handleToggleKillSwitch = () => {
    setIsKillSwitchActive((prev) => !prev);
  };

  // Smooth transition from Banners / Catalog into Guided Recharge Wizard
  const navigateToRecharge = (gameId?: GameSlug, packageId?: string) => {
    sound.playClick();
    if (gameId) {
      setPreselectedGameId(gameId);
    }
    if (packageId) {
      setPreselectedPackageId(packageId);
    }
    setActiveTab('recharge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTournaments = () => {
    sound.playClick();
    setActiveTab('tournaments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[#a78bfa]/30 selection:text-[#ede9fe] font-sans antialiased overflow-x-hidden transition-colors duration-250">
      {/* Fixed Modern Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        isKillSwitchActive={isKillSwitchActive}
        userBalance={userBalance}
      />

      {/* Main Page Layout with Motion Transitions between Screens */}
      <main className="pt-24 pb-16">
        {/* Dynamic Island Status Notification */}
        <DynamicIsland />

        <AnimatePresence mode="wait">
          {/* =========================================================================
              PANTALLA 1: INICIO (HOME, BANNERS VIP Y CATÁLOGO DESTACADO)
              ========================================================================= */}
          {activeTab === 'home' && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Hero con headline de recargas en Bolívares / USDT y Banners interactivos */}
              <Hero
                onScrollToTerminal={navigateToRecharge}
                onScrollToTournaments={navigateToTournaments}
                onOpenArchitecture={() => setIsArchitectureOpen(true)}
              />

              {/* Marquee Ticker de Actividad en Vivo */}
              <MarqueeTicker />

              {/* Catálogo de Títulos Oficiales Soportados */}
              <GameCatalog onSelectGame={(gameId) => navigateToRecharge(gameId)} />
            </motion.div>
          )}

          {/* =========================================================================
              PANTALLA 2: FLUJO DE RECARGA GUIADO PASO A PASO (WIZARD)
              ========================================================================= */}
          {activeTab === 'recharge' && (
            <motion.div
              key="recharge-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <StepRechargeWizard
                initialGameId={preselectedGameId}
                initialPackageId={preselectedPackageId}
                onOpenPaymentModal={handleOpenPaymentModal}
                isKillSwitchActive={isKillSwitchActive}
                userBalance={userBalance}
              />
            </motion.div>
          )}

          {/* =========================================================================
              PANTALLA 3: BILLETERAS VIRTUALES (ZINLI VISA, STEAM, SHEIN)
              ========================================================================= */}
          {activeTab === 'wallets' && (
            <motion.div
              key="wallets-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ZinliWalletSection onOpenPaymentModal={handleOpenPaymentModal} />
            </motion.div>
          )}

          {/* =========================================================================
              PANTALLA 4: NEXUS ARENA (SISTEMA DE TORNEOS CON SALAS Y BRACKETS)
              ========================================================================= */}
          {activeTab === 'tournaments' && (
            <motion.div
              key="tournaments-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InteractiveTournamentHub />
            </motion.div>
          )}

          {/* =========================================================================
              PANTALLA 5: MONITOR DE DIVISAS & MOTOR DE MARGEN EN TIEMPO REAL
              ========================================================================= */}
          {activeTab === 'rates' && (
            <motion.div
              key="rates-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <LiveRateDashboard onNavigateToRecharge={() => setActiveTab('recharge')} />
            </motion.div>
          )}

          {/* =========================================================================
              PANTALLA 6: RASTREADOR DE ÓRDENES EN TIEMPO REAL
              ========================================================================= */}
          {activeTab === 'tracking' && (
            <motion.div
              key="tracking-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <OrderSearchSection
                orders={pendingOrders}
                onOpenRecharge={() => setActiveTab('recharge')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* NEXUS BOT: Asistente interactivo flotante */}
      <NexusBotWidget
        onScrollToRecharge={() => navigateToRecharge()}
        onScrollToTournaments={navigateToTournaments}
      />

      {/* Footer */}
      <Footer
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
      />

      {/* Modals */}
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
          navigateToRecharge();
        }}
      />

      {/* Hidden Admin Console - accessible strictly via internal keyboard combo Ctrl+Shift+A */}
      <AdminConsoleModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pendingOrders={pendingOrders}
        onApproveOrder={handleApproveOrder}
        onRejectOrder={handleRejectOrder}
        isKillSwitchActive={isKillSwitchActive}
        onToggleKillSwitch={handleToggleKillSwitch}
      />

      <ArchitectureGuideModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <CommunityDiscord
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />
    </div>
  );
}
