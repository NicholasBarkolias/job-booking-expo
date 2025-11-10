import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authClient } from '@/lib/auth';
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
    const initializeAuth = async () => {
      try {
        // Initialize PowerSync
        const db = await getPowerSyncDatabase();
        const service = new PowerSyncDataService(db);
        setDataService(service);
        
        // Check BetterAuth session
        const session = await authClient.getSession();
        if (session.data?.user) {
          // Find user in PowerSync by email
          const powerSyncUser = await service.getUserByEmail(session.data.user.email);
          setUser(powerSyncUser);
        }
        
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
      // Sign in with BetterAuth
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      // Find user in PowerSync
      if (!dataService) {
        throw new Error('Data service not initialized');
      }
      
      const powerSyncUser = await dataService.getUserByEmail(email);
      if (!powerSyncUser) {
        throw new Error('User not found in local database');
      }
      
      console.log('AuthContext: login successful, user:', powerSyncUser);
      setUser(powerSyncUser);
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
      // Sign out with BetterAuth
      await authClient.signOut();
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