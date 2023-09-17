import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

const tokenCache: TokenCache = {
  get: (): TokenStore => JSON.parse(`${localStorage.getItem('tokenCache')}`),
  set: (cache: TokenStore): void => localStorage.setItem('tokenCache', JSON.stringify(cache)),
};

export { tokenCache };
