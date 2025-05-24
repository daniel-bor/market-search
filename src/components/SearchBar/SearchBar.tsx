'use client';

import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface SearchFilters {
  searchText: string;
  category: string;
  distance: number;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

const CATEGORIES = [
  'Todas',
  'Café/Restaurante',
  'Librería',
  'Ropa/Moda',
  'Farmacia/Salud',
  'Tecnología',
  'Panadería',
  'Deportes/Fitness',
  'Belleza/Estética',
  'Ferretería/Hogar'
];

const DISTANCE_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: 'Sin límite' }
];

export default function SearchBar({ onSearch, className = '' }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchText: '',
    category: 'Todas',
    distance: 5
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, searchText: value };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...filters, category: value };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleDistanceChange = (value: string) => {
    const newFilters = { ...filters, distance: parseInt(value) };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { searchText: '', category: 'Todas', distance: 5 };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Barra de búsqueda principal */}
      <Card className="p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo de búsqueda por texto */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar negocios..."
              value={filters.searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Botón de filtros */}
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 whitespace-nowrap"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro por categoría */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <Select value={filters.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por distancia */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Distancia máxima
                </label>
                <Select value={filters.distance.toString()} onValueChange={handleDistanceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar distancia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botón para limpiar filtros */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 invisible">
                  Acciones
                </label>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>

            {/* Resumen de filtros activos */}
            {(filters.searchText || filters.category !== 'Todas' || filters.distance !== 5) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Filtros activos:</span>
                  {filters.searchText && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                      Texto: &quot;{filters.searchText}&quot;
                    </span>
                  )}
                  {filters.category !== 'Todas' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                      Categoría: {filters.category}
                    </span>
                  )}
                  {filters.distance !== 5 && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-xs">
                      Distancia: {DISTANCE_OPTIONS.find(d => d.value === filters.distance)?.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// Export del tipo para usar en otros componentes
export type { SearchFilters };
