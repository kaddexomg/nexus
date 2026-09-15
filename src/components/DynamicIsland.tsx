import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

const DYNAMIC_EVENTS = [
  { text: 'Free Fire +1,060 💎 vía Pago Móvil BDV (Bs. 587.50)', latency: '1.4s' },
  { text: 'COD Mobile +420 CP vía Binance Pay ($4.99 USDT)', latency: '1.6s' },
  { text: 'Roblox +800 Robux vía Pago Móvil Banesco (Bs. 625.00)', latency: '1.2s' },
  { text: 'FC 24 +1,050 FC Points vía Mercantil (Bs. 590.00)', latency: '1.8s' },
  { text: 'Torneo Free Fire: Escuadra "Team Alpha VE" inscrita con éxito', latency: '2.0s' },
  { text: 'Mobile Legends +706 💎 vía Binance Pay ($12.00 USDT)', latency: '1.5s' },
  { text: 'Free Fire Booyah Pass vía Pago Móvil Provincial (Bs. 210.00)', latency: '1.3s' },
];

export const DynamicIsland: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DYNAMIC_EVENTS.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  const handleNextManual = () => {
    sound.playClick();
    setIsRotating(true);
    setCurrentIndex((prev) => (prev + 1) % DYNAMIC_EVENTS.length);
    setTimeout(() => setIsRotating(false), 500);
  };

  const currentEvent = DYNAMIC_EVENTS[currentIndex];

  return (
    <div className="w-full flex justify-center px-4 py-3 sticky top-20 z-40" id="dynamic-island-container">
      <div
        onClick={handleNextManual}
        title="Clic para ver otra recarga despachada en vivo"
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#121215]/95 backdrop-blur-2xl border border-[#27272a] shadow-2xl text-xs max-w-xl w-full justify-between cursor-pointer hover:border-[#a78bfa]/50 transition-all"
        id="dynamic-island"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]"></span>
          </span>
          <span className="text-[11px] font-semibold text-[#34d399] uppercase tracking-wider">En Vivo</span>
          <span className="text-[#a1a1aa] font-mono text-[11px] truncate" id="dynamic-island-text">
            {currentEvent.text}
          </span>
        </div>
        <div className="flex items-center gap-2 pl-2 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-[#1e1e22] text-[10px] font-mono text-[#a78bfa] border border-[#3f3f46]/40">
            {currentEvent.latency} disp.
          </span>
          <span
            className={`material-symbols-outlined text-[16px] text-[#a78bfa] ${
              isRotating ? 'animate-spin' : ''
            }`}
          >
            sync
          </span>
        </div>
      </div>
    </div>
  );
};
