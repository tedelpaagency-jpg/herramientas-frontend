'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Agency } from '../types';
import { Search, UserCheck, X, ChevronDown, Check, Building2, User as UserIcon } from 'lucide-react';

export interface AdvisorSearchSelectProps {
  users: User[];
  selectedUserId: string;
  onChange: (userId: string) => void;
  selectedAgencyId?: string;
  agencies?: Agency[];
  placeholder?: string;
  className?: string;
}

export const AdvisorSearchSelect: React.FC<AdvisorSearchSelectProps> = ({
  users,
  selectedUserId,
  onChange,
  selectedAgencyId,
  agencies = [],
  placeholder = 'Todos los Asesores',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllAgenciesOverride, setShowAllAgenciesOverride] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
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
      // Auto focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find currently selected user
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((u) => String(u.id) === String(selectedUserId)) || null;
  }, [users, selectedUserId]);

  // Helper to extract user agency name
  const getUserAgencyName = (u: User): string => {
    if (u.agency?.name) return u.agency.name;
    if (u.agency_id && agencies.length > 0) {
      const match = agencies.find((a) => a.id === u.agency_id);
      if (match?.name) return match.name;
    }
    if ((u as any).agencies && Array.isArray((u as any).agencies) && (u as any).agencies.length > 0) {
      return (u as any).agencies.map((a: any) => a.name).join(', ');
    }
    return '';
  };

  // Filter users by selectedAgencyId (if active and not overridden) and by search query
  const filteredUsers = useMemo(() => {
    let list = users;

    // Filter by selected agency if active
    if (selectedAgencyId && !showAllAgenciesOverride) {
      const agencyNum = Number(selectedAgencyId);
      list = list.filter((u) => {
        if (u.agency_id === agencyNum) return true;
        if ((u as any).agencies && Array.isArray((u as any).agencies)) {
          return (u as any).agencies.some((a: any) => a.id === agencyNum);
        }
        return false;
      });
    }

    if (!searchTerm.trim()) {
      return list;
    }

    const query = searchTerm.toLowerCase().trim();
    return list.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const lastName = ((u as any).last_name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const agencyName = getUserAgencyName(u).toLowerCase();
      const role = (u.role || '').toLowerCase();

      return (
        name.includes(query) ||
        lastName.includes(query) ||
        email.includes(query) ||
        agencyName.includes(query) ||
        role.includes(query)
      );
    });
  }, [users, selectedAgencyId, showAllAgenciesOverride, searchTerm, agencies]);

  const selectedUserAgencyName = selectedUser ? getUserAgencyName(selectedUser) : '';

  const getInitials = (nameStr: string) => {
    const parts = (nameStr || '').trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return (nameStr || '').substring(0, 2).toUpperCase() || 'AS';
  };

  const handleSelect = (userId: string) => {
    onChange(userId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border transition-all text-xs font-bold text-left ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-900 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <UserCheck className={`w-4 h-4 shrink-0 ${selectedUser ? 'text-emerald-600' : 'text-slate-400'}`} />
          
          {selectedUser ? (
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span className="font-extrabold text-slate-900 dark:text-white truncate leading-tight">
                {selectedUser.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {selectedUserAgencyName && (
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold truncate flex items-center gap-0.5">
                    <Building2 className="w-2.5 h-2.5 shrink-0" />
                    {selectedUserAgencyName}
                  </span>
                )}
                {selectedUser.email && (
                  <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                    • {selectedUser.email}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-slate-600 dark:text-slate-400 font-bold truncate">
              👤 {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedUser && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Quitar filtro de asesor"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[420px] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o agencia..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-0.5 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scope info / toggle when agency filter is active */}
            {selectedAgencyId && (
              <div className="mt-2 flex items-center justify-between text-[11px] px-1 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold truncate">
                  <Building2 className="w-3 h-3 text-purple-500 shrink-0" />
                  {showAllAgenciesOverride ? 'Viendo todas las agencias' : 'Filtrando por agencia seleccionada'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllAgenciesOverride(!showAllAgenciesOverride)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold shrink-0 ml-2"
                >
                  {showAllAgenciesOverride ? 'Solo esta agencia' : 'Ver todos'}
                </button>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[300px]">
            {/* "Todos los Asesores" Reset Option */}
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                !selectedUserId
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-extrabold'
                  : 'text-slate-700 dark:text-slate-300 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span>👤 Todos los Asesores</span>
              </div>
              {!selectedUserId && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* User Items */}
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  No se encontraron asesores
                </p>
                {searchTerm && (
                  <p className="text-[11px] text-slate-400">
                    No hay coincidencias con &ldquo;{searchTerm}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = String(u.id) === String(selectedUserId);
                const agencyName = getUserAgencyName(u);

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelect(String(u.id))}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar / Initials */}
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-extrabold text-[11px] shrink-0">
                        {getInitials(u.name || '')}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-extrabold truncate ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                            {u.name}
                          </span>
                          {agencyName && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 inline-flex items-center gap-1 shrink-0">
                              <Building2 className="w-2.5 h-2.5 text-purple-500" />
                              {agencyName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span>
              {filteredUsers.length} asesor{filteredUsers.length === 1 ? '' : 'es'} disponible{filteredUsers.length === 1 ? '' : 's'}
            </span>
            <span>ID o Nombre</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorSearchSelect;
