// Barrel export para todos los contextos
export { AuthProvider, useAuth } from './AuthContext';
export { DataProvider, useData } from './DataContext';

// Re-exportar tipos importantes
export type { 
  User, 
  CurrentUser, 
  Business, 
  Message 
} from '@/lib/storage';
