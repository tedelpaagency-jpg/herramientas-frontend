'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  UserCheck,
  Sparkles,
  Save,
  Loader2,
  Building2,
  Globe,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'agency'>('info');

  // Form State - Personal Info
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [savingInfo, setSavingInfo] = useState<boolean>(false);

  // Form State - Security & Password
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre completo es requerido');
      return;
    }
    if (!email.trim()) {
      toast.error('El correo electrónico es requerido');
      return;
    }

    setSavingInfo(true);
    try {
      const response = await userService.updateMyProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      toast.success(response.message || 'Perfil actualizado correctamente');
      
      // Refresh global auth user state
      await refreshUser();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Error al actualizar el perfil';
      toast.error(errorMsg);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Debes ingresar tu contraseña actual para confirmar el cambio.');
      toast.error('Ingresa tu contraseña actual');
      return;
    }

    if (!newPassword) {
      setPasswordError('Ingresa la nueva contraseña.');
      toast.error('Ingresa la nueva contraseña');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      toast.error('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmación de la contraseña no coincide.');
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setSavingPassword(true);
    try {
      const response = await userService.updateMyPassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success(response.message || 'Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError(null);
    } catch (err: any) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.current_password) {
        const msg = serverErrors.current_password[0];
        setPasswordError(msg);
        toast.error(msg);
      } else {
        const generalMsg = err.response?.data?.message || 'Error al actualizar la contraseña';
        setPasswordError(generalMsg);
        toast.error(generalMsg);
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'US';
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* Header Banner & Profile Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar Badge */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white font-black flex items-center justify-center text-3xl shadow-xl shadow-blue-600/20 border-2 border-white dark:border-slate-800 flex-shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="Cuenta Activa">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{user.role || 'Usuario'}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user.phone}
                  </span>
                )}
                {user.agency && (
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    {user.agency.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* User ID Tag */}
          <div className="self-start md:self-auto bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">ID de Usuario</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">#{user.id}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Información Personal</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Seguridad y Contraseña</span>
          </button>
          <button
            onClick={() => setActiveTab('agency')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'agency'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Información de Agencia</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INFORMACIÓN PERSONAL */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                <span>Datos Personales</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Actualiza tu nombre completo, correo electrónico principal y teléfono de contacto.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nombre Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Correo Electrónico *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@agencia.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Teléfono de Contacto</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+593 99 123 4567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {savingInfo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando Cambios...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                <span>Resumen de Cuenta</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Estado</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Activo
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Rol Asignado</span>
                  <span className="font-extrabold text-slate-900 dark:text-white capitalize">{user.role || 'Usuario'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Agencia</span>
                  <span className="font-extrabold text-blue-600">{user.agency?.name || 'Global / SuperAdmin'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEGURIDAD Y CONTRASEÑA */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <span>Cambio de Contraseña</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Para mayor seguridad, debes ingresar tu contraseña actual para validar la actualización.
            </p>
          </div>

          {passwordError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Contraseña Actual */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contraseña Actual *</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña *</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Actualizando Contraseña...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Actualizar Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AGENCIA Y PERMISOS */}
      {activeTab === 'agency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Agency Details */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Información de la Agencia</span>
            </h2>

            {user.agency ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 dark:text-slate-400">Nombre Comercial:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{user.agency.name}</span>
                </div>
                {user.agency.razon_social && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Razón Social:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{user.agency.razon_social}</span>
                  </div>
                )}
                {user.agency.ruc && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400">RUC:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user.agency.ruc}</span>
                  </div>
                )}
                {user.agency.domain && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Dominio Personalizado:</span>
                    <span className="font-mono text-blue-600 font-bold">{user.agency.domain}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                El usuario posee un perfil Global o SuperAdmin sin restricción de agencia.
              </p>
            )}
          </div>

          {/* Card Roles & System Permissions */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Rol del Sistema</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-600 dark:text-slate-400">Rol Asignado en la Plataforma:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 capitalize">
                  {user.role || 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
