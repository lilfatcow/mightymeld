import { BuilderComponent as BuilderBase, useIsPreviewing } from '@builder.io/react';
import { useEffect } from 'react';

interface BuilderPageProps {
  model: string;
}

export function BuilderComponent({ model }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  useEffect(() => {
    // Force preview mode in development
    if (import.meta.env.DEV) {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams.has('preview')) {
        searchParams.set('preview', 'true');
        window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BuilderBase 
        model={model}
        apiKey="4c9fdc80a9af4b7aab035bd9ee84e352"
        options={{ 
          includeRefs: true,
          cachebust: true,
          noCache: true
        }}
        contentLoaderFunction={async () => ({
          data: {
            blocks: []
          }
        })}
      />
    </div>
  );
}