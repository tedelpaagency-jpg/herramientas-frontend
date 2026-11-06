'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Loader2, Info } from 'lucide-react';
import { appointmentService, AgencyAppointment, AppointmentSlot } from '@/services/appointmentService';

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  appointment: AgencyAppointment | null;
  onClose: () => void;
  onSuccess: (updated: AgencyAppointment) => void;
  agencyId?: number;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSuccess,
  agencyId
}) => {
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && appointment) {
      if (appointment.appointment_date) {
        const parts = appointment.appointment_date.split('-');
        if (parts.length === 3) {
          const apptDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          setSelectedDate(apptDate);
          setCalendarMonth(apptDate.getMonth());
          setCalendarYear(apptDate.getFullYear());
        }
      }
      setSelectedSlot(null);
      setNotes('');
      setError(null);
    }
  }, [isOpen, appointment]);

  const dateToYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (isOpen && appointment) {
      loadSlots();
    }
  }, [isOpen, appointment, selectedDate]);

  const loadSlots = async () => {
    if (!appointment) return;
    try {
      setLoadingSlots(true);
      setSlotsMessage(null);
      setSelectedSlot(null);
      const ymd = dateToYMD(selectedDate);
      const res = await appointmentService.getAvailableSlots(appointment.admin_id, ymd, agencyId);
      setSlots(res.slots || []);
      if (!res.available && res.message) {
        setSlotsMessage(res.message);
      }
    } catch (err: any) {
      console.error('Error loading slots:', err);
      setSlotsMessage('Error al consultar horarios.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const daysInMonth = useMemo(() => {
    const date = new Date(calendarYear, calendarMonth, 1);
    const days: { day: number | null; date: Date | null }[] = [];
    const firstDayIndex = date.getDay();
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, date: null });
    }

    for (let d = 1; d <= lastDay; d++) {
      const dObj = new Date(calendarYear, calendarMonth, d);
      days.push({ day: d, date: dObj });
    }

    return days;
  }, [calendarYear, calendarMonth]);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isPastDate = (d: Date) => {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < startOfToday;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !selectedSlot) return;

    try {
      setLoading(true);
      setError(null);
      const ymd = dateToYMD(selectedDate);
      const updated = await appointmentService.reschedule(appointment.id, {
        appointment_date: ymd,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: notes.trim() || undefined,
        agency_id: agencyId
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error('Error rescheduling appointment:', err);
      setError(err.response?.data?.message || 'Error al reprogramar la cita.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reprogramar Cita</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Seleccione la nueva fecha y hora para la cita con {appointment.admin?.name}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-2 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
              {/* Mini Calendar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-800">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                  <span>D</span>
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {daysInMonth.map((item, idx) => {
                    if (!item.day || !item.date) {
                      return <div key={`empty-${idx}`} className="h-8" />;
                    }

                    const past = isPastDate(item.date);
                    const selected = isSameDay(item.date, selectedDate);

                    return (
                      <button
                        key={`day-${item.day}`}
                        type="button"
                        disabled={past}
                        onClick={() => {
                          if (item.date) setSelectedDate(item.date);
                        }}
                        className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition-all ${
                          selected
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : past
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div className="flex flex-col">
                <div className="text-sm font-bold text-slate-800 mb-3">
                  Nuevos Horarios Disponibles
                </div>

                {loadingSlots ? (
                  <div className="py-8 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                    <span className="text-xs">Cargando turnos...</span>
                  </div>
                ) : slotsMessage ? (
                  <div className="py-6 px-3 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                    {slotsMessage}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No hay turnos disponibles para esta fecha.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {slots.map((slot, idx) => {
                      const isSelected = selectedSlot?.start_time === slot.start_time;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : slot.available
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/30'
                              : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Zona horaria GMT-5</span>
                </div>
              </div>
            </div>

            {/* Optional Reschedule Note */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nota de reprogramación (Opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Razón del cambio de horario..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

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
              disabled={loading || !selectedSlot}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reprogramando...</span>
                </>
              ) : (
                <span>Confirmar Cambio</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
