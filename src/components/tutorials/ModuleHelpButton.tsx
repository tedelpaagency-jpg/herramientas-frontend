'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { ModuleHelpModal } from './ModuleHelpModal';

interface ModuleHelpButtonProps {
  moduleKey?: string;
  variant?: 'icon' | 'pill' | 'button';
  className?: string;
  label?: string;
}

export const ModuleHelpButton: React.FC<ModuleHelpButtonProps> = ({
  moduleKey,
  variant = 'icon',
  className = '',
  label = 'Ayuda del Módulo',
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 ${className}`}
          title="Ayuda y Tutorial de este Módulo"
          aria-label="Ayuda y Tutorial de este Módulo"
        >
          <HelpCircle className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] text-sky-600 dark:text-sky-400" />
        </button>
      ) : variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 transition-all active:scale-95 shadow-2xs cursor-pointer ${className}`}
          title="Ver Tutorial y Manual de este módulo"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 shadow-sm cursor-pointer ${className}`}
        >
          <HelpCircle className="w-4 h-4 text-sky-500" />
          <span>{label}</span>
        </button>
      )}

      {/* Embedded Help Modal without leaving the view */}
      <ModuleHelpModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        moduleKey={moduleKey}
        path={pathname || undefined}
      />
    </>
  );
};

export default ModuleHelpButton;
