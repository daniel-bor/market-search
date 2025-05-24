'use client';

import { useData } from "@/contexts";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { businesses, filteredBusinesses, loading, initMockData } = useData();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [fetchTest, setFetchTest] = useState<any>(null);

  useEffect(() => {
    // Verificar localStorage
    const businessesFromStorage = localStorage.getItem('buyloop_businesses');
    setLocalStorageData(businessesFromStorage);
    
    // Probar fetch directo
    fetch('/assets/mock-businesses.json')
      .then(response => response.json())
      .then(data => setFetchTest(data))
      .catch(error => setFetchTest({ error: error.message }));
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const forceReload = () => {
    initMockData();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Página de Depuración</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Estado del Contexto</h2>
          <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
          <p><strong>Businesses:</strong> {businesses.length}</p>
          <p><strong>Filtered Businesses:</strong> {filteredBusinesses.length}</p>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">LocalStorage</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
            {localStorageData || 'Vacío'}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Fetch Test</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
            {JSON.stringify(fetchTest, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Lista de Negocios</h2>
          {businesses.length > 0 ? (
            <ul className="space-y-1">
              {businesses.map((business, index) => (
                <li key={business.id} className="text-sm">
                  {index + 1}. {business.name} - {business.category}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay negocios cargados</p>
          )}
        </div>

        <div className="space-x-4">
          <button 
            onClick={clearStorage}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Limpiar Storage y Recargar
          </button>
          <button 
            onClick={forceReload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Forzar Recarga de Datos
          </button>
        </div>
      </div>
    </div>
  );
}
