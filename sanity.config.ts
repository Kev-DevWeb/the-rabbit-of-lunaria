/**
 * Configuración de Sanity Studio para La Madriguera de Lunaria
 * Montado en la ruta /studio
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'

// Configuración del proyecto
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Estilos personalizados
import './src/sanity/studio.css'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'El Grimorio de Lunaria',
  
  // Schema del contenido
  schema,
  
  // Plugins
  plugins: [
    structureTool({
      structure,
      // Mostrar el panel de vista previa por defecto
      defaultDocumentNode: (S, {schemaType}) => {
        if (schemaType === 'post') {
          return S.document().views([
            S.view.form(),
            // Puedes agregar vista previa aquí si lo deseas
          ])
        }
        return S.document()
      }
    }),
    
    // Plugin de gestión de medios mejorado
    media(),
    
    // Vision tool para queries GROQ
    visionTool({defaultApiVersion: apiVersion}),
  ],
  
  // Configuración del editor
  document: {
    // Autoguardado más frecuente
    productionUrl: async (prev, context) => {
      return prev
    }
  },
  
  // Configuración de formularios
  form: {
    // Renderizado de imágenes en vista previa
    image: {
      // Directamente mostrar imágenes
      directUploads: true,
    },
  },
})