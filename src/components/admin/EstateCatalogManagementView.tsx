"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Building2,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Search,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import estateCatalogService, {
  EstateCountryItem,
  EstateCityItem,
  EstateCategoryItem,
} from "@/services/estateCatalogService";

interface EstateCatalogManagementViewProps {
  whiteLabelId?: number;
  isCompact?: boolean;
}

export const EstateCatalogManagementView: React.FC<EstateCatalogManagementViewProps> = ({
  whiteLabelId,
  isCompact = false,
}) => {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.roles?.some((r: any) => r.name === 'super_admin');
  const isWhiteLabelAdmin =
    user?.role === 'white_label_admin' ||
    user?.roles?.some((r: any) => r.name === 'white_label_admin');
  const canManage = Boolean(isSuperAdmin || isWhiteLabelAdmin);

  const [activeTab, setActiveTab] = useState<"countries" | "cities" | "categories">("countries");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [countries, setCountries] = useState<EstateCountryItem[]>([]);
  const [cities, setCities] = useState<EstateCityItem[]>([]);
  const [categories, setCategories] = useState<EstateCategoryItem[]>([]);

  // Modals state
  const [modalType, setModalType] = useState<"country" | "city" | "category" | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states
  const [countryForm, setCountryForm] = useState({
    name: "",
    code: "EC",
    image: "",
    image_file: null as File | null,
    status: true,
    order: 0,
  });

  const [cityForm, setCityForm] = useState({
    name: "",
    province: "",
    country_id: undefined as number | undefined,
    image: "",
    image_file: null as File | null,
    status: true,
    order: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    icon: "home",
    property_type: 1,
    image: "",
    image_file: null as File | null,
    status: true,
    order: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await estateCatalogService.getCatalog(whiteLabelId);
      if (data) {
        setCountries(data.countries || []);
        setCities(data.cities || []);
        setCategories(data.categories || []);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cargar catálogo inmobiliario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [whiteLabelId]);

  const handleSeedDefaults = async () => {
    if (!canManage) {
      toast.error("Solo el administrador de la Marca Blanca puede poblar datos en el catálogo.");
      return;
    }
    if (!confirm("¿Deseas poblar el catálogo con países, ciudades y categorías sugeridas con fotos de alta resolución?")) {
      return;
    }
    setSeeding(true);
    try {
      const data = await estateCatalogService.seedDefaults(whiteLabelId);
      if (data) {
        setCountries(data.countries || []);
        setCities(data.cities || []);
        setCategories(data.categories || []);
        toast.success("¡Catálogo sugerido poblado con éxito con fotos de alta definición!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al poblar sugeridos");
    } finally {
      setSeeding(false);
    }
  };

  // Apertura de modales
  const openCountryModal = (country?: EstateCountryItem) => {
    if (country) {
      setEditingItem(country);
      setCountryForm({
        name: country.name,
        code: country.code || "EC",
        image: country.image || "",
        image_file: null,
        status: country.status,
        order: country.order || 0,
      });
      setImagePreview(country.image || "");
    } else {
      setEditingItem(null);
      setCountryForm({
        name: "",
        code: "EC",
        image: "",
        image_file: null,
        status: true,
        order: countries.length + 1,
      });
      setImagePreview("");
    }
    setModalType("country");
  };

  const openCityModal = (city?: EstateCityItem) => {
    if (city) {
      setEditingItem(city);
      setCityForm({
        name: city.name,
        province: city.province || "",
        country_id: city.country_id || (countries[0]?.id ?? undefined),
        image: city.image || "",
        image_file: null,
        status: city.status,
        order: city.order || 0,
      });
      setImagePreview(city.image || "");
    } else {
      setEditingItem(null);
      setCityForm({
        name: "",
        province: "",
        country_id: countries[0]?.id ?? undefined,
        image: "",
        image_file: null,
        status: true,
        order: cities.length + 1,
      });
      setImagePreview("");
    }
    setModalType("city");
  };

  const openCategoryModal = (cat?: EstateCategoryItem) => {
    if (cat) {
      setEditingItem(cat);
      setCategoryForm({
        name: cat.name,
        slug: cat.slug || "",
        icon: cat.icon || "home",
        property_type: cat.property_type || 1,
        image: cat.image || "",
        image_file: null,
        status: cat.status,
        order: cat.order || 0,
      });
      setImagePreview(cat.image || "");
    } else {
      setEditingItem(null);
      setCategoryForm({
        name: "",
        slug: "",
        icon: "home",
        property_type: 1,
        image: "",
        image_file: null,
        status: true,
        order: categories.length + 1,
      });
      setImagePreview("");
    }
    setModalType("category");
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setImagePreview("");
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (modalType === "country") setCountryForm((prev) => ({ ...prev, image_file: file }));
      if (modalType === "city") setCityForm((prev) => ({ ...prev, image_file: file }));
      if (modalType === "category") setCategoryForm((prev) => ({ ...prev, image_file: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardado de formularios
  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", countryForm.name);
      fd.append("code", countryForm.code);
      fd.append("status", countryForm.status ? "1" : "0");
      fd.append("order", String(countryForm.order));
      if (whiteLabelId) fd.append("white_label_id", String(whiteLabelId));
      if (countryForm.image_file) {
        fd.append("image_file", countryForm.image_file);
      } else if (countryForm.image) {
        fd.append("image", countryForm.image);
      }

      if (editingItem) {
        await estateCatalogService.updateCountry(editingItem.id, fd);
        toast.success("País actualizado con éxito");
      } else {
        await estateCatalogService.createCountry(fd);
        toast.success("País agregado con éxito");
      }
      closeModal();
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al guardar país");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", cityForm.name);
      if (cityForm.province) fd.append("province", cityForm.province);
      if (cityForm.country_id) fd.append("country_id", String(cityForm.country_id));
      fd.append("status", cityForm.status ? "1" : "0");
      fd.append("order", String(cityForm.order));
      if (whiteLabelId) fd.append("white_label_id", String(whiteLabelId));
      if (cityForm.image_file) {
        fd.append("image_file", cityForm.image_file);
      } else if (cityForm.image) {
        fd.append("image", cityForm.image);
      }

      if (editingItem) {
        await estateCatalogService.updateCity(editingItem.id, fd);
        toast.success("Ciudad actualizada con éxito");
      } else {
        await estateCatalogService.createCity(fd);
        toast.success("Ciudad agregada con éxito");
      }
      closeModal();
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al guardar ciudad");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", categoryForm.name);
      if (categoryForm.slug) fd.append("slug", categoryForm.slug);
      fd.append("icon", categoryForm.icon);
      fd.append("property_type", String(categoryForm.property_type));
      fd.append("status", categoryForm.status ? "1" : "0");
      fd.append("order", String(categoryForm.order));
      if (whiteLabelId) fd.append("white_label_id", String(whiteLabelId));
      if (categoryForm.image_file) {
        fd.append("image_file", categoryForm.image_file);
      } else if (categoryForm.image) {
        fd.append("image", categoryForm.image);
      }

      if (editingItem) {
        await estateCatalogService.updateCategory(editingItem.id, fd);
        toast.success("Categoría actualizada con éxito");
      } else {
        await estateCatalogService.createCategory(fd);
        toast.success("Categoría agregada con éxito");
      }
      closeModal();
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al guardar categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: "country" | "city" | "category", id: number, name: string) => {
    if (!canManage) {
      toast.error("Solo el administrador de la Marca Blanca puede eliminar elementos del catálogo.");
      return;
    }
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return;
    try {
      if (type === "country") await estateCatalogService.deleteCountry(id);
      if (type === "city") await estateCatalogService.deleteCity(id);
      if (type === "category") await estateCatalogService.deleteCategory(id);
      toast.success("Eliminado correctamente");
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al eliminar");
    }
  };

  const handleToggleCountryStatus = async (id: number) => {
    if (!canManage) {
      toast.error("Solo el administrador de la Marca Blanca puede cambiar el estado.");
      return;
    }
    try {
      const res = await estateCatalogService.toggleCountryStatus(id);
      if (res) {
        setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, status: !!res.status } : c)));
        toast.success(res.status ? "País activado" : "País desactivado");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cambiar estado del país");
    }
  };

  const handleToggleCityStatus = async (id: number) => {
    if (!canManage) {
      toast.error("Solo el administrador de la Marca Blanca puede cambiar el estado.");
      return;
    }
    try {
      const res = await estateCatalogService.toggleCityStatus(id);
      if (res) {
        setCities((prev) => prev.map((c) => (c.id === id ? { ...c, status: !!res.status } : c)));
        toast.success(res.status ? "Ciudad activada" : "Ciudad desactivada");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cambiar estado de la ciudad");
    }
  };

  const handleToggleCategoryStatus = async (id: number) => {
    if (!canManage) {
      toast.error("Solo el administrador de la Marca Blanca puede cambiar el estado.");
      return;
    }
    try {
      const res = await estateCatalogService.toggleCategoryStatus(id);
      if (res) {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, status: !!res.status } : c)));
        toast.success(res.status ? "Categoría activada" : "Categoría desactivada");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al cambiar estado de la categoría");
    }
  };

  // Filtrado por buscador
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.province && c.province.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner Superior con Acciones y Estadísticas */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Marca Blanca &bull; Módulo Inmobiliario
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Gestión de Destinos &amp; Categorías Inmobiliarias
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Personaliza los Países, Ciudades y Categorías con sus fotografías oficiales de alta calidad. Estos datos alimentan automáticamente el buscador, los filtros, las secciones del portal y el loader interactivo.
            </p>
          </div>

          {canManage && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={seeding}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-extrabold text-white flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Cargar países, ciudades y categorías sugeridas con fotos por defecto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
                <span>{seeding ? "Poblando..." : "Cargar Sugeridos con Fotos"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Contadores rápidos */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Países</p>
              <p className="text-lg font-black">{countries.length}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Ciudades</p>
              <p className="text-lg font-black">{cities.length}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Categorías</p>
              <p className="text-lg font-black">{categories.length}</p>
            </div>
          </div>
        </div>

        {!canManage && (
          <div className="mt-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Modo de solo lectura:</strong> Únicamente el Administrador de Marca Blanca tiene permisos para crear, editar o eliminar países, ciudades y categorías del catálogo.
            </span>
          </div>
        )}
      </div>

      {/* Selector de Pestañas y Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("countries")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "countries"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Países ({countries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cities")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "cities"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Ciudades ({cities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "categories"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {canManage && activeTab === "countries" && (
            <button
              type="button"
              onClick={() => openCountryModal()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo País</span>
            </button>
          )}

          {canManage && activeTab === "cities" && (
            <button
              type="button"
              onClick={() => openCityModal()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Ciudad</span>
            </button>
          )}

          {canManage && activeTab === "categories" && (
            <button
              type="button"
              onClick={() => openCategoryModal()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Categoría</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido según la pestaña */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-500">Cargando catálogo...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: PAÍSES */}
          {activeTab === "countries" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCountries.map((c) => (
                <div
                  key={c.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                      {c.code || "EC"}
                    </span>
                    {canManage ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCountryStatus(c.id);
                        }}
                        title="Click para cambiar estado (Activo / Inactivo)"
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs transition-transform active:scale-90 cursor-pointer ${
                          c.status ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {c.status ? "Activo" : "Inactivo"}
                      </button>
                    ) : (
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs ${
                          c.status ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {c.status ? "Activo" : "Inactivo"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Orden de visualización: #{c.order}</p>
                    </div>

                    {canManage && (
                      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => openCountryModal(c)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 active:scale-90 transition-all cursor-pointer"
                          title="Editar País"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete("country", c.id, c.name)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 active:scale-90 transition-all cursor-pointer"
                          title="Eliminar País"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                  No se encontraron países registrados. Haz clic en &quot;Nuevo País&quot; o &quot;Cargar Sugeridos con Fotos&quot;.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CIUDADES */}
          {activeTab === "cities" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
                    {city.image ? (
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    {city.country && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                        {city.country.name}
                      </span>
                    )}
                    {canManage ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCityStatus(city.id);
                        }}
                        title="Click para cambiar estado (Activa / Inactiva)"
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs transition-transform active:scale-90 cursor-pointer ${
                          city.status ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {city.status ? "Activa" : "Inactiva"}
                      </button>
                    ) : (
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs ${
                          city.status ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {city.status ? "Activa" : "Inactiva"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{city.name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {city.province ? `Provincia: ${city.province}` : "Sin provincia"} &bull; #{city.order}
                      </p>
                    </div>

                    {canManage && (
                      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => openCityModal(city)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 active:scale-90 transition-all cursor-pointer"
                          title="Editar Ciudad"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete("city", city.id, city.name)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 active:scale-90 transition-all cursor-pointer"
                          title="Eliminar Ciudad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredCities.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                  No se encontraron ciudades registradas.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORÍAS */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3 text-emerald-400" /> Tipo #{cat.property_type || 1}
                    </span>
                    {canManage ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCategoryStatus(cat.id);
                        }}
                        title="Click para cambiar estado (Visible / Oculta)"
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs transition-transform active:scale-90 cursor-pointer ${
                          cat.status ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {cat.status ? "Visible" : "Oculta"}
                      </button>
                    ) : (
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-xs ${
                          cat.status ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {cat.status ? "Visible" : "Oculta"}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Slug: /{cat.slug || "cat"} &bull; Icono: {cat.icon || "home"} &bull; #{cat.order}
                      </p>
                    </div>

                    {canManage && (
                      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => openCategoryModal(cat)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 active:scale-90 transition-all cursor-pointer"
                          title="Editar Categoría"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete("category", cat.id, cat.name)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 active:scale-90 transition-all cursor-pointer"
                          title="Eliminar Categoría"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                  No se encontraron categorías registradas.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL PAÍS ================= */}
      {modalType === "country" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                {editingItem ? "Editar País" : "Nuevo País"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCountry} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del País
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ecuador"
                  value={countryForm.name}
                  onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Código ISO (2 letras)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="ej. EC"
                    value={countryForm.code}
                    onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={countryForm.order}
                    onChange={(e) => setCountryForm({ ...countryForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Subida o URL de Foto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fotografía Oficial del País
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="O pega URL de imagen (https://...)"
                    value={countryForm.image}
                    onChange={(e) => {
                      setCountryForm({ ...countryForm, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2.5 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="country_status"
                  checked={countryForm.status}
                  onChange={(e) => setCountryForm({ ...countryForm, status: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="country_status" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  País Activo y Visible en el Portal
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar País"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CIUDAD ================= */}
      {modalType === "city" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                {editingItem ? "Editar Ciudad" : "Nueva Ciudad"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCity} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Ciudad
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Quito"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Provincia / Estado
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Pichincha"
                    value={cityForm.province}
                    onChange={(e) => setCityForm({ ...cityForm, province: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    País Perteneciente
                  </label>
                  <select
                    value={cityForm.country_id || ""}
                    onChange={(e) => setCityForm({ ...cityForm, country_id: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Seleccionar país...</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code || "EC"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  value={cityForm.order}
                  onChange={(e) => setCityForm({ ...cityForm, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Subida o URL de Foto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fotografía de la Ciudad
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="O pega URL de imagen (https://...)"
                    value={cityForm.image}
                    onChange={(e) => {
                      setCityForm({ ...cityForm, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2.5 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="city_status"
                  checked={cityForm.status}
                  onChange={(e) => setCityForm({ ...cityForm, status: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="city_status" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Ciudad Activa y Visible en el Portal
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar Ciudad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CATEGORÍA ================= */}
      {modalType === "category" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                {editingItem ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Casas & Residencias"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Propiedad (ID)
                  </label>
                  <select
                    value={categoryForm.property_type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, property_type: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  >
                    <option value={1}>1: Casas</option>
                    <option value={2}>2: Departamentos</option>
                    <option value={3}>3: Terrenos / Lotes</option>
                    <option value={4}>4: Locales Comerciales</option>
                    <option value={5}>5: Oficinas</option>
                    <option value={6}>6: Villas & Quintas</option>
                    <option value={7}>7: Bodegas / Galpones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Icono
                  </label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  >
                    <option value="home">home</option>
                    <option value="building">building</option>
                    <option value="map-pin">map-pin</option>
                    <option value="store">store</option>
                    <option value="briefcase">briefcase</option>
                    <option value="tree-pine">tree-pine</option>
                    <option value="warehouse">warehouse</option>
                    <option value="hotel">hotel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    placeholder="ej. casas"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Subida o URL de Foto */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Fotografía de la Categoría
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="O pega URL de imagen (https://...)"
                    value={categoryForm.image}
                    onChange={(e) => {
                      setCategoryForm({ ...categoryForm, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2.5 relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_status"
                  checked={categoryForm.status}
                  onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="cat_status" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Categoría Activa y Visible en el Catálogo
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateCatalogManagementView;
