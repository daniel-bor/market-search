"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getFromStorage, 
  saveToStorage,
  STORAGE_KEYS,
  Business,
  Message 
} from '@/lib/storage';

interface DataContextType {
  businesses: Business[];
  filteredBusinesses: Business[];
  selectedBusiness: Business | null;
  loading: boolean;
  filters: {
    category: string;
    distance: number;
    searchText: string;
  };
  setFilters: (filters: { category?: string; distance?: number; searchText?: string }) => void;
  filterBusinesses: (businessList: Business[]) => Business[];
  clearFilters: () => void;
  getAvailableCategories: () => string[];
  selectBusiness: (id: string) => void;
  getBusinessById: (id: string) => Business | undefined;
  addVisit: (businessId: string) => void;
  getVisits: (businessId: string) => number;
  sendMessage: (businessId: string, message: string) => void;
  getMessages: (businessId: string) => Message[];
  initMockData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState({
    category: '',
    distance: 50, // km
    searchText: ''
  });

  // Función para cargar datos mock
  const initMockData = React.useCallback(async () => {
    try {
      // Verificar si ya hay datos en localStorage
      const existingBusinesses = getFromStorage<Business[]>(STORAGE_KEYS.BUSINESSES);
      
      if (existingBusinesses && existingBusinesses.length > 0) {
        setBusinesses(existingBusinesses);
        setFilteredBusinesses(existingBusinesses);
        setLoading(false);
        return;
      }

      // Cargar datos desde el archivo JSON mock
      const response = await fetch('/assets/mock-businesses.json');
      const mockBusinesses: Business[] = await response.json();
      
      // Guardar en localStorage
      saveToStorage(STORAGE_KEYS.BUSINESSES, mockBusinesses);
      
      // Inicializar contadores de visitas y mensajes si no existen
      if (!getFromStorage(STORAGE_KEYS.VISITS)) {
        saveToStorage(STORAGE_KEYS.VISITS, {});
      }
      if (!getFromStorage(STORAGE_KEYS.MESSAGES)) {
        saveToStorage(STORAGE_KEYS.MESSAGES, {});
      }
      
      setBusinesses(mockBusinesses);
      setFilteredBusinesses(mockBusinesses);
    } catch (error) {
      console.error('Error loading mock data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para calcular distancia entre dos puntos (fórmula haversine simplificada)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  };

  // Función principal de filtrado
  const filterBusinesses = React.useCallback((businessList: Business[]) => {
    let filtered = [...businessList];

    // Filtro por categoría
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(business => 
        business.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Filtro por texto de búsqueda
    if (filters.searchText && filters.searchText.trim() !== '') {
      const searchLower = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchLower) ||
        business.description.toLowerCase().includes(searchLower) ||
        business.category.toLowerCase().includes(searchLower) ||
        business.address.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por distancia (usando coordenadas simuladas)
    // Ubicación central de referencia (puede ser la ubicación del usuario)
    const userLocation = [4.7110, -74.0721]; // Bogotá centro como referencia
    
    if (filters.distance > 0) {
      filtered = filtered.filter(business => {
        const distance = calculateDistance(
          userLocation[0], userLocation[1], 
          business.coords[0], business.coords[1]
        );
        return distance <= filters.distance;
      });
    }

    return filtered;
  }, [filters]);

  // Aplicar filtros cuando cambien los negocios o los filtros
  useEffect(() => {
    const filtered = filterBusinesses(businesses);
    setFilteredBusinesses(filtered);
  }, [businesses, filterBusinesses]);

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFiltersState({
      category: '',
      distance: 50,
      searchText: ''
    });
  };

  // Obtener categorías disponibles de los negocios
  const getAvailableCategories = (): string[] => {
    const categories = businesses.map(business => business.category);
    return [...new Set(categories)].sort();
  };

  // Establecer filtros y aplicarlos
  const setFilters = (newFilters: { category?: string; distance?: number; searchText?: string }) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Seleccionar un negocio por ID
  const selectBusiness = (id: string) => {
    const business = businesses.find(b => b.id === id);
    setSelectedBusiness(business || null);
    
    // Añadir visita
    if (business) {
      addVisit(id);
    }
  };

  // Obtener negocio por ID
  const getBusinessById = (id: string): Business | undefined => {
    return businesses.find(b => b.id === id);
  };

  // Añadir visita a un negocio
  const addVisit = (businessId: string) => {
    const visits = getFromStorage<Record<string, number>>(STORAGE_KEYS.VISITS) || {};
    visits[businessId] = (visits[businessId] || 0) + 1;
    saveToStorage(STORAGE_KEYS.VISITS, visits);
  };

  // Obtener número de visitas de un negocio
  const getVisits = (businessId: string): number => {
    const visits = getFromStorage<Record<string, number>>(STORAGE_KEYS.VISITS) || {};
    return visits[businessId] || 0;
  };

  // Enviar mensaje a un negocio
  const sendMessage = (businessId: string, messageText: string) => {
    const allMessages = getFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
    const businessMessages = allMessages[businessId] || [];
    
    const newMessage: Message = {
      from: 'user',
      text: messageText,
      timestamp: Date.now()
    };
    
    businessMessages.push(newMessage);
    allMessages[businessId] = businessMessages;
    
    saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);
  };

  // Obtener mensajes de un negocio
  const getMessages = (businessId: string): Message[] => {
    const allMessages = getFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
    return allMessages[businessId] || [];
  };

  // Efectos
  useEffect(() => {
    initMockData();
  }, [initMockData]);

  const value: DataContextType = {
    businesses,
    filteredBusinesses,
    selectedBusiness,
    loading,
    filters,
    setFilters,
    filterBusinesses,
    clearFilters,
    getAvailableCategories,
    selectBusiness,
    getBusinessById,
    addVisit,
    getVisits,
    sendMessage,
    getMessages,
    initMockData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
