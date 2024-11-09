import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MONITE_CONFIG, initializeMoniteSDK, clearMoniteSDK } from '@/lib/monite/config';

describe('Monite SDK Authentication', () => {
  beforeEach(() => {
    clearMoniteSDK();
  });

  afterEach(() => {
    clearMoniteSDK();
  });

  it('should successfully authenticate and initialize SDK', async () => {
    try {
      const sdk = await initializeMoniteSDK();
      expect(sdk).toBeDefined();
      expect(MONITE_CONFIG.entityId).toBeDefined();
      
      // Test if we can make a basic API call
      const entity = await sdk.entity.getEntity();
      expect(entity).toBeDefined();
      expect(entity.id).toBe(MONITE_CONFIG.entityId);
      
      console.log('Successfully authenticated with Monite SDK');
      console.log('Entity ID:', entity.id);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  });
});