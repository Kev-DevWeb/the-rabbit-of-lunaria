import StarBackground from '@/components/StarBackground';

export default function ArticulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen pt-24">
      <StarBackground />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative container mx-auto px-4 py-8 text-white">
        {children}
      </div>
    </div>
  );
}
