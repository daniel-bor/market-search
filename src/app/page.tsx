'use client';

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

// Datos de prueba para el mapa
const mockBusinesses = [
  {
    id: "1",
    name: "Café Central",
    category: "Café/Restaurante",
    coords: [40.4168, -3.7038] as [number, number],
    address: "Calle Principal 123, Centro",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Librería El Saber",
    category: "Librería",
    coords: [40.4178, -3.7048] as [number, number],
    address: "Calle de los Libros 45, Centro",
    rating: 4.3,
  },
  {
    id: "3",
    name: "Farmacia San José",
    category: "Farmacia",
    coords: [40.4158, -3.7028] as [number, number],
    address: "Avenida de la Salud 78, Centro",
    rating: 4.8,
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBusinesses, setFilteredBusinesses] = useState(mockBusinesses);

  // Filtrar negocios basado en búsqueda y categoría
  useEffect(() => {
    let filtered = mockBusinesses;

    if (searchTerm) {
      filtered = filtered.filter(business => 
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(business => 
        business.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredBusinesses(filtered);
  }, [searchTerm, selectedCategory]);

  const handleBusinessClick = (businessId: string) => {
    console.log(`Navegando a negocio: ${businessId}`);
    // Aquí se implementará la navegación cuando se cree la página de detalle
  };
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button>Buscar</Button>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="café">Cafés y Restaurantes</SelectItem>
                  <SelectItem value="librería">Librerías</SelectItem>
                  <SelectItem value="farmacia">Farmacias</SelectItem>
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

        {/* Estado del desarrollo */}
        <div className="text-center space-y-2">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ Tarea 5.2 Completada
          </div>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ MapView Funcional
          </div>
          <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg">
            ✅ Responsive Design
          </div>
        </div>
      </div>
    </div>
  );
}
