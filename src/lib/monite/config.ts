import { MoniteSDK } from '@monite/sdk-api';

interface MoniteConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  apiVersion: string;
  entityId?: string;
}

export const MONITE_CONFIG: MoniteConfig = {
  apiUrl: 'https://api.sandbox.monite.com/v1',
  clientId: 'c8eb06b3-706e-4f71-8c7c-38b9dcd16d0f',
  clientSecret: '3157626c-e99d-47ba-8be9-a06d538c5df5',
  apiVersion: '2024-01-31',
  entityId: undefined
};

let moniteInstance: MoniteSDK | null = null;

export async function initializeMoniteSDK(): Promise<MoniteSDK> {
  if (!MONITE_CONFIG.clientId || !MONITE_CONFIG.clientSecret || !MONITE_CONFIG.apiUrl) {
    throw new Error('Missing required Monite configuration');
  }

  if (moniteInstance) {
    return moniteInstance;
  }

  const token = await getAccessToken();
  
  // Create or get entity
  const entityId = await createOrGetEntity(token);
  MONITE_CONFIG.entityId = entityId;

  moniteInstance = new MoniteSDK({
    entityId,
    apiUrl: MONITE_CONFIG.apiUrl,
    fetchToken: getAccessToken
  });

  return moniteInstance;
}

export function getMoniteInstance(): MoniteSDK {
  if (!moniteInstance) {
    throw new Error('Monite SDK not initialized. Call initializeMoniteSDK() first.');
  }
  return moniteInstance;
}

export function clearMoniteSDK(): void {
  moniteInstance = null;
  MONITE_CONFIG.entityId = undefined;
}

export async function getAccessToken(): Promise<string> {
  try {
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

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
}

async function createOrGetEntity(token: string): Promise<string> {
  try {
    // First try to list existing entities
    const listResponse = await fetch(`${MONITE_CONFIG.apiUrl}/entities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-monite-version': MONITE_CONFIG.apiVersion
      }
    });

    if (!listResponse.ok) {
      throw new Error('Failed to list entities');
    }

    const listData = await listResponse.json();
    
    // If we have existing entities, use the first one
    if (listData.data && listData.data.length > 0) {
      return listData.data[0].id;
    }

    // If no entities exist, create a new one
    const createResponse = await fetch(`${MONITE_CONFIG.apiUrl}/entities`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-monite-version': MONITE_CONFIG.apiVersion
      },
      body: JSON.stringify({
        type: 'organization',
        organization: {
          legal_name: 'Wonderland Studio LLC',
          legal_type: 'llc',
          tax_id: '123456789',
          is_vendor: true,
          is_customer: true
        },
        address: {
          country: 'US',
          city: 'Los Angeles',
          line1: '123 Main St',
          postal_code: '90001',
          state: 'CA'
        },
        email: 'mitch@wonderland.studio',
        phone: '+12125551234'
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create entity: ${createResponse.status}`);
    }

    const entity = await createResponse.json();
    return entity.id;
  } catch (error) {
    console.error('Entity creation/retrieval error:', error);
    throw error;
  }
}