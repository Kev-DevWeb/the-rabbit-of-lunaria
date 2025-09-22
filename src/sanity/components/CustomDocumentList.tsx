// components/CustomDocumentList.tsx
import React from 'react'
import {Card, Flex, Stack, Text, Box} from '@sanity/ui'
import {definePlugin} from 'sanity'

// Componente personalizado para mostrar documentos como cartas
const CustomDocumentCard = ({document}: any) => {
  return (
    <Card 
      padding={3} 
      radius={2} 
      shadow={1}
      style={{
        width: '200px',
        height: '300px',
        margin: '8px',
        cursor: 'pointer'
      }}
    >
      <Stack space={3}>
        {/* Imagen más grande */}
        {document.mainImage && (
          <Box style={{height: '150px', overflow: 'hidden', borderRadius: '4px'}}>
            <img 
              src={document.mainImage.asset?.url + '?w=200&h=150&fit=crop'} 
              alt={document.mainImage.alt || document.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}
        
        {/* Título */}
        <Text size={2} weight="semibold" style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {document.title || 'Sin título'}
        </Text>
        
        {/* Autor */}
        {document.authors && document.authors[0] && (
          <Text size={1} muted>
            por {document.authors[0].name}
          </Text>
        )}
        
        {/* Fecha */}
        {document.publishedAt && (
          <Text size={1} muted>
            {new Date(document.publishedAt).toLocaleDateString()}
          </Text>
        )}
      </Stack>
    </Card>
  )
}

// Plugin para vistas personalizadas
export const customViews = definePlugin({
  name: 'custom-views',
  document: {
    views: [
      {
        component: ({document}) => (
          <Flex wrap="wrap" justify="flex-start">
            <CustomDocumentCard document={document} />
          </Flex>
        ),
        title: 'Vista de Cartas',
        id: 'card-view'
      }
    ]
  }
})

// structure.ts - Versión actualizada con vista personalizada
import {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {BookIcon, ImagesIcon} from '@sanity/icons'

export const structure = async (S: StructureBuilder, context: StructureResolverContext) => {
  const apiVersion = '2025-09-22'
  
  try {
    const categories = await context.getClient({apiVersion}).fetch(
      `*[_type == 'category']{_id, title}`
    )

    const categoryItems = categories.map((category: {_id: string, title: string}) => 
      S.listItem()
        .title(category.title)
        .icon(BookIcon)
        .child(
          S.documentList()
            .title(`Artículos en: ${category.title}`)
            .filter(`_type == "post" && $categoryId in categories[]._ref`)
            .params({ categoryId: category._id })
            .apiVersion(apiVersion)
            // Vista personalizada como grid de cartas
            .child((documentId) =>
              S.document()
                .documentId(documentId)
                .schemaType('post')
            )
        )
    )

    return S.list()
      .title('El Grimorio')
      .items([
        // Vista especial para todos los artículos como galería
        S.listItem()
          .title('Galería de Artículos')
          .icon(ImagesIcon)
          .child(
            S.documentList()
              .title('Vista de Galería')
              .filter('_type == "post"')
              .apiVersion(apiVersion)
              .defaultLayout('card') // Vista de cartas por defecto
          ),
        
        S.documentTypeListItem('post').title('Todos los Artículos (Lista)'),
        S.documentTypeListItem('category').title('Gestionar Categorías'),
        S.documentTypeListItem('author').title('Gestionar Aportadores'),
        S.divider(),
        ...categoryItems,
      ])
  } catch (error) {
    console.error('Error building structure:', error)
    
    return S.list()
      .title('El Grimorio')
      .items([
        S.documentTypeListItem('post').title('Todos los Artículos'),
        S.documentTypeListItem('category').title('Gestionar Categorías'),
        S.documentTypeListItem('author').title('Gestionar Aportadores'),
      ])
  }
}