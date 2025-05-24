"use client";

import { useState } from 'react';
import { Business } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Star, 
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BusinessProfileProps {
  business: Business;
  onCall?: () => void;
  onMessage?: () => void;
}

export default function BusinessProfile({ business, onCall, onMessage }: BusinessProfileProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === business.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? business.images.length - 1 : prev - 1
    );
  };

  const formatHours = (day: string) => {
    const dayKey = getDayKey(day);
    const hours = business.hours[dayKey];
    if (!hours || hours === 'Cerrado') {
      return 'Cerrado';
    }
    return hours;
  };

  const getDaysOfWeek = () => [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const getDayKey = (dayName: string): string => {
    const dayMap: Record<string, string> = {
      'Lunes': 'monday',
      'Martes': 'tuesday', 
      'Miércoles': 'wednesday',
      'Jueves': 'thursday',
      'Viernes': 'friday',
      'Sábado': 'saturday',
      'Domingo': 'sunday'
    };
    return dayMap[dayName] || dayName.toLowerCase();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con información básica */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                {business.featured && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Destacado
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                {renderStars(business.rating)}
                <span className="ml-2 text-gray-600">({business.rating})</span>
              </div>

              <Badge variant="outline" className="mb-4">
                {business.category}
              </Badge>

              <p className="text-gray-700 mb-4">
                {business.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{business.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{business.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{business.email}</span>
                </div>
                
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 md:w-48">
              <Button 
                onClick={onCall}
                className="flex items-center gap-2"
                size="lg"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onMessage}
                className="flex items-center gap-2"
                size="lg"
              >
                <MessageCircle className="w-4 h-4" />
                Mensaje
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Galería de imágenes */}
      {business.images && business.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Galería de imágenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={business.images[currentImageIndex]}
                  alt={`${business.name} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {business.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {business.images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {business.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Horarios de atención */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horarios de atención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {getDaysOfWeek().map((day) => {
              const hours = formatHours(day);
              // Corregir la lógica para determinar el día actual
              // getDay() devuelve 0=Domingo, 1=Lunes, ..., 6=Sábado
              // getDaysOfWeek() tiene el array [Lunes, Martes, ..., Domingo]
              const today = new Date().getDay();
              const dayIndex = getDaysOfWeek().indexOf(day);
              // Convertir: 0=Domingo -> 6, 1=Lunes -> 0, 2=Martes -> 1, etc.
              const todayIndex = today === 0 ? 6 : today - 1;
              const isToday = todayIndex === dayIndex;
              
              return (
                <div 
                  key={day}
                  className={`flex justify-between py-2 px-3 rounded ${
                    isToday ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  <span className={`font-medium ${isToday ? 'text-blue-700' : ''}`}>
                    {day}
                  </span>
                  <span className={`${
                    hours === 'Cerrado' 
                      ? 'text-red-600' 
                      : isToday 
                        ? 'text-blue-700' 
                        : 'text-gray-600'
                  }`}>
                    {hours}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
