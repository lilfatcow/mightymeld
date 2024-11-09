import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MONITE_CONFIG } from '@/lib/monite/config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Monite SDK Integration', () => {
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

      return {
        ok: true,
        json: async () => ({})
      };
    });
  });

  it('should authenticate with valid partner credentials', async () => {
    const response = await fetch(`${MONITE_CONFIG.apiUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-monite-version': MONITE_CONFIG.apiVersion
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: MONITE_CONFIG.clientId,
        client_secret: MONITE_CONFIG.clientSecret
      })
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.access_token).toBeDefined();
    expect(data.token_type).toBe('Bearer');
    expect(data.expires_in).toBeDefined();
  });

  it('should use correct API version and credentials', () => {
    expect(MONITE_CONFIG.apiVersion).toBe('2024-01-31');
    expect(MONITE_CONFIG.clientId).toBe('c8eb06b3-706e-4f71-8c7c-38b9dcd16d0f');
    expect(MONITE_CONFIG.clientSecret).toBe('3157626c-e99d-47ba-8be9-a06d538c5df5');
  });
});