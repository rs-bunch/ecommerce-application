import { ProductData } from '@commercetools/platform-sdk';

export interface LocationState {
  location: string | null;
}

export interface AuthState {
  id: string | null;
  inProgress?: boolean;
  firstName: string | null;
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
