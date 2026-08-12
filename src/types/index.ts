export interface PlanPermission {
  id: number;
  plan_id: number;
  permission: string;
  created_at?: string;
}

export interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  features?: string[];
  allowed_agency_types?: string[];
  status?: boolean;
  plan_permissions?: PlanPermission[];
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  agency_id: number;
  agency?: Agency;
  plan_id: number;
  plan?: Plan;
  started_at: string;
  expires_at?: string | null;
  status?: string;
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
  plan_id?: number;
  plan?: Plan;
  gerente_id?: number;
  gerente_comercial?: User;
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
  roles?: Role[];
  permissions?: Permission[];
  phone?: string;
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
  images?: EstateImage[] | string[];
  attributes_json?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name?: string;
  phone?: string;
  identification_number?: string;
  document_number?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string;
  agency_id?: number;
  created_at?: string;
}

export interface WorkspaceStage {
  id: number;
  name: string;
  order: number;
  color?: string;
}

export interface CrmPipelineItem {
  id: number;
  title: string;
  client_id?: number;
  client?: Client;
  stage_id: number;
  stage?: WorkspaceStage;
  deal_value: number;
  currency?: string;
  expected_close_date?: string;
  created_at?: string;
}

export interface PipelineActivity {
  id: number;
  client_id: number;
  activity_type: string;
  note: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  category_id?: number;
  is_active: boolean;
  images?: string[];
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

export interface Visa {
  id: number;
  applicant_name: string;
  passport_number: string;
  country_destination: string;
  visa_type: string;
  status: 'pending' | 'in_process' | 'approved' | 'rejected' | string;
  agency_id?: number;
  created_at?: string;
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
  field_values_json?: Record<string, any>;
  pdf_path?: string;
  pdf_url?: string;
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

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  user?: User;
  token?: string;
}
