import { motion } from 'motion/react';
import { GAMES_DATA } from '../data/mockData';
import { sound } from '../utils/audio';
import { GameSlug } from '../types';

interface TournamentSectionProps {
  onViewTournaments: () => void;
  onOpenCommunity: () => void;
}

export function TournamentSection({ onViewTournaments, onOpenCommunity }: TournamentSectionProps) {
  const tournamentGameSlugs: GameSlug[] = [
    'free-fire',
    'fc-26',
    'mobile-legends',
    'brawl-stars',
    'roblox',
    'cod-mobile'
  ];

  const tournamentGames = tournamentGameSlugs
    .map(slug => GAMES_DATA.find(g => g.id === slug))
    .filter((g): g is NonNullable<typeof g> => g != null);

  const handleViewTournaments = () => {
    try {
      sound.playClick();
    } catch (e) {
      // ignore
    }
    onViewTournaments();
  };

  const handleOpenCommunity = () => {
    try {
      sound.playClick();
    } catch (e) {
      // ignore
    }
    onOpenCommunity();
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-cyan-400">Torneos</h2>
        <button
          onClick={handleViewTournaments}
          className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Todos los Torneos</span>
          <span>{'>'}</span>
        </button>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
        {tournamentGames.map((game) => (
          <motion.div
            key={game.id}
            onClick={handleViewTournaments}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex-none w-36 sm:w-44 aspect-[3/4] relative rounded-2xl overflow-hidden cursor-pointer snap-start border border-[var(--border-default)] hover:border-cyan-400 shadow-lg group transition-all"
          >
            <img
              src={game.coverImage}
              alt={game.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
            
            {/* Centered or bottom logo overlay like in Bonoxs image 2 */}
            <div className="absolute bottom-4 inset-x-2 flex flex-col items-center justify-center pointer-events-none">
              {game.logoImage ? (
                <img
                  src={game.logoImage}
                  alt={game.name}
                  className="max-h-12 max-w-[90%] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform"
                />
              ) : (
                <h4 className="text-white text-sm md:text-base font-black leading-tight drop-shadow-md text-center">
                  {game.name}
                </h4>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 to-blue-900 shadow-xl border border-white/10">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-[var(--accent)] mb-2 tracking-tight">
              NexusNet
            </h3>
            <h4 className="text-lg md:text-xl font-bold text-white mb-2">
              tus comunidades favoritas, ahora en Nexus.
            </h4>
            <p className="text-white/80 max-w-md">
              Chatea, comenta y conecta con tus comunidades favoritas.
            </p>
          </div>
          <div className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCommunity}
              className="bg-white text-blue-900 font-bold py-3 px-6 rounded-full shadow-lg"
            >
              Ver comunidades
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
