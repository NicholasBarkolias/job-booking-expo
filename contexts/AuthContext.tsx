import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getPowerSyncDatabase } from '@/lib/powersync';
import { PowerSyncDataService } from '@/lib/powersync-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataService, setDataService] = useState<PowerSyncDataService | null>(null);

  useEffect(() => {
    // Initialize PowerSync and check for existing session
    const initializeAuth = async () => {
      try {
        const db = await getPowerSyncDatabase();
        const service = new PowerSyncDataService(db);
        setDataService(service);
        
        // In a real app, this would check for stored tokens and validate session
        // For now, we'll just set loading to false
        setIsLoading(false);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: login called with', email);
    setIsLoading(true);
    try {
      if (!dataService) {
        throw new Error('Data service not initialized');
      }
      
      // Find user by email (in real app, would verify password too)
      const user = await dataService.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      console.log('AuthContext: login successful, user:', user);
      setUser(user);
    } catch (error) {
      console.error('AuthContext: login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // In a real app, would clear tokens and session
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}