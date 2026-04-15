# 🔧 Lista de Mejoras, Correcciones y Optimizaciones

> **Proyecto:** La Madriguera de Lunaria  
> **Fecha de auditoría:** 2026-04-14  
> **Auditor:** Análisis full-stack completo

---

## 🔴 CRÍTICOS — Correcciones Urgentes

### C-01. Layout raíz como Client Component bloquea SEO
**Archivo:** `src/app/layout.tsx`  
**Problema:** El `layout.tsx` raíz usa `'use client'` y `usePathname()`, lo que **impide que Next.js exporte metadata** estática. El archivo `metadata.ts` existe pero está **completamente ignorado** porque no puede ser exportado desde un client component.  
**Impacto:** ❌ Sin meta tags en el HTML (título, descripción, OG, Twitter Cards). Google no tiene metadata para indexar.  
**Solución:**
- Convertir `layout.tsx` a Server Component
- Crear un componente wrapper client (`LayoutClient.tsx`) para la lógica de `usePathname`
- Exportar `metadata` desde un Server Component layout

```
// layout.tsx (Server Component)
export { metadata } from './metadata'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
```

---

### C-02. Idioma HTML incorrecto
**Archivo:** `src/app/layout.tsx` (línea 84)  
**Problema:** `<html lang="en">` — El sitio está enteramente en español.  
**Impacto:** Los motores de búsqueda interpretan el contenido como inglés; afecta SEO en español.  
**Solución:** Cambiar a `<html lang="es-MX">` o `<html lang="es">`

---

### C-03. Reglas de Firestore completamente abiertas
**Archivo:** `firestore.rules`  
**Problema:** `allow read, create: if true;` y `allow update, delete: if true;` — cualquier persona puede leer, crear, modificar y borrar TODAS las citas.  
**Impacto:** ⚠️ Un atacante puede borrar todas las citas, crear spam, o modificar citas existentes.  
**Solución:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // Cualquiera puede leer (para ver disponibilidad) y crear
      allow read, create: if true;
      // Solo admin puede actualizar/eliminar (usar Firebase Auth o autenticación custom)
      allow update, delete: if false; // O implementar auth admin
    }
  }
}
```

---

### C-04. Tasa de cambio USD/MXN hardcodeada
**Archivos:** `src/components/BookingSystem.tsx` (línea 118), `src/app/api/create-paypal-order/route.ts` (línea 45)  
**Problema:** `price * 0.05443` — Tasa de cambio fija. El peso fluctúa diariamente.  
**Impacto:** Los clientes pagarán de más o menos dependiendo del tipo de cambio real. Puede causar pérdidas.  
**Solución:**
- Usar un API de tipo de cambio (ExchangeRate-API, Fixer, Currency API)
- O definir los precios fijos en USD en `readings-data.ts` directamente
- O almacenar la tasa de cambio como variable de entono actualizable

---

### C-05. Inconsistencia en número de Arcanos Mayores
**Archivos:** `manifest.json` (dice "21"), `sobre-mi/page.tsx` (dice "22"), `metadata.ts` (dice "21")  
**Problema:** Inconsistencia entre "21" y "22" Arcanos Mayores en todo el sitio.  
**Solución:** Verificar con el dueño y unificar. Los Arcanos Mayores del tarot son **22** (0-El Loco hasta XXI-El Mundo).

---

## 🟠 IMPORTANTES — Mejoras de Rendimiento y Calidad

### I-01. Imágenes enormes sin optimizar en `/public/`
**Archivos afectados:**
| Archivo | Tamaño |
|---|---|
| `Cabaña.png` | **27.9 MB** |
| `lunacarta.jpg` | 7.4 MB |
| `cartablanca.jpg` | 5.6 MB |
| `cartamano.jpg` | 5.3 MB |
| `night.wav` | 22.2 MB |

**Impacto:** Tiempos de carga extremadamente largos. `Cabaña.png` sola puede tardar 15+ segundos en conexiones móviles.  
**Solución:**
- Convertir imágenes a **WebP** o **AVIF** (reducción ~80%)
- Usar `next/image` con `quality` reducida y tamaños responsivos
- Comprimir `Cabaña.png` (27.9MB → ~500KB en WebP)
- Eliminar `night.wav` (22MB) si ya existe `night.mp3` (1.2MB)
- Servir imágenes desde Sanity CDN cuando sea posible

---

### I-02. Archivos de prueba en la raíz del proyecto
**Archivos:**
- `test-audio.html`
- `test-free-music.html`
- `test-local-audio.html`
- `test-notifications.html`
- `check-categories.js`
- `check-categories.mjs`
- `PIXABAY-MUSIC.md`
- `PIXABAY-MUSIC-backup.md`
- `PLAYLISTS-GUIA.md`

**Impacto:** Desorden del proyecto, archivos temporales expuestos.  
**Solución:** Mover a una carpeta `_dev/` o eliminar los que ya no se necesiten.

---

### I-03. Script externo de geolocalización con `beforeInteractive`
**Archivo:** `src/app/layout.tsx` (línea 87)  
**Problema:** `BigDataCloud reverse geocode` se carga con `strategy="beforeInteractive"`, bloqueando el renderizado.  
**Impacto:** Retrasa First Contentful Paint y Largest Contentful Paint.  
**Solución:**
- Cambiar a `strategy="lazyOnload"` o `"afterInteractive"`
- Mejor aún: usar la API de geolocalización del navegador + una llamada fetch al server
- O detectar el país con el header `Accept-Language` del request

---

### I-04. Funciones de debug en producción
**Archivo:** `src/context/BackgroundMusicProvider.tsx` (líneas 201-234)  
**Problema:** `testNotification`, `clearNotifications`, `showManualNotification` expuestos en `window` global. Múltiples `console.log` de debug activos.  
**Impacto:** Código de desarrollo visible, consumo innecesario de memoria, logs en producción.  
**Solución:**
- Envolver en `if (process.env.NODE_ENV === 'development')`
- Remover console.logs de producción o usar un logger condicional

---

### I-05. Nombres de archivos con espacios y caracteres especiales
**Archivos:** `Cabaña.png`, `Plantilla diseño.png`, `cabañanoche.jpg`, `CELL 1_Grimorio.png`, etc.  
**Impacto:** Problemas potenciales de encoding en URLs, incompatibilidad entre sistemas operativos.  
**Solución:** Renombrar usando kebab-case: `cabana.webp`, `plantilla-diseno.webp`, `cell-1-grimorio.webp`

---

### I-06. Duplicidad en notificaciones de música
**Archivos:** `MusicNotification.tsx`, `MusicNotificationFixed.tsx`, `GlobalMusicNotifications.tsx`  
**Problema:** 3 archivos para el mismo feature. `MusicNotification.tsx` parece la versión anterior de `MusicNotificationFixed.tsx`.  
**Solución:** Consolidar en un solo componente y eliminar los obsoletos.

---

### I-07. Lenis rAF loop sin cleanup apropiado
**Archivo:** `src/context/LenisProvider.tsx` (líneas 33-38)  
**Problema:** El `requestAnimationFrame` loop no se cancela con `cancelAnimationFrame` en cleanup.  
**Solución:**
```tsx
useEffect(() => {
  const newLenis = new Lenis({ ... });
  let rafId: number;
  
  function raf(time: number) {
    newLenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);
  
  return () => {
    cancelAnimationFrame(rafId);
    newLenis.destroy();
  };
}, [isStudioPage]);
```

---

## 🟡 MODERADAS — Mejoras de Código y Buenas Prácticas

### M-01. Duplicación de lógica de email HTML
**Archivo:** `src/app/api/bookAppointment/route.ts`  
**Problema:** 4 templates HTML completos inline (>300 líneas de HTML en strings). Cada template se repite con variaciones mínimas.  
**Solución:**
- Crear un directorio `src/lib/email-templates/`
- Usar template functions: `getBookingConfirmedEmail(data)`, `getBookingPendingEmail(data)`
- Considerar usar `react-email` o handlebars para templates

---

### M-02. `send-confirmation/route.ts` es un endpoint redundante
**Archivo:** `src/app/api/send-confirmation/route.ts`  
**Problema:** Ya se envían emails dentro de `bookAppointment/route.ts`. Este endpoint parece duplicado.  
**Solución:** Evaluar si se usa y eliminarlo si no tiene un caso de uso diferenciado.

---

### M-03. Copyright año hardcodeado en emails
**Archivo:** `src/app/api/bookAppointment/route.ts`  
**Problema:** `© 2025 La Madriguera de Lunaria` hardcodeado en los templates de email.  
**Solución:** Usar `new Date().getFullYear()` dinámicamente.

---

### M-04. Layout de artículos es client component innecesariamente
**Archivo:** `src/app/articulos/layout.tsx`  
**Problema:** Hace `client.fetch` en un `useEffect` desde un client component. Podría ser un Server Component que hace fetch en el server.  
**Impacto:** Doble carga: SSR vacío → CSR con datos. Sin SEO para la navegación.  
**Solución:** 
- Convertir a Server Component con `async` fetch
- Pasar datos de navegación a los children via props o context

---

### M-05. Typo en BookingSystem - clase CSS incorrecta
**Archivo:** `src/components/BookingSystem.tsx` (línea 341)  
**Problema:** `bg-purple-900/so` — debería ser `.../50` (typo en opacity).  
**Solución:** Corregir a `bg-purple-900/50`

---

### M-06. `handleStartExperience` es una función vacía
**Archivo:** `src/app/page.tsx` (líneas 28-31)  
**Problema:** La función `handleStartExperience` está vacía y se pasa como prop.  
**Solución:** Si ya no se necesita, remover el boilerplate o implementar la lógica pendiente.

---

### M-07. Email regex débil
**Archivo:** `src/components/BookingSystem.tsx` (línea 237)  
**Problema:** `const emailRegex = /^[^"]+@[^"]+\.[^"]+$/;` — Acepta emails claramente inválidos.  
**Solución:** Usar validación HTML5 nativa (`type="email"` ya lo tiene) o una regex más robusta. Mejor aún: validar server-side.

---

### M-08. Tailwind CSS v4 con tailwind.config.ts (config v3)
**Archivos:** `tailwind.config.ts`, `postcss.config.mjs`, `globals.css`  
**Problema:** Se usa `@import "tailwindcss"` (v4) y `@theme inline` (v4), pero el `tailwind.config.ts` tiene formato v3 con `require()`. Tailwind v4 usa CSS-first configuration.  
**Solución:** Migrar completamente a Tailwind CSS v4 o downgrade a v3 para consistencia.

---

## 🔵 OPTIMIZACIONES PARA SANITY

### S-01. Agregar caché y revalidación a las GROQ queries
**Archivo:** `src/sanity/lib/client.ts`  
**Problema:** `useCdn: true` está bien para lectura, pero no hay estrategia de revalidación configurada.  
**Solución:**
```ts
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Considerar para ISR:
  // stega: { enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' },
})
```
- Implementar `revalidateTag` o `revalidatePath` en las queries
- Usar `next: { revalidate: 3600 }` para ISR (Incremental Static Regeneration)

---

### S-02. SanityLive configurado pero no usado
**Archivo:** `src/sanity/lib/live.ts`  
**Problema:** `SanityLive` y `sanityFetch` están exportados pero no se usan en el layout ni en los componentes. Esto significa que los contenidos no se actualizan en tiempo real.  
**Solución:**
- Si se quiere live preview: agregar `<SanityLive />` en el layout root
- Si no se necesita: remover el archivo para reducir confusión

---

### S-03. Schema de `author` demasiado simple
**Archivo:** `src/sanity/schemaTypes/authorType.ts`  
**Problema:** Solo tiene `name` y `slug`. No tiene imagen, bio, redes sociales. La página `/autores/[slug]` no tiene data para mostrar.  
**Solución:** Extender el schema:
```ts
defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
defineField({ name: 'bio', type: 'text' }),
defineField({ name: 'socialLinks', type: 'array', of: [{ type: 'url' }] }),
```

---

### S-04. SEOGenerator usa PatchEvent de manera no estándar
**Archivo:** `src/sanity/components/SEOGenerator.tsx`  
**Problema:** Actualiza campos hermanos (`metaTitle`, `metaDescription`, `keywords`) desde dentro de un campo `seoGenerator`. La API de `onChange` en Sanity v4 ha evolucionado y `PatchEvent` con rutas absolutas (`['metaTitle']`) podría no funcionar como se espera.  
**Solución:**
- Testear que la funcionalidad realmente escribe los campos
- Considerar usar `useDocumentOperation` o `document.patch` del action API
- Alternativamente, usar `useFormValue` solo para lectura y un Action button para escritura

---

### S-05. Estructura asíncrona del desk puede causar lentitud
**Archivo:** `src/sanity/structure.ts`  
**Problema:** La función `structure` es `async` y hace un `fetch` a Sanity cada vez que se renderiza el panel. Si hay muchas categorías, esto puede ralentizar el Studio.  
**Solución:**
- El fetch en `structure` se ejecuta en cada render del sidebar
- Considerar usar `structureTool` con listeners en vez de async fetch
- O aceptar el trade-off si son pocas categorías

---

### S-06. Imágenes del editor PT sin lazy loading
**Archivo:** `src/sanity/studio.css`  
**Problema:** Las imágenes en el editor portable text no tienen optimización de carga.  
**Nota:** Esto es más limitación de Sanity que algo configurable via CSS. Documentar como FYI.

---

### S-07. Falta validación required en campos clave de post
**Archivo:** `src/sanity/schemaTypes/postType.ts`  
**Problema:** `title`, `slug`, `body`, `publishedAt` no tienen `validation: Rule => Rule.required()`. Un editor podría publicar un post vacío.  
**Solución:**
```ts
defineField({
  name: 'title',
  type: 'string',
  validation: Rule => Rule.required().error('El título es obligatorio'),
}),
defineField({
  name: 'slug',
  type: 'slug',
  validation: Rule => Rule.required(),
  options: { source: 'title' },
}),
```

---

### S-08. Falta un schema para "configuración del sitio"
**Sugerencia:** Crear un schema singleton para configuración global:
```ts
// siteSettingsType.ts
export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string' }),
    defineField({ name: 'siteDescription', type: 'text' }),
    defineField({ name: 'socialLinks', type: 'object', fields: [...] }),
    defineField({ name: 'contactEmail', type: 'string' }),
    defineField({ name: 'defaultOGImage', type: 'image' }),
  ],
})
```
Beneficios: Cambiar textos del sitio sin tocar código.

---

## 🟢 MEJORAS GENERALES SUGERIDAS

### G-01. Agregar Error Boundaries
**Problema:** No hay manejo de errores a nivel de componente. Si un componente falla, toda la app crashea.  
**Solución:** Crear `error.tsx` en cada ruta y un `global-error.tsx` raíz.

---

### G-02. Agregar loading states con Suspense
**Problema:** Solo `articulos/page.tsx` tiene Suspense. Las demás páginas no tienen loading UI.  
**Solución:** Agregar `loading.tsx` en las rutas principales.

---

### G-03. Implementar Analytics completamente
**Archivo:** `src/lib/firebase.ts`  
**Problema:** Firebase Analytics se inicializa pero no se usa para trackear eventos.  
**Solución:** Agregar tracking de eventos clave (page views, booking started, booking completed, etc.)

---

### G-04. Agregar tests
**Problema:** No hay tests unitarios, de integración ni E2E.  
**Solución:** Configurar Jest + React Testing Library para componentes clave (BookingSystem, API routes).

---

### G-05. Configurar prettier
**Problema:** Inconsistencia en formato de código (mezcla de comillas simples y dobles, con/sin punto y coma).  
**Solución:** Agregar `.prettierrc` y formatear todo el proyecto.

---

### G-06. Crear `.env.example`
**Problema:** No hay plantilla de variables de entorno. Un nuevo desarrollador no sabe qué variables necesita.  
**Solución:** Crear `.env.example` con todas las variables documentadas (sin valores sensibles).

---

### G-07. Next.js Image optimization más agresiva
**Archivo:** `next.config.ts`  
**Sugerencia:** Agregar formatos optimizados:
```ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}
```

---

### G-08. Considerar rate limiting en API routes
**Archivos:** Todas las API routes  
**Problema:** No hay rate limiting. Un atacante podría spamear citas o emails.  
**Solución:** Implementar rate limiting con `next-rate-limit` o con un middleware personalizado.

---

## 📊 Resumen de Prioridades

| Prioridad | ID | Descripción | Esfuerzo |
|---|---|---|---|
| 🔴 Crítico | C-01 | Layout raíz → Server Component | Medio |
| 🔴 Crítico | C-02 | `lang="en"` → `lang="es"` | Trivial |
| 🔴 Crítico | C-03 | Firestore rules inseguras | Bajo |
| 🔴 Crítico | C-04 | Tasa de cambio hardcodeada | Medio |
| 🔴 Crítico | C-05 | Inconsistencia 21/22 Arcanos | Trivial |
| 🟠 Importante | I-01 | Optimizar imágenes (+27MB) | Medio |
| 🟠 Importante | I-02 | Limpiar archivos de test | Bajo |
| 🟠 Importante | I-03 | Script geocoding → lazyOnload | Trivial |
| 🟠 Importante | I-04 | Remover debug de producción | Bajo |
| 🟠 Importante | I-05 | Renombrar archivos con espacios | Bajo |
| 🟠 Importante | I-06 | Consolidar notificaciones música | Bajo |
| 🟠 Importante | I-07 | Fix Lenis rAF cleanup | Trivial |
| 🟡 Moderada | M-01 | Extraer templates de email | Medio |
| 🟡 Moderada | M-04 | Artículos layout → Server | Medio |
| 🟡 Moderada | M-05 | Fix typo `bg-purple-900/so` | Trivial |
| 🟡 Moderada | M-08 | Tailwind v3/v4 consistencia | Medio |
| 🔵 Sanity | S-01 | Caché + revalidación queries | Medio |
| 🔵 Sanity | S-03 | Extender schema de author | Bajo |
| 🔵 Sanity | S-07 | Validación required en post | Trivial |
| 🔵 Sanity | S-08 | Schema de configuración sitio | Medio |
| 🟢 General | G-01 | Error Boundaries | Bajo |
| 🟢 General | G-06 | Crear `.env.example` | Trivial |
| 🟢 General | G-07 | Next.js Image formats | Trivial |
