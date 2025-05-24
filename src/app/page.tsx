export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Buyloop Web MVP
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Prototipo de aplicación para descubrir negocios locales
          </p>
        </div>

        {/* Prueba de componentes de TailwindCSS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2 text-primary-600">
              Mapa Interactivo
            </h3>
            <p className="text-gray-600">
              Explora negocios cercanos en un mapa interactivo con marcadores personalizados.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2 text-primary-600">
              Búsqueda Avanzada
            </h3>
            <p className="text-gray-600">
              Filtra por categoría, distancia y encuentra exactamente lo que buscas.
            </p>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2 text-primary-600">
              Perfiles Detallados
            </h3>
            <p className="text-gray-600">
              Información completa de cada negocio con horarios y contacto directo.
            </p>
          </div>
        </div>

        {/* Prueba de botones */}
        <div className="text-center space-x-4">
          <button className="btn-primary">
            Explorar Mapa
          </button>
          <button className="btn-secondary">
            Iniciar Sesión
          </button>
        </div>

        {/* Prueba de formulario */}
        <div className="max-w-md mx-auto mt-8 card">
          <h3 className="text-lg font-semibold mb-4">Prueba de Formulario</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Buscar negocios..." 
              className="input-field"
            />
            <select className="input-field">
              <option>Todas las categorías</option>
              <option>Restaurantes</option>
              <option>Tiendas</option>
              <option>Servicios</option>
            </select>
          </div>
        </div>

        {/* Estado de TailwindCSS */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-success text-white px-4 py-2 rounded-lg">
            ✅ TailwindCSS configurado correctamente
          </div>
        </div>
      </div>
    </div>
  );
}
