import apiClient from './apiClient';

export interface UserTaskStage {
  id: number;
  user_id: number;
  agency_id?: number | null;
  name: string;
  color: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserTask {
  id: number;
  user_id: number;
  created_by?: number | null;
  agency_id?: number | null;
  stage_id: number;
  title: string;
  description?: string | null;
  priority: number; // 1=Baja, 2=Media, 3=Alta
  due_date?: string | null;
  status: number; // 0=Pendiente, 1=Completada
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  stage?: UserTaskStage;
}

export interface TaskKanbanData {
  stages: UserTaskStage[];
  tasks: UserTask[];
  team_users: {
    id: number;
    name: string;
    email: string;
    role?: string;
  }[];
}

export const taskService = {
  getKanbanData: async (agencyId?: number): Promise<TaskKanbanData> => {
    const params = agencyId ? { agency_id: agencyId } : {};
    const res = await apiClient.get('/v1/tasks/kanban', { params });
    return res.data.data;
  },

  createStage: async (data: { name: string; color?: string }): Promise<UserTaskStage> => {
    const res = await apiClient.post('/v1/tasks/stages', data);
    return res.data.data;
  },

  updateStage: async (id: number, data: { name?: string; color?: string; sort_order?: number }): Promise<UserTaskStage> => {
    const res = await apiClient.put(`/v1/tasks/stages/${id}`, data);
    return res.data.data;
  },

  deleteStage: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/tasks/stages/${id}`);
  },

  reorderStages: async (stages: { id: number; sort_order: number }[]): Promise<void> => {
    await apiClient.post('/v1/tasks/stages/reorder', { stages });
  },

  createTask: async (data: {
    stage_id: number;
    title: string;
    description?: string;
    priority?: number;
    due_date?: string;
    assigned_user_id?: number;
  }): Promise<UserTask> => {
    const res = await apiClient.post('/v1/tasks', data);
    return res.data.data;
  },

  updateTask: async (id: number, data: Partial<UserTask> & { assigned_user_id?: number }): Promise<UserTask> => {
    const res = await apiClient.put(`/v1/tasks/${id}`, data);
    return res.data.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/tasks/${id}`);
  },

  moveTaskStage: async (taskId: number, stageId: number): Promise<UserTask> => {
    const res = await apiClient.post('/v1/tasks/move-stage', { task_id: taskId, stage_id: stageId });
    return res.data.data;
  },

  toggleTaskStatus: async (id: number): Promise<UserTask> => {
    const res = await apiClient.patch(`/v1/tasks/${id}/toggle`);
    return res.data.data;
  },
};
