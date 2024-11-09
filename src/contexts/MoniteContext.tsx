import { createContext, useContext, useEffect, useState } from 'react';
import { MoniteSDK } from '@monite/sdk-api';
import { useToast } from '@/hooks/use-toast';
import { initializeMoniteSDK, clearMoniteSDK } from '@/lib/monite/config';

interface MoniteContextType {
  monite: MoniteSDK | null;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<MoniteSDK | null>;
}

const MoniteContext = createContext<MoniteContextType>({
  monite: null,
  isInitializing: true,
  error: null,
  initialize: async () => null
});

export function MoniteProvider({ children }: { children: React.ReactNode }) {
  const [monite, setMonite] = useState<MoniteSDK | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const initialize = async (): Promise<MoniteSDK | null> => {
    try {
      setIsInitializing(true);
      setError(null);

      const sdk = await initializeMoniteSDK();
      setMonite(sdk);
      
      toast({
        title: 'Success',
        description: 'Connected to Monite successfully',
      });

      return sdk;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Monite');
      console.error('Monite initialization error:', error);
      
      setError(error);
      
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: error.message
      });
      
      return null;
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initialize();
    return () => {
      clearMoniteSDK();
    };
  }, []);

  return (
    <MoniteContext.Provider value={{
      monite,
      isInitializing,
      error,
      initialize
    }}>
      {children}
    </MoniteContext.Provider>
  );
}

export function useMonite() {
  const context = useContext(MoniteContext);
  if (!context) {
    throw new Error('useMonite must be used within MoniteProvider');
  }
  return context;
}