// Tipos TypeScript para la estructura de datos en localStorage
export interface User {
  email: string;
  name: string;
  password?: string;
}

export interface CurrentUser {
  email: string;
  name: string;
  token: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  coords: [number, number]; // [lat, lng]
  images: string[];
  rating: number;
  hours: {
    [key: string]: string; // "monday": "9:00-18:00"
  };
  featured?: boolean;
}

export interface Message {
  from: 'user' | 'business';
  text: string;
  timestamp: number;
}

export interface StorageData {
  users: User[];
  currentUser: CurrentUser | null;
  businesses: Business[];
  visits: Record<string, number>; // businessId -> visit count
  messages: Record<string, Message[]>; // businessId -> messages
}

// Claves de localStorage
export const STORAGE_KEYS = {
  USERS: 'buyloop_users',
  CURRENT_USER: 'buyloop_currentUser',
  BUSINESSES: 'buyloop_businesses',
  VISITS: 'buyloop_visits',
  MESSAGES: 'buyloop_messages',
} as const;

/**
 * Obtiene un valor del localStorage y lo parsea como JSON
 * @param key - Clave del localStorage
 * @returns El valor parseado o null si no existe o hay error
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Guarda un valor en localStorage como JSON
 * @param key - Clave del localStorage
 * @param data - Datos a guardar
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

/**
 * Añade un elemento a un array existente en localStorage
 * @param key - Clave del localStorage
 * @param item - Elemento a añadir al array
 */
export function appendToStorageArray<T>(key: string, item: T): void {
  try {
    const existingArray = getFromStorage<T[]>(key) || [];
    existingArray.push(item);
    saveToStorage(key, existingArray);
  } catch (error) {
    console.error(`Error appending to localStorage array key "${key}":`, error);
  }
}

/**
 * Elimina un elemento de localStorage
 * @param key - Clave del localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

/**
 * Limpia todos los datos de la aplicación del localStorage
 */
export function clearAppStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeFromStorage(key);
    });
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
}

/**
 * Inicializa el localStorage con datos por defecto si no existen
 */
export function initializeStorage(): void {
  try {
    // Inicializar usuarios si no existen
    if (!getFromStorage(STORAGE_KEYS.USERS)) {
      saveToStorage(STORAGE_KEYS.USERS, []);
    }

    // Inicializar usuario actual si no existe
    if (!getFromStorage(STORAGE_KEYS.CURRENT_USER)) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
    }

    // Inicializar negocios si no existen (se llenará desde mock data)
    if (!getFromStorage(STORAGE_KEYS.BUSINESSES)) {
      saveToStorage(STORAGE_KEYS.BUSINESSES, []);
    }

    // Inicializar visitas si no existen
    if (!getFromStorage(STORAGE_KEYS.VISITS)) {
      saveToStorage(STORAGE_KEYS.VISITS, {});
    }

    // Inicializar mensajes si no existen
    if (!getFromStorage(STORAGE_KEYS.MESSAGES)) {
      saveToStorage(STORAGE_KEYS.MESSAGES, {});
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

/**
 * Incrementa el contador de visitas para un negocio
 * @param businessId - ID del negocio
 */
export function incrementBusinessVisit(businessId: string): void {
  const visits = getFromStorage<Record<string, number>>(STORAGE_KEYS.VISITS) || {};
  visits[businessId] = (visits[businessId] || 0) + 1;
  saveToStorage(STORAGE_KEYS.VISITS, visits);
}

/**
 * Añade un mensaje a la conversación de un negocio
 * @param businessId - ID del negocio
 * @param message - Mensaje a añadir
 */
export function addBusinessMessage(businessId: string, message: Message): void {
  const allMessages = getFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
  if (!allMessages[businessId]) {
    allMessages[businessId] = [];
  }
  allMessages[businessId].push(message);
  saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);
}

/**
 * Obtiene todos los mensajes de un negocio
 * @param businessId - ID del negocio
 * @returns Array de mensajes o array vacío
 */
export function getBusinessMessages(businessId: string): Message[] {
  const allMessages = getFromStorage<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
  return allMessages[businessId] || [];
}

/**
 * Obtiene las visitas de un negocio
 * @param businessId - ID del negocio
 * @returns Número de visitas
 */
export function getBusinessVisits(businessId: string): number {
  const visits = getFromStorage<Record<string, number>>(STORAGE_KEYS.VISITS) || {};
  return visits[businessId] || 0;
}

/**
 * Carga los datos mock iniciales si no existen en localStorage
 * Esta función debe llamarse al inicializar la aplicación
 */
export async function initMockData(): Promise<void> {
  try {
    // Primero inicializar el storage con estructuras básicas
    initializeStorage();
    
    // Verificar si ya existen negocios en localStorage
    const existingBusinesses = getFromStorage<Business[]>(STORAGE_KEYS.BUSINESSES);
    
    if (!existingBusinesses || existingBusinesses.length === 0) {
      // Cargar datos mock desde el archivo JSON
      try {
        const response = await fetch('/assets/mock-businesses.json');
        if (response.ok) {
          const mockBusinesses: Business[] = await response.json();
          saveToStorage(STORAGE_KEYS.BUSINESSES, mockBusinesses);
          console.log('Datos mock de negocios cargados exitosamente');
        } else {
          console.warn('No se pudo cargar el archivo mock-businesses.json');
        }
      } catch (fetchError) {
        console.warn('Error al cargar datos mock desde archivo:', fetchError);
        // Fallback: cargar algunos datos básicos hardcodeados
        const fallbackBusinesses: Business[] = [
          {
            id: "1",
            name: "Café Central",
            category: "Café/Restaurante",
            description: "Un acogedor café en el centro de la ciudad",
            address: "Calle Principal 123, Centro",
            phone: "+57 300 123 4567",
            email: "info@cafecentral.com",
            coords: [4.7110, -74.0721],
            images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"],
            rating: 4.5,
            hours: {
              monday: "7:00-20:00",
              tuesday: "7:00-20:00",
              wednesday: "7:00-20:00",
              thursday: "7:00-20:00",
              friday: "7:00-22:00",
              saturday: "8:00-22:00",
              sunday: "8:00-18:00"
            },
            featured: true
          }
        ];
        saveToStorage(STORAGE_KEYS.BUSINESSES, fallbackBusinesses);
        console.log('Datos mock fallback cargados');
      }
    }
    
    // Crear algunos usuarios de ejemplo si no existen
    const existingUsers = getFromStorage<User[]>(STORAGE_KEYS.USERS);
    if (!existingUsers || existingUsers.length === 0) {
      const mockUsers: User[] = [
        {
          email: "demo@buyloop.com",
          name: "Usuario Demo",
          password: "demo123"
        },
        {
          email: "admin@buyloop.com", 
          name: "Administrador",
          password: "admin123"
        }
      ];
      saveToStorage(STORAGE_KEYS.USERS, mockUsers);
    }
    
  } catch (error) {
    console.error('Error inicializando datos mock:', error);
  }
}

/**
 * Obtiene todos los negocios del localStorage
 * @returns Array de negocios
 */
export function getAllBusinesses(): Business[] {
  return getFromStorage<Business[]>(STORAGE_KEYS.BUSINESSES) || [];
}

/**
 * Obtiene un negocio por su ID
 * @param id - ID del negocio
 * @returns El negocio encontrado o null
 */
export function getBusinessById(id: string): Business | null {
  const businesses = getAllBusinesses();
  return businesses.find(business => business.id === id) || null;
}

/**
 * Filtra negocios por categoría
 * @param category - Categoría a filtrar (vacío para todas)
 * @returns Array de negocios filtrados
 */
export function filterBusinessesByCategory(category: string = ''): Business[] {
  const businesses = getAllBusinesses();
  if (!category) return businesses;
  return businesses.filter(business => 
    business.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Busca negocios por texto en nombre o descripción
 * @param searchText - Texto a buscar
 * @returns Array de negocios que coinciden
 */
export function searchBusinesses(searchText: string): Business[] {
  if (!searchText.trim()) return getAllBusinesses();
  
  const businesses = getAllBusinesses();
  const search = searchText.toLowerCase();
  
  return businesses.filter(business => 
    business.name.toLowerCase().includes(search) ||
    business.description.toLowerCase().includes(search) ||
    business.category.toLowerCase().includes(search) ||
    business.address.toLowerCase().includes(search)
  );
}

/**
 * Obtiene las categorías únicas de todos los negocios
 * @returns Array de categorías únicas
 */
export function getBusinessCategories(): string[] {
  const businesses = getAllBusinesses();
  const categories = businesses.map(business => business.category);
  return [...new Set(categories)].sort();
}
