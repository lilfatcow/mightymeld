import { MoniteSDK } from '@monite/sdk-api';
import { MONITE_CONFIG } from './config';
import { MoniteAuthError } from './errors';

let tokenData: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  try {
    if (tokenData && tokenData.expiresAt > Date.now()) {
      return tokenData.token;
    }

    if (!MONITE_CONFIG.clientId || !MONITE_CONFIG.clientSecret) {
      throw new MoniteAuthError('Missing required Monite credentials');
    }

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
      const errorData = await response.json().catch(() => ({}));
      throw new MoniteAuthError(
        `Authentication failed: ${response.status}`,
        errorData
      );
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new MoniteAuthError('Invalid token response from server');
    }

    tokenData = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };

    return data.access_token;
  } catch (error) {
    console.error('Token generation error:', error);
    if (error instanceof MoniteAuthError) {
      throw error;
    }
    throw new MoniteAuthError('Failed to generate access token', error);
  }
}