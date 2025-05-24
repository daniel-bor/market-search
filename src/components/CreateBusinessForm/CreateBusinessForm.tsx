"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Business } from '@/lib/storage';
import { useData } from '@/contexts/DataContext';

interface CreateBusinessFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  'Café/Restaurante',
  'Librería',
  'Fitness/Gimnasio',
  'Electrónicos',
  'Farmacia',
  'Supermercado',
  'Ropa/Moda',
  'Salud/Belleza',
  'Servicios',
  'Entretenimiento',
  'Otros'
];

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

export default function CreateBusinessForm({ onSuccess, onCancel }: CreateBusinessFormProps) {
  const { addBusiness } = useData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    latitude: '',
    longitude: '',
    images: '',
    rating: '4.0',
    hours: {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: '9:00-17:00',
      sunday: 'Cerrado'
    } as Record<string, string>
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHourChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        alert('El nombre del comercio es obligatorio');
        return;
      }

      if (!formData.category) {
        alert('La categoría es obligatoria');
        return;
      }

      if (!formData.description.trim()) {
        alert('La descripción es obligatoria');
        return;
      }

      if (!formData.address.trim()) {
        alert('La dirección es obligatoria');
        return;
      }

      // Convertir coordenadas
      const lat = parseFloat(formData.latitude) || 4.7110;
      const lng = parseFloat(formData.longitude) || -74.0721;

      // Convertir imágenes (separadas por comas)
      const images = formData.images
        .split(',')
        .map(img => img.trim())
        .filter(img => img.length > 0);

      // Si no hay imágenes, usar una por defecto
      if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400');
      }

      const newBusiness: Omit<Business, 'id'> = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || undefined,
        coords: [lat, lng],
        images,
        rating: parseFloat(formData.rating) || 4.0,
        hours: formData.hours,
        featured: false
      };

      await addBusiness(newBusiness);
      
      console.log('Comercio creado exitosamente');
      
      // Limpiar formulario
      setFormData({
        name: '',
        category: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        latitude: '',
        longitude: '',
        images: '',
        rating: '4.0',
        hours: {
          monday: '9:00-18:00',
          tuesday: '9:00-18:00',
          wednesday: '9:00-18:00',
          thursday: '9:00-18:00',
          friday: '9:00-18:00',
          saturday: '9:00-17:00',
          sunday: 'Cerrado'
        } as Record<string, string>
      });

      // Mostrar mensaje de éxito más detallado
      alert(`¡Comercio "${newBusiness.name}" creado exitosamente!\n\nPuedes encontrarlo en la búsqueda principal. Te redirigiremos ahora.`);
      
      // Redireccionar a la página principal para ver el nuevo comercio
      router.push('/');
      
      onSuccess?.();
      
    } catch (error) {
      console.error('Error al crear comercio:', error);
      alert('Error al crear el comercio. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Comercio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Comercio *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Café Central"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
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
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <textarea
              id="description"
              className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] resize-y"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu comercio, productos y servicios..."
              required
            />
          </div>

          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@tucomercio.com"
              />
            </div>
          </div>

          {/* Dirección y ubicación */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle Principal 123, Centro"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="4.7110"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="-74.0721"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Calificación</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Website e imágenes */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://tucomercio.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Imágenes (URLs separadas por comas)</Label>
              <textarea
                id="images"
                className="w-full p-3 border border-gray-300 rounded-md min-h-[80px] resize-y"
                value={formData.images}
                onChange={(e) => handleInputChange('images', e.target.value)}
                placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
              />
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Horarios de Atención</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DAYS_OF_WEEK.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="text"
                    value={formData.hours[key]}
                    onChange={(e) => handleHourChange(key, e.target.value)}
                    placeholder="9:00-18:00 o Cerrado"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Comercio'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
