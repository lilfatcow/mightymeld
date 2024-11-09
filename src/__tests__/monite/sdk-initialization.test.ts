import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MONITE_CONFIG, initializeMoniteSDK, clearMoniteSDK, getAccessToken } from '@/lib/monite/config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Monite SDK Initialization', () => {
  beforeEach(() => {
    clearMoniteSDK();
    vi.clearAllMocks();

    // Mock successful token response
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

  afterEach(() => {
    clearMoniteSDK();
  });

  it('should successfully initialize SDK with valid credentials', async () => {
    try {
      // First verify we can get a token
      const token = await getAccessToken();
      expect(token).toBeDefined();
      expect(token).toBe('test-token');

      // Initialize SDK
      const sdk = await initializeMoniteSDK();
      expect(sdk).toBeDefined();
      
      // Verify correct API calls were made
      expect(mockFetch).toHaveBeenCalledWith(
        `${MONITE_CONFIG.apiUrl}/auth/token`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-monite-version': MONITE_CONFIG.apiVersion
          })
        })
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `${MONITE_CONFIG.apiUrl}/entities`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'x-monite-version': MONITE_CONFIG.apiVersion
          })
        })
      );
    } catch (error) {
      throw error;
    }
  });

  it('should handle authentication errors', async () => {
    // Mock failed token response
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        detail: 'Invalid credentials'
      })
    }));

    await expect(initializeMoniteSDK()).rejects.toThrow('Failed to get access token');
  });

  it('should handle entity creation errors', async () => {
    // Mock failed entity creation
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
          ok: false,
          status: 400,
          json: async () => ({
            detail: 'Failed to create entity'
          })
        };
      }

      return {
        ok: true,
        json: async () => ({})
      };
    });

    await expect(initializeMoniteSDK()).rejects.toThrow('Failed to fetch entities');
  });

  it('should reuse existing token if not expired', async () => {
    // Get first token
    const token1 = await getAccessToken();
    expect(token1).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Get second token immediately
    const token2 = await getAccessToken();
    expect(token2).toBe(token1);
    expect(mockFetch).toHaveBeenCalledTimes(1); // Should not make another request
  });
});