"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts';
import { Business } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MessageCircle, Clock, MapPin, Star } from 'lucide-react';

export default function BusinessPage() {
  const params = useParams();
  const router = useRouter();
  const { getBusinessById, loading } = useData();
  const [business, setBusiness] = useState<Business | null>(null);
  const [notFound, setNotFound] = useState(false);

  const businessId = params.id as string;

  useEffect(() => {
    if (!businessId || loading) return;

    const foundBusiness = getBusinessById(businessId);
    
    if (foundBusiness) {
      setBusiness(foundBusiness);
      setNotFound(false);
    } else {
      setBusiness(null);
      setNotFound(true);
    }
  }, [businessId, getBusinessById, loading]);

  const handleBack = () => {
    router.back();
  };

  const handleCall = () => {
    if (business?.phone) {
      window.open(`tel:${business.phone}`, '_self');
    }
  };

  const handleMessage = () => {
    // Por ahora mostrar un alert, en la próxima tarea implementaremos el chat
    alert('Función de mensajería será implementada en la siguiente tarea');
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Cargando negocio...</div>
          </div>
        </div>
      </div>
    );
  }

  // Negocio no encontrado
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Negocio no encontrado
              </h1>
              <p className="text-gray-600 mb-6">
                El negocio que buscas no existe o ha sido eliminado.
              </p>
              <Button onClick={() => router.push('/')}>
                Ir al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mostrar negocio
  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de volver */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información principal */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Imagen del negocio */}
              <div className="md:w-1/3">
                <img
                  src={business.image || '/api/placeholder/300/200'}
                  alt={business.name}
                  className="w-full h-48 md:h-64 object-cover rounded-lg"
                />
              </div>

              {/* Información del negocio */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  <p className="text-lg text-blue-600 font-medium">
                    {business.category}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{business.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.rating}</span>
                  </div>
                  {/* <span className="text-gray-500">({business.reviews} reseñas)</span> */}
                </div>

                <p className="text-gray-700">
                  {business.description}
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={handleCall}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horarios de atención */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios de atención
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.hours && Object.entries(business.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium capitalize">{day}:</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información de contacto adicional */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Información de contacto</h2>
            <div className="space-y-2">
              {business.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📧</span>
                  <span>{business.email}</span>
                </div>
              )}
              {business.website && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🌐</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
