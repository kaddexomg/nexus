import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { ShieldCheck, Database, Volume2, VolumeX, Users, Sun, Moon, Sparkles, TrendingUp, Search, Gamepad2, CreditCard, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';

export type MainNavTab = 'home' | 'recharge' | 'wallets' | 'tournaments' | 'rates' | 'tracking';

interface HeaderProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenArchitecture: () => void;
  onOpenCommunity: () => void;
  isKillSwitchActive: boolean;
  userBalance: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenArchitecture,
  onOpenCommunity,
  isKillSwitchActive,
  userBalance,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { rates } = useCurrency();
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) {
      sound.playClick();
    }
  };

  const handleToggleTheme = () => {
    sound.playClick();
    toggleTheme();
  };

  const handleNav = (tab: MainNavTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NAV_ITEMS: { id: MainNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <span className="material-symbols-outlined text-[16px]">home</span> },
    { id: 'recharge', label: 'Recargar', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'wallets', label: 'Billeteras', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'tournaments', label: 'Nexus Arena', icon: <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" /> },
    { id: 'rates', label: 'Tasas en Vivo', icon: <TrendingUp className="w-3.5 h-3.5 text-[#34d399]" /> },
    { id: 'tracking', label: 'Rastrear', icon: <Search className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-3 sm:px-8 pt-3 pointer-events-none" id="main-header">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 bg-[#121215]/90 backdrop-blur-2xl rounded-full border border-[#27272a] shadow-[0_10px_35px_rgba(0,0,0,0.7)] pointer-events-auto transition-all">
        {/* Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 focus:outline-none group cursor-pointer text-left"
          id="brand-logo-btn"
        >
          <div className="w-9 h-9 rounded-full bg-[#1e1e22] border border-[#3f3f46] flex items-center justify-center text-[#a78bfa] group-hover:border-[#a78bfa] group-hover:scale-105 transition-all shadow-inner">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-wider text-[#fafafa] flex items-center gap-1">
              NEXUS<span className="text-[#a78bfa]">RECHARGE</span>
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#a1a1aa] font-medium -mt-0.5 flex items-center gap-1">
              Liquid Gaming Core
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
            </span>
          </div>
        </button>

        {/* Dynamic Navigation Links (Multi-Screen Router) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium" id="header-desktop-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`transition-all rounded-full px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#a78bfa] text-[#09090b] font-bold shadow-md'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'rates' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Balance */}
        <div className="flex items-center gap-2 sm:gap-3" id="header-actions">
          {/* Architecture / Master Plan Blueprint button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenArchitecture();
            }}
            title="Ver Lineamientos de Arquitectura y Base de Datos (SQL & Anti-Error)"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181b] hover:bg-[#27272a] text-[#a78bfa] border border-[#3f3f46]/70 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            id="open-architecture-btn"
          >
            <Database className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span className="hidden md:inline">Arquitectura</span>
            <span className="px-1.5 py-0.2 rounded bg-[#7c3aed]/40 text-[9px] text-[#ede9fe]">SQL</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={handleToggleTheme}
            title={`Modo actual: ${theme.toUpperCase()} (Clic para alternar Dark / Light / Neón)`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-semibold transition-all cursor-pointer text-[#fafafa] hover:border-[#a78bfa]/50"
            id="toggle-theme-btn"
          >
            {theme === 'dark' && <Moon className="w-4 h-4 text-[#a78bfa]" />}
            {theme === 'light' && <Sun className="w-4 h-4 text-[#f59e0b]" />}
            {theme === 'neon' && <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />}
            <span className="hidden md:inline capitalize text-[10px] tracking-wider text-[#a1a1aa] font-mono">
              {theme}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar Efectos Arcade' : 'Activar Efectos Arcade'}
            className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] transition-all cursor-pointer"
            id="toggle-sound-btn"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#34d399]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#71717a]" />
            )}
          </button>

          {/* User Wallet Balance */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#09090b] border border-[#27272a] text-xs font-medium"
            id="user-wallet-chip"
          >
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            <span className="text-[#a1a1aa]">Saldo:</span>
            <span className="font-bold text-[#fafafa] font-mono">${userBalance.toFixed(2)}</span>
          </div>

          {/* Mobile Menu Direct Shortcut */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => handleNav('recharge')}
              className="p-1.5 rounded-xl bg-[#a78bfa] text-[#09090b] text-xs font-bold"
            >
              Recargar
            </button>
          </div>
        </div>
      </div>

      {/* Subheader Mobile Navigation Bar */}
      <div className="max-w-7xl mx-auto mt-2 flex lg:hidden items-center justify-around p-1.5 bg-[#121215]/95 backdrop-blur-md rounded-2xl border border-[#27272a] pointer-events-auto text-[11px] font-mono">
        <button
          onClick={() => handleNav('home')}
          className={`px-2.5 py-1 rounded-xl ${activeTab === 'home' ? 'bg-[#a78bfa] text-[#09090b] font-bold' : 'text-[#a1a1aa]'}`}
        >
          Inicio
        </button>
        <button
          onClick={() => handleNav('recharge')}
          className={`px-2.5 py-1 rounded-xl ${activeTab === 'recharge' ? 'bg-[#a78bfa] text-[#09090b] font-bold' : 'text-[#a1a1aa]'}`}
        >
          Recargas
        </button>
        <button
          onClick={() => handleNav('wallets')}
          className={`px-2.5 py-1 rounded-xl ${activeTab === 'wallets' ? 'bg-[#a78bfa] text-[#09090b] font-bold' : 'text-[#a1a1aa]'}`}
        >
          Billeteras
        </button>
        <button
          onClick={() => handleNav('tournaments')}
          className={`px-2.5 py-1 rounded-xl ${activeTab === 'tournaments' ? 'bg-[#a78bfa] text-[#09090b] font-bold' : 'text-[#a1a1aa]'}`}
        >
          Torneos
        </button>
        <button
          onClick={() => handleNav('rates')}
          className={`px-2.5 py-1 rounded-xl ${activeTab === 'rates' ? 'bg-[#a78bfa] text-[#09090b] font-bold' : 'text-[#a1a1aa]'}`}
        >
          Tasas
        </button>
      </div>
    </header>
  );
};
