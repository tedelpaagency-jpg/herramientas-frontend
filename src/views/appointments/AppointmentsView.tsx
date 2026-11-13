'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, Filter, Download, 
  Calendar as CalendarIcon, Clock, Check, X, Phone, Edit, 
  MoreHorizontal, AlertCircle, ArrowUpRight, CheckCircle2, 
  MessageSquare, Loader2, Settings, RefreshCw, Send, MapPin, Video, Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  appointmentService, 
  AgencyAppointment, 
  AppointmentKPIs,
  AppointmentStatus 
} from '@/services/appointmentService';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';
import { RejectAppointmentModal } from '@/components/appointments/RejectAppointmentModal';
import { RescheduleAppointmentModal } from '@/components/appointments/RescheduleAppointmentModal';
import { AdminScheduleModal } from '@/components/appointments/AdminScheduleModal';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export default function AppointmentsView() {
  const { user, currentAgency } = useAuth();
  const agencyId = currentAgency?.id || user?.agency_id || undefined;

  // Determinar si es usuario estándar (rol 'user' o cliente)
  const isRegularUser = useMemo(() => {
    if (!user) return false;
    const role = (user.role || '').toLowerCase();
    const adminRoles = ['admin', 'agency_admin', 'agencia_admin', 'gerente', 'gerente_comercial', 'super_admin'];
    if (adminRoles.includes(role)) return false;
    const hasAdminRole = user.roles?.some((r: any) => adminRoles.includes((r.name || '').toLowerCase()));
    if (hasAdminRole) return false;
    return true;
  }, [user]);

  // View state
  const [viewMode, setViewMode] = useState<'mes' | 'semana' | 'dia'>('semana');
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // Data state
  const [appointments, setAppointments] = useState<AgencyAppointment[]>([]);
  const [kpis, setKpis] = useState<AppointmentKPIs>({
    efficiency: 94,
    today_count: 0,
    pending_count: 0,
    current_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Modals state
  const [showNewModal, setShowNewModal] = useState(false);
  const [rejectingAppt, setRejectingAppt] = useState<AgencyAppointment | null>(null);
  const [reschedulingAppt, setReschedulingAppt] = useState<AgencyAppointment | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Close menus when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch appointments on date/filter change
  useEffect(() => {
    fetchAppointments();
  }, [currentDate, statusFilter, agencyId]);

  const dateToYMD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getAppointments({
        agency_id: agencyId,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setAppointments(res.data || []);
      if (res.kpis) {
        setKpis(res.kpis);
      }
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Approve Action
  const handleApprove = async (appt: AgencyAppointment) => {
    try {
      setActionLoading(appt.id);
      setActiveMenuId(null);
      const updated = await appointmentService.updateStatus(appt.id, 'confirmed', undefined, agencyId);
      setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
      fetchAppointments();
    } catch (err: any) {
      console.error('Error approving appointment:', err);
      alert(err.response?.data?.message || 'Error al aprobar la cita.');
    } finally {
      setActionLoading(null);
    }
  };

  // Send Reminder Action
  const handleSendReminder = async (appt: AgencyAppointment) => {
    try {
      setActionLoading(appt.id);
      setActiveMenuId(null);
      await appointmentService.sendReminder(appt.id, agencyId);
      alert('Recordatorio enviado exitosamente.');
    } catch (err: any) {
      console.error('Error sending reminder:', err);
      alert('Error al enviar recordatorio.');
    } finally {
      setActionLoading(null);
    }
  };

  // WhatsApp / Phone Contact Link
  const handleContact = (appt: AgencyAppointment) => {
    const targetUser = (user?.id === appt.admin_id) ? appt.user : appt.admin;
    const phone = targetUser?.phone?.replace(/\D/g, '');
    if (!phone) {
      alert(`No hay teléfono registrado para ${targetUser?.name || 'el contacto'}.`);
      return;
    }
    const text = encodeURIComponent(
      `Hola ${targetUser?.name}, te contacto respecto a la cita agendada para el ${appt.appointment_date} a las ${appt.start_time.substring(0, 5)}.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Export to CSV
  const handleExport = () => {
    if (appointments.length === 0) {
      alert('No hay citas para exportar.');
      return;
    }
    const headers = ['ID', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Admin / Asesor', 'Solicitante', 'Modalidad', 'Estado', 'Motivo'];
    const rows = appointments.map(a => [
      a.id,
      a.appointment_date,
      a.start_time,
      a.end_time,
      `"${a.admin?.name || ''}"`,
      `"${a.user?.name || ''}"`,
      a.modality,
      a.status,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `citas_${dateToYMD(currentDate)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigate Previous / Next based on view
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'mes') {
      next.setMonth(next.getMonth() - 1);
    } else if (viewMode === 'semana') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'mes') {
      next.setMonth(next.getMonth() + 1);
    } else if (viewMode === 'semana') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  // Calculate Week Days for Semana View (Monday to Sunday)
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay(); // 0 is Sunday
    // Offset to Monday (1)
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  // Status Badge Colors & Labels
  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            CONFIRMADA
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            RECHAZADA
          </span>
        );
      case 'rescheduled':
        return (
          <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            REPROGRAMADA
          </span>
        );
      case 'completed':
        return (
          <span className="bg-slate-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            COMPLETADA
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-slate-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            CANCELADA
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            PENDIENTE
          </span>
        );
    }
  };

  // Format 12-hour AM/PM from HH:MM:SS
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200" ref={menuRef}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Citas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestión y programación de consultas para {dateToYMD(currentDate)}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Schedule Settings Button (Solo para administradores / asesores) */}
          {!isRegularUser && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm rounded-xl shadow-xs flex items-center gap-2 transition-all"
              title="Configurar horarios laborables"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Mis Horarios</span>
            </button>
          )}

          {/* + Nueva Cita Primary Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Calendar + Metrics) & Right (Próximas Citas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section (Calendar & KPI Cards) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Calendar Card Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            {/* Calendar Header with View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Month Navigator */}
              <div className="flex items-center gap-3">
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors border-r border-slate-200"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View Switcher Pills: Mes | Semana | Dia */}
              <div className="inline-flex bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('mes')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'mes'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mes
                </button>
                <button
                  onClick={() => setViewMode('semana')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'semana'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setViewMode('dia')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'dia'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dia
                </button>
              </div>
            </div>

            {/* SEMANA VIEW (Images 1 and 5) */}
            {viewMode === 'semana' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
                  {weekDays.map((d, idx) => {
                    const isSelected = dateToYMD(d) === dateToYMD(currentDate);
                    const dayLabel = `${WEEKDAY_NAMES[d.getDay()]} ${d.getDate()}`;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentDate(d)}
                        className={`py-3 text-center text-xs font-bold cursor-pointer transition-colors border-r last:border-r-0 border-slate-200 ${
                          isSelected ? 'text-blue-600 bg-blue-50/30' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {dayLabel}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-7 min-h-[220px] bg-white divide-x divide-slate-200">
                  {weekDays.map((d, idx) => {
                    const ymd = dateToYMD(d);
                    const isSelected = ymd === dateToYMD(currentDate);
                    const dayAppointments = appointments.filter(a => a.appointment_date === ymd);

                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentDate(d)}
                        className={`p-2 transition-all flex flex-col gap-1 cursor-pointer min-h-[200px] ${
                          isSelected ? 'ring-2 ring-blue-600 ring-inset bg-blue-50/10' : 'hover:bg-slate-50/40'
                        }`}
                      >
                        {dayAppointments.map(appt => (
                          <div
                            key={appt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(d);
                            }}
                            className={`p-1.5 rounded-md text-[11px] font-semibold truncate shadow-xs transition-transform hover:scale-[1.02] ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-700 text-white'
                                : appt.status === 'rejected'
                                ? 'bg-rose-700 text-white'
                                : 'bg-[#a3521b] text-white'
                            }`}
                            title={`${formatTime(appt.start_time)} - ${appt.admin?.name || appt.user?.name} (${appt.notes || 'Consulta'})`}
                          >
                            {formatTime(appt.start_time)}...
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MES VIEW */}
            {viewMode === 'mes' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/60 text-center py-2 text-xs font-bold text-slate-500">
                  <span>DOM</span>
                  <span>LUN</span>
                  <span>MAR</span>
                  <span>MIÉ</span>
                  <span>JUE</span>
                  <span>VIE</span>
                  <span>SÁB</span>
                </div>
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                  {(() => {
                    const y = currentDate.getFullYear();
                    const m = currentDate.getMonth();
                    const firstDay = new Date(y, m, 1).getDay();
                    const totalDays = new Date(y, m + 1, 0).getDate();
                    const cells: React.ReactNode[] = [];

                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`pad-${i}`} className="min-h-[70px] bg-slate-50/30" />);
                    }

                    for (let day = 1; day <= totalDays; day++) {
                      const dayDate = new Date(y, m, day);
                      const ymd = dateToYMD(dayDate);
                      const isSelected = ymd === dateToYMD(currentDate);
                      const dayAppts = appointments.filter(a => a.appointment_date === ymd);

                      cells.push(
                        <div
                          key={`day-${day}`}
                          onClick={() => setCurrentDate(dayDate)}
                          className={`min-h-[70px] p-1.5 cursor-pointer transition-colors flex flex-col justify-between ${
                            isSelected ? 'bg-blue-50/40 ring-1 ring-blue-600 inset-0' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className={`text-xs font-semibold ${isSelected ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                            {day}
                          </span>
                          <div className="space-y-1">
                            {dayAppts.slice(0, 2).map(a => (
                              <div
                                key={a.id}
                                className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${
                                  a.status === 'confirmed' ? 'bg-emerald-600' : 'bg-[#a3521b]'
                                }`}
                              >
                                {formatTime(a.start_time)}
                              </div>
                            ))}
                            {dayAppts.length > 2 && (
                              <span className="text-[9px] text-slate-400 block font-bold">
                                +{dayAppts.length - 2} más
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return cells;
                  })()}
                </div>
              </div>
            )}

            {/* DIA VIEW */}
            {viewMode === 'dia' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white p-4">
                <div className="font-bold text-slate-800 text-sm mb-3">
                  Citas programadas para {dateToYMD(currentDate)}
                </div>
                {appointments.filter(a => a.appointment_date === dateToYMD(currentDate)).length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No hay citas programadas para este día.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {appointments.filter(a => a.appointment_date === dateToYMD(currentDate)).map(a => (
                      <div key={a.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-sm text-slate-800">{formatTime(a.start_time)} - {formatTime(a.end_time)}</span>
                          <span className="text-sm text-slate-600">con {a.admin?.name || a.user?.name}</span>
                        </div>
                        {renderStatusBadge(a.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3 Metric Cards (Images 1 and 5) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: EFICIENCIA */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    EFICIENCIA
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">
                    {kpis.efficiency}%
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Dark Green Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, kpis.efficiency))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: CITAS HOY */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    CITAS HOY
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">
                    {kpis.today_count}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-4">
                Para {kpis.current_date}
              </div>
            </div>

            {/* Card 3: PENDIENTES */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    PENDIENTES
                  </div>
                  <div className="text-3xl font-extrabold text-amber-500 mt-2">
                    {kpis.pending_count}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-4">
                Requieren confirmación ({MONTH_NAMES[currentDate.getMonth()]})
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Próximas Citas Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Próximas Citas</h3>
              
              <div className="flex items-center gap-1.5 relative">
                {/* Filter Icon Button */}
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`p-2 rounded-xl transition-colors ${
                    statusFilter !== 'all' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Filtrar por estado"
                >
                  <Filter className="w-4 h-4" />
                </button>

                {/* Filter Dropdown Popover */}
                {showFilterDropdown && (
                  <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => { setStatusFilter('all'); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        statusFilter === 'all' ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      Todas las citas
                    </button>
                    <button
                      onClick={() => { setStatusFilter('pending'); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        statusFilter === 'pending' ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      Pendientes
                    </button>
                    <button
                      onClick={() => { setStatusFilter('confirmed'); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        statusFilter === 'confirmed' ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      Confirmadas
                    </button>
                    <button
                      onClick={() => { setStatusFilter('rescheduled'); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        statusFilter === 'rescheduled' ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      Reprogramadas
                    </button>
                    <button
                      onClick={() => { setStatusFilter('rejected'); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                        statusFilter === 'rejected' ? 'text-blue-600' : 'text-slate-700'
                      }`}
                    >
                      Rechazadas
                    </button>
                  </div>
                )}

                {/* Export Icon Button */}
                <button
                  onClick={handleExport}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Exportar a CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List or Empty State */}
            <div className="p-5 flex-1 min-h-[360px]">
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <span className="text-xs">Cargando citas...</span>
                </div>
              ) : appointments.length === 0 ? (
                /* Empty State (Pixel-matched with Image 1) */
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <CalendarIcon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">No hay citas</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                    No tienes citas agendadas para este filtro.
                  </p>
                </div>
              ) : (
                /* Populated Appointments List (Pixel-matched with Image 5) */
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {appointments.map((appt) => {
                    const initials = appt.admin?.name
                      ? appt.admin.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                      : 'AC';

                    return (
                      <div
                        key={appt.id}
                        className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all bg-white relative group"
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {/* Avatar Circle with brown/copper background */}
                            <div className="w-10 h-10 rounded-full bg-[#7a2500] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {appt.admin?.photo ? (
                                <img src={appt.admin.photo} alt={appt.admin.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                initials
                              )}
                            </div>

                            <div>
                              <div className="font-bold text-sm text-slate-900 leading-tight">
                                {appt.admin?.name || 'Administrador'}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {appt.admin?.id || '12312'} • {appt.admin?.role || 'General'}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          {renderStatusBadge(appt.status)}
                        </div>

                        {/* Modality & Reason Preview */}
                        {appt.notes && (
                          <div className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg line-clamp-2">
                            <span className="font-semibold text-slate-700">Motivo: </span>
                            {appt.notes}
                          </div>
                        )}

                        {/* Card Bottom: Time + Action Buttons */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                          {/* Time with Clock Icon */}
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{formatTime(appt.start_time)}</span>
                          </div>

                          {/* Action Buttons: Edit/Reschedule, Phone, Menu */}
                          <div className="flex items-center gap-1 relative">
                            {/* Reschedule Button (Pencil) */}
                            <button
                              onClick={() => setReschedulingAppt(appt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              title="Reprogramar cita"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Contact / WhatsApp Button (Phone) */}
                            <button
                              onClick={() => handleContact(appt)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Contactar por WhatsApp / Teléfono"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            {/* More Options Menu Button (...) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === appt.id ? null : appt.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                              title="Más opciones"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === appt.id && (
                              <div className="absolute right-0 bottom-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                                {appt.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleApprove(appt)}
                                    className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Aprobar Cita</span>
                                  </button>
                                )}

                                {appt.status !== 'rejected' && (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setRejectingAppt(appt);
                                    }}
                                    className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Rechazar Cita</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setReschedulingAppt(appt);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <CalendarIcon className="w-3.5 h-3.5" />
                                  <span>Reprogramar</span>
                                </button>

                                <button
                                  onClick={() => handleSendReminder(appt)}
                                  className="w-full text-left px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Enviar Recordatorio</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Footer Link */}
            <div className="border-t border-slate-100 p-3 text-center bg-slate-50/50">
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Ver todas las citas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Appointment Modal (Wizard 3 steps matching images 2, 3, 4) */}
      <NewAppointmentModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={(newAppt) => {
          fetchAppointments();
        }}
        agencyId={agencyId}
      />

      {/* Reject Appointment Modal */}
      <RejectAppointmentModal
        isOpen={Boolean(rejectingAppt)}
        appointment={rejectingAppt}
        onClose={() => setRejectingAppt(null)}
        onSuccess={() => {
          fetchAppointments();
        }}
        agencyId={agencyId}
      />

      {/* Reschedule Appointment Modal */}
      <RescheduleAppointmentModal
        isOpen={Boolean(reschedulingAppt)}
        appointment={reschedulingAppt}
        onClose={() => setReschedulingAppt(null)}
        onSuccess={() => {
          fetchAppointments();
        }}
        agencyId={agencyId}
      />

      {/* Admin Working Hours Settings Modal */}
      <AdminScheduleModal
        isOpen={showScheduleModal}
        adminId={user?.id || 1}
        adminName={user?.name || 'Mi Perfil'}
        onClose={() => setShowScheduleModal(false)}
        agencyId={agencyId}
      />
    </div>
  );
}
