// Script temporal para revisar la estructura de categorías
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vuuqwzr5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkCategories() {
  console.log('🔍 Consultando categorías...\n');
  
  const query = `*[_type == "category"] {
    _id,
    title,
    slug,
    orderRank,
    "parent": parent->{
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
  } | order(orderRank asc)`;

  const categories = await client.fetch(query);
  
  console.log(`📚 Total de categorías: ${categories.length}\n`);
  
  // Función para construir el path completo
  const buildPath = (category) => {
    const path = [category.title];
    let current = category.parent;
    
    while (current) {
      path.unshift(current.title);
      current = current.parent;
    }
    
    return path;
  };
  
  // Función para obtener la raíz
  const getRoot = (category) => {
    let current = category;
    while (current.parent) {
      current = current.parent;
    }
    return current.title;
  };
  
  // Agrupar por raíz
  const byRoot = {};
  
  categories.forEach(cat => {
    const root = getRoot(cat);
    if (!byRoot[root]) {
      byRoot[root] = [];
    }
    byRoot[root].push({
      title: cat.title,
      path: buildPath(cat),
      depth: buildPath(cat).length,
      order: cat.orderRank
    });
  });
  
  // Mostrar estructura
  console.log('📖 ESTRUCTURA DE CATEGORÍAS POR RAÍZ:\n');
  console.log('='.repeat(60));
  
  Object.keys(byRoot).sort().forEach(root => {
    console.log(`\n🗂️  RAÍZ: ${root}`);
    console.log('-'.repeat(60));
    
    byRoot[root]
      .sort((a, b) => a.order - b.order)
      .forEach(cat => {
        const indent = '  '.repeat(cat.depth - 1);
        const arrow = cat.depth > 1 ? '└→ ' : '';
        console.log(`${indent}${arrow}${cat.title} (nivel ${cat.depth}, order: ${cat.order})`);
        console.log(`${indent}   Ruta: ${cat.path.join(' > ')}`);
      });
  });
  
  console.log('\n' + '='.repeat(60));
  
  // Buscar categorías que podrían estar duplicadas o mal configuradas
  console.log('\n⚠️  VERIFICACIÓN DE POSIBLES PROBLEMAS:\n');
  
  const titleCounts = {};
  categories.forEach(cat => {
    titleCounts[cat.title] = (titleCounts[cat.title] || 0) + 1;
  });
  
  const duplicates = Object.entries(titleCounts).filter(([_, count]) => count > 1);
  
  if (duplicates.length > 0) {
    console.log('❌ Categorías con títulos duplicados:');
    duplicates.forEach(([title, count]) => {
      console.log(`   - "${title}" aparece ${count} veces`);
      const cats = categories.filter(c => c.title === title);
      cats.forEach(c => {
        console.log(`     * ${buildPath(c).join(' > ')}`);
      });
    });
  } else {
    console.log('✅ No hay títulos duplicados');
  }
  
  // Verificar categorías raíz
  const roots = categories.filter(c => !c.parent);
  console.log(`\n📌 Categorías raíz encontradas: ${roots.length}`);
  roots.forEach(r => {
    console.log(`   - ${r.title} (order: ${r.orderRank})`);
  });
}

checkCategories().catch(console.error);
