'use client';

import { PortableTextBlock } from '@portabletext/types';
import { useEffect, useState } from 'react';

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface TableOfContentsProps {
  body: PortableTextBlock[];
}

export default function TableOfContents({ body }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Extraer todos los headings del contenido
    const extractedHeadings: Heading[] = [];
    
    body.forEach((block, index) => {
      if (block._type === 'block' && block.style && /^h[2-4]$/.test(block.style)) {
        const text = block.children
          ?.map((child: any) => child.text)
          .join('') || '';
        
        if (text) {
          const id = `heading-${index}`;
          extractedHeadings.push({
            text,
            level: parseInt(block.style.charAt(1)),
            id
          });
        }
      }
    });
    
    setHeadings(extractedHeadings);
  }, [body]);

  useEffect(() => {
    // Observar qué sección está visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0
      }
    );

    // Observar todos los headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset para el header fijo
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 shadow-lg shadow-purple-900/30">
      <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">
        Contenido
      </h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ 
              paddingLeft: `${(heading.level - 2) * 12}px`
            }}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-left text-sm transition-colors duration-200 hover:text-purple-300 w-full ${
                activeId === heading.id
                  ? 'text-purple-400 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
