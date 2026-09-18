import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Swords, Users, Clock, Info, Shield, Target, FileText, CheckCircle, Copy, Play } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { sound } from '../utils/audio';

interface TournamentV2 {
  id: string;
  title: string;
  game: string;
  format: string;
  entryFeeUsd: number;
  maxTeams: number;
  registeredTeams: number;
  totalPrizePoolUsd: number;
  prizePerKillUsd: number;
  platformRakePercent: number;
  prizes: { position: number; label: string; amountUsd: number }[];
  status: 'REGISTRATION_OPEN' | 'CHECK_IN' | 'IN_PROGRESS' | 'SCORING' | 'COMPLETED';
  scheduledAt: string;
  mapPool: string[];
  rules: string[];
  roomCredentials?: { roomId: string; password: string; server: string };
}

const LOCAL_TOURNAMENTS_V2: TournamentV2[] = [
  {
    id: 't1',
    title: 'Copa Free Fire #15',
    game: 'Free Fire',
    format: 'Battle Royale',
    entryFeeUsd: 3,
    maxTeams: 32,
    registeredTeams: 18,
    totalPrizePoolUsd: 96,
    prizePerKillUsd: 1,
    platformRakePercent: 15,
    prizes: [
      { position: 1, label: '1er Lugar', amountUsd: 40 },
      { position: 2, label: '2do Lugar', amountUsd: 20 },
      { position: 3, label: '3er Lugar', amountUsd: 10 }
    ],
    status: 'REGISTRATION_OPEN',
    scheduledAt: '2026-09-20T20:00:00Z',
    mapPool: ['Bermuda', 'Purgatorio', 'Kalahari'],
    rules: [
      'Sin emuladores permitidos.',
      'Máximo 4 jugadores por escuadra.',
      'Inscripción no reembolsable.',
      'Check-in obligatorio 30 min antes.'
    ],
    roomCredentials: { roomId: '9984321', password: 'NEXUS', server: 'EEUU' }
  },
  {
    id: 't2',
    title: 'Clash Squad 4v4 COD',
    game: 'Call of Duty: Mobile',
    format: 'Clash Squad bracket',
    entryFeeUsd: 5,
    maxTeams: 16,
    registeredTeams: 12,
    totalPrizePoolUsd: 60,
    prizePerKillUsd: 1,
    platformRakePercent: 15,
    prizes: [
      { position: 1, label: '1er Lugar', amountUsd: 30 },
      { position: 2, label: '2do Lugar', amountUsd: 15 },
      { position: 3, label: '3er Lugar', amountUsd: 5 }
    ],
    status: 'REGISTRATION_OPEN',
    scheduledAt: '2026-09-22T19:00:00Z',
    mapPool: ['Crash', 'Standoff', 'Firing Range'],
    rules: [
      'Partidas al mejor de 3 (BO3).',
      'Sin uso de armas míticas prohibidas.',
      'Puntualidad obligatoria.'
    ],
    roomCredentials: { roomId: 'COD4412', password: 'NEXUS', server: 'Latam' }
  },
  {
    id: 't3',
    title: 'Arena MLBB 5v5',
    game: 'Mobile Legends',
    format: 'Arena 5v5',
    entryFeeUsd: 5,
    maxTeams: 12,
    registeredTeams: 12,
    totalPrizePoolUsd: 48,
    prizePerKillUsd: 1,
    platformRakePercent: 15,
    prizes: [
      { position: 1, label: '1er Lugar', amountUsd: 25 },
      { position: 2, label: '2do Lugar', amountUsd: 10 },
      { position: 3, label: '3er Lugar', amountUsd: 5 }
    ],
    status: 'IN_PROGRESS',
    scheduledAt: '2026-09-17T18:00:00Z',
    mapPool: ['Land of Dawn'],
    rules: [
      'Draft Pick.',
      'Tolerancia de 5 minutos al inicio.',
      'Desconexiones no pausan el juego.'
    ],
    roomCredentials: { roomId: 'ML1234', password: 'NEXUS', server: 'Latam' }
  },
  {
    id: 't4',
    title: 'Copa EA Sports FC 24 — 1v1 Cara a Cara',
    game: 'EA Sports FC 24 Mobile',
    format: '1v1 Cara a Cara (H2H)',
    entryFeeUsd: 5,
    maxTeams: 16,
    registeredTeams: 12,
    totalPrizePoolUsd: 80,
    prizePerKillUsd: 0,
    platformRakePercent: 15,
    prizes: [
      { position: 1, label: '🥇 Campeón', amountUsd: 45 },
      { position: 2, label: '🥈 Subcampeón', amountUsd: 20 },
      { position: 3, label: '🥉 3er Lugar', amountUsd: 10 }
    ],
    status: 'REGISTRATION_OPEN',
    scheduledAt: '2026-09-24T19:00:00Z',
    mapPool: ['Estadio El Libertador', 'Santiago Bernabéu'],
    rules: [
      'Modalidad Cara a Cara (H2H) de 6 minutos.',
      'Partidas de eliminación directa Bo3.',
      'Plantillas libres hasta 95 OVR.',
      'En caso de empate se juega prórroga y penales.'
    ],
    roomCredentials: { roomId: 'FC24-CHAMP-01', password: 'NEXUS', server: 'América Latina' }
  }
];

const MOCK_LEADERBOARD = [
  { team: 'Nexus Vanguard', kills: 18, position: 1, placementPts: 15 },
  { team: 'BolivarGangVE', kills: 14, position: 2, placementPts: 12 },
  { team: 'DragonForce', kills: 11, position: 3, placementPts: 10 },
  { team: 'PhantomCrew', kills: 9, position: 4, placementPts: 8 },
  { team: 'ShadowElite', kills: 7, position: 5, placementPts: 6 },
  { team: 'NeonStrike', kills: 5, position: 6, placementPts: 4 },
  { team: 'ViperSquad', kills: 4, position: 7, placementPts: 3 },
  { team: 'StormRiders', kills: 2, position: 8, placementPts: 2 },
];

const MOCK_SOCCER_LEADERBOARD = [
  { player: 'Vinicius_VE99', club: 'Real Madrid', pj: 5, pg: 4, pe: 1, pp: 0, gf: 14, gc: 4, dg: '+10', pts: 13, earnings: 45, isTopScorer: true },
  { player: 'CaracasGamer_10', club: 'Manchester City', pj: 5, pg: 4, pe: 0, pp: 1, gf: 12, gc: 6, dg: '+6', pts: 12, earnings: 20, isTopScorer: false },
  { player: 'StrikerMaracaibo', club: 'Arsenal FC', pj: 5, pg: 3, pe: 1, pp: 1, gf: 10, gc: 5, dg: '+5', pts: 10, earnings: 10, isTopScorer: false },
  { player: 'FutBolivar_7', club: 'Inter de Milán', pj: 5, pg: 2, pe: 2, pp: 1, gf: 8, gc: 6, dg: '+2', pts: 8, earnings: 0, isTopScorer: false },
  { player: 'ElTitan_FC', club: 'Bayern Múnich', pj: 5, pg: 2, pe: 0, pp: 3, gf: 7, gc: 9, dg: '-2', pts: 6, earnings: 0, isTopScorer: false },
  { player: 'GoldenGoal_99', club: 'Paris Saint-Germain', pj: 5, pg: 1, pe: 1, pp: 3, gf: 5, gc: 11, dg: '-6', pts: 4, earnings: 0, isTopScorer: false },
  { player: 'DefenseZero', club: 'FC Barcelona', pj: 5, pg: 0, pe: 1, pp: 4, gf: 3, gc: 12, dg: '-9', pts: 1, earnings: 0, isTopScorer: false },
];

export const InteractiveTournamentHub: React.FC = () => {
  const { toProtectedBs } = useCurrency();
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(LOCAL_TOURNAMENTS_V2[0].id);
  const [activeTab, setActiveTab] = useState<'INFO' | 'REGISTER' | 'LEADERBOARD' | 'ROOM'>('INFO');
  const [registeredTourneys, setRegisteredTourneys] = useState<string[]>([]);
  
  // Registration form state
  const [regForm, setRegForm] = useState({
    teamName: '',
    clanTag: '',
    capUid: '',
    capWa: '',
    p2Uid: '',
    p3Uid: '',
    p4Uid: '',
    subUid: '',
    // Soccer specific fields
    gamerTag: '',
    selectedClub: 'Real Madrid',
    platformDevice: 'Móvil (Android / iOS)',
    paymentMethod: 'saldo'
  });

  const selectedTourney = LOCAL_TOURNAMENTS_V2.find(t => t.id === selectedTourneyId) || LOCAL_TOURNAMENTS_V2[0];
  const isRegistered = registeredTourneys.includes(selectedTourneyId);
  const isSoccer = selectedTourney.prizePerKillUsd === 0 || selectedTourney.game.toLowerCase().includes('fc');

  const handleSelectTourney = (id: string) => {
    try { sound.playClick(); } catch (e) {}
    setSelectedTourneyId(id);
    setActiveTab('INFO');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    try { sound.playSuccess(); } catch (e) {}
    setRegisteredTourneys(prev => [...prev, selectedTourneyId]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    try { sound.playClick(); } catch (e) {}
    alert('Copiado al portapapeles');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 text-[var(--text-primary)]">
      
      {/* Left Panel: Tournament List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[var(--accent)]" />
          Torneos Disponibles
        </h2>
        
        <div className="flex flex-col gap-4">
          {LOCAL_TOURNAMENTS_V2.map((tourney) => (
            <motion.div
              key={tourney.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTourney(tourney.id)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-colors ${
                selectedTourneyId === tourney.id
                  ? 'bg-[var(--bg-elevated)] border-[var(--accent)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--text-secondary)]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{tourney.title}</h3>
                  <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                    <Swords className="w-3.5 h-3.5" />
                    {tourney.game} • {tourney.format}
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  tourney.status === 'REGISTRATION_OPEN' ? 'bg-green-500/20 text-green-400' : 
                  tourney.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {tourney.status === 'REGISTRATION_OPEN' ? 'ABIERTO' : 
                   tourney.status === 'IN_PROGRESS' ? 'EN CURSO' : 'FINALIZADO'}
                </div>
              </div>

              {tourney.prizePerKillUsd > 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-4 flex items-center justify-center gap-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">$1.00 por Kill</span>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 mb-4 flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-sm">⚽ Bota de Oro & Premio al Campeón</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Prize Pool</span>
                  <span className="font-bold text-[var(--accent)]">${tourney.totalPrizePoolUsd.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Entrada</span>
                  <span className="font-bold">${tourney.entryFeeUsd.toFixed(2)}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Cupos</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--accent)] rounded-full"
                        style={{ width: `${(tourney.registeredTeams / tourney.maxTeams) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{tourney.registeredTeams}/{tourney.maxTeams}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel: Tournament Details */}
      <div className="w-full lg:w-2/3 flex flex-col bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-default)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-elevated)]">
          <div>
            <h1 className="text-2xl font-bold">{selectedTourney.title}</h1>
            <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm mt-1">
              <span className="flex items-center gap-1"><Swords className="w-4 h-4" /> {selectedTourney.format}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {selectedTourney.registeredTeams}/{selectedTourney.maxTeams} Escuadras</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(selectedTourney.scheduledAt).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--accent)]">${selectedTourney.totalPrizePoolUsd.toFixed(2)}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Prize Pool Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[var(--border-default)] scrollbar-hide">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'INFO' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Info & Premios
          </button>
          
          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'REGISTER' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Inscripción
          </button>

          <button
            onClick={() => setActiveTab('LEADERBOARD')}
            className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'LEADERBOARD' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Tabla de Posiciones
          </button>

          {isRegistered && (
            <button
              onClick={() => setActiveTab('ROOM')}
              className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === 'ROOM' ? 'border-[var(--accent)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Sala de Juego
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'INFO' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Prize Breakdown */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[var(--accent)]" /> 
                    Distribución de Premios
                  </h3>
                  <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] overflow-hidden">
                    <div className="divide-y divide-[var(--border-default)]">
                      {selectedTourney.prizes.map((prize) => (
                        <div key={prize.position} className="flex justify-between items-center p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : '🥉'}
                            </span>
                            <span className="font-semibold">{prize.label}</span>
                          </div>
                          <span className="font-bold text-lg">${prize.amountUsd.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-4 bg-yellow-500/10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💀</span>
                          <span className="font-semibold text-yellow-400">Por cada eliminación confirmada</span>
                        </div>
                        <span className="font-bold text-lg text-yellow-400">${selectedTourney.prizePerKillUsd.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-3 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Nexus retiene {selectedTourney.platformRakePercent}% como comisión de plataforma (ya deducido del prize pool).
                  </p>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--accent)]" /> 
                    Reglas y Formato
                  </h3>
                  <ul className="space-y-3">
                    {selectedTourney.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <div className="min-w-[1.5rem] flex justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                        </div>
                        {rule}
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <div className="min-w-[1.5rem] flex justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      </div>
                      Mapas: {selectedTourney.mapPool.join(', ')}
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'REGISTER' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isRegistered ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">¡Inscripción Exitosa!</h3>
                    <p className="text-[var(--text-secondary)] max-w-md">
                      Tu escuadra ha sido registrada correctamente. Tienes el <strong>Slot #12</strong> reservado.
                    </p>
                    <button
                      onClick={() => setActiveTab('ROOM')}
                      className="mt-6 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
                    >
                      Ir a la Sala de Juego
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                ) : isSoccer ? (
                  /* ⚽ Formulario Especializado para EA Sports FC 24 / Fútbol 1v1 */
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <h4 className="font-bold text-emerald-400 text-sm">Inscripción Individual 1v1 (Cara a Cara)</h4>
                        <p className="text-xs text-[var(--text-secondary)]">Formato competitivo oficial. No requiere escuadra; juegas directamente tus partidos 1 contra 1.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Gamertag / EA ID Oficial *</label>
                        <input 
                          required
                          type="text" 
                          value={regForm.gamerTag}
                          onChange={(e) => setRegForm({...regForm, gamerTag: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          placeholder="Ej. Vinicius_VE99 o CaracasGamer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">WhatsApp de Coordinación *</label>
                        <input 
                          required
                          type="text" 
                          value={regForm.capWa}
                          onChange={(e) => setRegForm({...regForm, capWa: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          placeholder="+58 412 1234567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Club / Plantilla a Utilizar</label>
                        <input 
                          type="text" 
                          value={regForm.selectedClub}
                          onChange={(e) => setRegForm({...regForm, selectedClub: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          placeholder="Ej. Real Madrid, Man City o Plantilla UT"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Dispositivo / Consola</label>
                        <select 
                          value={regForm.platformDevice}
                          onChange={(e) => setRegForm({...regForm, platformDevice: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
                        >
                          <option value="Móvil (Android / iOS)">Móvil (Android / iOS)</option>
                          <option value="PlayStation 5">PlayStation 5</option>
                          <option value="Xbox Series X/S">Xbox Series X/S</option>
                          <option value="PC">PC (EA App / Steam)</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-[var(--border-default)] pt-5">
                      <h4 className="font-bold mb-3">Método de Pago</h4>
                      <select 
                        value={regForm.paymentMethod}
                        onChange={(e) => setRegForm({...regForm, paymentMethod: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <option value="saldo">Saldo Nexus (${selectedTourney.entryFeeUsd.toFixed(2)})</option>
                        <option value="binance">Binance Pay (${selectedTourney.entryFeeUsd.toFixed(2)} USDT)</option>
                        <option value="pagomovil">Pago Móvil (Bs. {toProtectedBs(selectedTourney.entryFeeUsd).toFixed(2)})</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedTourney.status !== 'REGISTRATION_OPEN'}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                    >
                      {selectedTourney.status === 'REGISTRATION_OPEN' ? `Inscribirme en Copa FC 24 ($${selectedTourney.entryFeeUsd.toFixed(2)})` : 'Inscripciones Cerradas'}
                    </button>
                  </form>
                ) : (
                  /* 💥 Formulario Battle Royale / Escuadras (Free Fire, COD, etc.) */
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Nombre de Escuadra</label>
                        <input 
                          required
                          type="text" 
                          value={regForm.teamName}
                          onChange={(e) => setRegForm({...regForm, teamName: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          placeholder="Ej. Nexus Vanguard"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">Tag del Clan (3-5 chars)</label>
                        <input 
                          required
                          type="text" 
                          maxLength={5}
                          minLength={3}
                          value={regForm.clanTag}
                          onChange={(e) => setRegForm({...regForm, clanTag: e.target.value})}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          placeholder="Ej. NXS"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[var(--border-default)] pt-6">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[var(--accent)]" /> Datos del Capitán
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">UID del Juego</label>
                          <input 
                            required
                            type="text" 
                            value={regForm.capUid}
                            onChange={(e) => setRegForm({...regForm, capUid: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                            placeholder="Ej. 123456789"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">WhatsApp</label>
                          <input 
                            required
                            type="text" 
                            value={regForm.capWa}
                            onChange={(e) => setRegForm({...regForm, capWa: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                            placeholder="+58 412 1234567"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[var(--border-default)] pt-6">
                      <h4 className="font-bold mb-4">Integrantes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">UID Jugador 2</label>
                          <input 
                            required
                            type="text" 
                            value={regForm.p2Uid}
                            onChange={(e) => setRegForm({...regForm, p2Uid: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">UID Jugador 3</label>
                          <input 
                            required
                            type="text" 
                            value={regForm.p3Uid}
                            onChange={(e) => setRegForm({...regForm, p3Uid: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">UID Jugador 4 (Opcional)</label>
                          <input 
                            type="text" 
                            value={regForm.p4Uid}
                            onChange={(e) => setRegForm({...regForm, p4Uid: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">UID Suplente (Opcional)</label>
                          <input 
                            type="text" 
                            value={regForm.subUid}
                            onChange={(e) => setRegForm({...regForm, subUid: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--accent)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[var(--border-default)] pt-6">
                      <h4 className="font-bold mb-4">Método de Pago</h4>
                      <select 
                        value={regForm.paymentMethod}
                        onChange={(e) => setRegForm({...regForm, paymentMethod: e.target.value})}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
                      >
                        <option value="saldo">Saldo Nexus (${selectedTourney.entryFeeUsd.toFixed(2)})</option>
                        <option value="binance">Binance Pay (${selectedTourney.entryFeeUsd.toFixed(2)} USDT)</option>
                        <option value="pagomovil">Pago Móvil (Bs. {toProtectedBs(selectedTourney.entryFeeUsd).toFixed(2)})</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={selectedTourney.status !== 'REGISTRATION_OPEN'}
                      className="w-full py-4 bg-[var(--accent)] hover:bg-opacity-90 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                    >
                      {selectedTourney.status === 'REGISTRATION_OPEN' ? `Inscribir Escuadra ($${selectedTourney.entryFeeUsd.toFixed(2)})` : 'Inscripciones Cerradas'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {activeTab === 'LEADERBOARD' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isSoccer ? (
                  /* ⚽ TABLA DE POSICIONES FÚTBOL / LIGA FC 24 */
                  <div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="font-bold text-emerald-400">Tabla de Clasificación Oficial — EA Sports FC 24</h4>
                          <p className="text-sm text-[var(--text-secondary)]">
                            Regla oficial: Victoria = 3 Pts | Empate = 1 Pt | Derrota = 0 Pts. Desempate: Diferencia de Goles (DG) y Goles a Favor (GF).
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold whitespace-nowrap">
                        👟 Bota de Oro: $10.00 al Goleador
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-default)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                            <th className="p-3.5 font-semibold w-12 text-center">#</th>
                            <th className="p-3.5 font-semibold">Jugador / EA ID</th>
                            <th className="p-3.5 font-semibold">Club Elegido</th>
                            <th className="p-3.5 font-semibold text-center">PJ</th>
                            <th className="p-3.5 font-semibold text-center">PG</th>
                            <th className="p-3.5 font-semibold text-center">PE</th>
                            <th className="p-3.5 font-semibold text-center">PP</th>
                            <th className="p-3.5 font-semibold text-center">GF</th>
                            <th className="p-3.5 font-semibold text-center">GC</th>
                            <th className="p-3.5 font-semibold text-center">DG</th>
                            <th className="p-3.5 font-semibold text-center font-bold text-[var(--text-primary)]">Pts</th>
                            <th className="p-3.5 font-semibold text-right">Premio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-default)] text-sm">
                          {MOCK_SOCCER_LEADERBOARD.map((team, index) => (
                            <tr key={team.player} className={`hover:bg-[var(--bg-primary)]/50 transition-colors ${index < 3 ? 'bg-emerald-500/5' : ''}`}>
                              <td className="p-3.5 font-mono font-bold text-center text-[var(--text-secondary)]">
                                {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `${index + 1}`}
                              </td>
                              <td className="p-3.5 font-bold flex items-center gap-2">
                                <span>{team.player}</span>
                                {team.isTopScorer && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 font-semibold border border-yellow-500/30 flex items-center gap-1">
                                    👟 Bota de Oro
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-[var(--text-secondary)]">{team.club}</td>
                              <td className="p-3.5 text-center font-mono">{team.pj}</td>
                              <td className="p-3.5 text-center font-mono text-emerald-400 font-bold">{team.pg}</td>
                              <td className="p-3.5 text-center font-mono text-[var(--text-secondary)]">{team.pe}</td>
                              <td className="p-3.5 text-center font-mono text-rose-400">{team.pp}</td>
                              <td className="p-3.5 text-center font-mono font-bold text-emerald-300">{team.gf}</td>
                              <td className="p-3.5 text-center font-mono text-zinc-400">{team.gc}</td>
                              <td className="p-3.5 text-center font-mono font-semibold">{team.dg}</td>
                              <td className="p-3.5 text-center font-mono font-black text-base text-[var(--accent)]">{team.pts}</td>
                              <td className="p-3.5 text-right font-bold text-green-400">
                                {team.earnings > 0 ? `$${team.earnings.toFixed(2)}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* 💥 TABLA DE POSICIONES BATTLE ROYALE / KILLS */
                  <div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-yellow-400" />
                        <div>
                          <h4 className="font-bold text-yellow-400">Sistema de $1.00 por Kill Activo</h4>
                          <p className="text-sm text-[var(--text-secondary)]">Las ganancias se calculan sumando el premio por posición + ($1.00 × Kills)</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-default)] text-[var(--text-secondary)] text-sm">
                            <th className="p-4 font-semibold w-16">#</th>
                            <th className="p-4 font-semibold">Escuadra</th>
                            <th className="p-4 font-semibold text-center">Pts Posición</th>
                            <th className="p-4 font-semibold text-center">Kills</th>
                            <th className="p-4 font-semibold text-center">Total Pts</th>
                            <th className="p-4 font-semibold text-right">Ganancia</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-default)]">
                          {MOCK_LEADERBOARD
                            .map(t => ({ ...t, totalPts: t.placementPts + t.kills }))
                            .sort((a, b) => b.totalPts - a.totalPts)
                            .map((team, index) => {
                              const positionPrize = selectedTourney.prizes.find(p => p.position === team.position)?.amountUsd || 0;
                              const killEarnings = team.kills * selectedTourney.prizePerKillUsd;
                              const totalEarnings = positionPrize + killEarnings;
                              
                              return (
                                <tr key={team.team} className={`hover:bg-[var(--bg-primary)]/50 transition-colors ${index < 3 ? 'bg-yellow-500/5' : ''}`}>
                                  <td className="p-4 font-mono font-bold text-[var(--text-secondary)]">
                                    {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : `${index + 1}`}
                                  </td>
                                  <td className="p-4 font-bold">{team.team}</td>
                                  <td className="p-4 text-center font-mono">{team.placementPts}</td>
                                  <td className="p-4 text-center font-mono text-yellow-400 font-bold">{team.kills}</td>
                                  <td className="p-4 text-center font-mono font-bold">{team.totalPts}</td>
                                  <td className="p-4 text-right font-bold text-green-400">${totalEarnings.toFixed(2)}</td>
                                </tr>
                              );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'ROOM' && isRegistered && (
              <motion.div
                key="room"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Credenciales de la Sala</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-6">Por favor, no compartas estos datos con nadie externo a tu escuadra.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-default)] flex-1 max-w-xs relative group">
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">ID de Sala</div>
                      <div className="text-2xl font-mono font-bold tracking-widest">{selectedTourney.roomCredentials?.roomId}</div>
                      <button 
                        onClick={() => handleCopy(selectedTourney.roomCredentials?.roomId || '')}
                        className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-default)] flex-1 max-w-xs relative group">
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Contraseña</div>
                      <div className="text-2xl font-mono font-bold tracking-widest">{selectedTourney.roomCredentials?.password}</div>
                      <button 
                        onClick={() => handleCopy(selectedTourney.roomCredentials?.password || '')}
                        className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-primary)] rounded-full text-sm font-semibold border border-[var(--border-default)]">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Servidor: {selectedTourney.roomCredentials?.server}
                  </div>
                </div>

                <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-xl p-5">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)]" /> Cronograma del Match
                  </h4>
                  <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                    <li className="flex justify-between items-center pb-3 border-b border-[var(--border-default)]">
                      <span>Creación de sala</span>
                      <span className="font-mono">{new Date(new Date(selectedTourney.scheduledAt).getTime() - 15*60000).toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'})}</span>
                    </li>
                    <li className="flex justify-between items-center pb-3 border-b border-[var(--border-default)]">
                      <span>Inicio del juego (Estricto)</span>
                      <span className="font-mono text-[var(--text-primary)] font-bold">{new Date(selectedTourney.scheduledAt).toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'})}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Reporte de resultados máximo</span>
                      <span className="font-mono">{new Date(new Date(selectedTourney.scheduledAt).getTime() + 45*60000).toLocaleTimeString('es-VE', {hour: '2-digit', minute:'2-digit'})}</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
