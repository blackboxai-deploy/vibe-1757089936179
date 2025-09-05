'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterData, ArtistProfile, CustomerProfile } from '@/types';
import db from './database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await db.findUserByEmail(email);
      
      // Simple password validation (in a real app, use proper hashing)
      if (foundUser && password.length >= 6) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        return false;
      }

      // Create default profile based on role
      let profile: ArtistProfile | CustomerProfile;
      
      if (userData.role === 'artist') {
        profile = {
          bio: '',
          specialties: [],
          experience: '',
          location: '',
          socialMedia: {},
          commissionSettings: {
            isAccepting: false,
            priceRange: { min: 100, max: 500 },
            turnaroundTime: '2-3 weeks',
            styles: []
          },
          portfolio: []
        } as ArtistProfile;
      } else {
        profile = {
          favoriteStyles: [],
          purchaseHistory: [],
          wishlist: []
        } as CustomerProfile;
      }

      const newUser = await db.createUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        profile
      });

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

// Hook for protected routes
export function useRequireAuth(redirectTo = '/login') {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      window.location.href = redirectTo;
    }
  }, [auth.isLoading, auth.user, redirectTo]);

  return auth;
}

// Password utilities for demo purposes
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}