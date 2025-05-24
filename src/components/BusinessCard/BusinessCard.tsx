"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Phone } from 'lucide-react';
import { Business } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface BusinessCardProps {
  business: Business;
  showDistance?: boolean;
  distance?: number; // distancia en km
  className?: string;
}

// Función para calcular la distancia (para mostrar en la tarjeta)
const formatDistance = (distance?: number): string => {
  if (!distance) return '';
  return distance < 1 
    ? `${(distance * 1000).toFixed(0)}m` 
    : `${distance.toFixed(1)}km`;
};

// Función para obtener horario actual
const getCurrentDayHours = (hours: Record<string, string>): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[new Date().getDay()];
  return hours[today] || 'Horario no disponible';
};

// Función para determinar si está abierto (simulada)
const isOpenNow = (hours: Record<string, string>): boolean => {
  const todayHours = getCurrentDayHours(hours);
  if (todayHours === 'Cerrado' || todayHours === 'Horario no disponible') {
    return false;
  }
  // Simplificación: si tiene horario, está abierto
  return true;
};

export function BusinessCard({ 
  business, 
  showDistance = false, 
  distance, 
  className = '' 
}: BusinessCardProps) {
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/business/${business.id}`);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.phone) {
      window.open(`tel:${business.phone}`, '_self');
    }
  };

  const todayHours = getCurrentDayHours(business.hours);
  const isOpen = isOpenNow(business.hours);

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${className}`}>
      {/* Imagen principal */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        {business.images && business.images.length > 0 ? (
          <img
            src={business.images[0]}
            alt={business.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si la imagen no carga
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
        
        {/* Badge destacado */}
        {business.featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
            Destacado
          </Badge>
        )}
        
        {/* Badge de estado */}
        <Badge 
          className={`absolute top-3 right-3 ${
            isOpen 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {isOpen ? 'Abierto' : 'Cerrado'}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
            {business.name}
          </CardTitle>
          {business.rating && (
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{business.rating}</span>
            </div>
          )}
        </div>
        
        <Badge variant="secondary" className="w-fit">
          {business.category}
        </Badge>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Dirección */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">{business.address}</span>
        </div>

        {/* Distancia (si se proporciona) */}
        {showDistance && distance !== undefined && (
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-600 font-medium">
              A {formatDistance(distance)} de distancia
            </span>
          </div>
        )}

        {/* Horario de hoy */}
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Hoy: {todayHours}
          </span>
        </div>

        {/* Descripción (truncada) */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {business.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        {/* Botón de llamar */}
        {business.phone && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCallClick}
            className="flex items-center space-x-1"
          >
            <Phone className="h-4 w-4" />
            <span>Llamar</span>
          </Button>
        )}

        {/* Botón Ver más */}
        <Button
          onClick={handleViewMore}
          size="sm"
          className="ml-auto"
        >
          Ver más →
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BusinessCard;
