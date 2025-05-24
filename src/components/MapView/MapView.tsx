'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG } from '@/lib/mapConfig';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  className?: string;
}

export default function MapView({ className = '' }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializar el mapa
    mapRef.current = L.map(mapContainerRef.current, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Añadir layer de tiles
    L.tileLayer(MAP_CONFIG.tileLayer.url, {
      attribution: MAP_CONFIG.tileLayer.attribution,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom,
    }).addTo(mapRef.current);

    // Añadir un marcador de prueba
    L.marker(MAP_CONFIG.defaultCenter)
      .addTo(mapRef.current)
      .bindPopup('¡Mapa de Buyloop funcionando!')
      .openPopup();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className={`w-full h-full min-h-[400px] rounded-lg border ${className}`}
      style={{ height: '100%' }}
    />
  );
}
