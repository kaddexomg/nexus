import React, { useState, useEffect } from 'react';
import { INITIAL_DAEMON_LOGS } from '../data/mockData';
import { DaemonLog } from '../types';
import { sound } from '../utils/audio';
import { Bot, RefreshCw, Activity, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

interface DaemonTerminalProps {
  isKillSwitchActive: boolean;
}

export const DaemonTerminal: React.FC<DaemonTerminalProps> = ({ isKillSwitchActive }) => {
  const [logs, setLogs] = useState<DaemonLog[]>(INITIAL_DAEMON_LOGS);
  const [pingLatency, setPingLatency] = useState<number>(38);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Auto push log items periodically to simulate real live engine
  useEffect(() => {
    if (isKillSwitchActive) return;

    const sampleAutomatedEvents = [
      { type: 'DISPATCH' as const, message: 'Handshake con Garena API SAC OK (latencia: 36ms)' },
      { type: 'PAGO_MOVIL' as const, message: 'Conciliación instantánea BDV Ref #591024 por Bs. 293.75' },
      { type: 'INYECCION' as const, message: '+572 Diamantes acreditados a UID 712948123 en 1.72s' },
      { type: 'BINANCE_PAY' as const, message: 'Depósito recibido: 4.90 USDT (500 FC Points)' },
      { type: 'SECURITY' as const, message: 'Anti-ban checksum pass. Headers criptográficos válidos.' },
      { type: 'AUTO' as const, message: 'Daemon v4.2 verificación periódica de saldo en tarjetas virtuales: OK' },
    ];

    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const randomEvent = sampleAutomatedEvents[Math.floor(Math.random() * sampleAutomatedEvents.length)];

      const newEntry: DaemonLog = {
        id: String(Date.now()),
        time: timeStr,
        type: randomEvent.type,
        message: randomEvent.message,
      };

      setLogs((prev) => [...prev.slice(-9), newEntry]);
    }, 5500);

    return () => clearInterval(timer);
  }, [isKillSwitchActive]);

  const handleManualPing = () => {
    sound.playClick();
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const newLat = Math.floor(Math.random() * 25) + 28;
      setPingLatency(newLat);
      const now = new Date().toTimeString().split(' ')[0];
      setLogs((prev) => [
        ...prev.slice(-9),
        {
          id: String(Date.now()),
          time: now,
          type: 'DISPATCH',
          message: `Manual Health-Check: Gateway Latency ${newLat}ms [OK]`,
        },
      ]);
    }, 400);
  };

  return (
    <section className="w-full px-3 sm:px-8 py-14" id="daemon-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Terminal Console View */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#09090b] border border-[#27272a] font-mono text-xs space-y-3 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#a78bfa]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#34d399]/80"></span>
              <span className="text-[11px] text-[#a1a1aa] ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-[#a78bfa]" />
                nexus-bot-engine-v4.2.daemon.log
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualPing}
                disabled={isPinging}
                className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1 cursor-pointer"
                title="Comprobar latencia"
              >
                <Activity className="w-3 h-3 text-[#34d399]" />
                <span>{isPinging ? 'Pinging...' : `${pingLatency}ms`}</span>
              </button>

              <span
                className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-bold ${
                  isKillSwitchActive
                    ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                    : 'bg-[#065f46] text-[#bbf7d0] border border-[#34d399]/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isKillSwitchActive ? 'bg-[#ef4444]' : 'bg-[#34d399] animate-pulse'
                  }`}
                ></span>
                {isKillSwitchActive ? 'Kill Switch ACTIVO' : 'Socket: Conectado'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] leading-relaxed max-h-56 overflow-y-auto pr-1" id="terminal-logs">
            {logs.map((log) => {
              let badgeColor = 'text-[#a78bfa]';
              if (log.type === 'PAGO_MOVIL' || log.type === 'INYECCION') badgeColor = 'text-[#34d399]';
              if (log.type === 'SECURITY') badgeColor = 'text-[#38bdf8]';
              if (log.type === 'BINANCE_PAY') badgeColor = 'text-[#f59e0b]';

              return (
                <p key={log.id} className="text-[#a1a1aa]">
                  [{log.time}]{' '}
                  <span className={`font-bold ${badgeColor}`}>[{log.type}]</span>{' '}
                  {log.message}
                </p>
              );
            })}
          </div>
        </div>

        {/* Mascot & Bot Buddy Info */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121215] border border-[#27272a] flex flex-col items-center text-center space-y-4 relative shadow-xl">
          {/* Floating mascot animation container */}
          <div
            className="relative w-20 h-20 rounded-full bg-[#1e1e22] border border-[#3f3f46] flex items-center justify-center animate-bounce shadow-lg cursor-pointer hover:border-[#a78bfa] transition-all"
            style={{ animationDuration: '2.8s' }}
            onClick={() => {
              sound.playSuccess();
            }}
            title="¡Haz clic en Nexus Bot Buddy!"
          >
            <Bot className="w-10 h-10 text-[#a78bfa]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#34d399] flex items-center justify-center text-[10px] text-[#09090b] font-extrabold shadow">
              ✓
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-[#fafafa] flex items-center justify-center gap-1.5">
              <span>Nexus Bot Buddy</span>
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">
              "¡Hola! Estoy monitoreando las tasas oficiales del BCV y Binance Pay en tiempo real. Tus recargas se procesan en 1.8 segundos automáticamente sin intermediarios."
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#34d399] bg-[#0c0c0f] border border-[#27272a] px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            <span>9,420 Recargas hoy sin fallas</span>
          </div>
        </div>
      </div>
    </section>
  );
};
