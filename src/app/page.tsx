'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar, SearchFilters } from "@/components/SearchBar";
import { useData } from "@/contexts";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Importar MapView dinámicamente para evitar problemas de SSR
const MapView = dynamic(() => import("@/components/MapView/MapView"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const { 
    filteredBusinesses, 
    setFilters, 
    loading, 
    initMockData
  } = useData();
  const router = useRouter();

  // Inicializar datos mock si no están cargados
  useEffect(() => {
    initMockData();
  }, [initMockData]);

  const handleBusinessClick = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  const handleSearchFilters = (searchFilters: SearchFilters) => {
    // Mapear los filtros del SearchBar a los filtros del DataContext
    setFilters({
      searchText: searchFilters.searchText,
      category: searchFilters.category === 'Todas' ? '' : searchFilters.category,
      distance: searchFilters.distance
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando negocios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buyloop
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Descubre negocios locales cerca de ti
          </p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearchFilters} />
        </div>

        {/* Mapa principal */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Negocios</CardTitle>
              <CardDescription>
                {filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <div className="p-6">
              <div className="h-96 w-full">
                <MapView 
                  businesses={filteredBusinesses}
                  onBusinessClick={handleBusinessClick}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Estado del desarrollo */}
        <div className="text-center space-y-2">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ Tarea 6.1 Completada
          </div>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ SearchBar Funcional
          </div>
          <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg">
            ✅ Filtros Avanzados
          </div>
        </div>
      </div>
    </div>
  );
}
