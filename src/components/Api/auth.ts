import type {
  CustomerDraft,
  ClientResponse,
  CustomerSignInResult,
  Customer,
  CustomerUpdate,
} from '@commercetools/platform-sdk';
import { apiRoot } from './apiRoot';
import { AuthPayload } from '../../dto/types';

// Request Flow: request -> execute -> then -> catch
// Examples: https://docs.commercetools.com/sdk/sdk-example-code
// Customers: https://docs.commercetools.com/api/projects/customers#create-sign-up-customer

const createCustomer = (payload: CustomerDraft): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.customers().post({ body: payload }).execute();
};

const loginCustomer = (payload: AuthPayload): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.login().post({ body: payload }).execute();
};

const updateCustomerById = (payload: { id: string; query: CustomerUpdate }): Promise<ClientResponse<Customer>> => {
  return apiRoot.customers().withId({ ID: payload.id }).post({ body: payload.query }).execute();
};

export { createCustomer, loginCustomer, updateCustomerById };
