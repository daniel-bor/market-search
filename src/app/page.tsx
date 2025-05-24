'use client';

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessCard } from "@/components/BusinessCard";
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
    filters, 
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

  const handleCategoryChange = (value: string) => {
    setFilters({ category: value === 'all' ? '' : value });
  };

  const handleSearchChange = (value: string) => {
    setFilters({ searchText: value });
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
        <div className="max-w-2xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Negocios</CardTitle>
              <CardDescription>
                Encuentra el lugar perfecto para lo que necesitas
              </CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Buscar negocios..." 
                  value={filters.searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1"
                />
                <Button>Buscar</Button>
              </div>
              <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Café/Restaurante">Cafés y Restaurantes</SelectItem>
                  <SelectItem value="Librería">Librerías</SelectItem>
                  <SelectItem value="Farmacia">Farmacias</SelectItem>
                  <SelectItem value="Supermercado">Supermercados</SelectItem>
                  <SelectItem value="Tienda de Ropa">Tiendas de Ropa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
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

        {/* Lista de negocios - Demostración de BusinessCard */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Negocios</CardTitle>
              <CardDescription>
                Vista en tarjetas de los negocios encontrados
              </CardDescription>
            </CardHeader>
            <div className="p-6">
              {filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.slice(0, 6).map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      showDistance={true}
                      distance={Math.random() * 5 + 0.5} // Distancia simulada entre 0.5km y 5.5km
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron negocios con los filtros actuales.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Estado del desarrollo */}
        <div className="text-center space-y-2">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ Tarea 7.1 Completada
          </div>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ BusinessCard Funcional
          </div>
          <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg">
            ✅ Vista de Lista
          </div>
        </div>
      </div>
    </div>
  );
}
