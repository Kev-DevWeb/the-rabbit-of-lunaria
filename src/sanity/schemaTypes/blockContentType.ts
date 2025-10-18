import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * Este es el schema type para block content usado en los posts
 * Configurado con opciones mejoradas para mejor experiencia de edición
 */

export const blockContentType = defineType({
  title: 'Contenido del Artículo',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Estilos disponibles para los bloques de texto
      styles: [
        {title: 'Párrafo Normal', value: 'normal'},
        {title: 'Título 1 (H1)', value: 'h1'},
        {title: 'Título 2 (H2)', value: 'h2'},
        {title: 'Título 3 (H3)', value: 'h3'},
        {title: 'Título 4 (H4)', value: 'h4'},
        {title: 'Cita / Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Viñetas', value: 'bullet'},
        {title: 'Lista Numerada', value: 'number'},
      ],
      // Marcas para texto inline
      marks: {
        decorators: [
          {title: 'Negrita', value: 'strong'},
          {title: 'Cursiva', value: 'em'},
          {title: 'Subrayado', value: 'underline'},
          {title: 'Tachado', value: 'strike-through'},
          {title: 'Código', value: 'code'},
        ],
        annotations: [
          {
            title: 'Enlace (URL)',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              },
              {
                title: 'Abrir en nueva pestaña',
                name: 'blank',
                type: 'boolean',
                initialValue: true
              }
            ],
          },
          {
            title: 'Color del Texto',
            name: 'color',
            type: 'object',
            icon: () => '🎨',
            fields: [
              {
                title: 'Color',
                name: 'hex',
                type: 'string',
                options: {
                  list: [
                    {title: '🟣 Púrpura', value: '#a855f7'},
                    {title: '🌸 Rosa', value: '#ec4899'},
                    {title: '🔵 Azul', value: '#3b82f6'},
                    {title: '🟢 Verde', value: '#10b981'},
                    {title: '🟡 Amarillo', value: '#f59e0b'},
                    {title: '🔴 Rojo', value: '#ef4444'},
                    {title: '⚫ Gris', value: '#6b7280'},
                    {title: '⚪ Blanco', value: '#ffffff'},
                    {title: '🟠 Dorado', value: '#d97706'},
                  ]
                }
              }
            ]
          },
          {
            title: 'Tamaño de Fuente',
            name: 'fontSize',
            type: 'object',
            icon: () => '📏',
            fields: [
              {
                title: 'Tamaño',
                name: 'size',
                type: 'string',
                options: {
                  list: [
                    {title: 'Extra Pequeño', value: 'xs'},
                    {title: 'Pequeño', value: 'sm'},
                    {title: 'Normal', value: 'base'},
                    {title: 'Grande', value: 'lg'},
                    {title: 'Extra Grande', value: 'xl'},
                    {title: '2X Grande', value: '2xl'},
                    {title: '3X Grande', value: '3xl'},
                  ]
                }
              }
            ]
          },
        ],
      },
    }),
    // Imágenes con campos mejorados
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      title: 'Imagen',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
          description: 'Importante para SEO y accesibilidad',
          validation: (Rule) => Rule.required().error('El texto alternativo es obligatorio')
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Pie de Imagen',
          description: 'Texto que aparece debajo de la imagen'
        }
      ]
    }),
    // Videos de YouTube/Vimeo
    defineArrayMember({
      name: 'videoEmbed',
      title: 'Video (YouTube/Vimeo)',
      type: 'object',
      icon: () => '🎥',
      fields: [
        {
          name: 'url',
          title: 'URL del Video',
          type: 'url',
          description: 'Pega la URL de YouTube o Vimeo',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'caption',
          title: 'Pie del Video',
          type: 'string',
        }
      ],
      preview: {
        select: {
          url: 'url'
        },
        prepare({url}) {
          return {
            title: 'Video Embebido',
            subtitle: url
          }
        }
      }
    }),
    // Bloque de nota/advertencia
    defineArrayMember({
      name: 'callout',
      title: 'Nota Destacada',
      type: 'object',
      icon: () => '📌',
      fields: [
        {
          name: 'text',
          title: 'Texto',
          type: 'text',
          rows: 3
        },
        {
          name: 'type',
          title: 'Tipo de Nota',
          type: 'string',
          options: {
            list: [
              {title: '💡 Consejo', value: 'tip'},
              {title: '⚠️ Advertencia', value: 'warning'},
              {title: 'ℹ️ Información', value: 'info'},
              {title: '✨ Importante', value: 'important'},
            ]
          },
          initialValue: 'tip'
        }
      ],
      preview: {
        select: {
          text: 'text',
          type: 'type'
        },
        prepare({text, type}) {
          const icons = {
            tip: '💡',
            warning: '⚠️',
            info: 'ℹ️',
            important: '✨'
          }
          return {
            title: `${icons[type as keyof typeof icons] || '📌'} Nota`,
            subtitle: text
          }
        }
      }
    }),
  ],
})
