export type LandingMode = 'visual' | 'custom_html';
export type FormLayoutType = 'linear' | 'multi_step';
export type ActionType = 'lead' | 'register_agency';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldSchema {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'number' | 'file';
  placeholder?: string;
  required?: boolean;
  is_system_field?: boolean; // Locked system field for mandatory lead info
  options?: FormFieldOption[];
  step_index?: number; // 0-indexed for multi-step form grouping
}

export interface FormStepSchema {
  title: string;
  description?: string;
  field_ids: string[];
}

export interface FormStyleConfig {
  bg_color?: string;
  text_color?: string;
  input_bg_color?: string;
  input_text_color?: string;
  input_border_color?: string;
  button_bg_color?: string;
  button_text_color?: string;
  border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  card_style?: 'card' | 'glass' | 'bordered' | 'minimal';
}

export interface StripeAppearanceConfig {
  theme?: 'stripe' | 'night' | 'flat';
  // Fondo
  bg_color?: string;
  bg_transparent?: boolean;
  container_border_color?: string;
  container_border_width?: string;
  container_border_radius?: string;
  container_shadow?: string;
  spacing_unit?: string;

  // Tipografía
  text_color?: string;
  title_color?: string;
  label_color?: string;
  font_size?: string;
  font_weight?: string;
  font_family?: string;

  // Inputs
  input_bg_color?: string;
  input_text_color?: string;
  input_placeholder_color?: string;
  input_border_color?: string;
  input_focus_border_color?: string;
  input_border_width?: string;
  input_border_radius?: string;
  input_padding?: string;

  // Botones
  button_bg_color?: string;
  button_text_color?: string;
  button_hover_bg_color?: string;
  button_border_radius?: string;
  button_padding?: string;
  button_text?: string;

  // Otros elementos
  error_color?: string;
  success_color?: string;
  link_color?: string;
}

export interface FormSchema {
  layout: FormLayoutType;
  title?: string;
  subtitle?: string;
  submit_button_text?: string;
  fields: FormFieldSchema[];
  steps?: FormStepSchema[];
  styles?: FormStyleConfig;
  stripe_appearance?: StripeAppearanceConfig;
}

export interface BuilderSchemaBlock {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'form' | 'custom_html';
  title?: string;
  subtitle?: string;
  content?: string;
  bg_color?: string;
  text_color?: string;
  button_text?: string;
  button_url?: string;
  image_url?: string;
}

export interface BuilderSchema {
  theme?: {
    primary_color?: string;
    background_color?: string;
    font_family?: string;
  };
  blocks: BuilderSchemaBlock[];
}

export interface PaymentConfig {
  enabled: boolean;
  currency: string;
  amount: number;
  product_name: string;
  stripe_appearance?: StripeAppearanceConfig;
}

export interface LandingTemplate {
  id: number;
  title?: string;
  name?: string;
  plantilla: string;
  description?: string;
  status?: number | boolean;
  white_label_id?: number | null;
  agency_id?: number | null;
  agency_name?: string;
  user_id?: number | null;
  mode?: LandingMode;
  custom_html?: string | null;
  workspace_id?: number | null;
  stage_id?: number | null;
  workflow_id?: number | null;
  action_type?: ActionType;
  plan_id?: number | null;
  default_password?: string | null;
  course_ids?: number[] | null;
  payment_config?: PaymentConfig | null;
  stripe_appearance?: StripeAppearanceConfig | null;
  builder_schema?: BuilderSchema | null;
  form_schema?: FormSchema | null;
  terms_and_conditions?: string | null;
  privacy_policy?: string | null;
  encoded_id?: string;
  public_url?: string;
  events?: any[];
  requests_count?: number;
  agency?: {
    id: number;
    name: string;
    logo?: string;
  };
  white_label?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LandingAvailableResources {
  workspaces: Array<{ id: number; name: string; agency_id?: number }>;
  stages: Array<{ id: number; name: string; workspace_id: number }>;
  courses: Array<{ id: number; title: string }>;
  workflows: Array<{ id: number; name: string }>;
  white_labels: Array<{ id: number; name: string }>;
  agencies: Array<{ id: number; name: string; white_label_id?: number }>;
  plans?: Array<{
    id: number;
    name: string;
    type?: string;
    price?: number | string;
    billing_type?: string;
    duration_value?: number;
    duration_unit?: string;
    status?: boolean | number;
    white_label_id?: number | null;
  }>;
}

