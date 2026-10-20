'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Home, 
  Key, 
  Layers, 
  Users, 
  RefreshCw, 
  Filter, 
  Award, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import estateService from '@/services/estateService';
import { AgencySearchSelect } from '@/components/AgencySearchSelect';
import { AdvisorSearchSelect } from '@/components/AdvisorSearchSelect';
import { Agency, User } from '@/types';
import toast from 'react-hot-toast';

interface EstateReportsViewProps {
  agencies?: Agency[];
  agents?: User[];
  isWhiteLabelOrSuperAdmin?: boolean;
  selectedAgencyId?: string | number;
  onAgencyChange?: (agencyId: string | number) => void;
}

const PALETTE = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899',
  '#06B6D4', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  '#64748B', '#A855F7', '#E11D48', '#0EA5E9', '#D97706'
];

export const EstateReportsView: React.FC<EstateReportsViewProps> = ({
  agencies = [],
  agents = [],
  isWhiteLabelOrSuperAdmin = false,
  selectedAgencyId = '',
  onAgencyChange,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeAgencyFilter, setActiveAgencyFilter] = useState<string | number>(selectedAgencyId);
  const [activeAgentFilter, setActiveAgentFilter] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'sales' | 'rent'>('all');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await estateService.getEstateReports({
        agency_id: activeAgencyFilter ? Number(activeAgencyFilter) : undefined,
        agent_id: activeAgentFilter ? Number(activeAgentFilter) : undefined,
      });
      setData(res);
    } catch (err) {
      console.error('Error fetching estate reports:', err);
      toast.error('Error al cargar métricas y reportes de propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeAgencyFilter, activeAgentFilter]);

  useEffect(() => {
    setActiveAgencyFilter(selectedAgencyId);
    setActiveAgentFilter('');
  }, [selectedAgencyId]);

  const handleAgencySelect = (agencyId: any) => {
    setActiveAgencyFilter(agencyId);
    setActiveAgentFilter('');
    if (onAgencyChange) {
      onAgencyChange(agencyId);
    }
  };

  const summary = data?.summary || {};
  const operations = data?.operations || [];
  const categories = data?.categories || [];
  const timeline = data?.timeline || [];
  const agentsRanking = data?.agents || [];
  const agenciesBreakdown = data?.agencies || [];
  const isWhiteLabel = isWhiteLabelOrSuperAdmin || data?.meta?.is_white_label;

  // Format currency helpers
  const formatMoney = (val: number = 0) => {
    return '$ ' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Control Header & Filters */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tablero de Control Inmobiliario & Analítica
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Métricas en tiempo real de cartera, ventas, alquileres y desempeño de asesores.
              </p>
            </div>
          </div>
        </div>

        {/* Global Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Agency Selector (Solo visible para Marca Blanca / Super Admin) */}
          {isWhiteLabel && agencies.length > 0 && (
            <div className="w-full sm:w-64 min-w-[220px]">
              <AgencySearchSelect
                agencies={agencies}
                value={activeAgencyFilter}
                onChange={handleAgencySelect}
                allowAll={true}
                allLabel="🏢 Todas las Agencias (Global)"
                placeholder="Filtrar por Agencia"
                size="sm"
              />
            </div>
          )}

          {/* Agent Selector */}
          {agents.length > 0 && (
            <div className="w-full sm:w-60 min-w-[200px]">
              <AdvisorSearchSelect
                users={agents}
                selectedUserId={activeAgentFilter}
                onChange={(uId) => setActiveAgentFilter(uId)}
                placeholder="Todos los Asesores"
                className="w-full"
              />
            </div>
          )}

          <button
            type="button"
            onClick={fetchReports}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 shadow-xs flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* 6 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: Total Inmuebles */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Cartera</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {summary.total_properties ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {summary.available_count ?? 0} activos
              </span>
              <span>•</span>
              <span>{summary.verified_count ?? 0} verificados</span>
            </div>
          </div>
        </div>

        {/* KPI 2: En Venta */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cartera en Venta</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 truncate">
              {formatMoney(summary.total_sale_volume)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center justify-between">
              <span>{summary.for_sale_count ?? 0} en venta</span>
              <span className="text-slate-400 font-mono text-[10px]">
                Prom: {formatMoney(summary.avg_sale_price)}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: En Alquiler */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cartera en Renta</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Key className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 truncate">
              {formatMoney(summary.total_rent_volume)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center justify-between">
              <span>{summary.for_rent_count ?? 0} en alquiler</span>
              <span className="text-slate-400 font-mono text-[10px]">
                Prom: {formatMoney(summary.avg_rent_price)}/m
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Disponibles */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Disponibles</span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {summary.available_count ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">
              {summary.total_properties > 0 ? (
                <span>{Math.round(((summary.available_count || 0) / summary.total_properties) * 100)}% disponible para clientes</span>
              ) : (
                <span>0% disponible</span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 5: Cerradas / Vendidas / Alquiladas */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Cerradas / Exitosas</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {(summary.sold_count ?? 0) + (summary.rented_count ?? 0)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
              <span>{summary.sold_count ?? 0} Vendidas</span>
              <span>•</span>
              <span>{summary.rented_count ?? 0} Alquiladas</span>
            </div>
          </div>
        </div>

        {/* KPI 6: Remates & Reservas */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Remates & Reservas</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {(summary.auction_count ?? 0) + (summary.reserved_count ?? 0)}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
              <span>{summary.auction_count ?? 0} Remates</span>
              <span>•</span>
              <span>{summary.reserved_count ?? 0} Reservas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Monthly Timeline Evolution */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Evolución Mensual: Captaciones vs Cierres</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Historial de propiedades registradas vs vendidas/alquiladas en los últimos 12 meses
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            {timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="captacionesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="cerradasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px'
                    }} 
                    formatter={(value: any, name: any) => {
                      if (name === 'nuevas_captaciones') return [`${value} inmuebles`, 'Nuevas Captaciones'];
                      if (name === 'cerradas_o_vendidas') return [`${value} inmuebles`, 'Cerradas / Vendidas'];
                      return [value, name];
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    formatter={(val) => {
                      if (val === 'nuevas_captaciones') return <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Nuevas Captaciones</span>;
                      if (val === 'cerradas_o_vendidas') return <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cerradas / Vendidas</span>;
                      return val;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nuevas_captaciones" 
                    stroke="#3B82F6" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#captacionesGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cerradas_o_vendidas" 
                    stroke="#10B981" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#cerradasGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                Sin datos históricos suficientes
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Category / Type Portfolio Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" />
                <span>Distribución por Categorías / Tipos</span>
              </h4>
              <span className="text-[11px] font-bold text-slate-400">
                {categories.length} categorías
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Porcentaje y concentración de propiedades en la base de datos
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                  >
                    {categories.slice(0, 8).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val} propiedades (${item.payload.percentage}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400 font-semibold">Sin categorías registradas</div>
            )}
          </div>

          {/* Top Categories Badges */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            {categories.slice(0, 6).map((cat: any, idx: number) => (
              <div key={cat.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.name}</span>
                </div>
                <span className="font-black text-slate-900 dark:text-white shrink-0 ml-1">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table 1: Agents Ranking & Performance */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Rendimiento por Asesores / Agentes Comerciales</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de inventario, cierres y volumen monetario gestionado por cada asesor
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            {agentsRanking.length} Asesores con propiedades
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4">Asesor</th>
                <th className="py-3 px-4 text-center">Total Inmuebles</th>
                <th className="py-3 px-4 text-center">Disponibles</th>
                <th className="py-3 px-4 text-center">Reservadas</th>
                <th className="py-3 px-4 text-center">Vendidas</th>
                <th className="py-3 px-4 text-center">Alquiladas</th>
                <th className="py-3 px-4 text-right">Volumen Venta ($)</th>
                <th className="py-3 px-4 text-right">Volumen Renta ($)</th>
                <th className="py-3 px-4 text-center">Efectividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {agentsRanking.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No hay asesores asignados a las propiedades seleccionadas.
                  </td>
                </tr>
              ) : (
                agentsRanking.map((agent: any) => (
                  <tr key={agent.agent_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center text-xs shrink-0 overflow-hidden border border-blue-200 dark:border-blue-800">
                          {agent.photo ? (
                            <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                          ) : (
                            agent.name?.charAt(0)?.toUpperCase() || 'A'
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">{agent.name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{agent.email || 'Sin email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-slate-900 dark:text-white">
                      {agent.total_properties}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {agent.available}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
                      {agent.reserved}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                      {agent.sold}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {agent.rented}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatMoney(agent.sale_volume)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatMoney(agent.rent_volume)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(agent.efficiency_rate, 100)}%` }} 
                          />
                        </div>
                        <span className="font-extrabold text-[11px] text-slate-700 dark:text-slate-300">
                          {agent.efficiency_rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Comparative Breakdown by Agency (Visible only for White Label & Super Admin) */}
      {isWhiteLabel && agenciesBreakdown.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Desglose Comparativo por Agencias (Marca Blanca)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rendimiento y volumen de inventario consolidado de cada agencia registrada
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              {agenciesBreakdown.length} Agencias
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-4">Agencia</th>
                  <th className="py-3 px-4 text-center">Total Propiedades</th>
                  <th className="py-3 px-4 text-center">Disponibles</th>
                  <th className="py-3 px-4 text-center">Reservadas</th>
                  <th className="py-3 px-4 text-center">Vendidas</th>
                  <th className="py-3 px-4 text-center">Alquiladas</th>
                  <th className="py-3 px-4 text-right">Volumen en Venta ($)</th>
                  <th className="py-3 px-4 text-right">Volumen en Alquiler ($)</th>
                  <th className="py-3 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agenciesBreakdown.map((ag: any) => {
                  const isSelected = String(activeAgencyFilter) === String(ag.agency_id);
                  return (
                    <tr 
                      key={ag.agency_id} 
                      className={`transition-colors ${
                        isSelected 
                          ? 'bg-blue-50/60 dark:bg-blue-950/40' 
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-purple-200 dark:border-purple-800">
                            {ag.logo ? (
                              <img src={ag.logo} alt={ag.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-xs">{ag.name}</div>
                            <div className="text-[10px] text-slate-400">{ag.city || ag.domain || `ID #${ag.agency_id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-900 dark:text-white">
                        {ag.total_properties}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {ag.available}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
                        {ag.reserved}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                        {ag.sold}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {ag.rented}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatMoney(ag.sale_volume)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatMoney(ag.rent_volume)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleAgencySelect(isSelected ? '' : ag.agency_id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isSelected ? 'Filtrado' : 'Filtrar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateReportsView;
