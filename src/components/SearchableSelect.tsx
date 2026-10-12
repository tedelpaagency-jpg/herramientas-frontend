'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | number | null | undefined;
  onChange: (value: any) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  icon?: React.ReactNode;
  allowClear?: boolean;
  clearLabel?: string;
  allOption?: { value: string | number; label: string; icon?: React.ReactNode };
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados',
  disabled = false,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  icon,
  allowClear = true,
  clearLabel = '-- Ninguno --',
  allOption,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (allOption && String(value) === String(allOption.value)) {
      return {
        value: allOption.value,
        label: allOption.label,
        icon: allOption.icon,
      } as SearchableSelectOption;
    }
    if (value === undefined || value === null || value === '') return null;
    return options.find((opt) => String(opt.value) === String(value)) || null;
  }, [options, value, allOption]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }
    const query = searchTerm.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(query);
      const matchSublabel = opt.sublabel ? opt.sublabel.toLowerCase().includes(query) : false;
      const matchBadge = opt.badge ? opt.badge.toLowerCase().includes(query) : false;
      const matchValue = String(opt.value).toLowerCase().includes(query);
      return matchLabel || matchSublabel || matchBadge || matchValue;
    });
  }, [options, searchTerm]);

  // Total list items including allOption (if available and matching)
  const displayAllOption = useMemo(() => {
    if (!allOption) return null;
    if (!searchTerm.trim()) return allOption;
    const query = searchTerm.toLowerCase().trim();
    return allOption.label.toLowerCase().includes(query) ? allOption : null;
  }, [allOption, searchTerm]);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const totalItems = (displayAllOption ? 1 : 0) + filteredOptions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex === 0 && displayAllOption) {
        handleSelect(displayAllOption.value);
      } else {
        const optionIndex = displayAllOption ? highlightedIndex - 1 : highlightedIndex;
        if (filteredOptions[optionIndex]) {
          handleSelect(filteredOptions[optionIndex].value);
        }
      }
    }
  };

  // Size styling tokens
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs rounded-lg',
    md: 'px-3 py-2 text-xs rounded-xl',
    lg: 'px-3.5 py-2.5 text-sm rounded-xl',
  }[size];

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 border text-left font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${sizeClasses} ${
          disabled
            ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
            : isOpen
            ? 'bg-white dark:bg-slate-950 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 text-slate-900 dark:text-white shadow-sm'
            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="shrink-0 px-1.5 py-0.2 text-[10px] rounded-md font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-medium truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {allowClear && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title={clearLabel}
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-500' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 mt-1.5 w-full min-w-[260px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[360px] animate-in fade-in slide-in-from-top-2 duration-150 ${dropdownClassName}`}
        >
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="px-1 pt-1.5 text-[10px] font-bold text-slate-400 flex items-center justify-between">
                <span>{filteredOptions.length} resultados encontrados</span>
              </div>
            )}
          </div>

          {/* Options List */}
          <div ref={listRef} className="overflow-y-auto max-h-[280px] p-1.5 divide-y divide-slate-50 dark:divide-slate-800/40">
            {/* Optional "All / None" option */}
            {displayAllOption && (
              <button
                type="button"
                onClick={() => handleSelect(displayAllOption.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all mb-1 ${
                  String(value) === String(displayAllOption.value)
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {displayAllOption.icon && <span className="shrink-0">{displayAllOption.icon}</span>}
                  <span className="truncate">{displayAllOption.label}</span>
                </div>
                {String(value) === String(displayAllOption.value) && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                )}
              </button>
            )}

            {filteredOptions.length === 0 && !displayAllOption ? (
              <div className="py-6 px-4 text-center">
                <Search className="w-6 h-6 text-slate-300 dark:text-slate-700 mx-auto mb-1.5 opacity-60" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Prueba con otro término de búsqueda</p>
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(value) === String(opt.value);
                const actualIndex = displayAllOption ? idx + 1 : idx;
                const isHighlighted = highlightedIndex === actualIndex;

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold shadow-2xs'
                        : isHighlighted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate leading-tight">{opt.label}</span>
                          {opt.badge && (
                            <span className="shrink-0 px-1.5 py-0.2 text-[9px] rounded font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.sublabel && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-normal">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
