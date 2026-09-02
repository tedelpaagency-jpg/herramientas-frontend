import apiClient from './apiClient';

export interface Reward {
  id: number;
  agency_id?: number;
  name: string;
  title?: string;
  description?: string;
  image?: string;
  points_cost: number;
  stock: number;
  status: number;
}

export interface RouletteReward {
  id: number;
  roulette_id: number;
  reward_id: number;
  probability: number; // 0.0000 to 1.0000
  probability_percent?: number;
  color?: string;
  reward?: Reward;
}

export interface Roulette {
  id: number;
  agency_id?: number;
  name: string;
  title?: string;
  description?: string;
  status: number;
  is_active: boolean;
  rewards?: RouletteReward[];
}

export interface AgencyRouletteGift {
  id: number;
  agency_id: number;
  user_id?: number;
  roulette_id: number;
  reward_id?: number;
  status: number; // 1: Pendiente, 2: Canjeado
  winner_at?: string;
  assigned_at?: string;
  created_at?: string;
  agency?: any;
  user?: any;
  roulette?: Roulette;
  reward?: Reward;
}

export interface UserPointsData {
  balance: number;
  total_earned: number;
  total_spent: number;
  history: Array<{
    id: number;
    user_id: number;
    points: number;
    type: 'earn' | 'spend';
    reason: string;
    created_at: string;
  }>;
}

export const gamificationService = {
  getRoulettes: async (params?: { active_only?: boolean }) => {
    const res = await apiClient.get('/v1/gamification/roulettes', { params });
    return res.data?.data || res.data;
  },

  createRoulette: async (data: { title: string; description?: string }) => {
    const res = await apiClient.post('/v1/gamification/roulettes', data);
    return res.data;
  },

  updateRoulette: async (id: number, data: { title: string; description?: string; status?: number }) => {
    const res = await apiClient.put(`/v1/gamification/roulettes/${id}`, data);
    return res.data;
  },

  deleteRoulette: async (id: number) => {
    const res = await apiClient.delete(`/v1/gamification/roulettes/${id}`);
    return res.data;
  },

  saveRouletteRewards: async (id: number, rewards: Array<{ reward_id: number; probability: number; color?: string }>) => {
    const res = await apiClient.post(`/v1/gamification/roulettes/${id}/rewards`, { rewards });
    return res.data;
  },

  spinRoulette: async (id: number) => {
    const res = await apiClient.post(`/v1/gamification/roulettes/${id}/spin`);
    return res.data;
  },

  getRewards: async () => {
    const res = await apiClient.get('/v1/gamification/rewards');
    return res.data?.data || res.data;
  },

  createReward: async (data: { name: string; description?: string; points_cost?: number; stock?: number; image?: string }) => {
    const res = await apiClient.post('/v1/gamification/rewards', data);
    return res.data;
  },

  updateReward: async (id: number, data: { name: string; description?: string; points_cost?: number; stock?: number; image?: string }) => {
    const res = await apiClient.put(`/v1/gamification/rewards/${id}`, data);
    return res.data;
  },

  redeemWithPoints: async (rewardId: number) => {
    const res = await apiClient.post(`/v1/gamification/rewards/${rewardId}/redeem`);
    return res.data;
  },

  getGifts: async () => {
    const res = await apiClient.get('/v1/gamification/gifts');
    return res.data?.data || res.data;
  },

  updateGiftStatus: async (giftId: number, status: number) => {
    const res = await apiClient.put(`/v1/gamification/gifts/${giftId}/status`, { status });
    return res.data;
  },

  getUserPoints: async () => {
    const res = await apiClient.get('/v1/gamification/points');
    return res.data?.data || res.data;
  },
};

export default gamificationService;
