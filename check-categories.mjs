import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'pzke98ou',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkCategories() {
  const query = `*[_type == "category"] {
    _id,
    title,
    slug,
    orderRank,
    "parent": parent->{
      title,
      slug,
      "parent": parent->{
        title,
        slug,
        "parent": parent->{
          title,
          slug,
          "parent": parent->{
            title,
            slug
          }
        }
      }
    }
  } | order(orderRank asc)`;

  const categories = await client.fetch(query);
  
  console.log('\n📚 ESTRUCTURA DE CATEGORÍAS:\n');
  console.log('='.repeat(80));
  
  categories.forEach(cat => {
    const path = [];
    let current = cat;
    
    // Construir path completo
    while (current) {
      path.unshift(current.title);
      current = current.parent;
    }
    
    const indent = '  '.repeat(path.length - 1);
    const level = path.length;
    console.log(`${indent}${'└─ '.repeat(Math.max(0, level - 1))}${cat.title} (${path.join(' → ')})`);
  });
  
  console.log('\n' + '='.repeat(80));
  
  // Ahora buscar artículos de "Arcanos Mayores"
  console.log('\n📖 ARTÍCULOS DE "ARCANOS MAYORES":\n');
  
  const articlesQuery = `*[_type == "post" && references(*[_type == "category" && title == "Arcanos Mayores"]._id)] {
    title,
    "categories": categories[]->{
      title,
      "parent": parent->{
        title,
        "parent": parent->{
          title,
          "parent": parent->{
            title
          }
        }
      }
    }
  }`;
  
  const articles = await client.fetch(articlesQuery);
  
  articles.forEach(article => {
    console.log(`\n  📄 ${article.title}`);
    article.categories.forEach(cat => {
      const path = [];
      let current = cat;
      
      while (current) {
        path.unshift(current.title);
        current = current.parent;
      }
      
      console.log(`     Categoría: ${path.join(' → ')}`);
    });
  });
  
  console.log('\n');
}

checkCategories().catch(console.error);
