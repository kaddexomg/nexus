import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  Trophy,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  Swords,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Key,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Gamepad2,
  Share2,
  Radio,
  Flame,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface TournamentWithRoom {
  id: string;
  title: string;
  game: string;
  format: string;
  prizePoolUsd: number;
  registeredTeams: number;
  maxTeams: number;
  date: string;
  time: string;
  status: 'open' | 'in_progress' | 'completed';
  customRoomDetails: {
    roomId: string;
    password: string;
    matchMode: string;
    server: string;
  };
}

export const LOCAL_TOURNAMENTS: TournamentWithRoom[] = [
  {
    id: 'ff-cup-14',
    title: 'Free Fire Escuadras Cup #14',
    game: 'Free Fire SAC',
    format: 'Duelo de Escuadras 4v4',
    prizePoolUsd: 150.00,
    registeredTeams: 28,
    maxTeams: 32,
    date: 'Hoy 20:00 VET',
    time: '8:00 PM',
    status: 'open',
    customRoomDetails: {
      roomId: '94810294',
      password: 'NXFF-2026',
      matchMode: 'Duelo de Escuadras (Bo3)',
      server: 'Sudamérica (SAC)',
    },
  },
  {
    id: 'cod-5v5-snd',
    title: 'Call of Duty: Mobile 5v5 SnD',
    game: 'Call of Duty: Mobile',
    format: 'Search and Destroy 5v5',
    prizePoolUsd: 200.00,
    registeredTeams: 14,
    maxTeams: 16,
    date: 'Mañana 19:30 VET',
    time: '7:30 PM',
    status: 'open',
    customRoomDetails: {
      roomId: '88204912',
      password: 'NXCOD-77',
      matchMode: 'Search & Destroy Competitivo',
      server: 'Activision Latam',
    },
  },
  {
    id: 'ml-starlight-clash',
    title: 'Mobile Legends 5v5 Starlight Clash',
    game: 'Mobile Legends: Bang Bang',
    format: 'Torneo 5v5 Eliminación Directa',
    prizePoolUsd: 100.00,
    registeredTeams: 12,
    maxTeams: 16,
    date: 'Viernes 21:00 VET',
    time: '9:00 PM',
    status: 'open',
    customRoomDetails: {
      roomId: '71049281',
      password: 'NXML-55',
      matchMode: 'Draft Pick Competitivo 5v5',
      server: 'Moonton Smile Latam',
    },
  },
];

export interface InteractiveBracketMatch {
  id: string;
  round: string;
  teamA: { name: string; score: number; kills?: number; isWinner?: boolean };
  teamB: { name: string; score: number; kills?: number; isWinner?: boolean };
  status: 'completed' | 'in_progress' | 'pending';
}

export const InteractiveTournamentHub: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTournament, setSelectedTournament] = useState<TournamentWithRoom>(LOCAL_TOURNAMENTS[0]);

  // Team Registration Form
  const [teamName, setTeamName] = useState('Nexus Vanguard');
  const [teamTag, setTeamTag] = useState('NVG');
  const [captainUid, setCaptainUid] = useState('849204812');
  const [captainDiscord, setCaptainDiscord] = useState('@captain_striker');
  const [player2Uid, setPlayer2Uid] = useState('918237190');
  const [player3Uid, setPlayer3Uid] = useState('748192018');
  const [player4Uid, setPlayer4Uid] = useState('691048201');
  const [isRegistered, setIsRegistered] = useState(false);

  // Custom Room Connection Simulation
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'ready' | 'in_game' | 'finished'>('ready');
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Dynamic Fixture & Live Match Scores
  const [matches, setMatches] = useState<InteractiveBracketMatch[]>([
    {
      id: 'm1',
      round: 'Cuartos de Final',
      teamA: { name: 'Nexus Vanguard', score: 3, kills: 14, isWinner: true },
      teamB: { name: 'Caracas E-Sports', score: 1, kills: 8, isWinner: false },
      status: 'completed',
    },
    {
      id: 'm2',
      round: 'Cuartos de Final',
      teamA: { name: 'Shadow Hunters', score: 3, kills: 16, isWinner: true },
      teamB: { name: 'Vortex Latam', score: 2, kills: 12, isWinner: false },
      status: 'completed',
    },
    {
      id: 'm3',
      round: 'Semifinal',
      teamA: { name: 'Nexus Vanguard', score: 2, kills: 11, isWinner: undefined },
      teamB: { name: 'Shadow Hunters', score: 1, kills: 9, isWinner: undefined },
      status: 'in_progress',
    },
    {
      id: 'm4',
      round: 'Gran Final',
      teamA: { name: 'Por Definir', score: 0, isWinner: undefined },
      teamB: { name: 'Titanes del Zulia', score: 0, isWinner: undefined },
      status: 'pending',
    },
  ]);

  const handleCopy = (text: string, type: 'id' | 'pass') => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 1800);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 1800);
    }
  };

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setIsRegistered(true);
    setCurrentStep(3); // Go to Room Credentials
  };

  const handleSimulateScoreUpdate = () => {
    sound.playClick();
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === 'm3') {
          return {
            ...m,
            teamA: { ...m.teamA, score: 3, kills: (m.teamA.kills || 11) + 2, isWinner: true },
            teamB: { ...m.teamB, score: 1, isWinner: false },
            status: 'completed',
          };
        }
        if (m.id === 'm4') {
          return {
            ...m,
            teamA: { name: 'Nexus Vanguard', score: 1, kills: 4, isWinner: undefined },
            status: 'in_progress',
          };
        }
        return m;
      })
    );
  };

  const STEPS = [
    { num: 1, title: 'Torneo & Juego', desc: 'Selección de disciplina' },
    { num: 2, title: 'Inscripción Escuadra', desc: 'UIDs de jugadores' },
    { num: 3, title: 'Conexión de Sala', desc: 'Room ID & Contraseña' },
    { num: 4, title: 'Brackets & Fixture', desc: 'Seguimiento en vivo' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn" id="torneos-hub">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a78bfa] font-bold">
              Nexus Esports Circuit • Temporada Competitiva
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
            Arena de Torneos & Conexión de Salas
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Flujo guiado para competir por premios en USDT y Bolívares. Creación de salas de juego con árbitro asistido y brackets actualizados en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-card)] px-4 py-2 rounded-2xl border border-[var(--border-color)]">
          <Trophy className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
            Pozo Total Activo: ${LOCAL_TOURNAMENTS.reduce((acc, t) => acc + t.prizePoolUsd, 0)} USDT
          </span>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentStep(s.num);
                }}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#a78bfa] text-[#09090b] border-[#a78bfa] shadow-md font-bold'
                    : isCompleted
                    ? 'bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-color)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase">Paso {s.num}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5" />}
                </div>
                <h4 className="text-xs font-bold truncate">{s.title}</h4>
                <span className={`text-[10px] block truncate ${isCurrent ? 'text-[#09090b]/80' : 'text-[var(--text-muted)]'}`}>
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER CON MOTION */}
      <div className="relative min-h-[460px]">
        <AnimatePresence mode="wait">
          {/* =========================================================================
              PASO 1: SELECCIÓN DE TORNEO Y MODALIDAD
              ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step-tourney-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {LOCAL_TOURNAMENTS.map((t) => {
                  const isSelected = selectedTournament.id === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedTournament(t);
                      }}
                      className={`p-6 rounded-3xl bg-[var(--bg-card)] border-2 transition-all cursor-pointer flex flex-col justify-between shadow-xl relative overflow-hidden ${
                        isSelected
                          ? 'border-[#a78bfa] ring-2 ring-[#a78bfa]/30 bg-[#a78bfa]/5'
                          : 'border-[var(--border-color)] hover:border-[#a78bfa]/40'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#a78bfa]/15 text-[#a78bfa] font-bold">
                            {t.game}
                          </span>
                          <span className="text-[10px] font-mono text-[#34d399] font-bold flex items-center gap-1">
                            <Radio className="w-3 h-3 text-[#34d399] animate-pulse" />
                            {t.status === 'open' ? 'Inscripciones Abiertas' : 'En Curso'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-[var(--text-primary)]">{t.title}</h4>
                          <span className="text-xs text-[var(--text-muted)] font-mono block mt-0.5">
                            Modalidad: {t.format}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-1 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Pozo a Repartir:</span>
                            <span className="text-[#f59e0b] font-bold">${t.prizePoolUsd} USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Cupos Escuadras:</span>
                            <span className="text-[var(--text-primary)]">{t.registeredTeams}/{t.maxTeams}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Entrada:</span>
                            <span className="text-[#34d399] font-bold">Gratis / Free Entry</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          {t.date} • {t.time}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedTournament(t);
                            setCurrentStep(2);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#a78bfa] text-[#09090b] font-bold text-xs flex items-center gap-1 hover:bg-[#c4b5fd] transition-all"
                        >
                          <span>Inscribir Escuadra</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 2: FORMULARIO DE INSCRIPCIÓN DE ESCUADRA
              ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step-tourney-2"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              <form
                onSubmit={handleRegisterTeam}
                className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl space-y-6"
              >
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-[#a78bfa]">
                    Inscripción Oficial • {selectedTournament.title}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                    Registra tu Escuadra Competitiva
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                    Ingresa los UIDs oficiales de tus 4 jugadores para que el árbitro pueda verificar los accesos a la sala personalizada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      Nombre de la Escuadra / Clan
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      Tag de Clan (3-5 letras)
                    </label>
                    <input
                      type="text"
                      required
                      value={teamTag}
                      onChange={(e) => setTeamTag(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      UID Capitán (Titular)
                    </label>
                    <input
                      type="text"
                      required
                      value={captainUid}
                      onChange={(e) => setCaptainUid(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      Discord / Telegram Capitán
                    </label>
                    <input
                      type="text"
                      required
                      value={captainDiscord}
                      onChange={(e) => setCaptainDiscord(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      UID Jugador 2
                    </label>
                    <input
                      type="text"
                      required
                      value={player2Uid}
                      onChange={(e) => setPlayer2Uid(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase font-mono text-[var(--text-secondary)] block mb-1">
                      UID Jugador 3
                    </label>
                    <input
                      type="text"
                      required
                      value={player3Uid}
                      onChange={(e) => setPlayer3Uid(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(1);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver a Torneos</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Completar Registro & Generar Sala</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 3: CONECTOR Y GENERADOR DE SALA OFICIAL (CUSTOM ROOM)
              ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step-tourney-3"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              {/* Tarjeta de Credenciales de Sala */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border-2 border-[#34d399]/40 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-ping"></span>
                      <span className="text-xs font-mono text-[#34d399] font-bold uppercase tracking-wider">
                        Sala Creada en Servidor Oficial • {selectedTournament.game}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                      Credenciales de Acceso para la Escuadra
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#34d399]/20 text-[#34d399] text-xs font-mono font-bold self-start sm:self-auto">
                    ESTADO: SALA LISTA (8/8)
                  </span>
                </div>

                {/* Bloque de ID de Sala y Contraseña Copiable */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">ID de Sala (Room ID)</span>
                      <span className="text-xl font-extrabold font-mono text-[var(--text-primary)]">
                        {selectedTournament.customRoomDetails.roomId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedTournament.customRoomDetails.roomId, 'id')}
                      className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[#a78bfa] hover:text-[#09090b] text-[var(--text-secondary)] transition-all cursor-pointer"
                      title="Copiar Room ID"
                    >
                      {copiedRoomId ? <Check className="w-4 h-4 text-[#34d399]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Contraseña de Sala</span>
                      <span className="text-xl font-extrabold font-mono text-[#a78bfa]">
                        {selectedTournament.customRoomDetails.password}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedTournament.customRoomDetails.password, 'pass')}
                      className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[#a78bfa] hover:text-[#09090b] text-[var(--text-secondary)] transition-all cursor-pointer"
                      title="Copiar Contraseña"
                    >
                      {copiedPassword ? <Check className="w-4 h-4 text-[#34d399]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Explicación Técnica de la Integración (Respuesta exacta a la duda del cliente) */}
                <div className="p-4 rounded-2xl bg-[#a78bfa]/10 border border-[#a78bfa]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#a78bfa]">
                    <HelpCircle className="w-4 h-4" />
                    <span>¿Cómo se conectan las salas de juego con nuestra plataforma web?</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    En videojuegos móviles (Free Fire, COD Mobile, MLBB), las salas personalizadas requieren un anfitrión dentro del juego. Nuestra plataforma opera con el modelo <strong>Árbitro / Bot Host Asistido</strong>: el árbitro de Nexus crea la sala con la tarjeta oficial de torneo, publica las credenciales encriptadas en esta pantalla para los capitanes verificados, y valida la tabla de bajas (Kills) al finalizar la partida para avanzar automáticamente las llaves del fixture.
                  </p>
                </div>

                {/* Reglas de la Partida */}
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] space-y-2 text-xs">
                  <h4 className="font-bold text-[var(--text-primary)] uppercase font-mono text-[11px]">
                    Reglas Oficiales del Encuentro:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                      Modo: {selectedTournament.customRoomDetails.matchMode}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                      Servidor: {selectedTournament.customRoomDetails.server}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                      Tolerancia de espera: 5 minutos máximo
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]"></span>
                      Prohibido emulador en torneos móvil exclusivo
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(2);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Editar Escuadra</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(4);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Ver Fixture & Marcador en Vivo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PASO 4: FIXTURE / BRACKETS Y SEGUIMIENTO DE PARTIDAS EN VIVO
              ========================================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step-tourney-4"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.22 }}
              className="space-y-6"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-[#34d399] flex items-center gap-1.5">
                      <Radio className="w-3 h-3 text-[#34d399] animate-pulse" /> Marcador en Tiempo Real
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                      Fixture Oficial & Avance de Rondas
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateScoreUpdate}
                    className="px-4 py-2 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[#a78bfa] hover:text-[#09090b] text-[var(--text-primary)] text-xs font-bold border border-[var(--border-color)] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Simular Actualización de Kills</span>
                  </button>
                </div>

                {/* Brackets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        match.status === 'in_progress'
                          ? 'bg-[#a78bfa]/10 border-[#a78bfa] shadow-lg ring-1 ring-[#a78bfa]'
                          : match.status === 'completed'
                          ? 'bg-[var(--bg-elevated)] border-[#34d399]/30'
                          : 'bg-[var(--bg-elevated)] border-[var(--border-color)] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3 text-xs font-mono">
                        <span className="font-bold text-[var(--text-primary)]">{match.round}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            match.status === 'in_progress'
                              ? 'bg-[#a78bfa] text-[#09090b] animate-pulse'
                              : match.status === 'completed'
                              ? 'bg-[#34d399]/20 text-[#34d399]'
                              : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                          }`}
                        >
                          {match.status === 'in_progress'
                            ? 'EN JUEGO'
                            : match.status === 'completed'
                            ? 'FINALIZADA'
                            : 'PENDIENTE'}
                        </span>
                      </div>

                      {/* Team A */}
                      <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)] text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              match.teamA.isWinner
                                ? 'text-[#34d399]'
                                : match.teamA.isWinner === false
                                ? 'text-[var(--text-muted)] line-through'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {match.teamA.name}
                          </span>
                          {match.teamA.isWinner && <Award className="w-3.5 h-3.5 text-[#34d399]" />}
                        </div>
                        <div className="flex items-center gap-3">
                          {match.teamA.kills !== undefined && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {match.teamA.kills} Kills
                            </span>
                          )}
                          <span className="font-extrabold text-sm text-[var(--text-primary)]">
                            {match.teamA.score}
                          </span>
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between py-2 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              match.teamB.isWinner
                                ? 'text-[#34d399]'
                                : match.teamB.isWinner === false
                                ? 'text-[var(--text-muted)] line-through'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {match.teamB.name}
                          </span>
                          {match.teamB.isWinner && <Award className="w-3.5 h-3.5 text-[#34d399]" />}
                        </div>
                        <div className="flex items-center gap-3">
                          {match.teamB.kills !== undefined && (
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {match.teamB.kills} Kills
                            </span>
                          )}
                          <span className="font-extrabold text-sm text-[var(--text-primary)]">
                            {match.teamB.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(3);
                    }}
                    className="px-5 py-3 rounded-2xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Ver Sala de Juego</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(1);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#a78bfa] text-[#09090b] font-bold text-xs shadow-lg hover:bg-[#c4b5fd] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Inscribir en Otro Torneo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
