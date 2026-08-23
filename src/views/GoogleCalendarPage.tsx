'use client';

import React, { useEffect, useState } from 'react';
import { CalendarEvent, GoogleCalendarSetting } from '../types';
import googleCalendarService from '../services/googleCalendarService';
import { useAuth } from '../context/AuthContext';
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
  Link as LinkIcon
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const GoogleCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calendar' | 'developer'>('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<GoogleCalendarSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

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

  const fetchSettings = async () => {
    try {
      const data = await googleCalendarService.getSettings();
      setSettings(data);
      setClientId(data.client_id || '');
      setApiKey(data.api_key || '');
      setRedirectUri(data.redirect_uri || `${window.location.origin}/calendar/callback`);
      setCalendarId(data.calendar_id || 'primary');
    } catch (err) {
      console.error('Error fetching Google settings:', err);
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
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Solo el rol super_admin puede guardar credenciales Developer.');
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
      alert('¡Credenciales de Google Developer guardadas exitosamente por el Super Admin!');
    } catch (err: any) {
      console.error('Error saving Google Developer settings:', err);
      alert(err.response?.data?.message || 'Ocurrió un error al guardar las credenciales.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const currentRedirectUri = window.location.origin + '/calendar/callback';
      const authUrl = await googleCalendarService.getAuthUrl(currentRedirectUri);
      if (authUrl) {
        // Calculate centered popup dimensions
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
            alert('¡Cuenta de Google Calendar vinculada exitosamente sin salir de la aplicación!');
          }
        };

        window.addEventListener('message', handleAuthMessage);

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          // Fallback if popup blocked
          window.location.href = authUrl;
        }
      }
    } catch (err: any) {
      console.error('Error getting Google Auth URL:', err);
      alert(err.response?.data?.message || 'Error al obtener URL de autenticación. Contacte al Super Admin.');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Desea desvincular su cuenta de Google Calendar?')) return;
    try {
      await googleCalendarService.disconnect();
      await fetchSettings();
      alert('Cuenta desvinculada exitosamente.');
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
      const attendees = eventAttendees
        ? eventAttendees.split(',').map((a) => a.trim()).filter(Boolean)
        : [];

      await googleCalendarService.createEvent({
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        start_datetime: startDateTime,
        end_datetime: endDateTime,
        attendees,
      });

      setShowEventModal(false);
      setEventTitle('');
      setEventDescription('');
      setEventLocation('');
      setEventAttendees('');
      fetchEvents();
      alert('¡Evento creado exitosamente para su usuario!');
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Error al registrar el evento.');
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este evento de su calendario?')) return;
    try {
      await googleCalendarService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

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
            Gestión individual de citas y eventos para {user?.name || 'su usuario'}.
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
                const today = new Date().toISOString().split('T')[0];
                setEventStartDate(today);
                setEventEndDate(today);
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
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs gap-2">
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
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl border border-blue-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-black flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Vincular mi Cuenta de Google Calendar</span>
                </h3>
                <p className="text-xs text-blue-200 max-w-xl">
                  Conecte su cuenta personal de Google para sincronizar automáticamente sus citas y reuniones en tiempo real.
                </p>
              </div>

              <button
                onClick={handleConnectGoogle}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-extrabold text-xs transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Vincular mi Cuenta de Google</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Su cuenta de usuario está vinculada y sincronizada con Google Calendar.</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-xl font-bold text-[11px] transition-colors"
              >
                Desvincular Mi Cuenta
              </button>
            </div>
          )}

          {/* Calendar Events Grid */}
          {isLoading ? (
            <TableSkeleton rows={4} />
          ) : events.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tiene eventos agendados en su usuario</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Utilice el botón superior para registrar su primera reunión o cita.
              </p>
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setEventStartDate(today);
                  setEventEndDate(today);
                  setShowEventModal(true);
                }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Evento</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => {
                const startDate = new Date(ev.start_datetime);
                const endDate = new Date(ev.end_datetime);

                return (
                  <div
                    key={ev.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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

                      {/* Date & Time */}
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

                      {ev.attendees_json && ev.attendees_json.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Invitados:</span>
                          <div className="flex flex-wrap gap-1">
                            {ev.attendees_json.map((email, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                                {email}
                              </span>
                            ))}
                          </div>
                        </div>
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

      {/* TAB 2: DEVELOPER SETTINGS (SUPER_ADMIN ONLY) */}
      {activeTab === 'developer' && isSuperAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Credentials Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 pr-10"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ID de Calendario Predeterminado</label>
                    <input
                      type="text"
                      value={calendarId}
                      onChange={(e) => setCalendarId(e.target.value)}
                      placeholder="primary"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
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
                <li>Agregue el <em>Redirect URI</em> mostrado a la izquierda.</li>
                <li>Guarde aquí el Client ID y Client Secret. Todos los usuarios de la plataforma podrán vincular su propio calendario con su cuenta de Google.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Registrar Evento en Mi Calendario
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título del Evento / Reunión</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ej: Reunión de Cierre de Venta con Cliente"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación / Enlace de Reunión</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Ej: Sala de Juntas 2 o Google Meet link"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Inicio</label>
                  <input
                    type="date"
                    required
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Fin</label>
                  <input
                    type="date"
                    required
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hora de Fin</label>
                  <input
                    type="time"
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correos de Invitados</label>
                <input
                  type="text"
                  value={eventAttendees}
                  onChange={(e) => setEventAttendees(e.target.value)}
                  placeholder="cliente@correo.com, asesor@correo.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                />
                <small className="text-[10px] text-slate-400 font-medium">Separe por comas (,) varios correos electrónicos.</small>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Notas adicionales o temas a tratar..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEvent}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                >
                  {isSubmittingEvent ? 'Registrando...' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarPage;
