'use client';

const AppFooter = () => {
  return (
    <footer className="w-full p-4 text-center text-white bg-gray-800 z-10">
      <p className="mb-2">&copy; {new Date().getFullYear()} La madriguera de Lunaria. Todos los derechos reservados.</p>
      <p className="text-xs text-gray-400">
        Música: &quot;The First Fallen Leaf&quot; by Thomas J. Curran.
      </p>
    </footer>
  );
};

export default AppFooter;
