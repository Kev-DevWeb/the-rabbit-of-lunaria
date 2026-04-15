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
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto de perfil',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      rows: 4,
      description: 'Breve descripción del aportador',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter / X',
          type: 'url',
        }),
        defineField({
          name: 'website',
          title: 'Sitio Web',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
