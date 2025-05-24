"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getFromStorage, 
  saveToStorage, 
  appendToStorageArray,
  initMockData,
  STORAGE_KEYS,
  User,
  CurrentUser 
} from '@/lib/storage';

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario actual al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      // Inicializar datos mock (incluye usuarios demo)
      await initMockData();
      
      // Cargar usuario actual
      const user = getFromStorage<CurrentUser>(STORAGE_KEYS.CURRENT_USER);
      if (user) {
        setCurrentUser(user);
        // Restaurar cookie si existe el usuario
        document.cookie = `buyloop_session=${user.token}; path=/; max-age=86400`;
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Obtener usuarios registrados
      const users = getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
      
      // Buscar usuario por email y password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Crear sesión simulada
        const currentUser: CurrentUser = {
          email: user.email,
          name: user.name,
          token: `dummy_token_${Date.now()}`
        };
        
        // Guardar en localStorage y estado
        saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
        setCurrentUser(currentUser);
        
        // Crear cookie para el middleware
        document.cookie = `buyloop_session=${currentUser.token}; path=/; max-age=86400`; // 24 horas
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Verificar si el usuario ya existe
      const users = getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return false; // Usuario ya existe
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        name,
        email,
        password
      };
      
      // Guardar usuario en la lista
      appendToStorageArray(STORAGE_KEYS.USERS, newUser);
      
      // Hacer login automático después del registro
      const currentUser: CurrentUser = {
        email: newUser.email,
        name: newUser.name,
        token: `dummy_token_${Date.now()}`
      };
      
      saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
      setCurrentUser(currentUser);
      
      // Crear cookie para el middleware
      document.cookie = `buyloop_session=${currentUser.token}; path=/; max-age=86400`; // 24 horas
      
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };

  const logout = () => {
    // Limpiar sesión
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
    setCurrentUser(null);
    
    // Limpiar cookie
    document.cookie = 'buyloop_session=; path=/; max-age=0';
  };

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: currentUser !== null,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
