import type { ProductData, ProductProjectionPagedSearchResponse, Customer, Cart } from '@commercetools/platform-sdk';

export interface LocationState {
  location: string | null;
}

export interface AuthState extends Customer {
  inProgress?: boolean;
  tokenCache: TokenCache;
}

export interface AuthPayload {
  email: string;
  password: string;
  anonymousCart?: {
    id: string;
    typeId: 'cart';
  };
}

export interface ProductState {
  product: ProductData | null;
  id: number | null;
}

export type TextValidator = (value: string, payload?: string | number) => Error | void;

export enum CountryCodes {
  US = 'United States of America',
  CA = 'Canada',
}

export interface ProductListState {
  id: string | null;
  products: ProductProjectionPagedSearchResponse | null;
}

export type CategoiesPathData = { name: string; id: string }[];

export interface TokenCache {
  token: string | null;
  expirationTime: number | null;
  refreshToken?: string | null | undefined;
}

export interface CartState {
  inProgress: boolean;
  error: string;
  cart: Cart;
}
