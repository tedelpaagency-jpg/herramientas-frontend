'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Search, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, 
  Check, Calendar as CalendarIcon, Clock, Info, Video, Building2, MapPin, Loader2
} from 'lucide-react';
import { 
  appointmentService, 
  AppointmentUser, 
  AppointmentSlot, 
  AppointmentModality,
  AgencyAppointment
} from '@/services/appointmentService';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: AgencyAppointment) => void;
  agencyId?: number;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  agencyId
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Admin Selection
  const [admins, setAdmins] = useState<AppointmentUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<AppointmentUser | null>(null);

  // Step 2: Date & Available Time Slot
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState<number>(today.getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);

  // Step 3: Motive & Confirmation
  const [notes, setNotes] = useState('');
  const [modality, setModality] = useState<AppointmentModality>('in_person');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch admins on mount
  useEffect(() => {
    if (isOpen) {
      loadAdmins();
    } else {
      // Reset state on close
      setCurrentStep(1);
      setSelectedAdmin(null);
      setSelectedSlot(null);
      setNotes('');
      setModality('in_person');
      setErrorMessage(null);
    }
  }, [isOpen]);

  const loadAdmins = async () => {
    try {
      setLoadingAdmins(true);
      const data = await appointmentService.getAdmins(agencyId);
      setAdmins(data || []);
    } catch (err: any) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // Filter admins
  const filteredAdmins = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter(a => 
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      String(a.id).includes(q) ||
      (a.role && a.role.toLowerCase().includes(q))
    );
  }, [admins, adminSearch]);

  // Load slots when admin or date changes in Step 2
  useEffect(() => {
    if (currentStep === 2 && selectedAdmin) {
      loadSlots();
    }
  }, [currentStep, selectedAdmin, selectedDate]);

  const dateToYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadSlots = async () => {
    if (!selectedAdmin) return;
    try {
      setLoadingSlots(true);
      setSlotsMessage(null);
      setSelectedSlot(null);
      const ymd = dateToYMD(selectedDate);
      const res = await appointmentService.getAvailableSlots(selectedAdmin.id, ymd, agencyId);
      setSlots(res.slots || []);
      if (!res.available && res.message) {
        setSlotsMessage(res.message);
      }
    } catch (err: any) {
      console.error('Error loading slots:', err);
      setSlotsMessage('Error al cargar horarios disponibles.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Mini calendar generator
  const daysInMonth = useMemo(() => {
    const date = new Date(calendarYear, calendarMonth, 1);
    const days: { day: number | null; date: Date | null }[] = [];
    const firstDayIndex = date.getDay(); // 0 is Sunday
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, date: null });
    }

    // Days of current month
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

  const handleConfirmAppointment = async () => {
    if (!selectedAdmin || !selectedSlot) return;
    if (!notes.trim()) {
      setErrorMessage('Por favor ingrese el motivo de la cita.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const ymd = dateToYMD(selectedDate);
      const appt = await appointmentService.createAppointment({
        admin_id: selectedAdmin.id,
        appointment_date: ymd,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes: notes.trim(),
        modality,
        agency_id: agencyId
      });

      onSuccess(appt);
      onClose();
    } catch (err: any) {
      console.error('Error scheduling appointment:', err);
      const msg = err.response?.data?.message || 'Error al agendar la cita. Por favor intente de nuevo.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Agendar Cita</h3>
              <p className="text-sm text-slate-500 mt-0.5">Siga los pasos para programar una nueva cita.</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold tracking-wider uppercase mb-2">
              <span className={currentStep === 1 ? 'text-blue-600' : 'text-slate-400'}>
                ADMIN / ASESOR
              </span>
              <span className={currentStep === 2 ? 'text-blue-600' : 'text-slate-400'}>
                FECHA Y HORA
              </span>
              <span className={currentStep === 3 ? 'text-blue-600' : 'text-slate-400'}>
                MOTIVO
              </span>
            </div>
            {/* Step Progress Bar Track */}
            <div className="h-1 bg-slate-100 w-full rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ 
                  width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Body with Scroll */}
        <div className="px-6 py-4 flex-1 overflow-y-auto border-t border-slate-100">
          {/* STEP 1: ADMIN / ASESOR */}
          {currentStep === 1 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar Admin / Asesor
              </label>

              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Nombre, ID o email..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  {adminSearch && (
                    <button
                      onClick={() => setAdminSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
                RESULTADOS ({filteredAdmins.length})
              </div>

              {loadingAdmins ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-600 mb-2" />
                  <span className="text-sm">Cargando personal...</span>
                </div>
              ) : filteredAdmins.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">
                  No se encontraron administradores o asesores disponibles.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredAdmins.map((admin) => {
                    const isSelected = selectedAdmin?.id === admin.id;
                    const initials = admin.name
                      ? admin.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                      : 'AD';

                    return (
                      <div
                        key={admin.id}
                        onClick={() => setSelectedAdmin(admin)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                          }`}>
                            {admin.photo ? (
                              <img src={admin.photo} alt={admin.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{admin.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              ID: {admin.id} • {admin.role || 'Administrador'}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: FECHA Y HORA */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Mini Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-800">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day Labels D L M M J V S */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                  <span>D</span>
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                </div>

                {/* Days Grid */}
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

              {/* Right Column: Horarios Disponibles */}
              <div className="flex flex-col">
                <div className="text-sm font-bold text-slate-800 mb-3">
                  Horarios Disponibles
                </div>

                {loadingSlots ? (
                  <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
                    <span className="text-xs">Consultando disponibilidad...</span>
                  </div>
                ) : slotsMessage ? (
                  <div className="py-8 px-3 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                    {slotsMessage}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No hay turnos disponibles para esta fecha.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
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

                <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Horario basado en zona GMT-5</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MOTIVO Y CONFIRMACIÓN */}
          {currentStep === 3 && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Motivo de la Cita
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Describa brevemente el motivo o propósito de la cita..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                />
              </div>

              {/* Modality Selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Modalidad de Consulta
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModality('in_person')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      modality === 'in_person'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Presencial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModality('virtual')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      modality === 'virtual'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Virtual (Meet)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModality('property_visit')}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                      modality === 'property_visit'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Visita Inmueble</span>
                  </button>
                </div>
              </div>

              {/* Resumen de la Cita Card (matching Image 4) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <span>Resumen de la Cita</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Admin / Asesor</span>
                    <span className="font-bold text-slate-800">{selectedAdmin?.name || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Fecha</span>
                    <span className="font-bold text-slate-800">
                      {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Hora</span>
                    <span className="font-bold text-slate-800">{selectedSlot?.time || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Modalidad</span>
                    <span className="font-bold text-slate-800">
                      {modality === 'in_person' ? 'Presencial (Oficina)' : modality === 'virtual' ? 'Virtual (Enlace)' : 'Visita a Inmueble'}
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(s => (s - 1) as 1 | 2)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-sm flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep === 1 && (
            <button
              type="button"
              disabled={!selectedAdmin}
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              disabled={isSubmitting || !notes.trim()}
              onClick={handleConfirmAppointment}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirmando...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Cita</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
