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

export interface FormSchema {
  layout: FormLayoutType;
  title?: string;
  subtitle?: string;
  submit_button_text?: string;
  fields: FormFieldSchema[];
  steps?: FormStepSchema[];
  styles?: FormStyleConfig;
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
  course_ids?: number[] | null;
  payment_config?: PaymentConfig | null;
  builder_schema?: BuilderSchema | null;
  form_schema?: FormSchema | null;
  terms_and_conditions?: string | null;
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
}
