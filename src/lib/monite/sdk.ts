import { MoniteSDK } from '@monite/sdk-api';
import { MONITE_CONFIG } from './config';
import { MoniteInitError } from './errors';
import { getAccessToken } from './auth';
import { getOrCreateEntity } from './entity';

let moniteInstance: MoniteSDK | null = null;

export async function initializeMoniteSDK(): Promise<MoniteSDK> {
  try {
    if (moniteInstance) {
      return moniteInstance;
    }

    const entityId = await getOrCreateEntity();
    MONITE_CONFIG.entityId = entityId;

    moniteInstance = new MoniteSDK({
      entityId,
      apiUrl: MONITE_CONFIG.apiUrl,
      fetchToken: getAccessToken
    });

    // Verify SDK is working
    await moniteInstance.waitForReady();

    return moniteInstance;
  } catch (error) {
    console.error('Monite SDK initialization error:', error);
    if (error instanceof MoniteInitError) {
      throw error;
    }
    throw new MoniteInitError('Failed to initialize Monite SDK', error);
  }
}

export function getMoniteInstance(): MoniteSDK {
  if (!moniteInstance) {
    throw new MoniteInitError('Monite SDK not initialized. Call initializeMoniteSDK() first.');
  }
  return moniteInstance;
}

export function clearMoniteSDK(): void {
  moniteInstance = null;
  MONITE_CONFIG.entityId = undefined;
}