export interface AcmZone {
  id: number;
  agency_id?: number | null;
  user_id?: number | null;
  name: string;
  code?: string | null;
  color?: string;
  suggested_suelo: number;
  suggested_construccion: number;
  coordinates: Array<{ lat: number; lng: number }>;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcmPhotoItem {
  id: string;
  preview: string;
  file?: File;
}

export interface AcmPhotos {
  fachada: AcmPhotoItem[];
  social: AcmPhotoItem[];
  humedas: AcmPhotoItem[];
  anexos: AcmPhotoItem[];
}

export interface AcmEstimation {
  id: number;
  code: string;
  agency_id?: number | null;
  user_id?: number | null;
  zone_id?: number | null;
  client_name: string;
  client_id?: string | null;
  client_phone?: string | null;
  property_type: string;
  property_subtype?: string | null;
  transaction_type: 'venta' | 'alquiler';
  status: 'Completado' | 'En Proceso' | 'Revisión';
  confidence: string;
  location_str?: string | null;
  lat?: number | null;
  lng?: number | null;
  area_terreno: number;
  valor_terreno: number;
  area_util: number;
  area_abierta: number;
  precio_base: number;
  habitaciones: number;
  banos: number;
  num_parqueaderos: number;
  valor_parqueadero: number;
  bodegas: number;
  valor_bodega: number;
  ano_construccion?: number | null;
  estado_conservacion: number;
  tipo_ubicacion: string;
  margen_negociacion: number;
  plusvalia_zona: number;
  obsolescencia: number;
  cap_rate: number;
  amenities?: Record<string, boolean>;
  photos?: AcmPhotos;
  calculations?: any;
  suggested_value: number;
  suggested_rent: number;
  zone?: AcmZone | null;
  created_at?: string;
  updated_at?: string;
}
