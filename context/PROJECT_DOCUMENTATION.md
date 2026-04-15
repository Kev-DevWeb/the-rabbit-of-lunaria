# 📖 Documentación del Proyecto — La Madriguera de Lunaria

> **Última actualización:** 2026-04-14  
> **Versión:** 0.1.0  
> **Estado:** En desarrollo activo

---

## 1. Resumen General

**La Madriguera de Lunaria** es una aplicación web temática de tarot y espiritualidad que ofrece:

- 🔮 **Sistema de agendamiento de citas** con pagos vía PayPal y transferencia bancaria
- 📚 **Blog (El Grimorio de Lunaria)** — artículos gestionados con Sanity CMS
- 🌙 **Página "Sobre mí"** con animaciones interactivas
- 🎵 **Reproductor de música ambiental** integrado vía YouTube (playlist)
- ✨ **Animación cinematográfica de inicio** con cielo estrellado
- 📧 **Sistema de notificaciones email** para confirmaciones de citas
- 🔍 **SEO optimizado** con sitemap dinámico, robots.txt y metadata

**URL de producción:** `https://www.themadrigueradelunaria.com`  
**URL de Vercel:** `https://the-rabbit-of-lunaria.vercel.app`

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 15.5.2 |
| Lenguaje | TypeScript | ^5 |
| UI/Estilos | Tailwind CSS | ^4 |
| CMS | Sanity | ^4.9.0 |
| Base de datos (citas) | Firebase Firestore | ^12.2.1 |
| Autenticación Admin | Firebase Admin SDK | ^13.5.0 |
| Pagos | PayPal JS SDK | ^8.9.1 |
| Animaciones | GSAP + Framer Motion | ^3.13.0 / ^12.23.12 |
| 3D | Three.js + React Three Fiber | ^0.179.1 |
| Smooth Scroll | Lenis | ^1.3.11 |
| Email | Nodemailer | ^7.0.6 |
| Iconos | Lucide React | ^0.544.0 |
| Rich Text | @portabletext/react | ^4.0.3 |
| Calendario | react-day-picker | ^9.9.0 |
| Partículas | tsparticles | ^3.9.1 |

---

## 3. Arquitectura del Proyecto

### 3.1 Estructura de Directorios

```
the-rabbit-of-lunaria/
├── context/                      # ← Documentación del proyecto (esta carpeta)
├── public/                       # Assets estáticos
│   ├── *.svg, *.png, *.jpg       # Imágenes y gráficos
│   ├── *.mp3, *.wav              # Archivos de audio
│   ├── manifest.json             # PWA manifest
│   └── robots.txt                # SEO - directivas de crawlers
├── src/
│   ├── app/                      # Next.js App Router (páginas y rutas)
│   │   ├── layout.tsx            # Layout raíz (CLIENT COMPONENT ⚠️)
│   │   ├── page.tsx              # Página de inicio
│   │   ├── metadata.ts           # Metadata SEO global (NO SE USA ⚠️)
│   │   ├── globals.css           # Estilos globales + Tailwind
│   │   ├── sitemap.ts            # Sitemap dinámico
│   │   ├── api/                  # API Routes (Route Handlers)
│   │   │   ├── bookAppointment/  # POST: Crear cita + enviar emails
│   │   │   ├── cancelAppointment/# Cancelar cita por token
│   │   │   ├── confirmAppointment/# Confirmar cita
│   │   │   ├── create-paypal-order/# POST: Crear orden PayPal
│   │   │   ├── generate-seo/     # POST: Generar SEO con IA
│   │   │   └── send-confirmation/# POST: Enviar email de confirmación
│   │   ├── articulos/            # Blog / El Grimorio
│   │   │   ├── layout.tsx        # Layout con navegación Anterior/Siguiente
│   │   │   ├── page.tsx          # Lista de artículos (BookshelfGrimorio)
│   │   │   └── [slug]/           # Artículo individual dinámico
│   │   ├── autores/[slug]/       # Página de autor individual
│   │   ├── citas/                # Sistema de agendamiento
│   │   ├── confirmation/[status]/# Página de confirmación post-pago
│   │   ├── sobre-mi/             # Página "Sobre mí"
│   │   └── studio/               # Sanity Studio (embebido)
│   ├── components/               # Componentes React reutilizables
│   │   ├── Header.tsx            # Navbar con controles de música
│   │   ├── AppFooter.tsx         # Footer con créditos
│   │   ├── BookingSystem.tsx     # Sistema completo de citas
│   │   ├── BookshelfGrimorio.tsx # Vista de libros para artículos
│   │   ├── ArticulosContent.tsx  # Vista alternativa de artículos
│   │   ├── ArticleContent.tsx    # Renderizado de artículo individual
│   │   ├── MagicHeroSection.tsx  # Hero de la página principal
│   │   ├── ServicesSection.tsx   # Sección de servicios
│   │   ├── CommunitySection.tsx  # Sección de comunidad
│   │   ├── StarrySky.tsx         # Animación cinemática inicial
│   │   ├── StarBackground.tsx    # Fondo estrellado reutilizable
│   │   ├── Constellation.tsx     # Componente de constelación SVG
│   │   ├── FloatingButton.tsx    # Botón flotante CTA
│   │   ├── TableOfContents.tsx   # Tabla de contenidos de artículos
│   │   ├── PageTransition.tsx    # Transiciones entre páginas
│   │   ├── GlobalMusicNotifications.tsx # Notificaciones de canciones
│   │   ├── MusicNotification.tsx        # Notificación individual
│   │   ├── MusicNotificationFixed.tsx   # Notificación arreglada
│   │   ├── Cover.tsx             # Componente de portada
│   │   └── Page.tsx              # Componente de página genérica
│   ├── context/                  # React Context Providers
│   │   ├── BackgroundMusicProvider.tsx  # Proveedor de música YouTube
│   │   └── LenisProvider.tsx            # Proveedor de smooth scroll
│   ├── lib/                      # Utilidades y configuraciones
│   │   ├── firebase.ts           # Firebase Client SDK
│   │   ├── firebaseAdmin.ts      # Firebase Admin SDK (server-side)
│   │   ├── music-playlists.ts    # Datos de playlists de música
│   │   ├── music-playlists-simple.ts  # Playlists simplificadas
│   │   ├── readings-data.ts      # Datos de lecturas/precios
│   │   ├── utils.ts              # Utilidades generales
│   │   └── youtube-player.ts     # Servicio del reproductor YouTube
│   ├── sanity/                   # Configuración de Sanity CMS
│   │   ├── env.ts                # Variables de entorno Sanity
│   │   ├── structure.ts          # Estructura del desk (sidebar)
│   │   ├── studio.css            # CSS personalizado del Studio
│   │   ├── components/
│   │   │   └── SEOGenerator.tsx  # Componente generador SEO en Studio
│   │   ├── lib/
│   │   │   ├── client.ts         # Cliente Sanity para queries
│   │   │   ├── image.ts          # URL builder para imágenes
│   │   │   └── live.ts           # Sanity Live Content API
│   │   └── schemaTypes/
│   │       ├── index.ts          # Registro de schemas
│   │       ├── postType.ts       # Schema: Artículo/Post
│   │       ├── categoryType.ts   # Schema: Categoría
│   │       ├── authorType.ts     # Schema: Autor/Aportador
│   │       └── blockContentType.ts # Schema: Contenido rich text
│   └── types/
│       └── readings.ts           # Tipos TypeScript (Booking, TarotReading)
├── sanity.config.ts              # Configuración raíz de Sanity Studio
├── sanity.cli.ts                 # Configuración del CLI de Sanity
├── firebase.json                 # Configuración de Firebase
├── firestore.rules               # Reglas de seguridad de Firestore
├── firestore.indexes.json        # Índices de Firestore
├── next.config.ts                # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind CSS
├── tsconfig.json                 # Configuración de TypeScript
├── eslint.config.mjs             # Configuración de ESLint
├── postcss.config.mjs            # Configuración de PostCSS
└── package.json                  # Dependencias y scripts
```

### 3.2 Diagrama de Flujo de Datos

```
┌──────────────────────────────────────────────────┐
│                  CLIENTE (Browser)                │
│                                                   │
│  ┌─────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │ Next.js │  │ YouTube  │  │ BDC Reverse     │  │
│  │ App     │  │ IFrame   │  │ Geocode (CDN)   │  │
│  │ Router  │  │ Player   │  │ (Detección país)│  │
│  └────┬────┘  └────┬─────┘  └────────┬────────┘  │
│       │             │                 │           │
└───────┼─────────────┼─────────────────┼───────────┘
        │             │                 │
        ▼             ▼                 ▼
┌───────────────────────────────────────────────────┐
│              NEXT.JS SERVER (Vercel)              │
│                                                   │
│  ┌─────────────────┐  ┌────────────────────────┐  │
│  │  API Routes     │  │  Server Components     │  │
│  │  ─────────────  │  │  ───────────────────   │  │
│  │  /bookAppoint.  │  │  sitemap.ts (dinámico) │  │
│  │  /create-paypal │  │  artículos/[slug]      │  │
│  │  /send-confirm. │  │  autores/[slug]        │  │
│  │  /generate-seo  │  │                        │  │
│  │  /cancelAppoint │  │                        │  │
│  │  /confirmAppoint│  │                        │  │
│  └────────┬────────┘  └───────────┬────────────┘  │
│           │                       │               │
└───────────┼───────────────────────┼───────────────┘
            │                       │
     ┌──────┼───────────────────────┼──────┐
     │      ▼                       ▼      │
     │  ┌────────┐          ┌──────────┐   │
     │  │Firebase│          │  Sanity  │   │
     │  │Firestore│         │  CMS     │   │
     │  │(Citas) │          │ (Blog)   │   │
     │  └────────┘          └──────────┘   │
     │                                     │
     │      ▼                       ▼      │
     │  ┌────────┐          ┌──────────┐   │
     │  │Gmail   │          │ PayPal   │   │
     │  │SMTP    │          │  API     │   │
     │  │(Emails)│          │ (Pagos)  │   │
     │  └────────┘          └──────────┘   │
     │         SERVICIOS EXTERNOS          │
     └─────────────────────────────────────┘
```

---

## 4. Rutas de la Aplicación

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Client Page | Página de inicio con cinemática, hero, servicios y comunidad |
| `/sobre-mi` | Client Page | Página "Sobre mí" con rabbit interactivo y servicios |
| `/articulos` | Server Page | Lista de artículos (BookshelfGrimorio) |
| `/articulos/[slug]` | Dynamic Page | Artículo individual renderizado desde Sanity |
| `/autores/[slug]` | Dynamic Page | Perfil de autor |
| `/citas` | Client Page | Sistema de agendamiento con calendario y pagos |
| `/confirmation/[status]` | Dynamic Page | Confirmación post-cita (success/pending) |
| `/studio` | Sanity Studio | CMS embebido en la aplicación |

### API Routes

| Ruta | Método | Descripción |
|---|---|---|
| `/api/bookAppointment` | POST | Crea booking en Firestore + envía emails (usuario y admin) |
| `/api/cancelAppointment` | GET | Cancela una cita usando token |
| `/api/confirmAppointment` | - | Confirma una cita pendiente |
| `/api/create-paypal-order` | POST | Crea orden de pago en PayPal |
| `/api/send-confirmation` | POST | Envía email de confirmación |
| `/api/generate-seo` | POST | Genera metadatos SEO con IA |

---

## 5. Sanity CMS — Configuración Detallada

### 5.1 Schemas

#### `post` (Artículo)
- `seoGenerator` — Componente custom para generar SEO (grupo: meta)
- `metaTitle` — String, max 60 chars (grupo: meta)
- `metaDescription` — Text, max 160 chars (grupo: meta)
- `keywords` — Array de strings, max 15 (grupo: meta)
- `title` — String
- `slug` — Slug (source: title)
- `authors` — Array de referencias a `author` (label: "Aportadores")
- `mainImage` — Image con hotspot + alt, caption, width, height
- `categories` — Array de referencias a `category`
- `publishedAt` — Datetime
- `body` — `blockContent` (rich text)

#### `category` (Categoría)
- `title` — String
- `slug` — Slug
- `description` — Text
- `parent` — Referencia a `category` (subcategorías jerárquicas)
- `orderRank` — Number (ordenamiento manual)

#### `author` (Aportador)
- `name` — String (required)
- `slug` — Slug

#### `blockContent` (Contenido Rich Text)
Tipos de bloque disponibles:
- **Texto:** h1-h4, blockquote, listas (bullet, number)
- **Decoradores:** negrita, cursiva, subrayado, tachado, código
- **Annotations:** Link (URL + blank), Color de texto (9 opciones), Tamaño de fuente (xs–3xl)
- **Embeds:** Imagen (con alt y caption), Video YouTube/Vimeo, Nota destacada (tip/warning/info/important)

### 5.2 Estructura del Desk (Sidebar)
- 📷 Galería de Artículos — Vista visual
- 📝 Todos los Artículos (Lista) — Vista de lista
- 🏷️ Gestionar Categorías
- 👤 Gestionar Aportadores
- ── (Divisor) ──
- 📚 [Categorías dinámicas] — Artículos filtrados por categoría

### 5.3 Sanity Studio
- Montado en `/studio`
- Plugins: `structureTool`, `media` (gestión de assets), `visionTool` (GROQ queries)
- CSS personalizado: `src/sanity/studio.css` (scroll, editor visual, responsive)
- Componente SEO Generator integrado en el formulario de posts
- API Version: `2025-09-22`

### 5.4 Sanity Client
- **Client:** `next-sanity` con `useCdn: true`
- **Image URL Builder:** `@sanity/image-url`
- **Live Content API:** `defineLive` configurado pero no utilizado activamente en layout

---

## 6. Firebase — Configuración

### 6.1 Firestore
- **Colección:** `bookings`
- **Campos por documento:**
  - `date` (string: yyyy-MM-dd)
  - `time` (string: HH:mm)
  - `name` (string)
  - `email` (string)
  - `readingId` (string)
  - `readingTitle` (string)
  - `status` ('pending' | 'confirmed')
  - `paymentMethod` ('paypal' | 'bankTransfer')
  - `paymentId` (string | null)
  - `cancelToken` (string uuid)
  - `createdAt` (string ISO)

### 6.2 Security Rules
```
allow read, create: if true;
allow update, delete: if true;
```
⚠️ **INSEGURO** — Todo público, sin restricciones.

### 6.3 Firebase Admin
- Se inicializa desde `FIREBASE_ADMIN_SDK_CONFIG` (JSON en variable de entorno)
- Se usa en API routes para escritura server-side

---

## 7. Variables de Entorno Requeridas

### Públicas (NEXT_PUBLIC_*)
| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset de Sanity (production) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Versión API de Sanity |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID (público) |
| `NEXT_PUBLIC_APP_URL` | URL base de la aplicación |

### Privadas (Server-only)
| Variable | Uso |
|---|---|
| `FIREBASE_ADMIN_SDK_CONFIG` | JSON completo de la service account |
| `GMAIL_EMAIL` | Cuenta Gmail para envío |
| `GMAIL_APP_PASSWORD` | App password de Gmail |
| `ADMIN_EMAIL` | Email del administrador para notificaciones |
| `PAYPAL_CLIENT_ID` | PayPal client ID (server) |
| `PAYPAL_CLIENT_SECRET` | PayPal secret |
| `PAYPAL_API_URL` | URL de la API de PayPal (sandbox/live) |

---

## 8. Sistema de Música Ambiental

- **Fuente:** YouTube Playlist (`PL4SJvJ-lWGWX2CFXEi7l92UJk-q91szHJ`)
- **Implementación:** `YouTubePlayerService` (clase custom en `src/lib/youtube-player.ts`)
- **Features:** Play/Pause con fade, skip anterior/siguiente, notificaciones de cambio de canción
- **Provider:** `BackgroundMusicProvider` (React Context)
- **Controles:** Integrados en Header (desktop y mobile)
- **Autoplay:** Se inicia automáticamente al completar la cinemática de inicio
- **UI:** Notificaciones toast cuando cambia la canción

---

## 9. Sistema de Citas (Booking)

### Flujo del usuario:
1. Seleccionar tipo de lectura (3 opciones)
2. Seleccionar fecha en calendario
3. Seleccionar hora disponible
4. Completar nombre y email
5. Elegir método de pago (PayPal o Transferencia)
6. PayPal → Pago inmediato → Cita confirmada
7. Transferencia → Cita pendiente → Se envían datos bancarios

### Lecturas disponibles:
| ID | Título | Precio (MXN) | Duración |
|---|---|---|---|
| `3-cards` | Tirada de 3 Cartas | $50.00 | 30 min |
| `past-lives` | Lectura de Vidas Pasadas | $100.00 | 30 min |
| `past-life-present` | Vidas Pasadas + 3 Cartas | $150.00 | 60 min |

### Detección de moneda:
- Se usa `BDCReverseGeocode` (BigDataCloud CDN) para detectar el país
- Si no es México → Precio en USD (conversión fija: `MXN * 0.05443`)

---

## 10. SEO y Rendimiento

### Implementado:
- ✅ `metadata.ts` con Open Graph, Twitter Cards, keywords
- ✅ `sitemap.ts` dinámico (artículos + autores de Sanity)
- ✅ `robots.txt` con Disallow para `/api/` y `/studio`
- ✅ `manifest.json` para PWA
- ✅ JSON-LD (WebSite + Organization) en layout
- ✅ Google Fonts optimizados (Cinzel Decorative, Playfair Display, Cormorant Garamond)
- ✅ Generador SEO integrado en Sanity Studio (via API /api/generate-seo)

### Problemas detectados:
- ❌ `metadata.ts` definido pero **NO exportado** desde layout (el layout es client component)
- ❌ `<html lang="en">` incorrecto — debería ser `"es"` o `"es-MX"`
- ❌ Open Graph image usa ruta relativa (`/Plantilla diseño.png`) — debería ser URL absoluta
- ❌ manifest.json dice "21 Arcanos Mayores", debería ser "22"
- ❌ No hay `<meta name="viewport">` explícito (Next.js lo agrega automáticamente, pero verificar)

---

## 11. Fuentes Tipográficas

| Fuente | Variable CSS | Uso |
|---|---|---|
| Geist Sans | `--font-geist-sans` | General sans-serif |
| Geist Mono | `--font-geist-mono` | Código monospace |
| Cinzel Decorative | `--font-cinzel-decorative` | Títulos h1, h2, navbar |
| Playfair Display | `--font-playfair-display` | Decorativo (poco usado) |
| Cormorant Garamond | `--font-cormorant-garamond` | Body principal |

---

## 12. Assets Estáticos Importantes

### Imágenes pesadas (candidatas a optimización):
| Archivo | Tamaño |
|---|---|
| `Cabaña.png` | **27.9 MB** ⚠️ |
| `lunacarta.jpg` | 7.4 MB |
| `cartablanca.jpg` | 5.6 MB |
| `cartamano.jpg` | 5.3 MB |
| `night.wav` | 22.2 MB |
| `musicafondo.mp3` | 3.9 MB |
| `mesamadera.jpg` | 1.9 MB |

### Archivos de test (candidatos a eliminación):
- `test-audio.html`
- `test-free-music.html`
- `test-local-audio.html`
- `test-notifications.html`
- `check-categories.js`
- `check-categories.mjs`

---

## 13. Scripts Disponibles

```bash
npm run dev     # Servidor de desarrollo con Turbopack
npm run build   # Build de producción
npm run start   # Servidor de producción
npm run lint    # ESLint
```
