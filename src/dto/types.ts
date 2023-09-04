import { ProductData, ProductProjectionPagedSearchResponse, Customer } from '@commercetools/platform-sdk';

export interface LocationState {
  location: string | null;
}

export interface AuthState extends Customer {
  inProgress?: boolean;
}

export interface AuthPayload {
  email: string;
  password: string;
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
  products?: ProductProjectionPagedSearchResponse | null;
}
