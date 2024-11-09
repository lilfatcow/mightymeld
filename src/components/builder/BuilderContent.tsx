import { BuilderComponent } from '@builder.io/react';

interface BuilderContentProps {
  model: string;
}

export function BuilderContent({ model }: BuilderContentProps) {
  return (
    <div className="min-h-screen bg-background">
      <BuilderComponent 
        model={model}
        apiKey="4c9fdc80a9af4b7aab035bd9ee84e352"
      />
    </div>
  );
}