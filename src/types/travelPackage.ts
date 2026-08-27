export interface AgentPackage {
  id: number;
  title: string;
  description?: string | null;
  main_image?: string | null;
  destination: string;
  duration: string;
  available_dates_start?: string | null;
  available_dates_end?: string | null;
  final_price: number;
  status: 'active' | 'inactive';
}

export interface SupplierPackage {
  id: number;
  title: string;
  description?: string | null;
  main_image?: string | null;
  destination: string;
  duration: string;
  available_dates_start?: string | null;
  available_dates_end?: string | null;
  supplier_price: number;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface AdminPackage {
  id: number;
  supplier_id: number;
  supplier?: {
    id: number;
    name: string;
    email: string;
  };
  title: string;
  description?: string | null;
  main_image?: string | null;
  destination: string;
  duration: string;
  available_dates_start?: string | null;
  available_dates_end?: string | null;
  supplier_price: number;
  additional_price: number;
  final_price: number;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface TravelPackageCartItem {
  package: AgentPackage;
  travelers_count: number;
  travel_date_start?: string;
  travel_date_end?: string;
}

export interface AgentTravelRequestItem {
  id: number;
  travel_package_id: number;
  package_title: string;
  destination: string;
  duration: string;
  travelers_count: number;
  travel_date_start?: string | null;
  travel_date_end?: string | null;
  final_price_snapshot: number;
  subtotal_final_snapshot: number;
}

export interface AgentTravelRequest {
  id: number;
  request_number: string;
  status: 'draft' | 'pending_super_admin' | 'payment_received' | 'pending_supplier' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  total_final_amount: number;
  agent_payment_proof?: string | null;
  created_at: string;
  items: AgentTravelRequestItem[];
  histories?: any[];
}

export interface SupplierTravelRequestItem {
  id: number;
  travel_package_id: number;
  package_title: string;
  destination: string;
  duration: string;
  travelers_count: number;
  travel_date_start?: string | null;
  travel_date_end?: string | null;
  supplier_price_snapshot: number;
  subtotal_supplier_snapshot: number;
}

export interface SupplierTravelRequest {
  id: number;
  request_number: string;
  status: 'draft' | 'pending_super_admin' | 'payment_received' | 'pending_supplier' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  supplier_total_amount: number;
  supplier_payment_proof?: string | null;
  rejection_reason?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  created_at: string;
  items: SupplierTravelRequestItem[];
  histories?: any[];
}

export interface AdminTravelRequestItem {
  id: number;
  travel_package_id: number;
  package_title: string;
  destination: string;
  duration: string;
  supplier?: {
    id: number;
    name: string;
    email: string;
  };
  travelers_count: number;
  travel_date_start?: string | null;
  travel_date_end?: string | null;
  supplier_price_snapshot: number;
  additional_price_snapshot: number;
  final_price_snapshot: number;
  subtotal_supplier_snapshot: number;
  subtotal_final_snapshot: number;
}

export interface AdminTravelRequest {
  id: number;
  request_number: string;
  status: 'draft' | 'pending_super_admin' | 'payment_received' | 'pending_supplier' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  agent?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  agency?: {
    id: number;
    name: string;
  };
  total_supplier_amount: number;
  total_additional_amount: number;
  total_final_amount: number;
  agent_payment_proof?: string | null;
  supplier_payment_proof?: string | null;
  rejection_reason?: string | null;
  approved_at?: string | null;
  approved_by?: { id: number; name: string } | null;
  rejected_at?: string | null;
  rejected_by?: { id: number; name: string } | null;
  created_at: string;
  items: AdminTravelRequestItem[];
  files?: any[];
  histories?: any[];
}
