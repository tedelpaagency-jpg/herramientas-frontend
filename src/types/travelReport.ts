export interface TravelReportPassenger {
  id?: number;
  travel_report_id?: number;
  client_id?: number | null;
  ruc?: string;
  type?: string;
  name: string;
  last_name?: string;
  created_at?: string;
}

export interface TravelReport {
  id: number;
  code: string;
  name: string;
  product_type?: string | null;
  travel_date?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  agency_id?: number | null;
  user_id: number;
  seller_code?: string | null;
  team_id?: number | null;
  status: number; // 0=pendiente, 1=autorizado, 2=rechazado, 3=eliminado, 4=preautorizado
  total_client?: number | null;
  total_supplier?: number | null;
  total_commissionable?: number | null;
  total_additional?: number | null;
  total_fee?: number | null;
  mgt?: number | null;
  gnt?: number | null;
  taxes?: number | null;
  fact_value?: number | null;
  commition_percent?: number | null;
  commition_percent_gerente?: number | null;
  commition_percent_director?: number | null;
  commition_percent_empresa?: number | null;
  excel?: string | null;
  pay_document?: string | null;
  pay_document_2?: string | null;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
    seller_code?: string;
  };
  agency?: {
    id: number;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  };
  passengers?: TravelReportPassenger[];
}

export interface AgencyTeam {
  id: number;
  agency_id: number;
  name: string;
  description?: string | null;
  leader_id?: number | null;
  admin_id?: number | null;
  commition_percent?: number;
  gerent_commition_percent?: number;
  director_commition_percent?: number;
  empresa_commition_percent?: number;
  status: number;
  members_count?: number;
  leader?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  admin?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  members?: Array<{
    id: number;
    name: string;
    email: string;
    role?: string;
    seller_code?: string;
    team_id?: number;
  }>;
  agency?: {
    id: number;
    name: string;
  };
}

export interface Commission {
  id: number;
  agency_id?: number | null;
  user_id: number;
  travel_report_id?: number | null;
  amount: number;
  type: number; // 1=ingreso, 0=retiro
  status: number; // 0=pendiente, 1=aprobado, 2=rechazado
  date: string;
  description?: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  agency?: {
    id: number;
    name: string;
  };
  travel_report?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface CommissionBalance {
  income: number;
  withdrawals: number;
  current_balance: number;
}
