export type AspectRatioType = '9:16' | '4:5' | '1:1' | '4:3' | '16:9';

export type ResourceType = 'image' | 'video';

export type ElementType = 'text' | 'agency_logo' | 'agent_name' | 'sale_price' | 'custom_field' | 'badge' | 'shape';

export interface ElementStyles {
  font_family?: string;
  font_size_rel?: number; // Relativo al alto del canvas (ej. 0.035)
  font_weight?: string;
  color?: string;
  background_color?: string;
  text_align?: 'left' | 'center' | 'right';
  opacity?: number;
  border_radius?: number;
  letter_spacing?: number;
  line_height?: number;
  auto_shrink_font?: boolean;
}

export interface MarketingTemplateElement {
  id?: number;
  template_id?: number;
  element_type: ElementType;
  label: string;
  field_key: string;
  is_agency_editable: boolean;
  is_required: boolean;
  default_value?: string | null;
  relative_x: number; // 0.0 - 1.0
  relative_y: number; // 0.0 - 1.0
  relative_width: number; // 0.0 - 1.0
  relative_height: number; // 0.0 - 1.0
  z_index: number;
  styles?: ElementStyles;
}

export interface SafeZoneConfig {
  top: number; // Porcentaje relativo 0.0 - 1.0
  bottom: number;
  left: number;
  right: number;
}

export interface MarketingMediaResource {
  id: number;
  white_label_id: number;
  created_by: number;
  name: string;
  description?: string | null;
  type: ResourceType;
  file_path: string;
  file_url: string;
  thumbnail_path?: string | null;
  thumbnail_url?: string | null;
  mime_type: string;
  file_size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  aspect_ratio: AspectRatioType;
  country?: string | null;
  product_type?: string | null;
  category?: string | null;
  tags?: string[] | null;
  status: 'draft' | 'processing' | 'published' | 'error' | 'archived';
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingTemplate {
  id: number;
  white_label_id: number;
  created_by: number;
  resource_id: number;
  name: string;
  description?: string | null;
  aspect_ratio: AspectRatioType;
  base_cost: number;
  suggested_price: number;
  currency: string;
  is_published: boolean;
  status: 'draft' | 'published' | 'archived';
  safe_zone_config?: SafeZoneConfig | null;
  preview_image_path?: string | null;
  preview_image_url?: string | null;
  metrics?: {
    views_count?: number;
    generations_count?: number;
    downloads_count?: number;
  } | null;
  resource?: MarketingMediaResource;
  elements?: MarketingTemplateElement[];
  created_at: string;
  updated_at: string;
}

export interface MarketingGeneration {
  id: number;
  uuid: string;
  white_label_id: number;
  agency_id: number;
  user_id: number;
  template_id: number;
  resource_id: number;
  type: ResourceType;
  format: 'mp4' | 'jpg' | 'png';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  customization_payload: Record<string, any>;
  base_cost_snapshot: number;
  sale_price: number;
  projected_profit: number;
  currency: string;
  output_path?: string | null;
  output_url?: string | null;
  file_size?: number | null;
  processing_time_ms?: number | null;
  expires_at?: string | null;
  error_message?: string | null;
  template?: MarketingTemplate;
  resource?: MarketingMediaResource;
  agency?: {
    id: number;
    name: string;
    logo?: string;
  };
  user?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProfitCalculation {
  base_cost: number;
  sale_price: number;
  projected_profit: number;
  profit_margin_percent: number;
  is_profitable: boolean;
  disclaimer: string;
}

export interface MarketingB2BMetrics {
  total_generations: number;
  completed_generations: number;
  failed_generations: number;
  success_rate_percent: number;
  total_downloads: number;
  total_projected_profit: number;
  top_agencies: Array<{
    agency_id: number;
    count: number;
    agency?: { id: number; name: string };
  }>;
  top_templates: Array<{
    template_id: number;
    count: number;
    template?: { id: number; name: string; aspect_ratio: AspectRatioType };
  }>;
}
