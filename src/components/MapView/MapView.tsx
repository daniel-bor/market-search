'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG } from '@/lib/mapConfig';
import { useMapMarkers } from './MapMarker';
import { Business } from '@/lib/storage';

// Fix para iconos de Leaflet en Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

  // Usar el hook personalizado para manejar marcadores
  useMapMarkers(businesses, mapRef.current, markersLayerRef.current, onBusinessClick);

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[400px] rounded-lg border shadow-sm z-0"
        style={{ height: '100%' }}
      />
    </div>
  );
}
