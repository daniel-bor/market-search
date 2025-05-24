'use client';

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessCard } from "@/components/BusinessCard";
import SearchBar, { SearchFilters } from "@/components/SearchBar/SearchBar";
import { useData } from "@/contexts";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Map, List } from "lucide-react";

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
    loading
  } = useData();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const handleBusinessClick = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  const handleSearchFilters = useCallback((searchFilters: SearchFilters) => {
    setFilters({
      searchText: searchFilters.searchText,
      category: searchFilters.category === 'Todas' ? '' : searchFilters.category,
      distance: searchFilters.distance
    });
  }, [setFilters]);

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
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar onSearch={handleSearchFilters} />
        </div>

        {/* Toggle de vista y resultados */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Negocios Encontrados</CardTitle>
                <CardDescription>
                  {filteredBusinesses.length} negocio{filteredBusinesses.length !== 1 ? 's' : ''} encontrado{filteredBusinesses.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="flex items-center space-x-1"
                >
                  <Map className="h-4 w-4" />
                  <span>Mapa</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-1"
                >
                  <List className="h-4 w-4" />
                  <span>Lista</span>
                </Button>
              </div>
            </CardHeader>
            <div className="p-6">
              {viewMode === 'map' ? (
                <div className="h-96 w-full">
                  <MapView 
                    businesses={filteredBusinesses}
                    onBusinessClick={handleBusinessClick}
                  />
                </div>
              ) : (
                <div>
                  {filteredBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBusinesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          showDistance={true}
                          distance={Math.random() * 5 + 0.5} // Distancia simulada entre 0.5km y 5.5km
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <List className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron negocios
                      </h3>
                      <p className="text-gray-500">
                        Intenta ajustar tus filtros de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
