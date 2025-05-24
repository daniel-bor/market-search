# Tienduki Web MVP

**Prototipo de plataforma de descubrimiento de negocios locales**

## 🚀 Tecnologías

- **Next.js 15.1.8** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework CSS utilitario
- **Leaflet** - Mapas interactivos
- **shadcn/ui** - Componentes UI

## 📁 Estructura del Proyecto

```
/
├─ public/
│   └─ assets/                 # Imágenes estáticas, mock-data JSON
├─ src/
│   ├─ app/
│   │   ├─ layout.tsx          # Layout global
│   │   ├─ page.tsx            # Página principal (mapa y buscador)
│   │   └─ globals.css         # Estilos globales de Tailwind
│   ├─ components/             # Componentes reutilizables
│   │   ├─ MapView/            # Mapa interactivo
│   │   ├─ SearchBar/          # Buscador con filtros
│   │   ├─ BusinessCard/       # Tarjeta de negocio
│   │   ├─ BusinessProfile/    # Vista detalle de negocio
│   │   ├─ AuthForm/           # Formulario login/registro
│   │   └─ Navbar/             # Barra de navegación
│   ├─ contexts/               # React Context para auth y datos
│   ├─ hooks/                  # Custom Hooks
│   └─ lib/                    # Utilidades (localStorage, helpers)
```

## 🏃‍♂️ Desarrollo

### Comandos disponibles

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

### Acceso local

- **Desarrollo**: http://localhost:3000

### Credenciales de prueba

Para probar la autenticación, puedes usar estas credenciales de demostración:

```
Email: demo@buyloop.com
Contraseña: demo123

Email: admin@buyloop.com  
Contraseña: admin123
```

O puedes registrar una nueva cuenta desde la página de registro.

## 📋 Estado del Desarrollo

✅ **MVP Funcional** - Todas las funcionalidades principales implementadas

### 🔄 En desarrollo:
- Panel de métricas y estadísticas
- Funcionalidades de contacto avanzadas

## 🎯 Funcionalidades Principales

### 🔐 Autenticación
- Sistema de registro e inicio de sesión
- Sesiones persistentes con localStorage
- Protección de rutas y middleware de seguridad
- Usuarios de demostración precargados

### 🗺️ Exploración de Negocios
- **Mapa interactivo** con marcadores personalizados por categoría
- **Vista de lista** alternativa con tarjetas informativas
- **Toggle fácil** entre vista de mapa y lista
- Marcadores destacados con animaciones

### 🔍 Búsqueda Avanzada
- **Búsqueda por texto** en tiempo real
- **Filtros por categoría** (Café, Restaurante, Librería, etc.)
- **Filtro por distancia** con slider interactivo
- Resultados actualizados automáticamente

### 📱 Perfiles de Negocio
- **Páginas detalladas** para cada negocio
- Información completa: horarios, contacto, ubicación
- **Galería de imágenes** con carrusel
- Botones de contacto directo (llamada y mensaje)
- Calificaciones y reseñas

### 🎨 Interfaz de Usuario
- **Diseño responsive** mobile-first
- **Componentes UI modernos** con shadcn/ui
- **Navegación intuitiva** con menú móvil
- **Animaciones suaves** y transiciones

## 📝 Notas Técnicas

### 🔧 Stack Tecnológico
- **Next.js 15.1.8** con App Router y TypeScript
- **TailwindCSS** para estilos responsive
- **shadcn/ui** componentes UI modernos
- **Leaflet** para mapas interactivos
- **React Hook Form** para formularios
- **Context API** para gestión de estado

### 💾 Almacenamiento
- **localStorage** para persistencia de datos
- **Datos mock** precargados automáticamente  
- **Usuarios demo** para testing
- **Sesiones simuladas** con tokens

### 🗺️ Configuración del Mapa
- Centrado en **Bogotá, Colombia**
- **Marcadores personalizados** por categoría
- **Popups informativos** con datos del negocio
- **Responsive** para móvil y desktop

---

**Última actualización**: 23 de mayo de 2025  
**Estado**: ✅ MVP funcional completo
