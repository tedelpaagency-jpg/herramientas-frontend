import apiClient from './apiClient';

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'rescheduled' | 'completed' | 'cancelled';
export type AppointmentModality = 'in_person' | 'virtual' | 'property_visit';

export interface AppointmentUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  photo?: string | null;
  role?: string | null;
}

export interface AppointmentEstate {
  id: number;
  title: string;
  price?: number | null;
  slug?: string | null;
  currency?: string | null;
  address?: string | null;
  main_image?: string | null;
}

export interface AgencyAppointment {
  id: number;
  agency_id: number;
  user_id: number;
  admin_id: number;
  estate_id?: number | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  title?: string | null;
  notes?: string | null;
  modality: AppointmentModality;
  location?: string | null;
  status: AppointmentStatus;
  rejection_reason?: string | null;
  rescheduled_from_id?: number | null;
  reminder_sent_at?: string | null;
  created_at: string;
  updated_at: string;
  user?: AppointmentUser;
  admin?: AppointmentUser;
  estate?: AppointmentEstate;
}

export interface AppointmentSlot {
  time: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface AppointmentKPIs {
  efficiency: number;
  today_count: number;
  pending_count: number;
  current_date: string;
}

export interface AppointmentNotification {
  id: number;
  agency_id: number;
  appointment_id: number;
  user_id: number;
  type: 'created' | 'confirmed' | 'rejected' | 'rescheduled' | 'reminder';
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  appointment?: AgencyAppointment;
}

export interface WeeklyScheduleDay {
  day_of_week: number;
  is_active: boolean;
  start_time: string;
  end_time: string;
  break_start?: string | null;
  break_end?: string | null;
  slot_duration_minutes?: number;
}

export const appointmentService = {
  getAppointments: async (params?: {
    agency_id?: number;
    date?: string;
    start_date?: string;
    end_date?: string;
    month?: number;
    year?: number;
    status?: string;
    admin_id?: number;
    user_id?: number;
  }): Promise<{ data: AgencyAppointment[]; kpis: AppointmentKPIs }> => {
    const res = await apiClient.get('/v1/appointments', { params });
    return {
      data: res.data.data,
      kpis: res.data.kpis
    };
  },

  getAdmins: async (agencyId?: number, q?: string): Promise<AppointmentUser[]> => {
    const params: Record<string, any> = {};
    if (agencyId) params.agency_id = agencyId;
    if (q) params.q = q;
    const res = await apiClient.get('/v1/appointments/admins', { params });
    return res.data.data;
  },

  getAvailableSlots: async (adminId: number, date: string, agencyId?: number): Promise<{
    available: boolean;
    slots: AppointmentSlot[];
    message?: string;
  }> => {
    const params: Record<string, any> = { admin_id: adminId, date };
    if (agencyId) params.agency_id = agencyId;
    const res = await apiClient.get('/v1/appointments/available-slots', { params });
    return res.data;
  },

  createAppointment: async (payload: {
    admin_id: number;
    appointment_date: string;
    start_time: string;
    end_time?: string;
    notes: string;
    modality?: AppointmentModality;
    estate_id?: number;
    title?: string;
    location?: string;
    agency_id?: number;
  }): Promise<AgencyAppointment> => {
    const res = await apiClient.post('/v1/appointments', payload);
    return res.data.data;
  },

  updateStatus: async (
    id: number,
    status: 'confirmed' | 'rejected' | 'completed' | 'cancelled',
    rejectionReason?: string,
    agencyId?: number
  ): Promise<AgencyAppointment> => {
    const res = await apiClient.post(`/v1/appointments/${id}/status`, {
      status,
      rejection_reason: rejectionReason,
      agency_id: agencyId
    });
    return res.data.data;
  },

  reschedule: async (
    id: number,
    payload: {
      appointment_date: string;
      start_time: string;
      end_time?: string;
      notes?: string;
      agency_id?: number;
    }
  ): Promise<AgencyAppointment> => {
    const res = await apiClient.post(`/v1/appointments/${id}/reschedule`, payload);
    return res.data.data;
  },

  sendReminder: async (id: number, agencyId?: number): Promise<void> => {
    await apiClient.post(`/v1/appointments/${id}/reminder`, { agency_id: agencyId });
  },

  getNotifications: async (agencyId?: number): Promise<{
    data: AppointmentNotification[];
    unread_count: number;
  }> => {
    const params: Record<string, any> = {};
    if (agencyId) params.agency_id = agencyId;
    const res = await apiClient.get('/v1/appointments/notifications', { params });
    return res.data;
  },

  markNotificationAsRead: async (id: number): Promise<void> => {
    await apiClient.post(`/v1/appointments/notifications/${id}/read`);
  },

  getAdminSchedule: async (adminId: number, agencyId?: number): Promise<WeeklyScheduleDay[]> => {
    const params: Record<string, any> = {};
    if (agencyId) params.agency_id = agencyId;
    const res = await apiClient.get(`/v1/appointments/schedules/${adminId}`, { params });
    return res.data.data;
  },

  saveAdminSchedule: async (adminId: number, days: WeeklyScheduleDay[], agencyId?: number): Promise<void> => {
    await apiClient.post(`/v1/appointments/schedules/${adminId}`, {
      days,
      agency_id: agencyId
    });
  }
};
