'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { appointmentService, AgencyAppointment } from '@/services/appointmentService';

interface RejectAppointmentModalProps {
  isOpen: boolean;
  appointment: AgencyAppointment | null;
  onClose: () => void;
  onSuccess: (updated: AgencyAppointment) => void;
  agencyId?: number;
}

export const RejectAppointmentModal: React.FC<RejectAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
  agencyId
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Debe especificar el motivo del rechazo.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updated = await appointmentService.updateStatus(
        appointment.id,
        'rejected',
        reason.trim(),
        agencyId
      );
      onSuccess(updated);
      onClose();
      setReason('');
    } catch (err: any) {
      console.error('Error rejecting appointment:', err);
      setError(err.response?.data?.message || 'Error al rechazar la cita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900">Rechazar Cita</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Indique la razón por la cual no es posible atender la cita con{' '}
            <span className="font-semibold text-slate-700">{appointment.user?.name}</span> para el{' '}
            <span className="font-semibold text-slate-700">{appointment.appointment_date}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Motivo del Rechazo
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Ejemplo: Conflicto de horario imprevisto, favor seleccionar otra fecha..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              required
            />

            {error && (
              <div className="mt-2 text-xs text-rose-600 font-medium">
                {error}
              </div>
            )}
          </div>

          <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Confirmar Rechazo</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
