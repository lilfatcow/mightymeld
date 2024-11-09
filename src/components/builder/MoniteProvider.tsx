import { ReactNode } from 'react';
import { MoniteProvider as BaseMoniteProvider } from '@/contexts/MoniteContext';
import { Builder } from '@builder.io/react';

interface MoniteWrapperProps {
  children: ReactNode;
}

function MoniteWrapper({ children }: MoniteWrapperProps) {
  return (
    <BaseMoniteProvider>
      {children}
    </BaseMoniteProvider>
  );
}

// Register Monite Provider as a Builder.io component wrapper
Builder.registerComponent(MoniteWrapper, {
  name: 'MoniteWrapper',
  description: 'Wraps components with Monite context',
  inputs: [],
  defaults: {
    bindings: {
      'component.options.className': 'w-full'
    }
  }
});