import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SOCIAL_PROOF_EVENTS = [
  { name: 'Juan de Caracas', action: 'compró 1,060 diamantes de Free Fire', time: 'hace 2 min' },
  { name: 'María de Maracaibo', action: 'recargó $10 en Zinli', time: 'hace 5 min' },
  { name: 'Carlos de Valencia', action: 'compró 420 CP de COD Mobile', time: 'hace 8 min' },
  { name: 'Ana de Barquisimeto', action: 'recargó 800 Robux', time: 'hace 12 min' },
  { name: 'Pedro de Mérida', action: 'se inscribió en Copa Free Fire #15', time: 'hace 15 min' },
  { name: 'Luisa de Caracas', action: 'compró Pase Booyah Premium', time: 'hace 18 min' },
];

export const SocialProofToast: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show first toast after 8 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed) return;
    if (!isVisible) return;

    // Hide after 4 seconds, then show next after 12 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    const nextTimer = setTimeout(() => {
      setCurrentEvent((prev) => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
      setIsVisible(true);
    }, 16000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [isVisible, currentEvent, isDismissed]);

  const event = SOCIAL_PROOF_EVENTS[currentEvent];

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto max-w-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl px-4 py-3 shadow-lg flex items-start gap-3"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent)] text-sm font-bold flex-shrink-0 mt-0.5">
              {event.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)] leading-snug">
                <span className="font-semibold">{event.name}</span>{' '}
                <span className="text-[var(--text-secondary)]">{event.action}</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{event.time}</p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mt-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
