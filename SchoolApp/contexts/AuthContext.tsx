import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, AuthResponse, LoginRequest, SignupRequest } from '../services/api';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  signup: (userData: SignupRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  handleTokenExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = apiService.getToken();
        if (savedToken) {
          setToken(savedToken);
          // You might want to validate the token here by making a request to get user info
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user || null);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      // If token expired during login request, clear local state
      if (error instanceof Error && error.message === 'Token expired') {
        setToken(null);
        setUser(null);
      }
      throw error;
    }
  };

  const signup = async (userData: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.signup(userData);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTokenExpired = () => {
    console.log('Handling token expiration');
    setToken(null);
    setUser(null);
    apiService.logout();
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
    handleTokenExpired,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
