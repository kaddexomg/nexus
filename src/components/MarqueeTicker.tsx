import React from 'react';

export const MarqueeTicker: React.FC = () => {
  return (
    <section className="w-full py-4 bg-[#0c0c0f] border-y border-[#27272a]/70 overflow-hidden space-y-3" id="marquee-section">
      {/* Marquee 1: Left to Right */}
      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-4 shrink-0 animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Free Fire</span>
            <span className="text-[#a78bfa] font-mono font-semibold">100 + 10 💎</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 58.20 / 0.95 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">COD Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">80 CP</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 62.50 / 0.99 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">FC 24 Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">500 FC Points</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 310.00 / 4.90 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">PUBG Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">60 UC</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 61.10 / 0.97 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Roblox</span>
            <span className="text-[#a78bfa] font-mono font-semibold">800 Robux</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 625.00 / 9.99 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Mobile Legends</span>
            <span className="text-[#a78bfa] font-mono font-semibold">86 💎</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 93.75 / 1.50 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Brawl Stars</span>
            <span className="text-[#a78bfa] font-mono font-semibold">30 Gemas</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 124.00 / 1.99 USDT</span>
          </div>
        </div>

        {/* Duplicate for seamless infinite loop */}
        <div aria-hidden="true" className="flex gap-4 shrink-0 animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Free Fire</span>
            <span className="text-[#a78bfa] font-mono font-semibold">100 + 10 💎</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 58.20 / 0.95 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">COD Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">80 CP</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 62.50 / 0.99 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">FC 24 Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">500 FC Points</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 310.00 / 4.90 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">PUBG Mobile</span>
            <span className="text-[#a78bfa] font-mono font-semibold">60 UC</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 61.10 / 0.97 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Roblox</span>
            <span className="text-[#a78bfa] font-mono font-semibold">800 Robux</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 625.00 / 9.99 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Mobile Legends</span>
            <span className="text-[#a78bfa] font-mono font-semibold">86 💎</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 93.75 / 1.50 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#121215] border border-[#27272a] text-xs">
            <span className="font-bold text-[#fafafa]">Brawl Stars</span>
            <span className="text-[#a78bfa] font-mono font-semibold">30 Gemas</span>
            <span className="text-[#a1a1aa] font-mono">Bs. 124.00 / 1.99 USDT</span>
          </div>
        </div>
      </div>

      {/* Marquee 2: Reverse (Right to Left) */}
      <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-4 shrink-0 animate-marquee-reverse whitespace-nowrap">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            <span className="text-[#fafafa] font-semibold">Tasa del día:</span>
            <span className="font-mono text-[#34d399] font-bold">1 USDT = Bs. 62.50</span>
            <span className="text-[#a1a1aa] font-mono text-[11px]">Actualizado hace 2m</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Pase Booyah FF:</span>
            <span className="text-[#a78bfa] font-mono">Bs. 210.00 / 3.35 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Torneo COD Mobile 5v5:</span>
            <span className="text-[#34d399] font-mono">Bolsa Bs. 3,750 / $60 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Inyección Automática:</span>
            <span className="text-[#a1a1aa]">Bot Activo 24/7 sin intermediarios</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Binance Pay ID:</span>
            <span className="text-[#a78bfa] font-mono font-semibold">#92841029 (Zero Fee)</span>
          </div>
        </div>

        {/* Duplicate for seamless infinite loop */}
        <div aria-hidden="true" className="flex gap-4 shrink-0 animate-marquee-reverse whitespace-nowrap">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            <span className="text-[#fafafa] font-semibold">Tasa del día:</span>
            <span className="font-mono text-[#34d399] font-bold">1 USDT = Bs. 62.50</span>
            <span className="text-[#a1a1aa] font-mono text-[11px]">Actualizado hace 2m</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Pase Booyah FF:</span>
            <span className="text-[#a78bfa] font-mono">Bs. 210.00 / 3.35 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Torneo COD Mobile 5v5:</span>
            <span className="text-[#34d399] font-mono">Bolsa Bs. 3,750 / $60 USDT</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Inyección Automática:</span>
            <span className="text-[#a1a1aa]">Bot Activo 24/7 sin intermediarios</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#18181b] border border-[#27272a] text-xs">
            <span className="text-[#fafafa] font-semibold">Binance Pay ID:</span>
            <span className="text-[#a78bfa] font-mono font-semibold">#92841029 (Zero Fee)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
