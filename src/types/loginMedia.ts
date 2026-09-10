export interface LoginVideo {
  id: number;
  title: string;
  subtitle?: string | null;
  file_path: string;
  url: string;
  sort_order: number;
  is_active: boolean;
  white_label_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginLogo {
  id: number;
  name: string;
  file_path?: string | null;
  url?: string | null;
  sort_order: number;
  is_active: boolean;
  white_label_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginTexts {
  portal_badge: string;
  main_title: string;
  main_subtitle: string;
  form_title: string;
  form_subtitle: string;
  footer_text: string;
  card_badge: string;
  card_button_text: string;
  is_custom?: boolean;
}

export interface PublicLoginVideoItem {
  id: number;
  title: string;
  subtitle?: string | null;
  url: string;
  sort_order: number;
}

export interface PublicLoginLogoItem {
  id: number;
  name: string;
  url?: string | null;
  sort_order: number;
}

export interface PublicWhiteLabelInfo {
  id: number;
  name: string;
  slug?: string | null;
  logo?: string | null;
  logo_2?: string | null;
  logo_icon?: string | null;
  login_background?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  button_color?: string | null;
  custom_domain?: string | null;
}

export interface PublicLoginConfiguration {
  white_label?: PublicWhiteLabelInfo | null;
  texts?: LoginTexts;
  videos: PublicLoginVideoItem[];
  logos: PublicLoginLogoItem[];
}
