import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/refresh', {
        credentials: 'include' // Important for cookies
      });

      console.log('Response from refresh:', await response.json());

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const login = () => {
    setIsAuthenticated(true);
    navigate('/home');
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/api/logout', {
        method: 'GET',
        credentials: 'include' // Important for cookies
      });
    } finally {
      setIsAuthenticated(false);
      navigate('');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("Auth context: ", context)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};