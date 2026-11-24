import apiClient from './apiClient';
import {
  CurrentModuleTutorialData,
  ModuleTutorialsAdminData,
  ModuleCatalogItem,
  ModuleTutorial,
} from '../types';

export const moduleTutorialService = {
  /**
   * Obtiene el tutorial configurado para el módulo actual o ruta actual.
   * Si no se especifica module_key ni path, se resolverá según la ruta solicitada.
   */
  getCurrentTutorial: async (params?: { module_key?: string; path?: string }): Promise<CurrentModuleTutorialData> => {
    const res = await apiClient.get('/v1/module-tutorials/current', { params });
    return res.data?.data;
  },

  /**
   * Vista de administración: Obtiene todos los módulos con el estado de sus tutoriales
   * para la Marca Blanca del usuario (o la especificada si es SuperAdmin).
   */
  getAllTutorials: async (whiteLabelId?: number): Promise<ModuleTutorialsAdminData> => {
    const res = await apiClient.get('/v1/module-tutorials', {
      params: whiteLabelId ? { white_label_id: whiteLabelId } : undefined,
    });
    return res.data?.data;
  },

  /**
   * Obtiene el catálogo maestro de módulos de la plataforma.
   */
  getModulesCatalog: async (): Promise<ModuleCatalogItem[]> => {
    const res = await apiClient.get('/v1/module-tutorials/modules');
    return res.data?.data || [];
  },

  /**
   * Crea o actualiza el tutorial de un módulo para la Marca Blanca actual.
   */
  saveTutorial: async (data: {
    module_key: string;
    title?: string | null;
    description?: string | null;
    video_url?: string | null;
    manual_url?: string | null;
    manual_content?: string | null;
    is_active?: boolean;
    white_label_id?: number;
  }): Promise<ModuleTutorial> => {
    const res = await apiClient.post('/v1/module-tutorials', data);
    return res.data?.data;
  },

  /**
   * Elimina un tutorial.
   */
  deleteTutorial: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/module-tutorials/${id}`);
  },
};

export default moduleTutorialService;
