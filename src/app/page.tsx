import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapView } from "@/components/MapView";

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

        {/* Prueba básica de búsqueda con shadcn/ui */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex space-x-2">
            <Input 
              placeholder="Buscar negocios..." 
              className="flex-1"
            />
            <Button>Buscar</Button>
          </div>
        </div>

        {/* Prueba de componentes de shadcn/ui */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Mapa Interactivo</CardTitle>
              <CardDescription>
                Explora negocios cercanos en un mapa interactivo con marcadores personalizados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Avanzada</CardTitle>
              <CardDescription>
                Filtra por categoría, distancia y encuentra exactamente lo que buscas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfiles Detallados</CardTitle>
              <CardDescription>
                Información completa de cada negocio con horarios y contacto directo.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Prueba de botones de shadcn/ui */}
        <div className="text-center space-x-4">
          <Button size="lg">
            Explorar Mapa
          </Button>
          <Button variant="outline" size="lg">
            Iniciar Sesión
          </Button>
        </div>

        {/* Prueba de formulario con shadcn/ui */}
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Formulario con shadcn/ui</CardTitle>
              <CardDescription>
                Ejemplo de formulario usando componentes de shadcn/ui
              </CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              <Input 
                type="text" 
                placeholder="Buscar negocios..." 
              />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="restaurants">Restaurantes</SelectItem>
                  <SelectItem value="stores">Tiendas</SelectItem>
                  <SelectItem value="services">Servicios</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">
                Buscar Negocios
              </Button>
            </div>
          </Card>
        </div>

        {/* Mapa de prueba */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mapa Interactivo</CardTitle>
              <CardDescription>
                Prueba del componente de mapa con Leaflet
              </CardDescription>
            </CardHeader>
            <div className="p-6">
              <div className="h-96 w-full">
                <MapView />
              </div>
            </div>
          </Card>
        </div>

        {/* Estado de la configuración */}
        <div className="mt-8 text-center space-y-2">
          <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ TailwindCSS configurado
          </div>
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
            ✅ shadcn/ui configurado
          </div>
          <div className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg">
            ✅ Leaflet configurado
          </div>
        </div>
      </div>
    </div>
  );
}
