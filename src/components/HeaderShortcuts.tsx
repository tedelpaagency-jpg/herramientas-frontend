'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import shortcutService from '../services/shortcutService';
import { Shortcut } from '../types';
import ShortcutIcon from './ShortcutIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HeaderShortcuts: React.FC = () => {
  const router = useRouter();
  const { user, currentWhiteLabel, currentAgency } = useAuth();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchShortcuts = async () => {
    if (!user) return;
    try {
      const data = await shortcutService.getHeaderShortcuts();
      setShortcuts(data);
    } catch (err) {
      console.error('Error loading header shortcuts:', err);
    }
  };

  useEffect(() => {
    fetchShortcuts();

    const handleUpdate = () => {
      fetchShortcuts();
    };

    window.addEventListener('shortcuts-updated', handleUpdate);
    window.addEventListener('branding-updated', handleUpdate);
    return () => {
      window.removeEventListener('shortcuts-updated', handleUpdate);
      window.removeEventListener('branding-updated', handleUpdate);
    };
  }, [user, currentWhiteLabel, currentAgency]);

  if (!shortcuts || shortcuts.length === 0) {
    return null;
  }

  const handleShortcutClick = (shortcut: Shortcut, e: React.MouseEvent) => {
    e.preventDefault();
    setShowDropdown(false);

    if (shortcut.tipo === 'enlace_externo') {
      let targetUrl = shortcut.destino.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(shortcut.destino);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* DESKTOP VIEW: Individual icons inline with tooltips */}
      <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.id}
            onClick={(e) => handleShortcutClick(shortcut, e)}
            title={shortcut.nombre}
            aria-label={shortcut.nombre}
            className="group relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shadow-2xs"
          >
            <ShortcutIcon name={shortcut.icono} className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />

            {shortcut.tipo === 'enlace_externo' && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}

            {/* Custom Tooltip */}
            <div className="absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
              <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-slate-700">
                {shortcut.nombre}
                {shortcut.tipo === 'enlace_externo' && ' ↗'}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MOBILE / RESPONSIVE VIEW: Dropdown button */}
      <div className="md:hidden relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`h-9 px-2.5 flex items-center gap-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
            showDropdown
              ? 'bg-sky-600 text-white border-sky-600 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
          }`}
          title="Accesos Directos"
          aria-label="Accesos Directos"
          aria-expanded={showDropdown}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="max-w-[80px] truncate">Accesos</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Accesos Directos</span>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {shortcuts.map((shortcut) => (
                    <button
                      key={shortcut.id}
                      onClick={(e) => handleShortcutClick(shortcut, e)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <ShortcutIcon name={shortcut.icono} className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{shortcut.nombre}</span>
                      </div>
                      {shortcut.tipo === 'enlace_externo' && (
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeaderShortcuts;
