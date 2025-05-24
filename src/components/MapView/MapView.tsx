'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG } from '@/lib/mapConfig';

// Fix para iconos de Leaflet en Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Business {
  id: string;
  name: string;
  category: string;
  coords: [number, number];
  address: string;
  rating: number;
}

interface MapViewProps {
  className?: string;
  businesses?: Business[];
  onBusinessClick?: (businessId: string) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({ 
  className = '', 
  businesses = [], 
  onBusinessClick,
  center,
  zoom
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear el mapa
    mapRef.current = L.map(mapContainerRef.current, {
      center: center || MAP_CONFIG.defaultCenter,
      zoom: zoom || MAP_CONFIG.defaultZoom,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      trackResize: true,
    });

    // Añadir layer de tiles
    L.tileLayer(MAP_CONFIG.tileLayer.url, {
      attribution: MAP_CONFIG.tileLayer.attribution,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom,
    }).addTo(mapRef.current);

    // Crear layer group para marcadores
    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  // Actualizar marcadores cuando cambien los negocios
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Limpiar marcadores existentes
    markersLayerRef.current.clearLayers();

    // Añadir nuevos marcadores
    businesses.forEach((business) => {
      const marker = L.marker(business.coords)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-lg mb-1">${business.name}</h3>
            <p class="text-sm text-gray-600 mb-1">${business.category}</p>
            <p class="text-sm mb-2">${business.address}</p>
            <div class="flex items-center justify-between">
              <span class="text-yellow-500">★ ${business.rating}</span>
              <button class="text-blue-600 text-sm hover:underline" onclick="window.viewBusiness?.('${business.id}')">
                Ver más →
              </button>
            </div>
          </div>
        `, {
          maxWidth: 250,
          className: 'custom-popup'
        });

      // Añadir evento de click si se proporciona callback
      if (onBusinessClick) {
        marker.on('click', () => {
          onBusinessClick(business.id);
        });
      }

      markersLayerRef.current?.addLayer(marker);
    });

    // Ajustar vista si hay negocios
    if (businesses.length > 0) {
      const layers = markersLayerRef.current.getLayers();
      if (layers.length > 0) {
        const group = L.featureGroup(layers);
        mapRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [businesses, onBusinessClick]);

  // Hacer que la función viewBusiness esté disponible globalmente para los popups
  useEffect(() => {
    if (onBusinessClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).viewBusiness = onBusinessClick;
    }
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).viewBusiness;
    };
  }, [onBusinessClick]);

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[400px] rounded-lg border shadow-sm"
        style={{ height: '100%' }}
      />
    </div>
  );
}
