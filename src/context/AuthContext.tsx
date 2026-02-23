import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginCredentials, SignupCredentials } from '../services/auth.service';

interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.checkAuth();
      setIsAuthenticated(authenticated);
      // Здесь можно получить данные пользователя с отдельного эндпоинта
      if (authenticated) {
        // Например: const userData = await authService.getCurrentUser();
        // setUser(userData);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      // Если в ответе приходят данные пользователя:
      // setUser(response.user);
      navigate('/home');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await authService.signup(credentials);
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      signup,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};