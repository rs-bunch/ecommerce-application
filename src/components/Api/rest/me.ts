import {
  type ClientResponse,
  type CustomerSignInResult,
  type Customer,
  type Cart,
  MyCartUpdate,
} from '@commercetools/platform-sdk';
import { AuthPayload } from '../../../dto/types';
import { passwordFlowApiRoot } from '../clients/passwordFlow';
import { apiRoot } from '../apiRoot';

const createCart = (): Promise<ClientResponse<Cart>> => {
  return apiRoot
    .me()
    .carts()
    .post({ body: { currency: 'USD' } })
    .execute();
};

const getActiveCart = (): Promise<ClientResponse<Cart>> => {
  return apiRoot.me().activeCart().get().execute();
};

const meLogin = (payload: AuthPayload): Promise<ClientResponse<CustomerSignInResult>> => {
  return passwordFlowApiRoot(payload).me().login().post({ body: payload }).execute();
};

const updateCart = (payload: { id: string; options: MyCartUpdate }): Promise<ClientResponse<Cart>> => {
  return apiRoot.me().carts().withId({ ID: payload.id }).post({ body: payload.options }).execute();
};

const getCustomer = (): Promise<ClientResponse<Customer>> => {
  return apiRoot.me().get().execute();
};

export { createCart, getActiveCart, meLogin, getCustomer, updateCart };
