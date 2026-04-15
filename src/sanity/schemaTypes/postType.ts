import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import { SEOGenerator } from '../components/SEOGenerator'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      name: 'meta',
      title: 'Meta',
    },
  ],
  fields: [
    defineField({
      name: 'seoGenerator',
      title: 'Generador de SEO',
      type: 'object',
      group: 'meta',
      fields: [
        {
          name: 'placeholder',
          type: 'string',
          hidden: true
        }
      ],
      components: {
        input: SEOGenerator
      }
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      group: 'meta',
      description: 'Título optimizado para SEO (50-60 caracteres recomendados)',
      validation: Rule => Rule.max(60).warning('Se recomienda mantener el título por debajo de 60 caracteres')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      group: 'meta',
      description: 'Descripción que aparece en los resultados de búsqueda (150-160 caracteres)',
      validation: Rule => Rule.max(160).warning('Se recomienda mantener la descripción por debajo de 160 caracteres')
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords (SEO)',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
      description: 'Palabras clave relevantes para el artículo (máximo 15 recomendadas)',
      validation: Rule => Rule.max(15).warning('Se recomienda no usar más de 15 keywords')
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required().error('El título es obligatorio'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: Rule => Rule.required().error('El slug es obligatorio'),
    }),
    defineField({
      name: 'authors',
      title: 'Aportadores',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'author'}})],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
        defineField({
          name: 'width',
          type: 'number',
          title: 'Width',
          readOnly: true,
        }),
        defineField({
          name: 'height',
          type: 'number',
          title: 'Height',
          readOnly: true,
        }),
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: Rule => Rule.required().error('La fecha de publicación es obligatoria'),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      validation: Rule => Rule.required().error('El contenido del artículo es obligatorio'),
    }),
  ],
 preview: {
  select: {
    title: 'title',
    author: 'authors.0.name', // Solo el primer autor
    media: 'mainImage',
  },
  prepare(selection) {
    const {author} = selection
    return {...selection, subtitle: author ? `by ${author}` : 'No author'}
  },
},
})
