import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{type: 'category'}],
      description: 'Asigna una categoría padre para crear sub-categorías.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Número de orden para organizar las categorías. Menor número = mayor prioridad.',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderRank',
      by: [{field: 'orderRank', direction: 'asc'}]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}]
    },
    {
      title: 'Title Z-A', 
      name: 'titleDesc',
      by: [{field: 'title', direction: 'desc'}]
    }
  ],
  preview: {
    select: {
      title: 'title',
      parent: 'parent.title',
      order: 'orderRank'
    },
    prepare(selection) {
      const {title, parent, order} = selection
      return {
        title: title,
        subtitle: parent ? `Sub-category of: ${parent} | Order: ${order ?? 0}` : `Main category | Order: ${order ?? 0}`
      }
    }
  }
})
