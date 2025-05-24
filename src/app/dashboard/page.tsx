"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreateBusinessForm from '@/components/CreateBusinessForm';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const { businesses, getAvailableCategories } = useData();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Crear Nuevo Comercio</h1>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Volver al Dashboard
              </Button>
            </div>
            
            <CreateBusinessForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bienvenido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">¡Hola, {currentUser?.name}!</p>
                <p className="text-sm text-gray-600 mt-2">
                  Email: {currentUser?.email}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowCreateForm(true)} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Crear Nuevo Comercio
                  </Button>
                  <Button 
                    onClick={() => router.push('/')} 
                    variant="outline"
                    className="w-full"
                  >
                    Buscar Comercios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
