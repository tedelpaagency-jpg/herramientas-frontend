'use client';

import React, { useState, useEffect } from 'react';
import { User, Agency } from '../types';
import userService from '../services/userService';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, Save, Loader2, ShieldCheck, Building } from 'lucide-react';
import Portal from './Portal';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}) => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'super_admin' || currentUser?.roles?.some(r => r.name === 'super_admin');
  const isGerenteComercial = currentUser?.role === 'gerente_comercial' || currentUser?.roles?.some(r => r.name === 'gerente_comercial');
  const isWhiteLabelAdmin = currentUser?.role === 'white_label_admin' || currentUser?.roles?.some(r => r.name === 'white_label_admin');
  const canSelectAgency = isSuperAdmin || isGerenteComercial || isWhiteLabelAdmin;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    agency_id: currentUser?.agency_id || 1,
    phone: '',
    status: 1,
    photo_file: null as File | null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (canSelectAgency) {
        setIsLoadingAgencies(true);
        adminService.getAgencies()
          .then(data => {
            setAgencies(data);
            if (data.length > 0 && !userToEdit) {
              setFormData(prev => ({
                ...prev,
                agency_id: data[0].id
              }));
            }
          })
          .catch(err => console.error('Error cargando agencias:', err))
          .finally(() => setIsLoadingAgencies(false));
      }

      if (userToEdit) {
        setFormData({
          name: userToEdit.name || '',
          email: userToEdit.email || '',
          password: '',
          role: userToEdit.role || (userToEdit.roles?.[0]?.name ?? 'user'),
          agency_id: userToEdit.agency_id || currentUser?.agency_id || 1,
          phone: userToEdit.phone || '',
          status: userToEdit.status ?? 1,
          photo_file: null,
        });
        setPhotoPreview(userToEdit.photo || null);
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'user',
          agency_id: currentUser?.agency_id || 1,
          phone: '',
          status: 1,
          photo_file: null,
        });
        setPhotoPreview(null);
      }
      setError(null);
    }
  }, [isOpen, userToEdit, currentUser, isSuperAdmin, isGerenteComercial]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (userToEdit) {
        await userService.updateUser(userToEdit.id, formData);
      } else {
        await userService.createUser(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        const emailErr = err.response.data.errors.email;
        setError(Array.isArray(emailErr) ? emailErr[0] : emailErr);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstErr = Object.values(err.response.data.errors)[0] as string[];
        setError(Array.isArray(firstErr) ? firstErr[0] : 'Error en la validación.');
      } else {
        setError('Error al procesar el usuario. Verifique los datos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {userToEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {userToEdit ? 'Actualice la información y permisos' : 'Ingrese los datos requeridos para el nuevo usuario'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* Foto de Perfil */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0 border border-blue-200">
                Avatar
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Foto de Perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setFormData({ ...formData, photo_file: file });
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. María García"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@ejemplo.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña {userToEdit ? '(Dejar en blanco para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              required={!userToEdit}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rol de Usuario *</label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none"
                >
                  <option value="user">User / Agente</option>
                  <option value="closer">Closer (CRM & Clientes Asignados)</option>
                  <option value="admin">Administrador de Agencia</option>
                  <option value="gerente">Gerente de Operaciones</option>
                  {isSuperAdmin && <option value="gerente_comercial">Gerente Comercial</option>}
                  {isSuperAdmin && <option value="super_admin">Super Admin</option>}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+593 99 999 9999"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {canSelectAgency && !['super_admin', 'white_label_admin'].includes(formData.role) && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Asociar a Agencia *</label>
              {isLoadingAgencies ? (
                <div className="text-xs text-slate-400 animate-pulse">Cargando agencias...</div>
              ) : (
                <select
                  value={formData.agency_id}
                  onChange={(e) => setFormData({ ...formData, agency_id: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none"
                >
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name} {agency.city ? `(${agency.city})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={1}
                  checked={formData.status === 1}
                  onChange={() => setFormData({ ...formData, status: 1 })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">Activo</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={0}
                  checked={formData.status === 0}
                  onChange={() => setFormData({ ...formData, status: 0 })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">Inactivo</span>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSubmitting ? 'Guardando...' : userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Portal>
);
};

export default UserFormModal;
