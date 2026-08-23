import apiClient from './apiClient';
import { GoogleCalendarSetting, CalendarEvent } from '../types';

export const googleCalendarService = {
  getSettings: async (): Promise<GoogleCalendarSetting> => {
    const response = await apiClient.get('/v1/google-calendar/settings');
    return response.data?.data || response.data;
  },

  saveSettings: async (data: Partial<GoogleCalendarSetting>): Promise<GoogleCalendarSetting> => {
    const response = await apiClient.post('/v1/google-calendar/settings', data);
    return response.data?.data || response.data;
  },

  getAuthUrl: async (): Promise<string> => {
    const response = await apiClient.get('/v1/google-calendar/auth-url');
    return response.data?.auth_url;
  },

  exchangeCode: async (code: string): Promise<any> => {
    const response = await apiClient.post('/v1/google-calendar/exchange-code', { code });
    return response.data;
  },

  disconnect: async (): Promise<void> => {
    await apiClient.post('/v1/google-calendar/disconnect');
  },

  getEvents: async (params?: Record<string, any>): Promise<CalendarEvent[]> => {
    const response = await apiClient.get('/v1/google-calendar/events', { params });
    return Array.isArray(response.data) ? response.data : (response.data?.data || []);
  },

  createEvent: async (data: {
    title: string;
    description?: string;
    location?: string;
    start_datetime: string;
    end_datetime: string;
    attendees?: string[];
  }): Promise<CalendarEvent> => {
    const response = await apiClient.post('/v1/google-calendar/events', data);
    return response.data?.data || response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/google-calendar/events/${id}`);
  },
};

export default googleCalendarService;
