import React, { useState } from 'react';
import { INITIAL_TOURNAMENTS, INITIAL_BRACKET_MATCHES, CURRENT_USDT_RATE_BS } from '../data/mockData';
import { sound } from '../utils/audio';
import {
  Trophy,
  Users,
  ShieldCheck,
  Check,
  Key,
  Flame,
  Award,
  Swords,
  Copy,
  Clock,
  Sparkles,
  Smartphone,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Send,
} from 'lucide-react';

interface TeamRoster {
  teamName: string;
  badgeId: string;
  captainName: string;
  captainPhone: string;
  captainUid: string;
  player2Uid: string;
  player3Uid: string;
  player4Uid: string;
  substituteUid?: string;
  paymentMethod: 'pagomovil' | 'binance' | 'wallet';
}

const CLAN_EMBLEMS = [
  { id: 'lion', name: 'León Real', icon: '🦁', color: 'from-amber-500/30 to-yellow-600/30', border: 'border-amber-400' },
  { id: 'phoenix', name: 'Fénix Fuego', icon: '🦅', color: 'from-rose-500/30 to-orange-600/30', border: 'border-rose-400' },
  { id: 'dragon', name: 'Dragón Neón', icon: '🐉', color: 'from-emerald-500/30 to-teal-600/30', border: 'border-emerald-400' },
  { id: 'skull', name: 'Calavera Ghost', icon: '💀', color: 'from-purple-500/30 to-violet-600/30', border: 'border-purple-400' },
  { id: 'wolf', name: 'Lobo Ártico', icon: '🐺', color: 'from-sky-500/30 to-blue-600/30', border: 'border-sky-400' },
  { id: 'titan', name: 'Titán Eléctrico', icon: '⚡', color: 'from-violet-500/30 to-indigo-600/30', border: 'border-violet-400' },
];

export const TournamentArena: React.FC = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('ff-cup-14');
  const [activeTab, setActiveTab] = useState<'tournaments' | 'register' | 'brackets' | 'admin'>('tournaments');

  // Registration Form State
  const [teamData, setTeamData] = useState<TeamRoster>({
    teamName: 'Delta Gaming VE',
    badgeId: 'dragon',
    captainName: 'Carlos Mendoza',
    captainPhone: '0414-9841029',
    captainUid: '849204812',
    player2Uid: '512948019',
    player3Uid: '712948123',
    player4Uid: '691048201',
    substituteUid: '904812401',
    paymentMethod: 'pagomovil',
  });

  // State after registration
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredTeam, setRegisteredTeam] = useState<TeamRoster | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [hasCheckedIn, setHasCheckedIn] = useState<boolean>(false);

  const currentTournament =
    INITIAL_TOURNAMENTS.find((t) => t.id === selectedTournamentId) || INITIAL_TOURNAMENTS[0];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamData.teamName.trim() || !teamData.captainUid.trim()) {
      sound.playAlert();
      alert('Por favor completa el nombre del equipo y el ID del capitán.');
      return;
    }

    sound.playSuccess();
    setRegisteredTeam({ ...teamData });
    setIsRegistered(true);
    setActiveTab('admin'); // Directly take user to tournament admin view
  };

  const handleCopyCredentials = () => {
    sound.playClick();
    navigator.clipboard.writeText('Sala ID: 948102 | Password: nexus2026 | Slot: #07');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleConfirmCheckin = () => {
    sound.playSuccess();
    setHasCheckedIn(true);
  };

  return (
    <section className="w-full px-3 sm:px-8 py-16 bg-[var(--bg-primary)] border-t border-[var(--border-color)] transition-colors duration-250" id="torneos-arena">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Title and Mascot Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#34d399] text-xs font-bold uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-[#34d399]" />
              Competición Oficial Esports • Nexus Arena
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#fafafa] mt-1 tracking-tight">
              Torneos de Escuadras & Brackets
            </h2>
            <p className="text-xs sm:text-sm text-[#a1a1aa] mt-2 max-w-2xl leading-relaxed">
              Inscribe tu equipo de 4 jugadores con Pago Móvil o USDT. Salas privadas protegidas con árbitros oficiales y bolsas de premios en dólares y bolívares.
            </p>
          </div>

          {/* Tournament Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#121215] border border-[#27272a]">
            {INITIAL_TOURNAMENTS.map((t) => {
              const isSelected = selectedTournamentId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTournamentId(t.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#1e1e24] text-[#fafafa] border border-[#a78bfa] shadow-sm'
                      : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>}
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#27272a] pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tournaments');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tournaments'
                ? 'bg-[#7c3aed] text-[#ede9fe] shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] bg-[#121215]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>1. Torneos & Premios</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('register');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#7c3aed] text-[#ede9fe] shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] bg-[#121215]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Inscribir Escuadra (Formulario)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#34d399]/20 text-[#34d399] text-[10px]">
              Cupos abiertos
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('brackets');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'brackets'
                ? 'bg-[#7c3aed] text-[#ede9fe] shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] bg-[#121215]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>3. Brackets en Vivo</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('admin');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-[#7c3aed] text-[#ede9fe] shadow-md'
                : 'text-[#a1a1aa] hover:text-[#fafafa] bg-[#121215]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#34d399]" />
            <span>4. Administración de Sala & Estado</span>
            {isRegistered && (
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
            )}
          </button>
        </div>

        {/* TAB 1: TORNEOS Y PREMIOS */}
        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1: Bolsa de Premios */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121215] to-[#18181b] border border-[#27272a] hover:border-[#34d399]/50 transition-all flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a1a1aa] uppercase font-mono">Bolsa Total</span>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-extrabold text-[#34d399] font-mono block">
                      Bs. {currentTournament.prizePoolBs.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#a1a1aa] font-mono">
                      ${currentTournament.prizePoolUsd.toFixed(2)} USDT Garantizado
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272a] text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-[#fafafa]">
                    <span>🥇 1er Lugar:</span>
                    <strong className="text-[#34d399]">${currentTournament.firstPlaceUsd}</strong>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>🥈 2do Lugar:</span>
                    <span>${currentTournament.secondPlaceUsd}</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>🥉 3er Lugar:</span>
                    <span>${currentTournament.thirdPlaceUsd}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Cupos y Check-in */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121215] to-[#18181b] border border-[#27272a] hover:border-[#a78bfa]/50 transition-all flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a1a1aa] uppercase font-mono">Cupos de Escuadras</span>
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-3xl font-extrabold text-[#fafafa] font-mono">
                        {currentTournament.registeredTeams}/{currentTournament.maxTeams}
                      </span>
                      <span className="text-xs font-bold text-[#a78bfa]">
                        ¡Últimos {currentTournament.maxTeams - currentTournament.registeredTeams}!
                      </span>
                    </div>
                    <div className="w-full bg-[#1e1e22] h-2.5 rounded-full overflow-hidden border border-[#27272a]">
                      <div
                        className="bg-gradient-to-r from-[#7c3aed] to-[#34d399] h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(currentTournament.registeredTeams / currentTournament.maxTeams) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272a] text-[11px] text-[#a1a1aa] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#a78bfa]" />
                  <span>Cierre: {currentTournament.checkInDeadline}</span>
                </div>
              </div>

              {/* Card 3: Formato & Modo */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121215] to-[#18181b] border border-[#27272a] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#a1a1aa] uppercase font-mono">Formato de Juego</span>
                    <span className="text-2xl">🎮</span>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-lg font-bold text-[#fafafa]">{currentTournament.game}</h4>
                    <p className="text-xs text-[#a78bfa] font-mono mt-0.5">{currentTournament.format}</p>
                    <p className="text-[11px] text-[#a1a1aa] mt-2 leading-relaxed">
                      Mapa: {currentTournament.mode}. Eliminación directa con árbitro en sala.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272a] text-[11px] text-[#34d399] font-mono">
                  Anti-Cheat Oficial Activo
                </div>
              </div>

              {/* Card 4: Inscripción & CTA */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#7c3aed]/20 via-[#18181b] to-[#121215] border border-[#a78bfa]/50 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs text-[#a78bfa] uppercase font-mono font-bold">Cuota por Escuadra</span>
                  <div className="mt-3">
                    <span className="text-2xl font-extrabold text-[#fafafa] font-mono block">
                      Bs. {currentTournament.entryFeeBs.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-[#34d399]">
                      ${currentTournament.entryFeeUsd.toFixed(2)} USDT (Equipo de 4)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a1a1aa] mt-2">
                    Pago directo con Pago Móvil o Binance Pay. Desbloqueo inmediato de Room ID.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('register');
                  }}
                  className="mt-4 w-full py-3 rounded-xl bg-[#a78bfa] text-[#09090b] font-extrabold text-xs hover:bg-[#c4b5fd] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Inscribir Escuadra Ahora</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULARIO DE INSCRIPCIÓN Y PAGO */}
        {activeTab === 'register' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#121215] border border-[#27272a] shadow-2xl relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-xs font-mono text-[#a78bfa] font-bold uppercase tracking-widest">
                  Formulario Oficial de Inscripción
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#fafafa] mt-1">
                  Registra tu Clan / Escuadra ({currentTournament.title})
                </h3>
                <p className="text-xs text-[#a1a1aa] mt-1.5">
                  Ingresa el nombre de tu equipo, los IDs de cada jugador y paga la cuota de inscripción para recibir tus credenciales de sala.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                {/* Paso 1 del formulario: Nombre de equipo y Emblema */}
                <div className="p-5 rounded-2xl bg-[#0e0e11] border border-[#27272a] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#fafafa] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-[#ede9fe] flex items-center justify-center text-[10px]">
                      A
                    </span>
                    Identidad del Clan y Emblema
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                        Nombre del Equipo / Clan *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamData.teamName}
                        onChange={(e) => setTeamData({ ...teamData, teamName: e.target.value })}
                        placeholder="Ej: Delta Gaming VE"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-bold text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                        WhatsApp / Teléfono del Capitán *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamData.captainPhone}
                        onChange={(e) => setTeamData({ ...teamData, captainPhone: e.target.value })}
                        placeholder="Ej: 0414-9841029 (Para sala y árbitros)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
                      />
                    </div>
                  </div>

                  {/* Selector de Emblemas animados ("Dibujitos") */}
                  <div>
                    <label className="block text-xs font-medium text-[#a1a1aa] mb-2">
                      Elige el Emblema de tu Escuadra:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {CLAN_EMBLEMS.map((emblem) => {
                        const isSelected = teamData.badgeId === emblem.id;
                        return (
                          <button
                            key={emblem.id}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              setTeamData({ ...teamData, badgeId: emblem.id });
                            }}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? `bg-gradient-to-b ${emblem.color} ${emblem.border} shadow-[0_0_15px_rgba(167,139,250,0.3)] scale-105`
                                : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'
                            }`}
                          >
                            <span className="text-2xl">{emblem.icon}</span>
                            <span className="text-[10px] font-bold text-[#fafafa]">{emblem.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Paso 2: IDs de cada jugador (Titulares + Suplente) */}
                <div className="p-5 rounded-2xl bg-[#0e0e11] border border-[#27272a] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#fafafa] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-[#ede9fe] flex items-center justify-center text-[10px]">
                      B
                    </span>
                    Alineación Oficial de Jugadores (UIDs Requeridos)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Capitán */}
                    <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#34d399]/40">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#34d399] flex items-center gap-1">
                          👑 Capitán de Escuadra
                        </span>
                        <span className="text-[10px] text-[#a1a1aa] font-mono">Titular #1</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={teamData.captainUid}
                        onChange={(e) => setTeamData({ ...teamData, captainUid: e.target.value })}
                        placeholder="Player ID / UID del Capitán"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0e11] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:border-[#34d399]"
                      />
                    </div>

                    {/* Jugador 2 */}
                    <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#fafafa]">Jugador 2</span>
                        <span className="text-[10px] text-[#a1a1aa] font-mono">Titular #2</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={teamData.player2Uid}
                        onChange={(e) => setTeamData({ ...teamData, player2Uid: e.target.value })}
                        placeholder="Player ID / UID Jugador 2"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0e11] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:border-[#a78bfa]"
                      />
                    </div>

                    {/* Jugador 3 */}
                    <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#fafafa]">Jugador 3</span>
                        <span className="text-[10px] text-[#a1a1aa] font-mono">Titular #3</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={teamData.player3Uid}
                        onChange={(e) => setTeamData({ ...teamData, player3Uid: e.target.value })}
                        placeholder="Player ID / UID Jugador 3"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0e11] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:border-[#a78bfa]"
                      />
                    </div>

                    {/* Jugador 4 */}
                    <div className="p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#fafafa]">Jugador 4</span>
                        <span className="text-[10px] text-[#a1a1aa] font-mono">Titular #4</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={teamData.player4Uid}
                        onChange={(e) => setTeamData({ ...teamData, player4Uid: e.target.value })}
                        placeholder="Player ID / UID Jugador 4"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0e11] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:border-[#a78bfa]"
                      />
                    </div>
                  </div>

                  {/* Suplente */}
                  <div className="p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#a1a1aa]">Jugador 5 (Suplente opcional)</span>
                      <span className="text-[10px] text-[#71717a]">Opcional</span>
                    </div>
                    <input
                      type="text"
                      value={teamData.substituteUid}
                      onChange={(e) => setTeamData({ ...teamData, substituteUid: e.target.value })}
                      placeholder="Player ID del Suplente (si aplica)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0e0e11] border border-[#27272a] text-xs font-mono text-[#fafafa] focus:border-[#a78bfa]"
                    />
                  </div>
                </div>

                {/* Paso 3: Pago de Inscripción */}
                <div className="p-5 rounded-2xl bg-[#0e0e11] border border-[#27272a] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#fafafa] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-[#ede9fe] flex items-center justify-center text-[10px]">
                      C
                    </span>
                    Pago de Inscripción de Escuadra
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      onClick={() => {
                        sound.playClick();
                        setTeamData({ ...teamData, paymentMethod: 'pagomovil' });
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        teamData.paymentMethod === 'pagomovil'
                          ? 'bg-[#18181b] border-[#34d399]'
                          : 'bg-[#121215] border-[#27272a]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#34d399]" />
                        <div>
                          <span className="text-xs font-bold text-[#fafafa] block">Pago Móvil BDV</span>
                          <span className="text-[10px] text-[#34d399] font-mono">
                            Bs. {currentTournament.entryFeeBs.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {teamData.paymentMethod === 'pagomovil' && (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                      )}
                    </div>

                    <div
                      onClick={() => {
                        sound.playClick();
                        setTeamData({ ...teamData, paymentMethod: 'binance' });
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        teamData.paymentMethod === 'binance'
                          ? 'bg-[#18181b] border-[#f59e0b]'
                          : 'bg-[#121215] border-[#27272a]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#f59e0b]" />
                        <div>
                          <span className="text-xs font-bold text-[#fafafa] block">Binance Pay</span>
                          <span className="text-[10px] text-[#f59e0b] font-mono">
                            ${currentTournament.entryFeeUsd.toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                      {teamData.paymentMethod === 'binance' && (
                        <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
                      )}
                    </div>

                    <div
                      onClick={() => {
                        sound.playClick();
                        setTeamData({ ...teamData, paymentMethod: 'wallet' });
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        teamData.paymentMethod === 'wallet'
                          ? 'bg-[#18181b] border-[#a78bfa]'
                          : 'bg-[#121215] border-[#27272a]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#a78bfa]" />
                        <div>
                          <span className="text-xs font-bold text-[#fafafa] block">Billetera Gamer</span>
                          <span className="text-[10px] text-[#a78bfa] font-mono">
                            ${currentTournament.entryFeeUsd.toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                      {teamData.paymentMethod === 'wallet' && (
                        <CheckCircle2 className="w-4 h-4 text-[#a78bfa]" />
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121215] border border-[#27272a] text-xs text-[#a1a1aa] flex justify-between items-center">
                    <span>Monto Total a Liquidar:</span>
                    <span className="text-base font-extrabold text-[#34d399] font-mono">
                      Bs. {currentTournament.entryFeeBs.toFixed(2)} / ${currentTournament.entryFeeUsd.toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                {/* Botón de Enviar Pago e Inscripción */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#34d399] via-[#6ee7b7] to-[#38bdf8] text-[#09090b] font-extrabold text-sm shadow-[0_4px_25px_rgba(52,211,153,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-5 h-5 text-[#09090b]" />
                  <span>Pagar Inscripción y Desbloquear Sala Privada</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: BRACKETS EN VIVO */}
        {activeTab === 'brackets' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#121215] border border-[#27272a] shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#27272a] gap-2">
              <div>
                <span className="text-xs font-mono text-[#a78bfa] uppercase font-bold tracking-widest">
                  Fixture Oficial
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#fafafa] mt-0.5">
                  Cuadro de Enfrentamientos en Vivo
                </h3>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-[#1e1e24] text-xs font-mono text-[#34d399] border border-[#27272a]">
                🔴 Semifinales en Curso
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cuartos */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#a1a1aa] uppercase tracking-wider block">
                  Cuartos de Final (Bo1)
                </span>
                {INITIAL_BRACKET_MATCHES.filter((m) => m.stage === 'quarters').map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl bg-[#18181b] border border-[#27272a] space-y-2 hover:border-[#a78bfa]/50 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#fafafa] font-mono">{match.team1.name}</span>
                      <span className="font-mono font-bold text-[#34d399]">{match.team1.score}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs opacity-60">
                      <span className="text-[#a1a1aa] font-mono">{match.team2.name}</span>
                      <span className="font-mono text-[#a1a1aa]">{match.team2.score}</span>
                    </div>
                    <span className="block text-[10px] text-[#a1a1aa] pt-1 font-mono border-t border-[#27272a]">
                      MVP: {match.mvp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Semifinales */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#34d399] uppercase tracking-wider block">
                  Semifinales (Bo3 en Vivo)
                </span>
                {INITIAL_BRACKET_MATCHES.filter((m) => m.stage === 'semis').map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-2xl bg-[#1e1e24] border border-[#34d399]/50 shadow-[0_0_20px_rgba(52,211,153,0.15)] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#fafafa] font-mono">{match.team1.name}</span>
                      <span className="font-mono font-bold text-[#34d399] text-sm">{match.team1.score}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#fafafa] font-mono">{match.team2.name}</span>
                      <span className="font-mono font-bold text-[#34d399] text-sm">{match.team2.score}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#27272a] text-[10px] font-mono">
                      <span className="text-[#34d399] animate-pulse">● EN VIVO (Mapa 2)</span>
                      <span className="text-[#a1a1aa]">Árbitro: Nexus_Ref_01</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gran Final */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider block">
                  Gran Final (Bo5 por $90 USDT)
                </span>
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#f59e0b]/20 to-[#121215] border border-[#f59e0b]/50 shadow-2xl flex flex-col justify-between min-h-[160px]">
                  <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] text-xs font-bold">
                      <Trophy className="w-4 h-4" />
                      <span>Copa de Campeones</span>
                    </div>
                    <div className="mt-3 text-sm font-bold text-[#fafafa]">
                      Ganador Semi 1 vs Ganador Semi 2
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-1 font-mono">
                      Premio 1er Lugar: Bs. 5,625 ($90 USDT)
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#27272a] text-[10px] text-[#f59e0b] font-mono">
                    Transmisión en directo hoy 21:00 VET
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMINISTRACIÓN DE SALA Y ESTADO DEL TORNEO */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {/* Si ya se registró el equipo */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121215] border border-[#34d399]/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#27272a] gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#34d399]/20 text-[#34d399] flex items-center justify-center text-3xl">
                    {registeredTeam ? CLAN_EMBLEMS.find((b) => b.id === registeredTeam.badgeId)?.icon || '🐉' : '🐉'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-[#fafafa]">
                        {registeredTeam ? registeredTeam.teamName : 'Delta Gaming VE'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#34d399]/20 text-[#34d399] text-[10px] font-bold">
                        INSCRIPCIÓN PAGADA
                      </span>
                    </div>
                    <p className="text-xs text-[#a1a1aa] font-mono">
                      Slot de Escuadra: <strong className="text-[#fafafa]">#07 (Zona Norte)</strong> • Torneo: {currentTournament.title}
                    </p>
                  </div>
                </div>

                {/* Check in button */}
                <button
                  onClick={handleConfirmCheckin}
                  disabled={hasCheckedIn}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    hasCheckedIn
                      ? 'bg-[#065f46] text-[#34d399] border border-[#34d399]'
                      : 'bg-[#34d399] text-[#09090b] hover:bg-[#6ee7b7]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hasCheckedIn ? '✓ Check-In Confirmado' : 'Confirmar Check-In de Escuadra'}</span>
                </button>
              </div>

              {/* Credenciales de Sala Privada */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#a1a1aa] font-mono uppercase">ID de Sala Privada</span>
                  <div className="text-2xl font-bold text-[#34d399] font-mono mt-1">948102</div>
                  <span className="text-[10px] text-[#71717a]">Garena Custom Room SAC</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a]">
                  <span className="text-xs text-[#a1a1aa] font-mono uppercase">Contraseña de Acceso</span>
                  <div className="text-2xl font-bold text-[#fafafa] font-mono mt-1">nexus2026</div>
                  <span className="text-[10px] text-[#71717a]">No compartir con rivales</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18181b] border border-[#27272a] flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#a1a1aa] font-mono uppercase">Copiar Todo</span>
                    <p className="text-[11px] text-[#a1a1aa] mt-1">Envía los datos a tu grupo de WhatsApp</p>
                  </div>
                  <button
                    onClick={handleCopyCredentials}
                    className="mt-2 py-1.5 px-3 rounded-lg bg-[#27272a] hover:bg-[#a78bfa] hover:text-[#09090b] text-xs font-semibold text-[#fafafa] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey ? '¡Copiado!' : 'Copiar Credenciales'}</span>
                  </button>
                </div>
              </div>

              {/* Reglas de Torneo y Soporte */}
              <div className="p-4 rounded-2xl bg-[#0c0c0f] border border-[#27272a] text-xs text-[#a1a1aa] space-y-2">
                <h5 className="font-bold text-[#fafafa]">Reglas Oficiales del Torneo:</h5>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#a1a1aa]">
                  <li>Todos los jugadores deben ingresar a la sala 10 minutos antes del inicio.</li>
                  <li>Prohibido el uso de emuladores para torneos de categoría Mobile Only.</li>
                  <li>Cada kill suma 1 punto; la colocación otorga puntos por Booyah (12 pts, 9 pts, 8 pts).</li>
                  <li>Los premios se transfieren a la billetera o Pago Móvil del capitán inmediatamente tras terminar la final.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
