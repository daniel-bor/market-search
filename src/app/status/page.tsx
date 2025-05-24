'use client';

import { useData } from "@/contexts";

export default function StatusPage() {
  const { businesses, filteredBusinesses, loading } = useData();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Estado de la Aplicación</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Información del Estado:</h2>
        <p><strong>Loading:</strong> {loading ? '🔄 Cargando...' : '✅ Cargado'}</p>
        <p><strong>Total de Negocios:</strong> {businesses.length}</p>
        <p><strong>Negocios Filtrados:</strong> {filteredBusinesses.length}</p>
      </div>

      {businesses.length > 0 && (
        <div className="bg-green-50 p-4 rounded mb-4">
          <h2 className="font-semibold mb-2 text-green-800">✅ Negocios Cargados:</h2>
          <ul className="space-y-1">
            {businesses.slice(0, 5).map((business, index) => (
              <li key={business.id} className="text-sm text-green-700">
                {index + 1}. {business.name} - {business.category}
              </li>
            ))}
            {businesses.length > 5 && (
              <li className="text-sm text-green-600 italic">
                ... y {businesses.length - 5} más
              </li>
            )}
          </ul>
        </div>
      )}

      {businesses.length === 0 && !loading && (
        <div className="bg-red-50 p-4 rounded">
          <h2 className="font-semibold mb-2 text-red-800">❌ No hay negocios cargados</h2>
          <p className="text-sm text-red-700">
            Los datos no se han cargado correctamente. Revisa la consola del navegador para más detalles.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <a 
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Volver al Mapa
        </a>
      </div>
    </div>
  );
}
