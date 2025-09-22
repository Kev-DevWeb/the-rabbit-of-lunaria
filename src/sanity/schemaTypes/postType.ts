import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      name: 'metaTitle',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      group: 'meta',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
    }),
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
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authors: 'authors[].name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {authors} = selection
      return {...selection, subtitle: authors && `by ${authors.join(', ')}`}
    },
  },
})
