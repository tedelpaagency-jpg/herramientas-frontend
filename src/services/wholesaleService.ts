import apiClient from './apiClient';

export interface CatalogItem {
  id: number;
  title?: string;
  hotel_name?: string;
  room_type?: string;
  destination: string;
  description?: string;
  main_image?: string;
  broker_base_cost: number;
  itemable_type: string;
  max_guests?: number;
  allotment_capacity?: number;
  shift_time?: string;
  capacity?: number;
  vehicle_type?: string;
}

export interface CartItem {
  id: string; // temp unique client id
  itemable_type: string;
  itemable_id: number;
  title: string;
  destination: string;
  category: 'rentals' | 'hotels' | 'activities' | 'transfers';
  start_date: string;
  end_date: string;
  quantity: number;
  broker_base_cost: number;
  main_image?: string;
  status?: string;
  rejection_reason?: string;
  db_item_id?: number;
}

export interface BookingResponse {
  id: number;
  booking_number: string;
  destination: string;
  master_start_date: string;
  master_end_date: string;
  adults: number;
  children: number;
  status: string;
  base_cost: number;
  broker_markup: number;
  total_final_price: number;
  items: any[];
  histories?: any[];
}

export const wholesaleService = {
  // Catálogo
  async getCatalog(destination?: string, search?: string) {
    const res = await apiClient.get('/v1/catalog', { params: { destination, search } });
    return res.data;
  },

  async getRentals(destination?: string, search?: string) {
    const res = await apiClient.get('/v1/catalog/rentals', { params: { destination, search } });
    return res.data;
  },

  async getHotels(destination?: string, search?: string) {
    const res = await apiClient.get('/v1/catalog/hotels', { params: { destination, search } });
    return res.data;
  },

  async getActivities(destination?: string, search?: string) {
    const res = await apiClient.get('/v1/catalog/activities', { params: { destination, search } });
    return res.data;
  },

  async getTransfers(destination?: string, search?: string) {
    const res = await apiClient.get('/v1/catalog/transfers', { params: { destination, search } });
    return res.data;
  },

  // Draft & Booking FSM
  async createDraft(payload: {
    destination: string;
    master_start_date: string;
    master_end_date: string;
    passengers: { adults: number; children: number };
    broker_markup_type: 'fixed' | 'percentage';
    broker_markup_value: number;
    items: Array<{
      itemable_type: string;
      itemable_id: number;
      start_date: string;
      end_date: string;
      quantity: number;
    }>;
  }) {
    const res = await apiClient.post('/v1/bookings/draft', payload);
    return res.data;
  },

  async requestHold(bookingId: number) {
    const res = await apiClient.post(`/v1/bookings/${bookingId}/request-hold`);
    return res.data;
  },

  async payWithWallet(bookingId: number) {
    const res = await apiClient.post(`/v1/bookings/${bookingId}/pay`);
    return res.data;
  },

  async getBookingStatus(bookingId: number) {
    const res = await apiClient.get(`/v1/bookings/${bookingId}/status`);
    return res.data;
  },

  async replaceRejectedItem(itemId: number, payload: {
    new_itemable_type: string;
    new_itemable_id: number;
    start_date: string;
    end_date: string;
    quantity: number;
  }) {
    const res = await apiClient.post(`/v1/booking-items/${itemId}/replace`, payload);
    return res.data;
  },

  async downloadExpressPdf(bookingId: number) {
    const res = await apiClient.post(`/v1/bookings/${bookingId}/pdf`);
    return res.data;
  },

  async getBookings(status?: string) {
    const res = await apiClient.get('/v1/bookings', { params: { status } });
    return res.data;
  },

  async approveBookingItem(itemId: number) {
    const res = await apiClient.post(`/v1/booking-items/${itemId}/approve`);
    return res.data;
  },

  async rejectBookingItem(itemId: number, rejection_reason?: string) {
    const res = await apiClient.post(`/v1/booking-items/${itemId}/reject`, { rejection_reason });
    return res.data;
  },

  // Wallet
  async getWallet() {
    const res = await apiClient.get('/v1/wallet');
    return res.data;
  },

  async depositWallet(amount: number) {
    const res = await apiClient.post('/v1/wallet/deposit', { amount });
    return res.data;
  },

  // Magic Link (Público)
  async getMagicLinkData(token: string) {
    const res = await apiClient.get(`/v1/provider/approve/${token}`);
    return res.data;
  },

  async approveMagicLink(token: string) {
    const res = await apiClient.post(`/v1/provider/approve/${token}`);
    return res.data;
  },

  async rejectMagicLink(token: string, rejection_reason: string) {
    const res = await apiClient.post(`/v1/provider/reject/${token}`, { rejection_reason });
    return res.data;
  },

  // Admin Clearing & Rules
  async getPricingRules() {
    const res = await apiClient.get('/v1/admin/pricing-rules');
    return res.data;
  },

  async createPricingRule(rule: any) {
    const res = await apiClient.post('/v1/admin/pricing-rules', rule);
    return res.data;
  },

  async deletePricingRule(id: number) {
    const res = await apiClient.delete(`/v1/admin/pricing-rules/${id}`);
    return res.data;
  },

  async getClearingSummary() {
    const res = await apiClient.get('/v1/admin/clearing');
    return res.data;
  },

  async processClearing(provider_id: number, payment_reference: string, notes?: string) {
    const res = await apiClient.post('/v1/admin/clearing', { provider_id, payment_reference, notes });
    return res.data;
  },

  // Provider Inventory Creation
  async createRental(data: any) {
    const res = await apiClient.post('/v1/provider/inventory/rental', data);
    return res.data;
  },

  async createHotel(data: any) {
    const res = await apiClient.post('/v1/provider/inventory/hotel', data);
    return res.data;
  },

  async createTransfer(data: any) {
    const res = await apiClient.post('/v1/provider/inventory/transfer', data);
    return res.data;
  }
};
