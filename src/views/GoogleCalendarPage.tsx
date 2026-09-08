'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CalendarEvent, GoogleCalendarSetting, User } from '../types';
import googleCalendarService from '../services/googleCalendarService';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Calendar as CalendarIcon,
  Plus,
  Settings,
  Globe,
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Shield,
  Trash2,
  Key,
  Lock,
  RefreshCw,
  AlertCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  CalendarDays,
  Users
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const GoogleCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calendar' | 'developer'>('calendar');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [selectedUserEmails, setSelectedUserEmails] = useState<string[]>([]);
  const [settings, setSettings] = useState<GoogleCalendarSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Selected event preview modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Check if current user is Super Admin
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r: any) => r.name === 'super_admin') ||
    (settings as any)?.is_super_admin;

  // Developer Form State
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [calendarId, setCalendarId] = useState('primary');
  const [showSecret, setShowSecret] = useState(false);

  // Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  const [eventAttendees, setEventAttendees] = useState('');
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [assignmentScope, setAssignmentScope] = useState<'all' | 'specific'>('all');

  const fetchSettings = async () => {
    try {
      const data = await googleCalendarService.getSettings();
      setSettings(data);
      setClientId(data.client_id || '');
      setApiKey(data.api_key || '');

      const defaultFrontendUri = `${window.location.origin}/calendar`;
      if (data.redirect_uri && !data.redirect_uri.includes('santun.tedelpa.com')) {
        setRedirectUri(data.redirect_uri);
      } else {
        setRedirectUri(defaultFrontendUri);
      }
      setCalendarId(data.calendar_id || 'primary');
    } catch (err) {
      console.error('Error fetching Google settings:', err);
    }
  };

  const fetchSystemUsers = async () => {
    try {
      const res = await userService.getUsers();
      const userList = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setSystemUsers(userList);
    } catch (err) {
      console.error('Error fetching system users:', err);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await googleCalendarService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchEvents();
    fetchSystemUsers();

    // Check if OAuth code is present in URL (e.g. /calendar?code=...)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (code) {
        const currentRedirectUri = window.location.origin + '/calendar';
        googleCalendarService
          .exchangeCode(code, currentRedirectUri)
          .then(() => {
            if (window.opener) {
              try {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
              } catch (e) {
                console.error('Error sending postMessage:', e);
              }
              setTimeout(() => {
                window.close();
              }, 1000);
            } else {
              window.history.replaceState({}, '', window.location.pathname);
              fetchSettings();
              fetchEvents();
              toast.success('¡Cuenta de Google Calendar vinculada exitosamente!');
            }
          })
          .catch((err) => {
            console.error('Error exchanging OAuth code:', err);
            toast.error('Error al vincular la cuenta de Google.');
          });
      }
    }
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      toast.error('Solo el rol super_admin puede guardar credenciales Developer.');
      return;
    }

    setIsSavingSettings(true);
    try {
      const updated = await googleCalendarService.saveSettings({
        client_id: clientId,
        client_secret: clientSecret || undefined,
        api_key: apiKey,
        redirect_uri: redirectUri,
        calendar_id: calendarId,
      });
      setSettings(updated);
      toast.success('¡Credenciales de Google Developer guardadas exitosamente por el Super Admin!');
    } catch (err: any) {
      console.error('Error saving Google Developer settings:', err);
      toast.error(err.response?.data?.message || 'Ocurrió un error al guardar las credenciales.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const currentRedirectUri = window.location.origin + '/calendar';
      const authUrl = await googleCalendarService.getAuthUrl(currentRedirectUri);
      if (authUrl) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          authUrl,
          'GoogleAuthPopup',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=no`
        );

        const handleAuthMessage = (event: MessageEvent) => {
          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
            window.removeEventListener('message', handleAuthMessage);
            fetchSettings();
            fetchEvents();
            toast.success('¡Cuenta de Google Calendar vinculada exitosamente!');
          }
        };

        window.addEventListener('message', handleAuthMessage);

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.location.href = authUrl;
        }
      }
    } catch (err: any) {
      console.error('Error getting Google Auth URL:', err);
      toast.error(err.response?.data?.message || 'Error al obtener URL de autenticación. Contacte al Super Admin.');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Desea desvincular su cuenta de Google Calendar?')) return;
    try {
      await googleCalendarService.disconnect();
      await fetchSettings();
      toast.success('Cuenta desvinculada exitosamente.');
    } catch (err) {
      console.error('Error disconnecting Google account:', err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventStartDate || !eventEndDate) return;

    setIsSubmittingEvent(true);
    try {
      const startDateTime = `${eventStartDate} ${eventStartTime}:00`;
      const endDateTime = `${eventEndDate} ${eventEndTime}:00`;
      const manualAttendees = eventAttendees
        ? eventAttendees.split(',').map((a) => a.trim()).filter(Boolean)
        : [];
      
      const targetEmails = assignmentScope === 'all'
        ? systemUsers.map((u) => u.email)
        : selectedUserEmails;
      
      const allAttendees = Array.from(new Set([...targetEmails, ...manualAttendees]));

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Guatemala';

      await googleCalendarService.createEvent({
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        attendees: allAttendees,
        timezone: userTimeZone,
      } as any);

      setShowEventModal(false);
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventAttendees('');
      setSelectedUserEmails([]);
      fetchEvents();
      toast.success('¡Evento creado exitosamente para su usuario!');
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Error al registrar el evento.');
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este evento de su calendario?')) return;
    try {
      await googleCalendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      toast.success('Evento eliminado de su calendario.');
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const formatDateToYYYYMMDD = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseLocalDateTime = (dateTimeStr?: string): Date => {
    if (!dateTimeStr) return new Date();
    const cleanStr = String(dateTimeStr)
      .replace('Z', '')
      .replace(' ', 'T')
      .split('.')[0];
    return new Date(cleanStr);
  };

  // Calendar Monthly Grid Calculation
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean; dateString: string }[] = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dateString = formatDateToYYYYMMDD(prevDate);
      days.push({ date: prevDate, isCurrentMonth: false, dateString });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const currDate = new Date(year, month, day);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ date: currDate, isCurrentMonth: true, dateString });
    }

    // Next month filler days to complete grid rows
    const totalCells = days.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateString = formatDateToYYYYMMDD(nextDate);
      days.push({ date: nextDate, isCurrentMonth: false, dateString });
    }

    return days;
  }, [currentMonthDate]);

  // Group events by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!ev.start_datetime) return;
      let dateStr = '';
      if (typeof ev.start_datetime === 'string') {
        const cleanStr = ev.start_datetime.replace('Z', '').replace(' ', 'T').split('.')[0];
        dateStr = cleanStr.split('T')[0];
      } else {
        dateStr = formatDateToYYYYMMDD(new Date(ev.start_datetime));
      }
      if (dateStr) {
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(ev);
      }
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
  };

  const handleCellClick = (dateString: string) => {
    setEventStartDate(dateString);
    setEventEndDate(dateString);
    setShowEventModal(true);
  };

  const todayStr = formatDateToYYYYMMDD(new Date());

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <span>Mi Calendario Personal</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestión de citas y eventos para {user?.name || 'su usuario'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {settings?.is_connected ? (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Conectado con Google
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Sin Vincular
            </span>
          )}

          {activeTab === 'calendar' && (
            <button
              onClick={() => {
                setEventStartDate(todayStr);
                setEventEndDate(todayStr);
                setShowEventModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Evento</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation (Developer Tab ONLY for super_admin) */}
      {isSuperAdmin && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs gap-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Mi Calendario</span>
          </button>

          <button
            onClick={() => setActiveTab('developer')}
            className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'developer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configuración Google Developer (Super Admin)</span>
          </button>
        </div>
      )}

      {/* TAB 1: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Connection Banner */}
          {!settings?.is_connected ? (
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-3xl border border-blue-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-2xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                    <Globe className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-black tracking-tight text-white">
                    Vincular mi Cuenta de Google Calendar
                  </h3>
                </div>
                <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
                  Conecte su cuenta personal de Google para sincronizar automáticamente sus citas y reuniones en tiempo real.
                </p>
              </div>

              <button
                onClick={handleConnectGoogle}
                className="relative z-10 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg hover:shadow-emerald-500/25 shrink-0 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Vincular mi Cuenta de Google</span>
              </button>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-500/30 p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      Sincronización Activa
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Google Calendar
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Su cuenta de usuario está vinculada y sincronizada con Google Calendar.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 rounded-2xl font-bold text-xs transition-all shadow-2xs hover:shadow-sm shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Desvincular Mi Cuenta</span>
              </button>
            </div>
          )}

          {/* Calendar Toolbar Header */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Month & Navigation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-all"
                  title="Mes Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  Hoy
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-all"
                  title="Mes Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-lg font-black text-slate-900 tracking-tight capitalize">
                {currentMonthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h2>
            </div>

            {/* View Switcher (Grid vs List) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Vista Cuadrícula</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Vista Lista ({events.length})</span>
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: GRID CALENDAR */}
          {viewMode === 'grid' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[640px]">
                  {/* Day Names Header */}
                  <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-3 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mié</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sáb</div>
              </div>

              {/* Monthly Grid Cells */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200/60 bg-slate-100/40">
                {calendarDays.map(({ date, isCurrentMonth, dateString }, index) => {
                  const isToday = dateString === todayStr;
                  const dayEvents = eventsByDate[dateString] || [];

                  return (
                    <div
                      key={index}
                      onClick={() => handleCellClick(dateString)}
                      className={`min-h-[110px] p-2 transition-all flex flex-col justify-between cursor-pointer group ${
                        isCurrentMonth ? 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-800/60' : 'bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {/* Day Number Header */}
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                            isToday
                              ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                              : isCurrentMonth
                              ? 'text-slate-800 group-hover:text-blue-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Day Events Pills */}
                      <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-none">
                        {dayEvents.map((ev) => {
                          const dateObj = parseLocalDateTime(ev.start_datetime);
                          const eventTime = dateObj && !isNaN(dateObj.getTime())
                            ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '';

                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                              }}
                              className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 hover:border-blue-400 rounded-lg text-[10px] font-bold text-blue-900 truncate shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              title={`${ev.title} (${eventTime})`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              <span className="font-extrabold text-[9px] text-blue-600 shrink-0">{eventTime}</span>
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Click to add hint on hover */}
                      <div className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-blue-500 pt-1 flex items-center gap-0.5 transition-opacity">
                        <Plus className="w-3 h-3" /> Agregar
                      </div>
                    </div>
                  );
                })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: LIST CARDS */}
          {viewMode === 'list' && (
            <div>
              {isLoading ? (
                <TableSkeleton rows={4} />
              ) : events.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No tiene eventos agendados</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Utilice el botón superior para registrar su primera reunión o cita.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.map((ev) => {
                    const startDate = parseLocalDateTime(ev.start_datetime);
                    const endDate = parseLocalDateTime(ev.end_datetime);

                    return (
                      <div
                        key={ev.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-extrabold text-base text-slate-900 line-clamp-2">{ev.title}</h3>
                            {ev.google_event_id && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Sync Google
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-slate-600 font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>{startDate.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>
                                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {ev.location && (
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                              <span>{ev.location}</span>
                            </div>
                          )}

                          {ev.description && (
                            <p className="text-xs text-slate-500 font-medium line-clamp-2">{ev.description}</p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          {ev.event_url ? (
                            <a
                              href={ev.event_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-bold text-[11px] flex items-center gap-1"
                            >
                              Ver en Google <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Calendario Local</span>
                          )}

                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Eliminar evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DEVELOPER SETTINGS (SUPER_ADMIN ONLY) */}
      {activeTab === 'developer' && isSuperAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Credentials Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    <span>Configuración Global Google Developer (Solo Super Admin)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Ingrese el Client ID y Client Secret del proyecto de Google Cloud para que todos los usuarios puedan vincular su calendario.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Client ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Ej: 123456789-abcdef.apps.googleusercontent.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Client Secret {settings?.has_secret && <span className="text-emerald-600 font-normal">(Registrado)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder={settings?.has_secret ? '••••••••••••••••••••••••' : 'Ingrese el Client Secret de Google Cloud'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">API Key / Developer Key (Opcional)</label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ID de Calendario Predeterminado</label>
                    <input
                      type="text"
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      placeholder="primary"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Redirect URI (URI de Redirección Autorizada)</label>
                  <input
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 outline-none"
                  />
                  <small className="text-[10px] text-slate-400 font-medium">Copie este URI y péguelo en "URIs de redirección autorizados" dentro de Google Console.</small>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2"
                  >
                    {isSavingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Guardar Credenciales Developer</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Setup Instructions Guide */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <h4 className="font-extrabold text-sm flex items-center gap-2 text-blue-400">
                <Shield className="w-5 h-5" />
                <span>Guía para el Super Admin</span>
              </h4>

              <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside font-medium leading-relaxed">
                <li>
                  Ingrese a la consola de desarrolladores en <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-blue-400 font-bold underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-3 h-3" /></a>.
                </li>
                <li>Cree un proyecto e ingrese a <strong>API y Servicios</strong> &gt; <strong>Biblioteca</strong> para habilitar <strong>Google Calendar API</strong>.</li>
                <li>En <strong>Credenciales</strong>, cree un <strong>ID de cliente de OAuth</strong> de tipo <em>Aplicación Web</em>.</li>
                <li>Agregue el <em>Redirect URI</em> oficial de su frontend en Hostinger: `https://peachpuff-giraffe-427261.hostingersite.com/calendar`.</li>
                <li>Guarde aquí el Client ID y Client Secret. Todos los usuarios de la plataforma podrán vincular su propio calendario con su cuenta de Google.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Create Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Registrar Evento en Mi Calendario
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título del Evento / Reunión *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ej: Reunión de Cierre de Venta con Cliente"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ubicación / Enlace de Reunión</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ej: Google Meet, Zoom o Dirección física"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={eventStartDate}
                    onChange={(e) => {
                      setEventStartDate(e.target.value);
                      if (!eventEndDate) setEventEndDate(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha de Fin *</label>
                  <input
                    type="date"
                    required
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hora de Fin</label>
                  <input
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Selector de Asignación / Audiencia de Usuarios */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Asignar Evento a Usuarios de la Agencia
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAssignmentScope('all');
                      setSelectedUserEmails(systemUsers.map((u) => u.email));
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      assignmentScope === 'all'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Todos los Usuarios</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignmentScope('specific')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      assignmentScope === 'specific'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Usuarios Específicos</span>
                  </button>
                </div>

                {assignmentScope === 'all' ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>El evento se invitará y notificará automáticamente a los <strong>{systemUsers.length} usuarios</strong> de su agencia.</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar">
                    {systemUsers.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Cargando usuarios del sistema...</p>
                    ) : (
                      systemUsers.map((u) => {
                        const isSelected = selectedUserEmails.includes(u.email);
                        return (
                          <label
                            key={u.id}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedUserEmails(selectedUserEmails.filter(e => e !== u.email));
                                  } else {
                                    setSelectedUserEmails([...selectedUserEmails, u.email]);
                                  }
                                }}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{u.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">{u.email}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correos Adicionales de Invitados</label>
                <input
                  type="text"
                  value={eventAttendees}
                  onChange={(e) => setEventAttendees(e.target.value)}
                  placeholder="cliente@correo.com, invitadotercero@correo.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                />
                <small className="text-[10px] text-slate-400 font-medium">Separe por comas (,) correos adicionales.</small>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Notas adicionales o temas a tratar..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmittingEvent ? 'Registrando...' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Event Details Preview */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays className="w-5 h-5" />
                </span>
                <h3 className="text-base font-black text-slate-900">Detalles de la Cita</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h2 className="text-lg font-extrabold text-slate-900">{selectedEvent.title}</h2>

              {(() => {
                const startDate = parseLocalDateTime(selectedEvent.start_datetime);
                const endDate = parseLocalDateTime(selectedEvent.end_datetime);

                return (
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <span>
                        {startDate.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {selectedEvent.location && (
                <div className="flex items-center gap-2 font-bold text-slate-700 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Descripción:</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {selectedEvent.attendees_json && selectedEvent.attendees_json.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invitados ({selectedEvent.attendees_json.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.attendees_json.map((email, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200/60">
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {selectedEvent.event_url ? (
                  <a
                    href={selectedEvent.event_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-extrabold text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Ver en Google Calendar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px] font-medium">Evento Local</span>
                )}

                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-extrabold text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarPage;
