export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
}