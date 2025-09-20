import {StructureBuilder} from 'sanity/structure'
import {BookIcon} from '@sanity/icons'

// The structure resolver will now be async
export const structure = async (S: StructureBuilder, context: any) => {
  // Fetch all categories to build the dynamic list
  const categories = await context.getClient({apiVersion: '2024-03-11'}).fetch(
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
          .filter(`_type == "post" && $categoryId in categories[]._ref`)
          .params({ categoryId: category._id })
          .menuItems([
            ...S.documentList().getMenuItems(),
            S.menuItem()
              .title('Crear Nuevo Artículo Aquí')
              .intent({ 
                type: 'create', 
                params: { 
                  type: 'post', 
                  template: 'post-by-category',
                  // Pass the category ID to the new document
                  categoryId: category._id 
                }
              })
          ])
      )
  )

  return S.list()
    .title('El Grimorio')
    .items([
      // Pinned items for management
      S.documentTypeListItem('post').title('Todos los Artículos'),
      S.documentTypeListItem('category').title('Gestionar Categorías'),
      S.documentTypeListItem('author').title('Gestionar Aportadores'),
      S.divider(),
      // Spread the dynamically generated category items
      ...categoryItems,
    ])
}
