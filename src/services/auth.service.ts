import { apiService, ApiError } from './api.service';
import { API_CONFIG } from '../config/api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  message?: string;
  user?: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      return await apiService.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.SIGNUP,
        credentials
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Signup failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.get(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      await apiService.get(API_CONFIG.ENDPOINTS.REFRESH);
      return true;
    } catch {
      return false;
    }
  }

  // Новый метод для получения текущего пользователя
  async getCurrentUser(): Promise<User | null> {
    try {
      // Предположим, что есть эндпоинт /me для получения данных пользователя
      const response = await apiService.get<{ user: User }>('/me');
      return response.user;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();