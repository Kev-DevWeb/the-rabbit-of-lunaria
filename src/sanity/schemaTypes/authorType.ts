import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Aportador',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del aportador',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      hidden: true,
    }),
    defineField({
      name: 'relatedArticlesUrl',
      title: 'Artículos Relacionados',
      type: 'url',
      description: 'URL a una página que muestra todos los artículos de este aportador.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
