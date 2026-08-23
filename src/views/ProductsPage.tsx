'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import productService from '../services/productService';
import {
  ShoppingBag,
  Plus,
  Search,
  Tag,
  DollarSign,
  Package,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Filter,
  Globe,
  Layers,
  Sparkles,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<number | 'all'>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 1, // 1: Paquete/Tour, 2: Producto Físico, 3: Servicio
    name: '',
    sku: '',
    description: '',
    location: '',
    duration: '',
    includes: '',
    sale_price: 0,
    suggested_price: 0,
    purchase_price: 0,
    main_image: '',
    category_id: ''
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (activeTypeTab !== 'all') params.type = activeTypeTab;

      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, activeTypeTab]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      type: 1,
      name: '',
      sku: '',
      description: '',
      location: '',
      duration: '',
      includes: '',
      sale_price: 0,
      suggested_price: 0,
      purchase_price: 0,
      main_image: '',
      category_id: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      type: product.type || 1,
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      location: product.location || '',
      duration: product.duration || '',
      includes: product.includes || '',
      sale_price: Number(product.sale_price || product.price || 0),
      suggested_price: Number(product.suggested_price || 0),
      purchase_price: Number(product.purchase_price || 0),
      main_image: product.main_image || '',
      category_id: product.category_id ? String(product.category_id) : ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Product> = {
        type: Number(formData.type),
        name: formData.name,
        sku: formData.sku || undefined,
        description: formData.description || undefined,
        location: formData.location || undefined,
        duration: formData.duration || undefined,
        includes: formData.includes || undefined,
        sale_price: Number(formData.sale_price),
        suggested_price: Number(formData.suggested_price) || undefined,
        purchase_price: Number(formData.purchase_price) || undefined,
        main_image: formData.main_image || undefined,
        category_id: formData.category_id ? Number(formData.category_id) : undefined
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product/package:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este paquete/producto?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product/package:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <span>Paquetes Turísticos & Catálogo de Productos</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gestión completa de tours, paquetes de viajes, productos y servicios conectados a `/v1/products`.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Paquete / Producto</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTypeTab === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos los Ítems
            </button>
            <button
              onClick={() => setActiveTypeTab(1)}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Paquetes & Tours</span>
            </button>
            <button
              onClick={() => setActiveTypeTab(2)}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 2 ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Productos Físicos</span>
            </button>
            <button
              onClick={() => setActiveTypeTab(3)}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 3 ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Servicios</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, destino o SKU..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Grid of Product/Package Cards */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron ítems en el catálogo</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Comience creando un nuevo paquete turístico, tour o producto con el botón superior.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Ítem</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isPackage = p.type === 1 || (!p.type && (p.location || p.duration));
            const isPhysical = p.type === 2;
            const isService = p.type === 3;
            const priceVal = Number(p.sale_price || p.price || 0);

            // Parse includes tags
            const includesList = p.includes
              ? p.includes.split(',').map(i => i.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image Banner */}
                  <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    {p.main_image ? (
                      <img
                        src={
                          p.main_image.startsWith('http')
                            ? p.main_image
                            : `/${p.main_image}`
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Globe className="w-10 h-10 text-slate-600 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sin Imagen</span>
                      </div>
                    )}

                    {/* Badge Category / Type */}
                    <div className="absolute top-3 left-3">
                      {isPackage && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-md flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Paquete / Tour
                        </span>
                      )}
                      {isPhysical && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white shadow-md flex items-center gap-1">
                          <Package className="w-3 h-3" /> Producto
                        </span>
                      )}
                      {isService && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Servicio
                        </span>
                      )}
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-xs text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-xl font-black text-sm shadow-md flex items-center gap-0.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{priceVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {p.name}
                    </h3>

                    {/* Location & Duration for Packages */}
                    {isPackage && (
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {p.location && (
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>{p.location}</span>
                          </div>
                        )}
                        {p.duration && (
                          <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>Duración: {p.duration}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {p.description && (
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {/* Includes Badges */}
                    {includesList.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Incluye:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {includesList.map((inc, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-extrabold flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 font-bold text-[11px]">
                    SKU: {p.sku || `#${p.id}`}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-xs"
                      title="Editar Ítem"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-xs"
                      title="Eliminar Ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form: Add / Edit Product or Package */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{editingProduct ? 'Editar Ítem' : 'Registrar Nuevo Paquete / Producto'}</h3>
                  <p className="text-xs text-slate-400">Complete los datos correspondientes al tipo seleccionado</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Registro
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 1 })}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all ${
                      formData.type === 1
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span>Paquete / Tour (1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 2 })}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all ${
                      formData.type === 2
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Producto Físico (2)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 3 })}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all ${
                      formData.type === 3
                        ? 'border-purple-600 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>Servicio (3)</span>
                  </button>
                </div>
              </div>

              {/* Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Tour Buenos Aires & Santiago 5D/4N"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Código</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ej: PAQ-SA-001"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Package Specific: Location & Duration */}
              {formData.type === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Destinos (Ubicación)</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Buenos Aires | Santiago de Chile"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duración</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Ej: 5 Días / 4 Noches"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre el itinerario, características o condiciones..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              {/* Package Specific: Includes */}
              {formData.type === 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Incluye (Atributos)</label>
                  <textarea
                    rows={2}
                    value={formData.includes}
                    onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    placeholder="Vuelos incluidos, Traslados aeropuerto, Hotel 4*, Desayunos"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                  <small className="text-[10px] text-slate-400 font-medium">Separe por comas (,) cada atributo que incluye el paquete.</small>
                </div>
              )}

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio de Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>

                {formData.type === 2 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Precio Sugerido ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.suggested_price}
                      onChange={(e) => setFormData({ ...formData, suggested_price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Main Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Imagen Principal (URL de la imagen)</span>
                </label>
                <input
                  type="text"
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  placeholder="https://ejemplo.com/imagen.jpg o public/uploads/gallery/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:shadow-lg"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Paquete / Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
