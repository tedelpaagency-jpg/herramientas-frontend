'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import productService from '../services/productService';
import toast from 'react-hot-toast';
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
  Image as ImageIcon,
  Building2,
  Upload,
  Loader2
} from 'lucide-react';
import { TableSkeleton } from '@/components/Skeleton';

interface ProductAttributeItem {
  name: string;
  value: string;
}

interface VariantItem {
  id?: string;
  attributes: ProductAttributeItem[];
  stock: number;
}

interface WarehouseItem {
  id: string;
  name: string;
  stock_mode: 'general' | 'variants';
  stock_general: number;
  variants: VariantItem[];
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState<number | 'all'>('all');

  // Upload States
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingExtra, setIsUploadingExtra] = useState(false);

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
    extra_images: [] as string[],
    category_id: '',
    // Physical product specific attributes & warehouse inventories
    product_attributes: [] as ProductAttributeItem[],
    warehouses: [] as WarehouseItem[],
  });

  const handleUploadMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMain(true);
    try {
      const url = await productService.uploadImage(file);
      if (url) {
        setFormData((prev) => ({ ...prev, main_image: url }));
        toast.success('Imagen principal subida exitosamente');
      } else {
        toast.error('No se recibió la URL de la imagen subida.');
      }
    } catch (err: any) {
      console.error('Error uploading main image:', err);
      toast.error(err.response?.data?.message || 'Error al subir la imagen principal');
    } finally {
      setIsUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleUploadExtraImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingExtra(true);
    try {
      const urls = await productService.uploadMultipleImages(files);
      if (urls && urls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          extra_images: [...prev.extra_images, ...urls],
        }));
        toast.success('Imágenes adicionales subidas exitosamente');
      } else {
        toast.error('No se recibieron URLs para las imágenes subidas.');
      }
    } catch (err: any) {
      console.error('Error uploading extra images:', err);
      toast.error(err.response?.data?.message || 'Error al subir imágenes adicionales');
    } finally {
      setIsUploadingExtra(false);
      e.target.value = '';
    }
  };

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
      toast.error('Error al cargar la lista de productos');
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
      extra_images: [],
      category_id: '',
      product_attributes: [],
      warehouses: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);

    const existingExtraImages = product.images
      ? product.images.map((img: any) => (typeof img === 'string' ? img : img.image_path))
      : [];

    const attrsObj = product.attributes_json || {};

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
      extra_images: attrsObj.extra_images || existingExtraImages,
      category_id: product.category_id ? String(product.category_id) : '',
      product_attributes: attrsObj.product_attributes || [],
      warehouses: attrsObj.warehouses || [],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const payload: Record<string, any> = {
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
        price: Number(formData.sale_price),
        main_image: formData.main_image || undefined,
        images: formData.extra_images,
        extra_images: formData.extra_images.join(','),
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        attributes_json: {
          extra_images: formData.extra_images,
          product_attributes: formData.product_attributes,
          warehouses: formData.warehouses,
        },
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        toast.success('Ítem actualizado exitosamente');
      } else {
        await productService.createProduct(payload);
        toast.success('Ítem registrado exitosamente');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product/package:', err);
      toast.error('Error al guardar el ítem.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este paquete/producto?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => (Array.isArray(prev) ? prev.filter((p) => p.id !== id) : []));
      toast.success('Ítem eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting product/package:', err);
      toast.error('Error al eliminar el ítem');
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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold gap-1">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTypeTab === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTypeTab(1)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 1 ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Paquetes / Tours</span>
            </button>
            <button
              onClick={() => setActiveTypeTab(2)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 2 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Productos Físicos</span>
            </button>
            <button
              onClick={() => setActiveTypeTab(3)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTypeTab === 3 ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Servicios</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o destino..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Grid of Product/Package Cards */}
      {(() => {
        const productList = Array.isArray(products) ? products : [];

        if (isLoading) {
          return <TableSkeleton rows={4} />;
        }

        if (productList.length === 0) {
          return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <Globe className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No se encontraron ítems en el catálogo</h3>
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
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((p) => {
              const isPackage = p.type === 1 || (!p.type && (p.location || p.duration));
              const isPhysical = p.type === 2;
              const isService = p.type === 3;
              const priceVal = Number(p.sale_price || p.price || 0);

              // Parse includes tags
              const includesList = p.includes
                ? p.includes.split(',').map((i) => i.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Header with Badge */}
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {p.main_image ? (
                        <img
                          src={p.main_image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                          <ImageIcon className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-bold">Sin Imagen</span>
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 flex gap-1">
                        {isPackage && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Paquete / Tour
                          </span>
                        )}
                        {isPhysical && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white shadow-sm flex items-center gap-1">
                            <Package className="w-3 h-3" /> Producto Físico
                          </span>
                        )}
                        {isService && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-600 text-white shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Servicio
                          </span>
                        )}
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-black shadow-md">
                        ${priceVal.toFixed(2)}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {p.name}
                      </h3>

                      {/* Location & Duration for Packages */}
                      {isPackage && (
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {p.location && (
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
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
        );
      })()}

      {/* Modal Form: Add / Edit Product or Package */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">{editingProduct ? 'Editar Ítem' : 'Registrar Nuevo Paquete / Producto'}</h3>
                  <p className="text-xs text-slate-400">Complete los datos correspondientes al tipo seleccionado</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tipo de Registro
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 1 })}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all ${
                      formData.type === 1
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span>Servicio (3)</span>
                  </button>
                </div>
              </div>

              {/* SECTION: IMAGES (Imagen Principal e Imágenes Adicionales Opcionales) */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Galería e Imágenes</span>
                </h4>

                {/* Imagen Principal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Imagen Principal</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.main_image}
                      onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                      placeholder="https://ejemplo.com/imagen.jpg o suba un archivo..."
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm">
                      {isUploadingMain ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Subir Imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadMainImage}
                        disabled={isUploadingMain}
                        className="hidden"
                      />
                    </label>

                    {formData.main_image && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img src={formData.main_image} alt="Principal" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Imágenes Adicionales */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">Imágenes Adicionales (Opcionales)</label>
                    <div className="flex items-center gap-1.5">
                      <label className="cursor-pointer px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1">
                        {isUploadingExtra ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Subir Archivos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadExtraImages}
                          disabled={isUploadingExtra}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Ingrese la URL de la imagen adicional:');
                          if (url && url.trim()) {
                            setFormData({
                              ...formData,
                              extra_images: [...formData.extra_images, url.trim()],
                            });
                          }
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-extrabold transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar URL</span>
                      </button>
                    </div>
                  </div>

                  {formData.extra_images.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No se han agregado imágenes adicionales. Puede subir archivos o ingresar URLs.</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                      {formData.extra_images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group w-full h-16 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                          <img src={imgUrl} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const nextImgs = [...formData.extra_images];
                              nextImgs.splice(idx, 1);
                              setFormData({ ...formData, extra_images: nextImgs });
                            }}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                            title="Eliminar imagen"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">SKU / Código</label>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Destinos (Ubicación)</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Buenos Aires | Santiago de Chile"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duración</label>
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Incluye (Atributos)</label>
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Precio de Venta ($)</label>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Precio Sugerido ($)</label>
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

              {/* SECTION: PRODUCT ATTRIBUTES (Sólo Producto Físico - Type 2) */}
              {formData.type === 2 && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span>Atributos del Producto</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          product_attributes: [...formData.product_attributes, { name: '', value: '' }],
                        });
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[11px] font-extrabold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Atributo</span>
                    </button>
                  </div>

                  {formData.product_attributes.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No se han especificado atributos generales (ej: Marca, Material, Peso).</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.product_attributes.map((attr, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Nombre (Ej: Marca, Color, Material)"
                            value={attr.name}
                            onChange={(e) => {
                              const updated = [...formData.product_attributes];
                              updated[idx].name = e.target.value;
                              setFormData({ ...formData, product_attributes: updated });
                            }}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                          <input
                            type="text"
                            placeholder="Valor (Ej: Nike, Algodón, 500g)"
                            value={attr.value}
                            onChange={(e) => {
                              const updated = [...formData.product_attributes];
                              updated[idx].value = e.target.value;
                              setFormData({ ...formData, product_attributes: updated });
                            }}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.product_attributes];
                              updated.splice(idx, 1);
                              setFormData({ ...formData, product_attributes: updated });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: WAREHOUSES & INVENTORY VARIANTS (Sólo Producto Físico - Type 2) */}
              {formData.type === 2 && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Box className="w-4 h-4 text-blue-600" />
                      <span>Inventario y Bodegas</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const name = prompt('Nombre de la Bodega (Ej: Bodega Principal, Bodega Norte):');
                        if (name && name.trim()) {
                          const newWh: WarehouseItem = {
                            id: String(Date.now()),
                            name: name.trim(),
                            stock_mode: 'general',
                            stock_general: 0,
                            variants: [],
                          };
                          setFormData({
                            ...formData,
                            warehouses: [...formData.warehouses, newWh],
                          });
                        }
                      }}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-extrabold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Bodega</span>
                    </button>
                  </div>

                  {formData.warehouses.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No se han registrado bodegas para gestionar inventario.</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.warehouses.map((wh, whIdx) => (
                        <div key={wh.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              <span className="font-extrabold text-xs text-slate-900">{wh.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 text-slate-600">
                                {wh.stock_mode === 'general' ? 'Stock General' : 'Con Variantes'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextMode = wh.stock_mode === 'general' ? 'variants' : 'general';
                                  const updated = [...formData.warehouses];
                                  updated[whIdx].stock_mode = nextMode;
                                  setFormData({ ...formData, warehouses: updated });
                                }}
                                className="text-[10px] font-bold text-blue-600 hover:underline"
                              >
                                Cambiar a {wh.stock_mode === 'general' ? 'Variantes' : 'Stock General'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formData.warehouses];
                                  updated.splice(whIdx, 1);
                                  setFormData({ ...formData, warehouses: updated });
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Mode 1: Stock General */}
                          {wh.stock_mode === 'general' ? (
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Stock General en Bodega</label>
                              <input
                                type="number"
                                min="0"
                                value={wh.stock_general}
                                onChange={(e) => {
                                  const updated = [...formData.warehouses];
                                  updated[whIdx].stock_general = Number(e.target.value);
                                  setFormData({ ...formData, warehouses: updated });
                                }}
                                className="w-full max-w-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          ) : (
                            /* Mode 2: Variantes por Bodega */
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700">Variantes en {wh.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.warehouses];
                                    updated[whIdx].variants.push({
                                      id: String(Date.now()),
                                      attributes: [{ name: '', value: '' }],
                                      stock: 0,
                                    });
                                    setFormData({ ...formData, warehouses: updated });
                                  }}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Agregar Variante</span>
                                </button>
                              </div>

                              {wh.variants.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic">Haga clic en "+ Agregar Variante" para definir opciones (ej: Talla M, Color Negro).</p>
                              ) : (
                                <div className="space-y-2">
                                  {wh.variants.map((v, vIdx) => (
                                    <div key={v.id || vIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                        <span>Variante #{vIdx + 1}</span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...formData.warehouses];
                                            updated[whIdx].variants.splice(vIdx, 1);
                                            setFormData({ ...formData, warehouses: updated });
                                          }}
                                          className="text-rose-600 hover:underline"
                                        >
                                          Eliminar Variante
                                        </button>
                                      </div>

                                      {/* Variant Attributes */}
                                      <div className="space-y-1">
                                        {v.attributes.map((attr, aIdx) => (
                                          <div key={aIdx} className="flex gap-2 items-center">
                                            <input
                                              type="text"
                                              placeholder="Atributo (Ej: Talla, Color)"
                                              value={attr.name}
                                              onChange={(e) => {
                                                const updated = [...formData.warehouses];
                                                updated[whIdx].variants[vIdx].attributes[aIdx].name = e.target.value;
                                                setFormData({ ...formData, warehouses: updated });
                                              }}
                                              className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                                            />
                                            <input
                                              type="text"
                                              placeholder="Valor (Ej: XL, Rojo)"
                                              value={attr.value}
                                              onChange={(e) => {
                                                const updated = [...formData.warehouses];
                                                updated[whIdx].variants[vIdx].attributes[aIdx].value = e.target.value;
                                                setFormData({ ...formData, warehouses: updated });
                                              }}
                                              className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const updated = [...formData.warehouses];
                                                updated[whIdx].variants[vIdx].attributes.splice(aIdx, 1);
                                                setFormData({ ...formData, warehouses: updated });
                                              }}
                                              className="text-slate-400 hover:text-rose-500 p-1"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}

                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...formData.warehouses];
                                            updated[whIdx].variants[vIdx].attributes.push({ name: '', value: '' });
                                            setFormData({ ...formData, warehouses: updated });
                                          }}
                                          className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5 pt-1"
                                        >
                                          <Plus className="w-2.5 h-2.5" /> Agregar Atributo a Variante
                                        </button>
                                      </div>

                                      {/* Variant Stock */}
                                      <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                                        <label className="text-[10px] font-bold text-slate-700">Stock de Variante:</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={v.stock}
                                          onChange={(e) => {
                                            const updated = [...formData.warehouses];
                                            updated[whIdx].variants[vIdx].stock = Number(e.target.value);
                                            setFormData({ ...formData, warehouses: updated });
                                          }}
                                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
