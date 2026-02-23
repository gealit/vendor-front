import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface MainPageData {
  id: number;
  name: string;
  cost: number;
  // Добавьте другие поля
}

class MainService {
  async getMainData(): Promise<MainPageData[]> {
    return apiService.get<MainPageData[]>(API_CONFIG.ENDPOINTS.MAIN);
  }
}

export const mainService = new MainService();