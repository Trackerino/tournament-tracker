import type { AuthData } from '../types/account-service';

export default async (auth: AuthData) => {
  const res = await fetch(
    `https://account-public-service-prod.ol.epicgames.com/account/api/oauth/sessions/kill/${auth.access_token}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `${auth.token_type} ${auth.access_token}`,
      },
    },
  );

  console.log('killed token', res.status);
};
