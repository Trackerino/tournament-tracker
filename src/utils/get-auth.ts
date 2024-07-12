import env from './env.js';

import type { AuthData } from '../types/account-service.js';

let cachedAuth: AuthData | null = null;

export default async () => {
  if (cachedAuth && new Date(cachedAuth.expires_at).getTime() - 1000 * 60 > Date.now()) {
    return cachedAuth;
  }

  const res = await fetch(
    'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.EPIC_CLIENT_ID}:${env.EPIC_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'device_auth',
        token_type: 'eg1',
        account_id: env.EPIC_ACCOUNT_ID,
        device_id: env.EPIC_DEVICE_ID,
        secret: env.EPIC_DEVICE_SECRET,
      }),
    },
  );

  if (!res.ok) {
    console.log(res.status, res.statusText, await res.text());

    throw new Error('Failed to get token');
  }

  cachedAuth = <AuthData>(await res.json());

  return cachedAuth;
};
