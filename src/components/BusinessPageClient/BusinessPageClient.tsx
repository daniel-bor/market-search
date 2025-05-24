"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/contexts';
import { Business } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BusinessProfile from '@/components/BusinessProfile';

interface BusinessPageClientProps {
  businessId: string;
}

export default function BusinessPageClient({ businessId }: BusinessPageClientProps) {
  const router = useRouter();
  const { getBusinessById, loading } = useData();
  const [business, setBusiness] = useState<Business | null>(null);
  const [notFound, setNotFound] = useState(false);

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

      <div className="p-4">
        <BusinessProfile 
          business={business}
          onCall={handleCall}
          onMessage={handleMessage}
        />
      </div>
    </div>
  );
}
