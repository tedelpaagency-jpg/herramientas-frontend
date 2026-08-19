'use client';

import React, { useEffect, useState } from 'react';
import { Client } from '../types';

import crmService from '../services/crmService';
import { Users, Plus, Search, Mail, Phone, Edit3, Trash2, Info } from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';
import { LeadCampaignDetailsModal } from '@/components/LeadCampaignDetailsModal';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [isLeadCampaignModalOpen, setIsLeadCampaignModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Ecuador',
  });


  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await crmService.getClients({ search });
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({ first_name: '', last_name: '', email: '', phone: '', city: '', country: 'Ecuador' });
    setShowModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      email: client.email || '',
      phone: client.phone || '',
      city: client.city || '',
      country: client.country || 'Ecuador',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await crmService.updateClient(editingClient.id, formData);
      } else {
        await crmService.createClient(formData);
      }
      setShowModal(false);
      fetchClients();
    } catch (err) {
      console.error('Error saving client:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desea eliminar este cliente?')) return;
    try {
      await crmService.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = (firstName || '').charAt(0);
    const l = (lastName || '').charAt(0);
    return `${f}${l}`.toUpperCase() || 'CL';
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Directorio de Clientes SANTUN
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gestión y contactos centralizados de clientes vía `/v1/clients`.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Cliente</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center">
        <Search className="w-4 h-4 text-slate-400 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente o cliente por nombre, email o ubicación..."
          className="w-full bg-transparent text-slate-900 text-sm focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Data Table Container */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr 
                    key={c.id} 
                    className="group transition-all duration-200 hover:bg-slate-50 border-l-4 border-transparent hover:border-l-blue-600"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {getInitials(c.first_name, c.last_name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {c.first_name} {c.last_name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">Cliente ID: #{c.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center text-xs text-slate-700 font-medium">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                          {c.phone}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {c.city || 'N/A'}, {c.country || 'Ecuador'}
                    </td>

                    <td className="px-6 py-4 text-right space-x-1">
                      <button 
                        onClick={() => {
                          setSelectedClientForDetails(c);
                          setIsLeadCampaignModalOpen(true);
                        }} 
                        className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Ver Ficha de Campaña y Custom Fields"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(c)} 
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500 font-medium">
            <p>Mostrando <strong className="text-slate-800">{clients.length}</strong> clientes</p>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Apellido</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F5F7] border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ficha de Campaña y Custom Fields */}
      <LeadCampaignDetailsModal
        client={selectedClientForDetails}
        isOpen={isLeadCampaignModalOpen}
        onClose={() => setIsLeadCampaignModalOpen(false)}
      />
    </div>
  );
};

export default ClientsPage;


