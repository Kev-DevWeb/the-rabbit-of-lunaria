
import React from 'react';

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>((props, ref) => {
  return (
    <div
      className="page bg-yellow-100 text-stone-800 shadow-lg"
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,.05) 0px, rgba(0,0,0,.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, rgba(0,0,0,.05) 0px, rgba(0,0,0,.05) 1px, transparent 1px, transparent 10px)',
        backgroundSize: '10px 10px',
      }}
      ref={ref}
    >
      <div className="page-content p-8 h-full flex flex-col">
        <div className="page-text flex-grow">{props.children}</div>
        <div className="page-footer text-right">
          <span className="page-number text-sm text-stone-500">{props.number}</span>
        </div>
      </div>
    </div>
  );
});

Page.displayName = 'Page';

export default Page;
