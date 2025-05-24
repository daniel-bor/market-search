'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { Business } from '@/lib/storage';

interface MapMarkerProps {
  business: Business;
  map: L.Map | null;
  layerGroup: L.LayerGroup | null;
  onBusinessClick?: (businessId: string) => void;
}

// Crear iconos personalizados para diferentes categorías
const createCustomIcon = (category: string, featured: boolean = false) => {
  const getIconColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Café/Restaurante': '#8B4513',
      'Librería': '#4A90E2',
      'Tienda de Ropa': '#E91E63',
      'Supermercado': '#4CAF50',
      'Farmacia': '#FF5722',
      'Peluquería': '#9C27B0',
      'Gimnasio': '#FF9800',
      'Panadería': '#795548',
      'Ferretería': '#607D8B',
      'Electrónicos': '#3F51B5',
    };
    return categoryColors[category] || '#2196F3';
  };

  const color = getIconColor(category);
  const size = featured ? 40 : 30;
  const borderColor = featured ? '#FFD700' : '#FFFFFF';
  const borderWidth = featured ? 3 : 2;

  const iconHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: ${borderWidth}px solid ${borderColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
      ${featured ? `
        <div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: #FFD700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: #333;
        ">★</div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Función para crear el contenido del popup
const createPopupContent = (business: Business, onBusinessClick?: (id: string) => void) => {
  const handleViewMore = () => {
    if (onBusinessClick) {
      onBusinessClick(business.id);
    }
  };

  // Crear el elemento del popup
  const popupContainer = document.createElement('div');
  popupContainer.className = 'p-3 min-w-[250px] max-w-[300px]';
  
  // Crear contenido HTML
  popupContainer.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-start justify-between">
        <h3 class="font-semibold text-lg text-gray-900 leading-tight">${business.name}</h3>
        ${business.featured ? '<span class="text-yellow-500 text-sm">★ Destacado</span>' : ''}
      </div>
      
      <div class="flex items-center space-x-1">
        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${business.category}</span>
        <div class="flex items-center text-yellow-500">
          <span class="text-sm">★ ${business.rating}</span>
        </div>
      </div>
      
      <p class="text-sm text-gray-600 line-clamp-2">${business.description}</p>
      
      <div class="text-xs text-gray-500">
        <p>📍 ${business.address}</p>
        <p>📞 ${business.phone}</p>
      </div>
      
      <div class="flex justify-between items-center pt-2 border-t">
        <span class="text-xs text-gray-400">Haz clic para más info</span>
        <button 
          id="view-more-btn-${business.id}"
          class="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
        >
          Ver perfil →
        </button>
      </div>
    </div>
  `;

  // Añadir event listener al botón
  const viewButton = popupContainer.querySelector(`#view-more-btn-${business.id}`);
  if (viewButton && onBusinessClick) {
    viewButton.addEventListener('click', (e) => {
      e.stopPropagation();
      handleViewMore();
    });
  }

  return popupContainer;
};

export default function MapMarker({ 
  business, 
  map, 
  layerGroup, 
  onBusinessClick 
}: MapMarkerProps) {
  
  useEffect(() => {
    if (!map || !layerGroup) return;

    // Crear icono personalizado
    const customIcon = createCustomIcon(business.category, business.featured);

    // Crear marcador
    const marker = L.marker(business.coords, {
      icon: customIcon,
      title: business.name,
    });

    // Crear popup con contenido personalizado
    const popupContent = createPopupContent(business, onBusinessClick);
    
    marker.bindPopup(popupContent, {
      maxWidth: 300,
      minWidth: 250,
      className: 'custom-popup',
      closeOnClick: false,
      autoClose: false,
    });

    // Añadir eventos
    marker.on('click', () => {
      // Abrir popup automáticamente al hacer clic
      marker.openPopup();
    });

    // Evento para hover (opcional)
    marker.on('mouseover', () => {
      marker.openPopup();
    });

    // Añadir marcador al layer group
    layerGroup.addLayer(marker);

    // Cleanup: remover marcador cuando el componente se desmonte
    return () => {
      if (layerGroup && layerGroup.hasLayer(marker)) {
        layerGroup.removeLayer(marker);
      }
    };
  }, [business, map, layerGroup, onBusinessClick]);

  // Este componente no renderiza nada directamente
  // Todo el trabajo se hace en useEffect con Leaflet
  return null;
}

// Hook personalizado para usar múltiples marcadores
export function useMapMarkers(
  businesses: Business[], 
  map: L.Map | null, 
  layerGroup: L.LayerGroup | null,
  onBusinessClick?: (businessId: string) => void
) {
  useEffect(() => {
    if (!map || !layerGroup) return;

    // Limpiar marcadores existentes
    layerGroup.clearLayers();

    // Crear marcadores para cada negocio
    businesses.forEach((business) => {
      const customIcon = createCustomIcon(business.category, business.featured);
      
      const marker = L.marker(business.coords, {
        icon: customIcon,
        title: business.name,
      });

      const popupContent = createPopupContent(business, onBusinessClick);
      
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        minWidth: 250,
        className: 'custom-popup',
        closeOnClick: false,
        autoClose: false,
      });

      marker.on('click', () => {
        marker.openPopup();
      });

      marker.on('mouseover', () => {
        marker.openPopup();
      });

      layerGroup.addLayer(marker);
    });

    // Ajustar vista si hay negocios
    if (businesses.length > 0) {
      const markers = layerGroup.getLayers();
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [businesses, map, layerGroup, onBusinessClick]);
}
