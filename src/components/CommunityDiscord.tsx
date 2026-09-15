import React, { useState } from 'react';
import { INITIAL_COMMUNITY_MESSAGES } from '../data/mockData';
import { CommunityMessage } from '../types';
import { sound } from '../utils/audio';
import { Hash, Send, Users, Shield, Sparkles, MessageSquare, Check } from 'lucide-react';

interface CommunityDiscordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityDiscord: React.FC<CommunityDiscordProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_COMMUNITY_MESSAGES);
  const [selectedChannel, setSelectedChannel] = useState<string>('comprobantes-exitosos');
  const [inputText, setInputText] = useState<string>('');

  if (!isOpen) return null;

  const channels = [
    { id: 'comprobantes-exitosos', name: 'comprobantes-exitosos', unread: 3 },
    { id: 'general-gamer', name: 'general-gamer', unread: 12 },
    { id: 'torneos-scrims', name: 'torneos-scrims', unread: 5 },
    { id: 'soporte-bot', name: 'soporte-bot', unread: 0 },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sound.playClick();
    const newMsg: CommunityMessage = {
      id: String(Date.now()),
      author: 'Tú (Jugador Verificado)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      badge: 'Gamer',
      timestamp: 'Ahora mismo',
      content: inputText,
      reactions: [{ emoji: '🔥', count: 1 }],
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleToggleReaction = (msgId: string, emojiIndex: number) => {
    sound.playClick();
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.reactions) {
          const newReactions = [...msg.reactions];
          newReactions[emojiIndex] = {
            ...newReactions[emojiIndex],
            count: newReactions[emojiIndex].count + 1,
          };
          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#09090b]/85 backdrop-blur-md animate-fadeIn"
      id="community-modal"
    >
      <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl bg-[#121215] border border-[#27272a] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex overflow-hidden">
        {/* Left Sidebar: Discord Channels */}
        <div className="w-56 sm:w-64 bg-[#0c0c0f] border-r border-[#27272a] flex flex-col justify-between hidden sm:flex">
          <div>
            <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#5865F2] text-white flex items-center justify-center font-bold text-xs">
                  N
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fafafa]">Nexus Discord Hub</h4>
                  <span className="text-[10px] text-[#34d399] flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse"></span>
                    1,420 En Línea
                  </span>
                </div>
              </div>
            </div>

            {/* Channels List */}
            <div className="p-3 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#71717a] px-2 block mb-1">
                Canales de Texto
              </span>
              {channels.map((ch) => {
                const isActive = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedChannel(ch.id);
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#18181b] text-[#fafafa] font-semibold'
                        : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#121215]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-[#71717a]" />
                      <span>{ch.name}</span>
                    </div>
                    {ch.unread > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#ef4444] text-[9px] font-bold text-white">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#a78bfa] text-[#09090b] flex items-center justify-center font-bold text-xs">
                U
              </div>
              <div>
                <span className="font-semibold text-[#fafafa] block leading-tight">Miembro_Nexus</span>
                <span className="text-[10px] text-[#34d399]">#4891</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#a1a1aa]">settings</span>
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col justify-between bg-[#121215]">
          {/* Header */}
          <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#a78bfa]" />
              <div>
                <h3 className="text-sm font-bold text-[#fafafa]">#{selectedChannel}</h3>
                <span className="text-[10px] text-[#a1a1aa]">
                  Comunidad oficial de jugadores, comprobantes en vivo y reclutamiento de escuadras.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 hover:bg-[#18181b]/40 p-2 rounded-xl transition-all">
                <img
                  src={msg.avatar}
                  alt={msg.author}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-[#27272a] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#fafafa]">{msg.author}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        msg.badge === 'Admin Bot'
                          ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30'
                          : msg.badge === 'Capitán'
                          ? 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30'
                          : 'bg-[#a78bfa]/20 text-[#a78bfa]'
                      }`}
                    >
                      {msg.badge}
                    </span>
                    <span className="text-[10px] text-[#71717a]">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-[#d4d4d8] mt-1 leading-relaxed">{msg.content}</p>

                  {/* Reaction Buttons */}
                  {msg.reactions && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleToggleReaction(msg.id, i)}
                          className="px-2 py-0.5 rounded-md bg-[#1e1e22] hover:bg-[#27272a] border border-[#27272a] text-xs text-[#a1a1aa] flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-mono text-[10px]">{r.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#27272a] bg-[#0c0c0f] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enviar mensaje a #${selectedChannel}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#a78bfa]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] transition-all cursor-pointer flex items-center justify-center shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
