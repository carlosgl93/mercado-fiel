# Mercado Fiel - Marketplace de Confianza

## Descripción

Mercado Fiel es una plataforma marketplace que conecta compradores con proveedores de productos y servicios de calidad. La plataforma actúa como intermediario digital facilitando transacciones seguras, permitiendo navegación de productos, compras, reseñas, chat en tiempo real, y funciones avanzadas.

**Tecnologías principales:**

- **Frontend**: Vite + React + TypeScript + Material-UI
- **Backend**: Firebase (Firestore, Functions, Auth, Storage) + Supabase (PostgreSQL, Real-time)
- **Base de Datos**: Hybrid Firebase Firestore + Supabase PostgreSQL
- **Estado**: Recoil (estado local) + React-Query (datos externos)
- **Testing**: Playwright para E2E
- **Deployment**: Firebase Hosting + Supabase Cloud

## Configuración Inicial

### Prerrequisitos

- Node.js (v16 o superior)
- npm o pnpm
- Firebase CLI (`npm install -g firebase-tools`)
- Supabase CLI (`npm install -g supabase`)
- Docker (para Supabase emuladores locales)
- Git

### Instalación Local

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd mercado-fiel
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # También instalar dependencias de Firebase Functions
   cd functions && npm install && cd ..
   ```

3. **Configurar variables de entorno**

   ```bash
   # Copiar template de variables de entorno
   cp env.template .env
   
   # Editar .env y configurar:
   VITE_ENV=dev  # Para desarrollo local con emuladores
   # VITE_ENV=prod  # Para producción
   
   # Variables de Supabase (agregar al .env)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   # Para desarrollo local con Supabase emuladores:
   # VITE_SUPABASE_URL=http://localhost:54321
   ```

4. **Configurar Firebase**

   ```bash
   # Inicializar Firebase (si es necesario)
   firebase init
   
   # Configurar proyecto (actualizar .firebaserc si es necesario)
   # Proyecto actual: mercado-fiel
   ```

5. **Agregar credenciales de Firebase Functions**

   ```bash
   # Descargar service account key desde Firebase Console
   # Colocar en: functions/firebase-adminsdk.json
   ```

6. **Configurar Supabase (Opcional - para funciones avanzadas)**

   ```bash
   # Inicializar Supabase en el proyecto
   supabase init
   
   # Configurar base de datos y migraciones
   supabase db reset
   
   # Generar tipos TypeScript para Supabase
   supabase gen types typescript --local > src/types/supabase.ts
   ```

### Desarrollo Local

#### Opción 1: Firebase + Supabase Emuladores (Desarrollo Completo)

```bash
# Terminal 1: Iniciar Supabase emuladores
supabase start

# Terminal 2: Iniciar emuladores de Firebase
firebase emulators:start

# Terminal 3: Iniciar aplicación en modo desarrollo
npm run dev
```

#### Opción 2: Solo Firebase Emuladores

```bash
# Terminal 1: Iniciar emuladores de Firebase
firebase emulators:start

# Terminal 2: Iniciar aplicación en modo desarrollo
npm run dev
```

#### Opción 3: Contra Servicios en Producción

```bash
# Cambiar VITE_ENV=prod en .env
npm run dev
```

### URLs de Desarrollo

- **App Local**: <http://localhost:5173>
- **Firebase Emulator UI**: <http://localhost:4000>
- **Functions Emulator**: <http://localhost:5001>
- **Supabase Studio**: <http://localhost:54323>
- **Supabase API**: <http://localhost:54321>

## Estructura del Proyecto

```text
mercado-fiel/
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── sections/          # Secciones de layout (Header, Footer, etc.)
│   ├── hooks/             # Custom hooks
│   ├── api/               # Servicios de API (Firebase + Supabase)
│   ├── config/            # Configuración de la app
│   ├── routes/            # Configuración de rutas
│   ├── store/             # Estado global (Recoil)
│   ├── theme/             # Configuración de Material-UI
│   └── types/             # Definiciones de TypeScript
├── functions/             # Firebase Cloud Functions (Backend API)
│   ├── src/
│   │   ├── functions/     # Funciones HTTP y triggers
│   │   ├── utils/         # Utilidades compartidas
│   │   ├── validations/   # Validaciones de datos
│   │   └── config.ts      # Configuración del backend
├── supabase/              # Configuración de Supabase
│   ├── migrations/        # Migraciones de base de datos
│   ├── seed.sql          # Datos de prueba
│   └── config.toml       # Configuración local
├── public/
│   ├── images/            # Imágenes estáticas
│   └── manifest.json      # PWA manifest
├── emails/                # Templates de email
└── tests/                 # Tests E2E con Playwright
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run preview          # Preview de build de producción

# Testing
npm run test             # Ejecutar tests con Playwright
npm run test:ui          # Playwright con interfaz gráfica

# Firebase
firebase emulators:start # Iniciar emuladores locales
firebase deploy          # Deploy a producción
firebase deploy --only functions  # Deploy solo functions
firebase deploy --only hosting    # Deploy solo hosting

# Supabase
supabase start           # Iniciar emuladores locales
supabase stop            # Detener emuladores
supabase db reset        # Reset base de datos local
supabase db push         # Aplicar migraciones a producción
supabase gen types typescript --local # Generar tipos TypeScript

# Linting
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Fix automático de ESLint
```

## Configuración de Firebase

### Proyectos

- **Desarrollo**: Emuladores locales
- **Producción**: `mercado-fiel` (Firebase project ID)

### Servicios Utilizados

- **Authentication**: Login/registro de usuarios
- **Firestore**: Base de datos principal (productos, usuarios, transacciones)
- **Cloud Functions**: API Backend y lógica de negocio
- **Storage**: Almacenamiento de archivos e imágenes
- **Hosting**: Deployment de la aplicación

### URLs de Producción

- **App**: <https://mercadofiel.cl>
- **Admin**: <https://mercado-fiel.web.app>

## Arquitectura Backend API

### Firebase Cloud Functions

El backend API está implementado en Firebase Cloud Functions con TypeScript. Principales endpoints:

```text
/api/
├── auth/              # Autenticación y autorización
├── users/             # Gestión de usuarios
├── products/          # CRUD de productos
├── orders/            # Gestión de pedidos
├── payments/          # Procesamiento de pagos
├── chat/              # Sistema de mensajería
├── notifications/     # Notificaciones push/email
└── admin/             # Funciones administrativas
```

### Supabase Integration

Supabase se utiliza como complemento para:

- **PostgreSQL**: Datos relacionales complejos (reportes, analytics)
- **Real-time**: Actualizaciones en tiempo real (chat, notificaciones)
- **Row Level Security**: Políticas de seguridad granulares
- **PostgREST**: API REST automática para consultas complejas

### Hybrid Data Strategy

```text
Firebase Firestore:
├── users/             # Perfiles de usuario
├── products/          # Catálogo de productos
├── orders/            # Pedidos y transacciones
└── chats/             # Mensajes de chat

Supabase PostgreSQL:
├── analytics/         # Métricas y reportes
├── inventory/         # Control de inventario detallado
├── reviews/           # Sistema de reseñas complejo
└── logs/              # Auditoría y logs del sistema
```

## Configuración de Supabase

### Emuladores Locales

Los emuladores de Supabase incluyen:

- **PostgreSQL**: Base de datos local en Docker
- **PostgREST**: API REST automática
- **Realtime**: WebSockets para actualizaciones en tiempo real
- **Auth**: Sistema de autenticación (opcional, usamos Firebase Auth)
- **Storage**: Almacenamiento de archivos (opcional, usamos Firebase Storage)
- **Studio**: Interfaz web para gestión de datos

### Configuración Inicial de Supabase

```bash
# Crear proyecto Supabase (primera vez)
supabase init

# Configurar variables de entorno
echo "SUPABASE_DB_PASSWORD=your_password" >> .env

# Iniciar servicios locales
supabase start

# Aplicar migraciones iniciales
supabase db reset
```

## Branding y Assets

### Logos

- **Principal**: `/public/images/b.svg` (SVG vectorial)
- **PNG**: `/public/images/mercadofiel.png`
- **Favicon**: `/public/favicon.svg`

### Colores de Marca

- **Primario**: #4CAF4F (Verde)
- **Fondo**: #F6F6F4 (Blanco cálido)
- **Tema**: Definido en `src/theme/`

### PWA

- **Manifest**: `/public/manifest.json`
- **Icons**: `/public/android/`, `/public/ios/`, `/public/windows11/`

### Convención de Ramas

```bash
# Formato: <type>/<description>
git checkout -b feat/nueva-funcionalidad
git checkout -b fix/corregir-bug
git checkout -b docs/actualizar-readme
```

### Tipos de commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `style`: Cambios de estilo/formato
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests

### Proceso de Deploy

1. Crear PR con cambios
2. Review de código
3. Merge a main
4. Auto-deploy a producción via GitHub Actions

## Troubleshooting

### Errores Comunes

1. **Functions no se conectan**

   ```bash
   # Verificar que firebase-adminsdk.json existe
   ls functions/firebase-adminsdk.json
   ```

2. **Emuladores no inician**

   ```bash
   # Limpiar cache y reinstalar
   firebase logout && firebase login
   ```

3. **Build falla**

   ```bash
   # Limpiar node_modules y reinstalar
   rm -rf node_modules package-lock.json
   npm install
   ```

### Enlaces Útiles

- [Firebase Console](https://console.firebase.google.com)
- [Material-UI Docs](https://mui.com/)
- [Vite Docs](https://vitejs.dev/)
- [Recoil Docs](https://recoiljs.org/)

## Contacto

Para soporte técnico o consultas sobre el proyecto:

- **Email**: <contacto@mercadofiel.cl>
- **Sitio Web**: <https://mercadofiel.cl>
