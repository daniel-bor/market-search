// Configuración básica para Leaflet
export const MAP_CONFIG = {
  // Coordenadas por defecto (San Juan Sacatepéquez, Guatemala)
  defaultCenter: [14.7174, -90.6413] as [number, number],
  defaultZoom: 14,
  minZoom: 11,
  maxZoom: 18,
  
  // Configuración del tile layer
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  
  // Estilos para marcadores
  markerStyles: {
    default: {
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.7,
      radius: 8,
      weight: 2
    },
    selected: {
      color: '#EF4444',
      fillColor: '#EF4444',
      fillOpacity: 0.9,
      radius: 10,
      weight: 3
    }
  }
};
