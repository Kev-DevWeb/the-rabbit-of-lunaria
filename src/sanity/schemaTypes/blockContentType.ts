import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'H5', value: 'h5'},
        {title: 'H6', value: 'h6'},
        {title: 'Quote', value: 'blockquote'},
        {title: 'Small Text', value: 'small'},
        {title: 'Large Text', value: 'large'},
      ],
      lists: [
        {title: 'Bullet Points', value: 'bullet'},
        {title: 'Numbered List', value: 'number'},
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
          {title: 'Code', value: 'code'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            title: 'Color Text',
            name: 'color',
            type: 'object',
            fields: [
              {
                title: 'Color',
                name: 'hex',
                type: 'string',
                options: {
                  list: [
                    {title: 'Purple', value: '#a855f7'},
                    {title: 'Pink', value: '#ec4899'},
                    {title: 'Blue', value: '#3b82f6'},
                    {title: 'Green', value: '#10b981'},
                    {title: 'Yellow', value: '#f59e0b'},
                    {title: 'Red', value: '#ef4444'},
                    {title: 'Gray', value: '#6b7280'},
                    {title: 'White', value: '#ffffff'},
                    {title: 'Gold', value: '#d97706'},
                  ]
                }
              }
            ]
          },
          {
            title: 'Font Size',
            name: 'fontSize',
            type: 'object',
            fields: [
              {
                title: 'Size',
                name: 'size',
                type: 'string',
                options: {
                  list: [
                    {title: 'Extra Small', value: 'xs'},
                    {title: 'Small', value: 'sm'},
                    {title: 'Normal', value: 'base'},
                    {title: 'Large', value: 'lg'},
                    {title: 'Extra Large', value: 'xl'},
                    {title: '2X Large', value: '2xl'},
                    {title: '3X Large', value: '3xl'},
                  ]
                }
              }
            ]
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineArrayMember({
      name: 'embed',
      title: 'Embed',
      type: 'object',
      fields: [
        {
          name: 'url',
          title: 'URL del Embed',
          type: 'url',
          description: 'Pega la URL de YouTube, Twitter, etc. aquí.',
        },
      ],
    }),
  ],
})
