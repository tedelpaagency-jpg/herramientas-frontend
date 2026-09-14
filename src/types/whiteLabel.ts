export interface WhiteLabel {
  id: number;
  name: string;
  slug: string;
  legal_name?: string | null;
  email: string;
  phone?: string | null;
  logo?: string | null;
  logo_2?: string | null;
  logo_icon?: string | null;
  favicon?: string | null;
  primary_color?: string;
  secondary_color?: string;
  button_color?: string;
  menu_background?: string | null;
  dark_theme?: string | null;
  navigation_mode?: string | null;
  font_family?: string;
  login_background?: string | null;
  custom_domain?: string | null;
  seo_description?: string | null;
  whatsapp?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  custom_css?: string | null;
  stripe_publishable_key?: string | null;
  stripe_secret_key?: string | null;
  stripe_webhook_secret?: string | null;
  stripe_mode?: 'test' | 'live' | string | null;
  border_radius?: string | null;
  status: 'active' | 'suspended';
  plan_id?: number | null;
  agencies?: any[];
  users?: any[];
  plan?: any;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: number;
  user_id?: number | null;
  white_label_id?: number | null;
  agency_id?: number | null;
  action: string;
  entity_type?: string | null;
  entity_id?: number | null;
  ip?: string | null;
  user_agent?: string | null;
  metadata?: any;
  created_at?: string;
}

export interface ImpersonationState {
  isImpersonating: boolean;
  impersonatingFrom?: {
    id: number;
    name: string;
    email: string;
  } | null;
}
