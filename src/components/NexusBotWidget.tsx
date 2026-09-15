import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Bot, X, Send, Sparkles, HelpCircle, CheckCircle2, Zap, DollarSign, Trophy, ShieldCheck, ChevronRight } from 'lucide-react';
import { CURRENT_USDT_RATE_BS } from '../data/mockData';

interface NexusBotWidgetProps {
  onScrollToRecharge: () => void;
  onScrollToTournaments: () => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
  timestamp: string;
}

export const NexusBotWidget: React.FC<NexusBotWidgetProps> = ({
  onScrollToRecharge,
  onScrollToTournaments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola gamer! ⚡ Soy NexusBot v4.2, tu copiloto de recargas y torneos en Venezuela. ¿En qué puedo ayudarte hoy?',
      options: [
        { label: '💵 Consultar Tasa del Día', action: 'rate' },
        { label: '💎 ¿Cómo recargar diamantes / CP?', action: 'how_to_recharge' },
        { label: '🏆 ¿Cómo inscribir mi escuadra?', action: 'tournament_help' },
        { label: '🛡️ ¿Es seguro? Garantía Anti-Ban', action: 'security' },
      ],
      timestamp: 'Ahora',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    sound.playClick();
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playClick();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    // AI/Daemon smart response logic
    setTimeout(() => {
      setIsTyping(false);
      sound.playSuccess();

      const lower = text.toLowerCase();
      let botResponse = '';
      let options: { label: string; action: string }[] | undefined;

      if (lower.includes('tasa') || lower.includes('dolar') || lower.includes('bs') || lower.includes('precio')) {
        botResponse = `📈 Tasa Oficial al día de hoy: 1 USDT = Bs. ${CURRENT_USDT_RATE_BS.toFixed(2)}. Las recargas en Bolívares se calculan automáticamente a esta tasa oficial sin comisiones adicionales por Pago Móvil (BDV, Banesco, Mercantil).`;
        options = [
          { label: '⚡ Ir a Recargar Ahora', action: 'go_recharge' },
          { label: '💳 Métodos de Pago', action: 'payment_methods' },
        ];
      } else if (lower.includes('free fire') || lower.includes('diamante') || lower.includes('ff')) {
        botResponse = `🔥 Para Free Fire sólo necesitas tu ID de Jugador (UID numérico de 8 a 12 dígitos) y tu Región (SAC / US). Una vez ingresado, el sistema valida tu Nickname en vivo antes de pagar para que no haya riesgo de error. ¡Acreditación en 1.8 segundos!`;
        options = [
          { label: '⚡ Abrir Recarga Free Fire', action: 'go_recharge' },
        ];
      } else if (lower.includes('mobile legends') || lower.includes('mlbb') || lower.includes('zone')) {
        botResponse = `⚔️ Para Mobile Legends necesitas dos datos que ves bajo tu avatar: Tu User ID numérico y tu Server Zone ID (4 dígitos entre paréntesis). Ejemplo: 491028301 (2041). Ambos son obligatorios para que los diamantes o Pase Starlight se inyecten de inmediato.`;
        options = [
          { label: '⚡ Recargar Mobile Legends', action: 'go_recharge' },
        ];
      } else if (lower.includes('cod') || lower.includes('call of duty') || lower.includes('cp')) {
        botResponse = `🎖️ En COD Mobile recargas CP directos mediante tu Player ID (UID de Activision). Soportamos Ruletas Míticas, Pase de Batalla y Cajas de temporada.`;
        options = [
          { label: '⚡ Recargar COD Mobile', action: 'go_recharge' },
        ];
      } else if (lower.includes('roblox') || lower.includes('robux')) {
        botResponse = `🧱 En Roblox sólo colocas tu nombre de usuario (@username). El sistema verifica tu avatar y te despacha los Robux directo a tu inventario.`;
        options = [
          { label: '⚡ Recargar Robux', action: 'go_recharge' },
        ];
      } else if (lower.includes('torneo') || lower.includes('escuadra') || lower.includes('premio')) {
        botResponse = `🏆 En Nexus Arena puedes inscribir tu escuadra (Capitán + 3 titulares + 1 suplente). Pagas la inscripción en Bolívares o USDT y recibes tus credenciales privadas de Sala (Room ID y Password). La bolsa de premios se paga en vivo al terminar.`;
        options = [
          { label: '🏆 Ver Torneos & Inscribirme', action: 'go_tournament' },
        ];
      } else if (lower.includes('seguro') || lower.includes('ban') || lower.includes('bloqueo')) {
        botResponse = `🛡️ 100% libre de baneo. No solicitamos contraseñas ni accesos a correos. La inyección se hace por API oficial de distribuidores autorizados (Garena, Activision, Smile.one, Midasbuy) directo al UID público del jugador.`;
      } else {
        botResponse = `¡Entendido! Puedes realizar recargas inmediatas en Bolívares con Pago Móvil o USDT con Binance Pay. Si necesitas inscribir a tu equipo en el torneo, ve a la sección Nexus Arena. ¿Deseas ir al terminal de recargas?`;
        options = [
          { label: '⚡ Ir a Terminal de Recargas', action: 'go_recharge' },
          { label: '🏆 Ir a Torneos Arena', action: 'go_tournament' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          options,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleActionClick = (action: string) => {
    sound.playClick();
    if (action === 'rate') {
      handleSendMessage('¿Cuál es la tasa de cambio hoy?');
    } else if (action === 'how_to_recharge') {
      handleSendMessage('¿Cómo se realiza una recarga?');
    } else if (action === 'tournament_help') {
      handleSendMessage('¿Cómo inscribir mi escuadra al torneo?');
    } else if (action === 'security') {
      handleSendMessage('¿Es seguro y anti-ban?');
    } else if (action === 'go_recharge') {
      setIsOpen(false);
      onScrollToRecharge();
    } else if (action === 'go_tournament') {
      setIsOpen(false);
      onScrollToTournaments();
    } else if (action === 'payment_methods') {
      handleSendMessage('¿Cuáles son los métodos de pago en Venezuela?');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end" id="nexus-bot-container">
      {/* Tooltip bubble when closed */}
      {!isOpen && showTooltip && (
        <div
          onClick={toggleChat}
          className="mb-2 px-3.5 py-2 rounded-2xl bg-[#18181b] border border-[#a78bfa]/50 text-xs text-[#fafafa] shadow-xl flex items-center gap-2 cursor-pointer animate-bounce max-w-[220px]"
        >
          <Sparkles className="w-4 h-4 text-[#a78bfa] shrink-0" />
          <span className="text-[11px] leading-tight">
            ¿Dudas con tu recarga o torneo? <strong>¡Consulta a NexusBot!</strong>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-[#71717a] hover:text-[#fafafa] ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Bot Trigger Button */}
      <button
        onClick={toggleChat}
        className={`relative group w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(167,139,250,0.4)] transition-all duration-300 cursor-pointer border ${
          isOpen
            ? 'bg-[#18181b] border-[#ef4444] text-[#ef4444] rotate-90'
            : 'bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] border-[#c4b5fd] text-[#09090b] hover:scale-105 active:scale-95'
        }`}
        title="Nexus Bot Asistente Gamer 24/7"
        id="nexus-bot-trigger-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#fafafa]" />
        ) : (
          <div className="flex flex-col items-center">
            {/* Animated mascot bot icon */}
            <Bot className="w-7 h-7 text-[#09090b]" />
            {/* Status pulse */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#34d399] border-2 border-[#09090b] animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#34d399] border-2 border-[#09090b]"></span>
          </div>
        )}
      </button>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] rounded-3xl bg-[#121215]/95 backdrop-blur-2xl border border-[#27272a] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 z-50"
          id="nexus-bot-chat-window"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1e1e24] to-[#121215] border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-[#7c3aed] flex items-center justify-center text-[#ede9fe] shadow-inner">
                <Bot className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34d399] ring-2 ring-[#121215]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-[#fafafa]">NexusBot 24/7</h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#34d399]/20 text-[#34d399] text-[9px] font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-[#a1a1aa] font-mono">
                  Daemon Engine • Tasa: Bs. {CURRENT_USDT_RATE_BS.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-full bg-[#18181b] hover:bg-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#27272a]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#7c3aed] text-[#ede9fe] rounded-tr-none'
                      : 'bg-[#1e1e22] text-[#fafafa] border border-[#27272a] rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Interactive Option Chips */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5 pt-2 border-t border-[#3f3f46]/40">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(opt.action)}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#a78bfa] hover:text-[#09090b] text-[11px] font-medium text-[#c4b5fd] transition-all flex items-center justify-between group"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3 h-3 text-[#a1a1aa] group-hover:text-[#09090b]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#71717a] font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#1e1e22] border border-[#27272a] w-20 rounded-tl-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Toolbar */}
          <div className="px-3 py-2 bg-[#0c0c0f] border-t border-[#27272a] flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => handleSendMessage('¿Cómo recargo?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] transition-colors"
            >
              ⚡ ¿Cómo recargar?
            </button>
            <button
              onClick={() => handleSendMessage('¿Tasa del día?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] transition-colors"
            >
              💵 Tasa Bs.
            </button>
            <button
              onClick={() => handleSendMessage('¿Premios del torneo?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] border border-[#27272a] transition-colors"
            >
              🏆 Premios Torneo
            </button>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#121215] border-t border-[#27272a] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta sobre recargas, torneos, UIDs..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1e1e22] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#a78bfa]"
              id="nexus-bot-input"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-xl bg-[#a78bfa] text-[#09090b] flex items-center justify-center hover:bg-[#c4b5fd] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              id="nexus-bot-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
