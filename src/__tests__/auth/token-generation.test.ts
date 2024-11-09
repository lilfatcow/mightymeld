import { describe, it, expect, vi } from 'vitest';
import { MONITE_CONFIG, getAccessToken } from '@/lib/monite/config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Monite Token Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful token response
    mockFetch.mockImplementation(async () => ({
      ok: true,
      json: async () => ({
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600
      })
    }));
  });

  it('should successfully generate an access token', async () => {
    try {
      console.log('Testing with credentials:', {
        clientId: MONITE_CONFIG.clientId,
        apiUrl: MONITE_CONFIG.apiUrl,
        apiVersion: MONITE_CONFIG.apiVersion
      });

      const token = await getAccessToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toBe('test-token');
      
      // Verify correct request
      expect(mockFetch).toHaveBeenCalledWith(
        `${MONITE_CONFIG.apiUrl}/auth/token`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-monite-version': MONITE_CONFIG.apiVersion
          }),
          body: expect.any(String)
        })
      );
      
      console.log('Successfully generated access token');
    } catch (error) {
      console.error('Token generation failed:', error);
      throw error;
    }
  });

  it('should handle API errors gracefully', async () => {
    // Mock failed response
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        detail: 'Invalid credentials'
      })
    }));

    try {
      await getAccessToken();
      throw new Error('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toContain('Failed to get access token');
    }
  });
});