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
  addBusiness: (business: Omit<Business, 'id'>) => Promise<void>;
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
    console.log('🔄 Iniciando carga de datos mock...');
    console.log('📍 Verificando si window está disponible:', typeof window !== 'undefined');
    
    if (typeof window === 'undefined') {
      console.log('❌ Window no está disponible (SSR)');
      setLoading(false);
      return;
    }
    
    try {
      // Verificar si ya hay datos en localStorage
      const existingBusinesses = getFromStorage<Business[]>(STORAGE_KEYS.BUSINESSES);
      console.log('📦 Negocios existentes en localStorage:', existingBusinesses?.length || 0);
      
      if (existingBusinesses && existingBusinesses.length > 0) {
        console.log('✅ Usando datos existentes del localStorage');
        setBusinesses(existingBusinesses);
        setLoading(false);
        return;
      }

      console.log('📥 Cargando datos desde archivo JSON...');
      // Cargar datos desde el archivo JSON mock
      const response = await fetch('/assets/mock-businesses.json');
      console.log('🌐 Respuesta del fetch:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const mockBusinesses: Business[] = await response.json();
      console.log('📄 Datos JSON parseados:', mockBusinesses.length, 'negocios');
      console.log('🔍 Primer negocio:', mockBusinesses[0]?.name);
      
      // Guardar en localStorage
      saveToStorage(STORAGE_KEYS.BUSINESSES, mockBusinesses);
      console.log('💾 Datos guardados en localStorage');
      
      // Inicializar contadores de visitas y mensajes si no existen
      if (!getFromStorage(STORAGE_KEYS.VISITS)) {
        saveToStorage(STORAGE_KEYS.VISITS, {});
      }
      if (!getFromStorage(STORAGE_KEYS.MESSAGES)) {
        saveToStorage(STORAGE_KEYS.MESSAGES, {});
      }
      
      setBusinesses(mockBusinesses);
      console.log('🎯 Estado businesses actualizado con', mockBusinesses.length, 'negocios');
    } catch (error) {
      console.error('❌ Error loading mock data:', error);
      console.error('📊 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      console.log('🏁 Finalizando carga de datos, loading = false');
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
    // Ubicación central de referencia (San Juan Sacatepéquez, Guatemala)
    const userLocation = [14.7174, -90.6413]; // San Juan Sacatepéquez centro como referencia
    
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

  // Añadir un nuevo negocio
  const addBusiness = async (businessData: Omit<Business, 'id'>): Promise<void> => {
    try {
      // Generar ID único
      const existingBusinesses = getFromStorage<Business[]>(STORAGE_KEYS.BUSINESSES) || [];
      console.log('Comercios existentes:', existingBusinesses.length);
      
      const maxId = existingBusinesses.reduce((max, business) => 
        Math.max(max, parseInt(business.id) || 0), 0
      );
      const newId = (maxId + 1).toString();

      const newBusiness: Business = {
        ...businessData,
        id: newId
      };

      console.log('Nuevo comercio a añadir:', newBusiness);

      // Añadir a la lista existente
      const updatedBusinesses = [...existingBusinesses, newBusiness];
      
      // Guardar en localStorage
      saveToStorage(STORAGE_KEYS.BUSINESSES, updatedBusinesses);
      console.log('Comercios guardados en localStorage:', updatedBusinesses.length);
      
      // Actualizar estado local
      setBusinesses(updatedBusinesses);
      console.log('Estado actualizado con', updatedBusinesses.length, 'comercios');
      
      // Limpiar filtros para mostrar todos los comercios incluyendo el nuevo
      setFiltersState({
        category: '',
        distance: 50,
        searchText: ''
      });
      
    } catch (error) {
      console.error('Error al añadir negocio:', error);
      throw error;
    }
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
    console.log('🚀 DataProvider montado, iniciando carga de datos...');
    initMockData();
  }, [initMockData]);

  // Log adicional cuando cambie el estado de businesses
  useEffect(() => {
    console.log('🔄 Estado businesses actualizado:', businesses.length, 'negocios');
    if (businesses.length > 0) {
      console.log('📋 Lista de negocios:', businesses.map(b => b.name));
    }
  }, [businesses]);

  // Log adicional cuando cambie el estado de loading
  useEffect(() => {
    console.log('⏳ Estado loading actualizado:', loading);
  }, [loading]);

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
    addBusiness,
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
