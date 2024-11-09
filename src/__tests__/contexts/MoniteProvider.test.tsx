import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MoniteProvider, useMonite } from '@/contexts/MoniteContext';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Test component
function TestComponent() {
  const { monite, isInitializing, error, initialize } = useMonite();
  
  if (isInitializing) return <div data-testid="loading">Initializing...</div>;
  if (error) return <div data-testid="error">Error: {error.message}</div>;
  if (monite) return <div data-testid="success">SDK Initialized</div>;
  
  return (
    <div data-testid="no-sdk">
      <button onClick={() => initialize()}>Initialize</button>
    </div>
  );
}

describe('MoniteProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful responses
    mockFetch.mockImplementation(async (url) => {
      if (url.includes('/auth/token')) {
        return {
          ok: true,
          json: async () => ({
            access_token: 'test-token',
            token_type: 'Bearer',
            expires_in: 3600
          })
        };
      }

      if (url.includes('/entities')) {
        return {
          ok: true,
          json: async () => ({
            data: [{
              id: 'test-entity-id',
              type: 'organization',
              organization: {
                name: 'Wonderland Studio LLC'
              }
            }]
          })
        };
      }

      return {
        ok: true,
        json: async () => ({})
      };
    });
  });

  it('should initialize the SDK successfully', async () => {
    render(
      <MoniteProvider>
        <TestComponent />
      </MoniteProvider>
    );

    // Should show loading state first
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Should show success state after initialization
    await waitFor(() => {
      expect(screen.getByTestId('success')).toBeInTheDocument();
    });
  });

  it('should handle initialization errors', async () => {
    // Mock failed response
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        detail: 'Invalid credentials'
      })
    }));

    render(
      <MoniteProvider>
        <TestComponent />
      </MoniteProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  it('should provide initialization method through context', async () => {
    render(
      <MoniteProvider>
        <TestComponent />
      </MoniteProvider>
    );

    // Click initialize button
    const button = screen.getByText('Initialize');
    fireEvent.click(button);

    // Should initialize successfully
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/token'),
        expect.any(Object)
      );
    });
  });
});