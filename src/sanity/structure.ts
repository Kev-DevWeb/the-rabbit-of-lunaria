import {StructureBuilder, StructureResolverContext} from 'sanity/structure'
import {BookIcon, ImagesIcon} from '@sanity/icons'

// The structure resolver will now be async
export const structure = async (S: StructureBuilder, context: StructureResolverContext) => {
  // Use the same API version as in env.ts
  const apiVersion = '2025-09-22'
  
  try {
    // Fetch all categories to build the dynamic list
    const categories = await context.getClient({apiVersion}).fetch(
      `*[_type == 'category']{_id, title}`
    )

    // Dynamically create a list item for each category
    const categoryItems = categories.map((category: {_id: string, title: string}) => 
      S.listItem()
        .title(category.title)
        .icon(BookIcon) // Use a book icon for a grimoire feel
        .child(
          S.documentList()
            .title(`Artículos en: ${category.title}`)
            // Fixed GROQ query syntax - targeting the categories array
            .filter(`_type == "post" && $categoryId in categories[]._ref`)
            .params({ categoryId: category._id })
            .apiVersion(apiVersion)
            .defaultLayout('card') // Vista de cartas para categorías
            .menuItems([
              ...(S.documentList().getMenuItems() || []),
              S.menuItem()
                .title('Crear Nuevo Artículo Aquí')
                .intent({ 
                  type: 'create', 
                  params: { 
                    type: 'post'
                    // Removed template reference that might not exist
                  }
                })
            ])
        )
    )

    return S.list()
      .title('El Grimorio')
      .items([
        // Vista especial de galería con cartas grandes
        S.listItem()
          .title('Galería de Artículos')
          .icon(ImagesIcon)
          .child(
            S.documentList()
              .title('Vista de Galería')
              .filter('_type == "post"')
              .apiVersion(apiVersion)
              .defaultLayout('card') // Vista de cartas nativa
          ),
        
        // Vista tradicional de lista
        S.documentTypeListItem('post')
          .title('Todos los Artículos (Lista)')
          .child(
            S.documentList()
              .title('Lista de Artículos')
              .filter('_type == "post"')
              .apiVersion(apiVersion)
              .defaultLayout('default') // Vista de lista tradicional
          ),
        
        S.documentTypeListItem('category').title('Gestionar Categorías'),
        S.documentTypeListItem('author').title('Gestionar Aportadores'),
        S.divider(),
        // Spread the dynamically generated category items
        ...categoryItems,
      ])
  } catch (error) {
    console.error('Error building structure:', error)
    
    // Fallback structure if there's an error
    return S.list()
      .title('El Grimorio')
      .items([
        S.documentTypeListItem('post')
          .title('Todos los Artículos')
          .child(
            S.documentList()
              .title('Artículos')
              .filter('_type == "post"')
              .defaultLayout('card') // Vista de cartas como fallback
          ),
        S.documentTypeListItem('category').title('Gestionar Categorías'),
        S.documentTypeListItem('author').title('Gestionar Aportadores'),
      ])
  }
}