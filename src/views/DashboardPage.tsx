'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Users, 
  ShoppingBag, 
  FileCheck, 
  ArrowUpRight, 
  Kanban,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import estateService from '../services/estateService';
import crmService from '../services/crmService';
import productService from '../services/productService';
import visaService from '../services/visaService';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    estatesCount: 0,
    clientsCount: 0,
    productsCount: 0,
    visasCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [estatesRes, clientsRes, productsRes, visasRes] = await Promise.allSettled([
          estateService.getEstates({ limit: 1 }),
          crmService.getClients(),
          productService.getProducts(),
          visaService.getVisas(),
        ]);

        setStats({
          estatesCount: estatesRes.status === 'fulfilled' ? (estatesRes.value.pagination?.total ?? estatesRes.value.data?.length ?? 0) : 0,
          clientsCount: clientsRes.status === 'fulfilled' ? (clientsRes.value.pagination?.total ?? clientsRes.value.data?.length ?? (Array.isArray(clientsRes.value) ? (clientsRes.value as any).length : 0)) : 0,
          productsCount: productsRes.status === 'fulfilled' ? productsRes.value.length : 0,
          visasCount: visasRes.status === 'fulfilled' ? visasRes.value.length : 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: 'Propiedades e Inmuebles',
      value: stats.estatesCount,
      label: 'Inmuebles en catálogo',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      link: '/estates',
    },
    {
      title: 'Clientes / Leads',
      value: stats.clientsCount,
      label: 'Prospectos registrados',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      link: '/clients',
    },
    {
      title: 'Productos & POS',
      value: stats.productsCount,
      label: 'Items en inventario',
      icon: ShoppingBag,
      color: 'from-violet-500 to-purple-600',
      link: '/products',
    },
    {
      title: 'Trámites de Visados',
      value: stats.visasCount,
      label: 'Solicitudes en proceso',
      icon: FileCheck,
      color: 'from-amber-500 to-orange-600',
      link: '/visas',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 mb-4">
            Bienvenido a SANTUN
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Hola, {user?.name || 'Usuario'}
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Plataforma centralizada conectada en tiempo real con el backend de Laravel. Administra inmuebles, embudos CRM, ventas e integración de servicios.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Link
                    href={card.link}
                    className="p-2 rounded-xl text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-900">
                  {isLoading ? '...' : card.value}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1">{card.title}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{card.label}</span>
                <span className="text-blue-600 font-bold">Ver módulo →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Modules Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Acceso Rápido a Módulos Laravel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/crm"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3 text-blue-600">
              <Kanban className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Tablero Kanban CRM</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Mueve etapas de prospectos mediante `/v1/crm/move-stage` y registra actividades.
            </p>
          </Link>

          <Link
            href="/lexvault"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3 text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Bóveda Legal LexVault</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Genera documentos contractuales en PDF a partir de plantillas dinámicas en `/v1/lexvault`.
            </p>
          </Link>

          <Link
            href="/spin-wheel"
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3 text-emerald-600">
              <Gift className="w-6 h-6" />
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Ruletas de Premios</h3>
            </div>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Ejecuta giros de ruletas activas con el motor probabilístico `/v1/spin-wheels/{'{id}'}/spin`.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
