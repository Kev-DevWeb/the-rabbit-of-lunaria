import React, { useState } from 'react';
import { Button, Card, Flex, Text, Spinner } from '@sanity/ui';
import { useFormValue, set, PatchEvent } from 'sanity';

interface SEOGeneratorProps {
  onChange: (event: PatchEvent) => void;
}

export function SEOGenerator({ onChange }: SEOGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Obtener valores actuales del formulario
  const title = useFormValue(['title']) as string;
  const body = useFormValue(['body']) as Array<Record<string, unknown>>;
  const metaTitle = useFormValue(['metaTitle']) as string;
  const metaDescription = useFormValue(['metaDescription']) as string;
  const keywords = useFormValue(['keywords']) as string[];

  // Función para extraer texto del contenido Portable Text
  const extractTextFromBody = (body: Array<Record<string, unknown>>): string => {
    if (!body || !Array.isArray(body)) return '';
    
    return body
      .filter(block => block._type === 'block' && block.children)
      .map(block => {
        const children = block.children as Array<Record<string, unknown>>;
        return children
          .filter((child: Record<string, unknown>) => child._type === 'span')
          .map((child: Record<string, unknown>) => child.text as string)
          .join(' ');
      })
      .join(' ')
      .substring(0, 1000); // Limitar a 1000 caracteres
  };

  const handleGenerateSEO = async () => {
    if (!title) {
      alert('Por favor, primero escribe un título para el artículo');
      return;
    }

    setIsGenerating(true);
    
    try {
      const content = extractTextFromBody(body);
      
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar SEO');
      }

      const seoData = await response.json();

      // Actualizar los campos usando PatchEvent
      const patches = [];

      if (seoData.metaTitle) {
        patches.push(set(seoData.metaTitle, ['metaTitle']));
      }

      if (seoData.metaDescription) {
        patches.push(set(seoData.metaDescription, ['metaDescription']));
      }

      if (seoData.keywords && seoData.keywords.length > 0) {
        patches.push(set(seoData.keywords, ['keywords']));
      }

      // Aplicar todos los patches
      onChange(PatchEvent.from(patches));

    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el contenido SEO. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Flex direction="column" gap={3}>
        <Text size={2} weight="semibold">
          🤖 Generador Automático de SEO
        </Text>
        
        <Text size={1} muted>
          Genera automáticamente metaTitle, metaDescription y keywords optimizados para SEO basándose en el título y contenido de tu artículo.
        </Text>

        {/* Mostrar estado actual */}
        <Card padding={3} radius={1} tone="default">
          <Text size={1}>
            <strong>Estado actual:</strong>
            <br />
            📝 MetaTitle: {metaTitle ? '✅ Configurado' : '❌ Vacío'}
            <br />
            📄 MetaDescription: {metaDescription ? '✅ Configurado' : '❌ Vacío'}
            <br />
            🏷️ Keywords: {keywords?.length ? `✅ ${keywords.length} palabras` : '❌ Vacío'}
          </Text>
        </Card>

        <Button
          onClick={handleGenerateSEO}
          disabled={isGenerating || !title}
          tone="primary"
          text={isGenerating ? 'Generando...' : 'Generar SEO Automáticamente'}
          icon={isGenerating ? Spinner : undefined}
        />
        
        {!title && (
          <Text size={1} style={{ color: '#f03e2f' }}>
            ⚠️ Necesitas escribir un título primero
          </Text>
        )}
      </Flex>
    </Card>
  );
}