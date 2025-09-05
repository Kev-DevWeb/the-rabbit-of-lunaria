export default function ArticuloPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Artículo: {params.slug}</h1>
      <p>Contenido del artículo...</p>
    </div>
  );
}
