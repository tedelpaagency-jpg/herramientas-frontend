'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileSignature, CheckCircle2, AlertCircle, User, Mail, Building, Phone } from 'lucide-react';
import { User as UserType } from '../types';
import Portal from './Portal';
import { normalizeFileUrl } from '../services/apiClient';

interface CreatorSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator?: UserType | null;
  contractTitle?: string;
  contractNumber?: string;
}

export const CreatorSignatureModal: React.FC<CreatorSignatureModalProps> = ({
  isOpen,
  onClose,
  creator,
  contractTitle,
  contractNumber,
}) => {
  if (!isOpen) return null;

  const signatureRaw = creator?.signature_url || creator?.signature;
  const signatureUrl = signatureRaw ? normalizeFileUrl(signatureRaw) : null;
  const hasSignature = Boolean(signatureUrl);

  return (
    <Portal>
      <AnimatePresence>
        <div className="fixed inset-0 z-[120] w-screen h-screen flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden my-auto flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-600/20">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    Firma del Creador del Contrato
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {contractNumber ? `Contrato: ${contractNumber}` : contractTitle || 'Documento Legal'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Creator Identity Info Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Usuario Creador del Contrato</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {creator?.name || 'Creador no especificado'}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {creator?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {creator.email}
                        </span>
                      )}
                      {creator?.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {creator.phone}
                        </span>
                      )}
                      {creator?.agency?.name && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {creator.agency.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Signature Display Area */}
              {hasSignature && signatureUrl ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Firma digital registrada en perfil:</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Firma Oficial
                    </span>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center min-h-[160px] shadow-inner">
                    <img
                      src={signatureUrl}
                      alt={`Firma de ${creator?.name || 'Creador'}`}
                      className="max-h-36 max-w-full object-contain filter drop-shadow-sm"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
                    Esta firma pertenece exclusivamente al perfil del usuario que originó este contrato y no puede ser modificada por terceros ni por el firmante cliente.
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                      El usuario que creó este contrato no tiene una firma registrada.
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400/90 mt-1 max-w-md mx-auto">
                      {creator?.name
                        ? `El usuario ${creator.name} aún no ha registrado su imagen de firma en el módulo de usuarios.`
                        : 'No se ha podido asociar un usuario creador con firma para este documento legal.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-colors"
              >
                Cerrar Visor
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
};

export default CreatorSignatureModal;
