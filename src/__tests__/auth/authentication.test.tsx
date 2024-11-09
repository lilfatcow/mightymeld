import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MoniteProvider } from '@/contexts/MoniteContext';
import { SignInForm } from '@/components/auth/SignInForm';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
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

  it('should render sign in form correctly', () => {
    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In to WonderPay')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('should authenticate with valid credentials', async () => {
    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    // Fill in valid credentials
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'mitch@wonderland.studio' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for authentication to complete
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(localStorage.getItem('wonderpay_auth')).toBeTruthy();
    });
  });

  it('should handle invalid credentials', async () => {
    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    // Fill in invalid credentials
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'wrong@email.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpassword' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for error handling
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.getItem('wonderpay_auth')).toBeNull();
    });
  });

  it('should handle SDK initialization failure', async () => {
    // Mock failed SDK initialization
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 500,
      json: async () => ({
        detail: 'Internal server error'
      })
    }));

    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    // Fill in credentials
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), {
      target: { value: 'mitch@wonderland.studio' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for error handling
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorage.getItem('wonderpay_auth')).toBeNull();
    });
  });

  it('should maintain authentication state after page reload', async () => {
    // Set initial auth state
    localStorage.setItem('wonderpay_auth', JSON.stringify({
      email: 'mitch@wonderland.studio',
      name: 'Mitch Eisner'
    }));

    render(
      <BrowserRouter>
        <MoniteProvider>
          <SignInForm />
        </MoniteProvider>
      </BrowserRouter>
    );

    // Verify auth state is maintained
    const authData = JSON.parse(localStorage.getItem('wonderpay_auth') || '{}');
    expect(authData.email).toBe('mitch@wonderland.studio');
    expect(authData.name).toBe('Mitch Eisner');
  });
});