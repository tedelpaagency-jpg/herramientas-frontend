'use client';

import React, { useState, useEffect } from 'react';
import { useTripBuilderStore } from '../store/useTripBuilderStore';
import { wholesaleService, CatalogItem } from '../services/wholesaleService';
import { SemaforoMonitorView } from '../components/mayorista/SemaforoMonitorView';
import { 
  MapPin, Calendar, Users, ShoppingCart, Search, Plus, Trash2, 
  FileText, Rocket, Sparkles, Building2, Home, Compass, Car, 
  DollarSign, Percent, AlertTriangle, CheckCircle2, Star, ShieldCheck,
  ChevronRight, ArrowRight, RefreshCw, SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TripBuilderPage: React.FC = () => {
  const {
    destination,
    masterStartDate,
    masterEndDate,
    adults,
    children,
    cartItems,
    brokerMarkupType,
    brokerMarkupValue,
    totalBaseCost,
    calculatedBrokerMarkup,
    totalClientFinal,
    bookingId,
    bookingStatus,
    setMasterContext,
    setBrokerMarkup,
    addItemToLienzo,
    removeItemFromLienzo,
    setBookingDetails,
    clearLienzo,
  } = useTripBuilderStore();

  // State local del catálogo y tabs (Tours por defecto primero)
  const [activeTab, setActiveTab] = useState<'activities' | 'hotels' | 'rentals' | 'transfers'>('activities');
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'lienzo' | 'semaforo'>('lienzo');
  const [processingHold, setProcessingHold] = useState(false);

  // Form local para contextualizar barra superior
  const [inputDest, setInputDest] = useState(destination);
  const [inputStart, setInputStart] = useState(masterStartDate);
  const [inputEnd, setInputEnd] = useState(masterEndDate);
  const [inputAdults, setInputAdults] = useState(adults);
  const [inputChildren, setInputChildren] = useState(children);

  useEffect(() => {
    fetchCatalog();
  }, [activeTab, destination]);

  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    try {
      let res: any;
      if (activeTab === 'rentals') {
        res = await wholesaleService.getRentals(destination, searchTerm);
      } else if (activeTab === 'hotels') {
        res = await wholesaleService.getHotels(destination, searchTerm);
      } else if (activeTab === 'activities') {
        res = await wholesaleService.getActivities(destination, searchTerm);
      } else {
        res = await wholesaleService.getTransfers(destination, searchTerm);
      }
      setCatalogItems(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar el catálogo de inventario.');
    } finally {
      setLoadingCatalog(false);
    }
  };

  const handleApplyMasterContext = (e: React.FormEvent) => {
    e.preventDefault();
    setMasterContext(inputDest, inputStart, inputEnd, inputAdults, inputChildren);
    toast.success('Filtros y Fechas Maestras actualizadas.');
  };

  const handleAddItem = (item: CatalogItem) => {
    try {
      const title = item.title || item.hotel_name || 'Recurso';
      addItemToLienzo({
        itemable_type: item.itemable_type,
        itemable_id: item.id,
        title,
        destination: item.destination,
        category: activeTab,
        start_date: masterStartDate,
        end_date: masterEndDate,
        quantity: 1,
        broker_base_cost: item.broker_base_cost,
        main_image: item.main_image,
      });
      toast.success(`${title} añadido al Lienzo Modular.`);
    } catch (err: any) {
      toast.error(err.message || 'No se pudo agregar el elemento.');
    }
  };

  const handlePedirBloqueo = async () => {
    if (cartItems.length === 0) {
      toast.error('El Lienzo Modular está vacío. Agrega recursos del catálogo.');
      return;
    }

    setProcessingHold(true);
    try {
      const draftRes = await wholesaleService.createDraft({
        destination,
        master_start_date: masterStartDate,
        master_end_date: masterEndDate,
        passengers: { adults, children },
        broker_markup_type: brokerMarkupType,
        broker_markup_value: brokerMarkupValue,
        items: cartItems.map((item) => ({
          itemable_type: item.itemable_type,
          itemable_id: item.itemable_id,
          start_date: item.start_date,
          end_date: item.end_date,
          quantity: item.quantity,
        })),
      });

      const newBooking = draftRes.data;
      await wholesaleService.requestHold(newBooking.id);

      setBookingDetails(
        newBooking.id,
        newBooking.booking_number,
        'pending_manual_providers',
        newBooking.items,
        newBooking.histories
      );

      toast.success('¡Solicitud de Pre-Bloqueo enviada! Cambiando a Monitor de Semáforo...');
      setViewMode('semaforo');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al procesar el pre-bloqueo.');
    } finally {
      setProcessingHold(false);
    }
  };

  const handlePdfExpress = async () => {
    if (cartItems.length === 0) {
      toast.error('El Lienzo Modular está vacío.');
      return;
    }

    try {
      const draftRes = await wholesaleService.createDraft({
        destination,
        master_start_date: masterStartDate,
        master_end_date: masterEndDate,
        passengers: { adults, children },
        broker_markup_type: brokerMarkupType,
        broker_markup_value: brokerMarkupValue,
        items: cartItems.map((item) => ({
          itemable_type: item.itemable_type,
          itemable_id: item.itemable_id,
          start_date: item.start_date,
          end_date: item.end_date,
          quantity: item.quantity,
        })),
      });

      const pdfRes = await wholesaleService.downloadExpressPdf(draftRes.data.id);
      toast.success('Cotización PDF Express generada.');
      window.open(pdfRes.data.pdf_url, '_blank');
    } catch (err: any) {
      toast.error('Error al generar PDF Express.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* ================================================== */}
      {/* ZIIGO BRANDED HERO HEADER BAR                      */}
      {/* ================================================== */}
      <div className="bg-gradient-to-r from-[#1a4a7a] via-[#1a3a5c] to-[#0f253e] border-b border-cyan-500/20 shadow-2xl relative overflow-hidden">
        
        {/* Glow & Geometric Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 space-y-6 relative z-10">
          
          {/* Top Brand Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/30 transform -rotate-6">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white font-sans">
                    ZIIGO <span className="text-cyan-400 font-extrabold text-sm">TRIP BUILDER B2B</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-black tracking-widest uppercase border border-cyan-400/30">
                    Engine v5.0
                  </span>
                </div>
                <p className="text-xs text-cyan-100/70 font-medium">
                  Cotizador dinámico modular para agencias mayoristas y brokers en Ecuador & Latinoamérica.
                </p>
              </div>
            </div>

            {/* Toggle Lienzo vs Semáforo Monitor */}
            {bookingId && (
              <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
                <button
                  onClick={() => setViewMode('lienzo')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    viewMode === 'lienzo'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lienzo Itinerario
                </button>
                <button
                  onClick={() => setViewMode('semaforo')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    viewMode === 'semaforo'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monitor de Semáforo
                </button>
              </div>
            )}
          </div>

          {/* ================================================== */}
          {/* ZIIGO GLASSMORPHISM SEARCH BOX (BARRA MAESTRA)      */}
          {/* ================================================== */}
          <form
            onSubmit={handleApplyMasterContext}
            className="p-5 rounded-3xl bg-[#1e2024]/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-widest">
                <SlidersHorizontal className="w-4 h-4" />
                FECHAS MAESTRAS & CONTEXTO GLOBAL
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Las variables seleccionadas filtran automáticamente la disponibilidad del inventario.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-[11px] font-extrabold text-slate-300 block mb-1 uppercase tracking-wider">
                  DESTINO MAESTRO
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={inputDest}
                    onChange={(e) => setInputDest(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Ej. Galápagos, Cancún, Punta Cana..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-300 block mb-1 uppercase tracking-wider">
                  FECHA INICIO
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={inputStart}
                    onChange={(e) => setInputStart(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-300 block mb-1 uppercase tracking-wider">
                  FECHA FIN
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={inputEnd}
                    onChange={(e) => setInputEnd(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-300 block mb-1 uppercase tracking-wider">
                  PASAJEROS (PAX)
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                  <select
                    value={`${inputAdults}_${inputChildren}`}
                    onChange={(e) => {
                      const [a, c] = e.target.value.split('_').map(Number);
                      setInputAdults(a);
                      setInputChildren(c);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="1_0">1 Adulto</option>
                    <option value="2_0">2 Adultos</option>
                    <option value="2_1">2 Adultos, 1 Niño</option>
                    <option value="2_2">2 Adultos, 2 Niños</option>
                    <option value="4_0">4 Adultos (Grupo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-black text-white text-xs tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                BUSCAR INVENTARIO ZIIGO
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        
        {viewMode === 'semaforo' && bookingId ? (
          <SemaforoMonitorView
            bookingId={bookingId}
            onBackToLienzo={() => setViewMode('lienzo')}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================================================== */}
            {/* ZONA 1: ZIIGO CATALOGO DE INVENTARIO B2B           */}
            {/* ================================================== */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Pills Branded Style */}
              <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                    activeTab === 'activities'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Tours & Excursiones
                </button>

                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                    activeTab === 'hotels'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Hoteles
                </button>

                <button
                  onClick={() => setActiveTab('rentals')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                    activeTab === 'rentals'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Rentas Cortas
                </button>

                <button
                  onClick={() => setActiveTab('transfers')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
                    activeTab === 'transfers'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Transfers VIP
                </button>
              </div>

              {/* Inventory Search & Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-base font-black text-white tracking-tight">
                    Catálogo Disponible en {destination}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Fechas: {masterStartDate} — {masterEndDate}
                </span>
              </div>

              {/* Grid de Tarjetas de Inventario Ziigo Style */}
              {loadingCatalog ? (
                <div className="py-20 text-center text-slate-500 font-semibold animate-pulse space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p>Consultando inventarios verificados ZIIGO 360...</p>
                </div>
              ) : catalogItems.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-slate-400 text-sm space-y-2">
                  <Compass className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white">No hay recursos disponibles para {destination} en esta categoría.</p>
                  <p className="text-xs">Prueba cambiando la ciudad o ajustando las Fechas Maestras.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catalogItems.map((item) => {
                    const title = item.title || item.hotel_name || 'Recurso Ziigo';

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-xl group hover:shadow-cyan-500/10"
                      >
                        {/* Image / Header Banner */}
                        <div className="relative h-44 bg-slate-800 overflow-hidden">
                          {item.main_image ? (
                            <img
                              src={item.main_image}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-600">
                              <Compass className="w-12 h-12 stroke-[1.5]" />
                            </div>
                          )}

                          {/* Pill Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[10px] font-black uppercase tracking-wider border border-white/10">
                              {item.destination}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-slate-950" />
                            4.9 Superhost
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-extrabold text-base text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                              {title}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-normal leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Footer & Price */}
                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                                COSTO BASE BROKER
                              </span>
                              <span className="text-xl font-black text-cyan-400">
                                ${item.broker_base_cost.toFixed(2)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleAddItem(item)}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              AÑADIR AL LIENZO
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* ================================================== */}
            {/* ZONA 2 & 3: LIENZO MODULAR Y CONSOLA FINANCIERA   */}
            {/* ================================================== */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ZONA 2 — LIENZO MODULAR / CARRITO */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    ZONA 2 — LIENZO MODULAR ({cartItems.length})
                  </h3>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearLienzo}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Vaciar Lienzo
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-14 text-center border-2 border-dashed border-slate-800 rounded-2xl space-y-2">
                    <ShoppingCart className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">
                      Tu Lienzo Modular está vacío.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Selecciona recursos de la Zona 1 para armar la cotización.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {cartItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 relative group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center flex-shrink-0">
                            #{index + 1}
                          </div>

                          <div>
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">
                              {item.start_date} AL {item.end_date}
                            </span>
                            <h4 className="font-extrabold text-sm text-white line-clamp-1">
                              {item.title}
                            </h4>
                            <span className="text-xs font-semibold text-slate-400">
                              Costo Base: ${item.broker_base_cost.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItemFromLienzo(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ZONA 3 — CONSOLA FINANCIERA & ACCIONES ZIIGO */}
              <div className="bg-gradient-to-br from-[#1a4a7a] to-[#0f253e] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                    ZONA 3 — CONSOLA FINANCIERA
                  </h3>
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    PricingEngine Live
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Costo Base Broker (Neto + Platform):</span>
                    <span className="font-extrabold text-white text-sm">${totalBaseCost.toFixed(2)}</span>
                  </div>

                  {/* Markup Editable Agencia */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 space-y-2">
                    <label className="text-[11px] font-black text-cyan-400 block uppercase tracking-wider">
                      TU GANANCIA (MARKUP AGENCIA)
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        value={brokerMarkupType}
                        onChange={(e) => setBrokerMarkup(e.target.value as any, brokerMarkupValue)}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                      >
                        <option value="fixed">Monto Fijo ($)</option>
                        <option value="percentage">Porcentaje (%)</option>
                      </select>

                      <input
                        type="number"
                        min="0"
                        value={brokerMarkupValue}
                        onChange={(e) => setBrokerMarkup(brokerMarkupType, parseFloat(e.target.value) || 0)}
                        className="w-full py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
                    <span className="text-sm font-black text-white uppercase tracking-wider">TOTAL CLIENTE FINAL:</span>
                    <span className="text-3xl font-black text-cyan-400">
                      ${totalClientFinal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Acciones Ziigo Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handlePdfExpress}
                    className="py-3.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-md"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    PDF EXPRESS
                  </button>

                  <button
                    disabled={processingHold}
                    onClick={handlePedirBloqueo}
                    className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-white font-black text-xs shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider"
                  >
                    <Rocket className="w-4 h-4" />
                    {processingHold ? 'Enviando...' : 'PEDIR BLOQUEO'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TripBuilderPage;
