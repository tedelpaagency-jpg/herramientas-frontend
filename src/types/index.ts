export interface PlanPermission {
  id: number;
  plan_id: number;
  permission: string;
  created_at?: string;
}

export interface Plan {
  id: number;
  white_label_id?: number | null;
  white_label?: any;
  type?: 'white_label' | 'agency';
  name: string;
  description?: string;
  price: number;
  billing_type?: 'fixed' | 'commission';
  commission_percentage?: number | null;
  duration_value?: number;
  duration_unit?: 'day' | 'month' | 'year';
  features?: string[];
  allowed_agency_types?: string[];
  status?: boolean;
  plan_permissions?: PlanPermission[];
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  subscribable_type?: string;
  subscribable_id?: number;
  subscribable?: any;
  agency_id?: number;
  agency?: Agency;
  plan_id: number;
  plan?: Plan;
  start_date: string;
  end_date?: string | null;
  started_at?: string;
  expires_at?: string | null;
  status?: string;
  renewed_at?: string | null;
  previous_subscription_id?: number | null;
  previous_subscription?: Subscription | null;
  notes?: string | null;
  created_by?: number | null;
  creator?: User | null;
  days_remaining?: number;
  created_at?: string;
}

export interface Agency {
  id: number;
  name: string;
  razon_social?: string;
  ruc?: string;
  email?: string;
  phone?: string;
  description?: string;
  address?: string;
  city?: string;
  province?: string;
  domain?: string;
  logo?: string | null;
  logo_2?: string | null;
  logo_icon?: string | null;
  favicon?: string | null;
  primary_color?: string;
  secondary_color?: string;
  button_color?: string;
  font_family?: string;
  login_background?: string | null;
  seo_description?: string | null;
  whatsapp?: string | null;
  custom_css?: string | null;
  stripe_publishable_key?: string | null;
  stripe_secret_key?: string | null;
  stripe_webhook_secret?: string | null;
  stripe_mode?: 'test' | 'live' | string | null;
  plan_id?: number;
  plan?: Plan;
  gerente_id?: number;
  gerente_comercial?: User;
  white_label_id?: number;
  white_label?: any;
  current_subscription?: Subscription;
  subscriptions?: Subscription[];
  status?: number;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  last_name?: string;
  email: string;
  role?: string;
  points?: number;
  avatarUrl?: string;
  agency_id?: number;
  agency?: Agency;
  white_label_id?: number;
  white_label?: any;
  white_labels?: any[];
  roles?: Role[];
  permissions?: Permission[];
  effective_permissions?: string[];
  dashboard_type?: 'super_admin' | 'white_label_admin' | 'agency_admin' | 'agent';
  subscription?: {
    is_expired: boolean;
    expired_scope: 'white_label' | 'agency' | null;
    status: string;
    start_date?: string | null;
    end_date?: string | null;
    days_left: number;
  };
  phone?: string;
  photo?: string | null;
  status?: number;
  deleted_at?: string | null;
  created_at?: string;
}

export interface EstateImage {
  id: number;
  estate_id: number;
  image_path: string;
  is_main?: boolean;
  order?: number;
}

export interface Estate {
  id: number;
  title: string;
  slug?: string;
  description: string;
  type: 'house' | 'apartment' | 'land' | 'commercial' | 'office' | string;
  price: number;
  currency: string;
  address?: string;
  full_address?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  has_coordinates?: boolean;
  city?: string;
  state?: string;
  province?: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  size?: number;
  status: 'available' | 'reserved' | 'sold' | 'rented' | string | number;
  property_status?: number;
  is_verified: boolean;
  agency_id?: number;
  agency?: Agency;
  user_id?: number;
  user?: User;
  image?: string;
  images?: EstateImage[] | string[];
  attributes_json?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface WorkspaceMetaCustomField {
  id: number;
  workspace_id: number;
  field_key: string;
  internal_name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean' | string;
  options?: string[] | null;
  is_required: boolean;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LeadCustomFieldValue {
  id: number;
  client_id: number;
  workspace_id: number;
  workspace_meta_custom_field_id?: number | null;
  field_key: string;
  field_name: string;
  value?: string | null;
  status: 'received' | 'not_received' | 'pending' | string;
  created_at?: string;
  updated_at?: string;
  custom_field?: WorkspaceMetaCustomField;
}

export interface Workspace {
  id: number;
  agency_id?: number;
  agency?: Agency;
  name: string;
  description?: string;
  color?: string;
  status?: number;
  meta_enabled?: boolean;
  meta_campaign_id?: string | null;
  meta_campaign_name?: string | null;
  meta_form_id?: string | null;
  meta_form_name?: string | null;
  meta_page_id?: string | null;
  meta_webhook_enabled?: boolean;
  meta_webhook_url?: string | null;
  meta_webhook_secret?: string | null;
  meta_config?: Record<string, any> | null;
  custom_fields?: WorkspaceMetaCustomField[];
  custom_fields_count?: number;
  clients_count?: number;
  stages?: WorkspaceStage[];
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
  phone?: string;
  source?: string; // 'manual' | 'meta' | string
  classification?: 'bueno' | 'facil' | 'urgente' | string | null;
  workspace_id?: number;
  workspace?: Workspace;
  meta_lead_id?: string | null;
  meta_form_id?: string | null;
  meta_campaign_id?: string | null;
  meta_adset_id?: string | null;
  meta_ad_id?: string | null;
  meta_page_id?: string | null;
  custom_field_values?: LeadCustomFieldValue[];
  identification_number?: string;
  document_number?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string | number;
  agency_id?: number;
  created_at?: string;
  [key: string]: any;
}

export interface WorkspaceStage {
  id: number;
  workspace_id?: number;
  name: string;
  sort_order?: number;
  order?: number;
  color?: string;
  is_fixed?: boolean;
}


export interface PipelineTask {
  id: number;
  client_pipeline_id: number;
  title: string;
  description?: string;
  due_at?: string;
  is_completed: boolean;
  assigned_user_id?: number;
  created_at?: string;
}

export interface PipelineProposal {
  id: number;
  client_pipeline_id: number;
  item: string;
  qty: number;
  price: number;
  created_at?: string;
}

export interface PipelinePayment {
  id: number;
  client_pipeline_id: number;
  name: string;
  total_amount: number;
  token: string;
  proof_file?: string;
  payment_reference?: string;
  status: 'pending' | 'review' | 'approved' | 'rejected' | string;
  proof_uploaded_at?: string;
  created_at?: string;
}

export interface PipelineActivity {
  id: number;
  client_pipeline_id?: number;
  client_id?: number;
  user_id?: number;
  user?: User;
  type: string;
  activity_type?: string;
  content: string;
  note?: string;
  created_at?: string;
}

export interface CrmPipelineItem {
  id: number;
  title: string;
  agency_id?: number;
  client_id?: number;
  client?: Client;
  workspace_id?: number;
  stage_id: number;
  stage?: WorkspaceStage;
  deal_value?: number;
  estimated_value?: number;
  currency?: string;
  priority?: number | string;
  due_date?: string;
  status?: number;
  assigned_user_id?: number;
  assignedUser?: User;
  activities?: PipelineActivity[];
  tasks?: PipelineTask[];
  proposals?: PipelineProposal[];
  payments?: PipelinePayment[];
  created_at?: string;
}

export interface LandingEvent {
  id: number;
  landing_id: number;
  name: string;
  date_start: string;
  date_end: string;
  email_remembers?: number;
  link?: string;
  status?: number;
}

export interface LandingRequest {
  id: number;
  landing_id: number;
  name: string;
  last_name?: string;
  email: string;
  phone?: string;
  motivo?: string;
  address?: string;
  date_start?: string;
  date_end?: string;
  status?: number;
  created_at?: string;
}



export interface EmailTemplate {
  id: number;
  agency_id?: number;
  name: string;
  subject?: string;
  body_html: string;
  files_json?: string[];
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CredentialTemplate {
  id: number;
  agency_id?: number;
  name: string;
  subject?: string;
  body_html: string;
  status?: number;
  agency?: Agency;
  created_at?: string;
  updated_at?: string;
}

export interface CredentialLog {
  id: number;
  sender_id?: number;
  recipient_id?: number;
  credential_template_id?: number;
  send_type?: 'individual' | 'batch' | 'all' | string;
  status?: 'sent' | 'failed' | string;
  error_message?: string;
  sent_at?: string;
  sender?: User;
  recipient?: User;
  template?: CredentialTemplate;
  created_at?: string;
}

export interface EmailCampaignLog {
  id: number;
  email_campaign_id: number;
  client_id?: number;
  client?: Client;
  email: string;
  status: 'sent' | 'failed' | string;
  error_message?: string;
  created_at?: string;
}

export interface EmailCampaign {
  id: number;
  agency_id?: number;
  email_template_id?: number;
  template?: EmailTemplate;
  name: string;
  subject: string;
  body_html: string;
  stage_id?: number;
  stage?: WorkspaceStage;
  recipient_count: number;
  status: 'draft' | 'sending' | 'sent' | 'failed' | string;
  sent_at?: string;
  logs?: EmailCampaignLog[];
  created_at?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: number;
  type?: 1 | 2 | 3 | number; // 1: Paquete/Tour, 2: Producto Físico, 3: Servicio
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  location?: string;
  duration?: string;
  includes?: string;
  price?: number;
  sale_price?: number;
  suggested_price?: number;
  purchase_price?: number;
  cost?: number;
  stock?: number;
  main_image?: string;
  category_id?: number;
  category?: ProductCategory;
  is_active?: boolean;
  images?: Array<{ id: number; image_path: string }>;
  attributes_json?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PosSaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface PosSaleRequest {
  client_name: string;
  client_email?: string;
  payment_type: string;
  items: PosSaleItem[];
}

export interface VisaRef {
  id: number;
  name: string;
  agency_id?: number;
  status?: number;
  visas_count?: number;
  created_at?: string;
}

export interface Visa {
  id: number;
  applicant_name: string;
  description?: string;
  passport_number?: string;
  country_destination: string;
  visa_type: string;
  visa_ref_id?: number;
  status: '1' | '2' | '3' | 'pending' | 'confirmed' | 'rejected' | string;
  fields?: Record<string, any>;
  passport_file?: string;
  bank_statements_file?: string;
  additional_docs_json?: Record<string, any>;
  notes?: string;
  agency_id?: number;
  client_id?: number;
  created_at?: string;
  visa_ref?: VisaRef;
}

export interface W8Form {
  id: number;
  applicant_name: string;
  tax_id: string;
  country_citizenship: string;
  status: string;
  pdf_url?: string;
  created_at?: string;
}

export interface LexvaultTemplate {
  id: number;
  agency_id?: number;
  title: string;
  category?: string;
  description?: string;
  html_content?: string;
  template_body?: string;
  tokens_json?: string[];
  fields_json?: Record<string, string>;
  is_active?: boolean;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LexvaultDocument {
  id: number;
  agency_id?: number;
  template_id?: number;
  template?: LexvaultTemplate;
  client_id?: number;
  client?: Client;
  document_number?: string;
  title: string;
  rendered_html?: string;
  filled_content?: string;
  content?: string;
  field_values_json?: Record<string, any>;
  fields_json?: Record<string, any>;
  replacements?: Record<string, any>;
  pdf_path?: string;
  pdf_url?: string;
  p12_certificate_path?: string | null;
  p12_info_json?: Record<string, any> | null;
  signature_type?: 'canvas' | 'image' | 'p12' | string;
  status: 'draft' | 'signed' | 'declined' | string;
  signed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SpinReward {
  id: number;
  title: string;
  probability: number;
  description?: string;
}

export interface SpinWheel {
  id: number;
  title: string;
  is_active: boolean;
  rewards: SpinReward[];
}

export interface SpinResult {
  reward: SpinReward;
  message: string;
}

export interface TravelReport {
  id: number;
  seller_name: string;
  destination: string;
  sale_amount: number;
  commission_amount: number;
  status: string;
  created_at?: string;
}

export interface GoogleCalendarSetting {
  id?: number;
  client_id: string;
  client_secret?: string;
  api_key?: string;
  redirect_uri?: string;
  calendar_id?: string;
  is_connected: boolean;
  has_secret?: boolean;
  updated_at?: string;
}

export interface CalendarEvent {
  id: number;
  google_event_id?: string;
  title: string;
  description?: string;
  location?: string;
  start_datetime: string;
  end_datetime: string;
  attendees_json?: string[];
  event_url?: string;
  status?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  user?: User;
  token?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface Shortcut {
  id: number;
  white_label_id: number;
  nombre: string;
  tipo: 'modulo' | 'enlace_externo';
  destino: string;
  icono: string;
  orden: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShortcutModuleDefinition {
  key: string;
  name: string;
  path: string;
  permission?: string | null;
  category?: string;
}

export * from './landing';
