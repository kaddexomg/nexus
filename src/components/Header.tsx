import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Search, Moon, Sun, Sparkles, Home, Trophy, CreditCard, Clock, X, ChevronRight, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { GAMES_DATA } from '../data/mockData';
import { GameSlug } from '../types';

export type MainNavTab = 'home' | 'recharge' | 'wallets' | 'tournaments' | 'rates' | 'tracking';

export interface HeaderProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenArchitecture: () => void;
  onOpenCommunity: () => void;
  onSelectGame?: (gameId: GameSlug) => void;
  onOpenAuth?: (tab: 'login' | 'register' | 'admin') => void;
  onOpenAdmin?: () => void;
  isKillSwitchActive: boolean;
  userBalance: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab,
  onSelectGame,
  onOpenAuth,
  onOpenAdmin,
  userBalance 
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (tab: MainNavTab) => {
    try { sound.playClick(); } catch (e) {}
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={18} />;
    if (theme === 'light') return <Sun size={18} />;
    return <Sparkles size={18} />;
  };

  const filteredSearchResults = searchQuery.trim() 
    ? GAMES_DATA.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (slug: GameSlug) => {
    try { sound.playClick(); } catch (e) {}
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectGame) {
      onSelectGame(slug);
    } else {
      setActiveTab('recharge');
    }
  };

  return (
    <>
      {/* ═══ Desktop Header ═══ */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[var(--bg-surface)]/90 border-b border-[var(--border-default)] shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center text-[var(--text-inverse)] shadow-md group-hover:scale-105 transition-transform">
              <Zap size={20} className="fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-[var(--text-primary)] leading-none">
                NEXUS<span className="text-[var(--accent)]">RECHARGE</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-medium mt-0.5">
                Recargas & Esports VE
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'home' || activeTab === 'recharge' 
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Tienda
            </button>

            <button
              onClick={() => handleNavClick('wallets')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'wallets' 
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Zinli & Gift Cards</span>
            </button>

            <button
              onClick={() => handleNavClick('tournaments')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tournaments' 
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Torneos</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-400/20 text-amber-400">$1/kill</span>
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tracking' 
                  ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Rastrear Pedido</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Search Toggle Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
              title="Buscar videojuego o servicio"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => {
                try { sound.playClick(); } catch (e) {}
                toggleTheme();
              }}
              className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
              title="Cambiar tema de color"
            >
              {getThemeIcon()}
            </button>

            {/* Auth / Profile Area */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-default)]">
              {/* Quick Admin Access Button */}
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    try { sound.playClick(); } catch {}
                    onOpenAdmin();
                  }}
                  title="Panel de Control Staff / PINes (Ctrl+Shift+A)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Shield size={13} />
                  <span className="hidden lg:inline">Admin</span>
                </button>
              )}

              {user ? (
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <span className="hidden xl:inline-block font-mono text-xs font-extrabold text-[var(--color-success)] bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      ${(profile?.walletBalanceUsd ?? userBalance).toFixed(2)} USD
                    </span>

                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-interactive)] border border-[var(--border-default)] transition-colors cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--accent)] text-[var(--text-inverse)] flex items-center justify-center font-bold text-xs">
                        {(profile?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-[var(--text-primary)] max-w-[90px] truncate hidden sm:inline">
                        {profile?.fullName || user.email?.split('@')[0]}
                      </span>
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] shadow-2xl p-3 z-50 space-y-2"
                      >
                        <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
                          <span className="text-xs font-bold text-[var(--text-primary)] block truncate">
                            {profile?.fullName || 'Gamer Nexus'}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] block truncate">
                            {user.email}
                          </span>
                          <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-[var(--border-default)]">
                            <span className="text-[10px] text-[var(--text-secondary)]">Saldo disponible:</span>
                            <span className="text-xs font-mono font-bold text-[var(--color-success)]">
                              ${(profile?.walletBalanceUsd ?? userBalance).toFixed(2)} USD
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          {onOpenAdmin && (
                            <button
                              onClick={() => {
                                handleNavClick('home');
                                setIsUserMenuOpen(false);
                                onOpenAdmin();
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 flex items-center gap-2 cursor-pointer transition-colors font-bold"
                            >
                              <Shield size={14} />
                              <span>Panel Admin & PINes</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleNavClick('tracking');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Clock size={14} />
                            <span>Mis Pedidos & Comprobantes</span>
                          </button>

                          <button
                            onClick={() => {
                              handleNavClick('wallets');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <CreditCard size={14} />
                            <span>Recargar Saldo Zinli / Cripto</span>
                          </button>

                          <button
                            onClick={async () => {
                              setIsUserMenuOpen(false);
                              await signOut();
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 flex items-center gap-2 cursor-pointer transition-colors pt-1.5 border-t border-[var(--border-default)]"
                          >
                            <LogOut size={14} />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth?.('login')}
                    className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => onOpenAuth?.('register')}
                    className="px-3.5 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] font-bold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Regístrate
                  </button>
                  <button
                    onClick={() => onOpenAuth?.('admin')}
                    title="Acceso de Administrador / Staff"
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Shield size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Drawer / Modal Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-4"
            >
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe el nombre del juego (ej: Free Fire, Zinli, Netflix, COD, Steam)..."
                    className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Instant Search Results */}
                {filteredSearchResults.length > 0 && (
                  <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-2 max-h-64 overflow-y-auto space-y-1">
                    {filteredSearchResults.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.id)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={item.coverImage} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-sm text-[var(--text-primary)] block leading-snug">{item.name}</span>
                            <span className="text-[11px] text-[var(--text-muted)]">{item.category} • Entrega {item.deliveryTime}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══ Mobile Bottom Nav Bar ═══ */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-t border-[var(--border-default)] lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          <button 
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
              activeTab === 'home' || activeTab === 'recharge' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Home size={19} />
            <span className="text-[10px] font-semibold">Tienda</span>
          </button>

          <button 
            onClick={() => handleNavClick('wallets')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
              activeTab === 'wallets' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <CreditCard size={19} />
            <span className="text-[10px] font-semibold">Zinli/Cards</span>
          </button>

          <button 
            onClick={() => handleNavClick('tournaments')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
              activeTab === 'tournaments' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Trophy size={19} />
            <span className="text-[10px] font-semibold">Torneos</span>
          </button>

          <button 
            onClick={() => handleNavClick('tracking')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
              activeTab === 'tracking' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Clock size={19} />
            <span className="text-[10px] font-semibold">Rastrear</span>
          </button>
        </div>
      </nav>
    </>
  );
};
