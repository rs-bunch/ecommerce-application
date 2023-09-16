import {
  type CustomerDraft,
  type ClientResponse,
  type CustomerSignInResult,
  type Customer,
  type CustomerUpdate,
  type CustomerChangePassword,
  type Cart,
  CustomerToken,
} from '@commercetools/platform-sdk';
import { AuthPayload } from '../../../dto/types';
import { passwordFlowApiRoot } from '../passwordFlow';
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

// const meLogin = (payload: AuthPayload): Promise<ClientResponse<CustomerSignInResult>> => {
//   return passwordFlowApiRoot(payload).me().login().post({ body: payload }).execute();
// };

const getCustomer = (): Promise<ClientResponse<Customer>> => {
  return apiRoot.me().get().execute();
};

// const updateCustomerById = (payload: { id: string; query: CustomerUpdate }): Promise<ClientResponse<Customer>> => {
//   return apiRoot.customers().withId({ ID: payload.id }).post({ body: payload.query }).execute();
// };

// const updateCustomerPassword = (payload: CustomerChangePassword): Promise<ClientResponse<Customer>> => {
//   return apiRoot.customers().password().post({ body: payload }).execute();
// };

// const addAddress = (payload: { id: string; query: CustomerUpdate }): Promise<ClientResponse<Customer>> => {
//   return apiRoot.customers().withId({ ID: payload.id }).post({ body: payload.query }).execute();
// };

export { createCart, getActiveCart, meLogin, getCustomer };
