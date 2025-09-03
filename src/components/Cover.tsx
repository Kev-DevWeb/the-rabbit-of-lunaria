
import React from 'react';

const Cover = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  return (
    <div className="page bg-stone-800 text-white shadow-lg flex flex-col items-center justify-center" ref={ref}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-cinzel-decorative text-yellow-200">Grimorio</h1>
        <p className="text-lg font-cormorant-garamond mt-4">de Lunaria</p>
        {props.children}
      </div>
    </div>
  );
});

Cover.displayName = 'Cover';

export default Cover;
