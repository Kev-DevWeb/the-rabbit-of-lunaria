/**
 * Sanity Live Content API
 * 
 * NOTA: Este archivo está configurado pero NO activado.
 * Para activar live preview en tiempo real:
 * 1. Importar `SanityLive` en el layout raíz
 * 2. Agregar `<SanityLive />` dentro del body
 * 3. Usar `sanityFetch` en vez de `client.fetch` en los componentes
 * 
 * Beneficio: Los contenidos se actualizan automáticamente sin recargar.
 * Costo: Más conexiones WebSocket activas.
 * 
 * Para producción, se recomienda usar ISR (revalidate) en vez de Live API
 * para mejor rendimiento. Live API es ideal para modo preview/draft.
 */

import { defineLive } from "next-sanity/live";
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
});
