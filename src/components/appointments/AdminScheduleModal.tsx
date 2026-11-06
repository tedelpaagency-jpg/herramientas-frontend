'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Check, Loader2, Save, Calendar } from 'lucide-react';
import { appointmentService, WeeklyScheduleDay } from '@/services/appointmentService';

interface AdminScheduleModalProps {
  isOpen: boolean;
  adminId: number;
  adminName: string;
  onClose: () => void;
  agencyId?: number;
}

const DAY_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

export const AdminScheduleModal: React.FC<AdminScheduleModalProps> = ({
  isOpen,
  adminId,
  adminName,
  onClose,
  agencyId
}) => {
  const [days, setDays] = useState<WeeklyScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && adminId) {
      loadSchedule();
    }
  }, [isOpen, adminId]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const existing = await appointmentService.getAdminSchedule(adminId, agencyId);

      // Build 7 days default
      const fullDays: WeeklyScheduleDay[] = [];
      for (let i = 0; i < 7; i++) {
        const found = existing.find(d => d.day_of_week === i);
        if (found) {
          fullDays.push({
            day_of_week: i,
            is_active: Boolean(found.is_active),
            start_time: found.start_time?.substring(0, 5) || '09:00',
            end_time: found.end_time?.substring(0, 5) || '18:00',
            break_start: found.break_start?.substring(0, 5) || '13:00',
            break_end: found.break_end?.substring(0, 5) || '14:00',
            slot_duration_minutes: found.slot_duration_minutes || 45
          });
        } else {
          // Default: Mon(1) to Fri(5) active, Sun(0) & Sat(6) inactive
          fullDays.push({
            day_of_week: i,
            is_active: i >= 1 && i <= 5,
            start_time: '09:00',
            end_time: '18:00',
            break_start: '13:00',
            break_end: '14:00',
            slot_duration_minutes: 45
          });
        }
      }
      setDays(fullDays);
    } catch (err: any) {
      console.error('Error loading schedule:', err);
      setError('Error al cargar la configuración de horarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    setDays(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, is_active: !d.is_active } : d));
  };

  const handleUpdateField = (dayIndex: number, field: keyof WeeklyScheduleDay, value: any) => {
    setDays(prev => prev.map(d => d.day_of_week === dayIndex ? { ...d, [field]: value } : d));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await appointmentService.saveAdminSchedule(adminId, days, agencyId);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saving schedule:', err);
      setError(err.response?.data?.message || 'Error al guardar los horarios.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Configuración de Horarios</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Establezca los días y horas laborables disponibles para <span className="font-semibold text-slate-700">{adminName}</span>.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-2 border-t border-slate-100">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600 mb-2" />
              <span className="text-sm">Cargando disponibilidad...</span>
            </div>
          ) : (
            <div className="space-y-3 my-2">
              {days.map((day) => (
                <div
                  key={day.day_of_week}
                  className={`p-3.5 rounded-xl border transition-all ${
                    day.is_active
                      ? 'border-blue-200 bg-blue-50/20'
                      : 'border-slate-200 bg-slate-50/50 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`day-${day.day_of_week}`}
                        checked={day.is_active}
                        onChange={() => handleToggleDay(day.day_of_week)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`day-${day.day_of_week}`}
                        className={`text-sm font-bold cursor-pointer ${
                          day.is_active ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {DAY_NAMES[day.day_of_week]}
                      </label>
                    </div>

                    {day.is_active ? (
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">De:</span>
                          <input
                            type="time"
                            value={day.start_time}
                            onChange={(e) => handleUpdateField(day.day_of_week, 'start_time', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">A:</span>
                          <input
                            type="time"
                            value={day.end_time}
                            onChange={(e) => handleUpdateField(day.day_of_week, 'end_time', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                          <span className="text-slate-500">Almuerzo:</span>
                          <input
                            type="time"
                            value={day.break_start || ''}
                            onChange={(e) => handleUpdateField(day.day_of_week, 'break_start', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs w-20"
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type="time"
                            value={day.break_end || ''}
                            onChange={(e) => handleUpdateField(day.day_of_week, 'break_end', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs w-20"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No disponible (Día no laborable)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-3 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Horarios guardados exitosamente.</span>
            </div>
          )}
        </form>

        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-xl"
          >
            Cerrar
          </button>
          <button
            type="button"
            disabled={saving || loading}
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

