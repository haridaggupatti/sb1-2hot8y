import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { toast } from 'react-hot-toast';

interface User {
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  expiresAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await authApi.login(email, password);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}