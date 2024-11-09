import { useEffect, useState } from 'react';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BUILDER_API_KEY } from '@/lib/builder';

interface BuilderPageProps {
  model?: string;
  url?: string;
}

export function BuilderPage({ model = 'page', url }: BuilderPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPreviewingInBuilder = useIsPreviewing();
  const [content, setContent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Force preview mode in development
    if (import.meta.env.DEV && !isPreviewingInBuilder) {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams.has('preview')) {
        searchParams.set('preview', 'true');
        window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
      }
    }
  }, [isPreviewingInBuilder]);

  useEffect(() => {
    async function fetchContent() {
      const path = url || location.pathname;
      try {
        builder.apiKey = BUILDER_API_KEY;
        const content = await builder
          .get(model, {
            url: path,
            apiKey: BUILDER_API_KEY
          })
          .promise();

        setContent(content);
        setNotFound(!content);

        // Update page title if available
        if (content?.data.title) {
          document.title = `${content.data.title} | WonderPay`;
        }
      } catch (error) {
        console.error('Error fetching Builder.io content:', error);
        setNotFound(true);
      }
    }

    fetchContent();
  }, [model, url, location.pathname]);

  // Handle 404 for non-preview mode
  if (notFound && !isPreviewingInBuilder) {
    navigate('/404', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <BuilderComponent 
        model={model}
        content={content}
        apiKey={BUILDER_API_KEY}
        options={{
          includeRefs: true,
          cachebust: true,
          noCache: import.meta.env.DEV
        }}
      />
    </div>
  );
}