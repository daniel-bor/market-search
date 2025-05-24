# Buyloop Web MVP

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

## 📋 Estado del Desarrollo

### ✅ Fase 1: Configuración Base del Proyecto
- [x] **Tarea 1.1**: Inicializar proyecto Next.js ✅
- [ ] **Tarea 1.2**: Configurar TailwindCSS
- [ ] **Tarea 1.3**: Configurar shadcn/ui

### 📦 Próximas Fases
- **Fase 2**: Estructura Base y Utilidades
- **Fase 3**: Layout y Navegación
- **Fase 4**: Autenticación
- **Fase 5**: Página Principal y Mapa
- **Fase 6**: Búsqueda y Filtros
- **Fase 7**: Tarjetas y Lista de Negocios
- **Fase 8**: Perfil Detallado de Negocio
- **Fase 9**: Panel de Métricas
- **Fase 10**: Pulido y Optimización

## 🎯 Características del MVP

- ✅ Proyecto Next.js con TypeScript configurado
- ⏳ Autenticación simulada (login/registro)
- ⏳ Mapa interactivo con marcadores de negocios
- ⏳ Buscador con filtros por categoría y distancia
- ⏳ Perfiles detallados de negocios
- ⏳ Gestión de datos en localStorage
- ⏳ Panel de métricas básico

## 📝 Notas de Desarrollo

- **Datos Mock**: Todos los datos son simulados y se almacenan en localStorage
- **Autenticación**: Sistema completamente simulado sin validación real
- **Mapa**: Usar coordenadas ficticias para los negocios
- **Responsive**: Diseño mobile-first

---

**Última actualización**: 23 de mayo de 2025
**Estado**: Tarea 1.1 completada ✅
