import { Agency } from './index';

export interface HunterRequest {
  id: number;
  hunter_store_id: number;
  client_name: string;
  email?: string;
  phone?: string;
  service_name?: string;
  status: number; // 1: Pendiente, 2: Aprobada, 0: Rechazada
  commission_percentage: number;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface HunterStore {
  id: number;
  agency_id: number;
  user_id?: number;
  name: string;
  ruc_dni?: string;
  username?: string;
  email?: string;
  phone?: string;
  country?: string;
  province?: string;
  canton?: string;
  address?: string;
  photo?: string;
  qr_code_url?: string;
  campaign_token: string;
  status: 'active' | 'suspended';
  agency?: Agency;
  requests?: HunterRequest[];
  created_at: string;
  updated_at: string;
}

export interface HunterStats {
  total_requests: number;
  approved_requests: number;
  pending_requests: number;
  rejected_requests: number;
  average_commission: number;
  estimated_visitors: number;
}

export interface HunterProfileData {
  store: HunterStore;
  stats: HunterStats;
  requests: HunterRequest[];
}
