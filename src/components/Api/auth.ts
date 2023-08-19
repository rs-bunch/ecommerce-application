import {
  type Customer,
  type ClientResponse,
  type ErrorResponse,
  type CustomerSignInResult,
} from '@commercetools/platform-sdk';
import { apiRoot } from './apiRoot';
import { Payload } from '../../dto/auth-payload';

// Request Flow: request -> execute -> then -> catch
// Examples: https://docs.commercetools.com/sdk/sdk-example-code
// Customers: https://docs.commercetools.com/api/projects/customers#create-sign-up-customer

const createCustomer = (payload: Payload): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.customers().post({ body: payload }).execute();
};

const loginCustomer = (payload: Payload): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.login().post({ body: payload }).execute();
};

export { createCustomer, loginCustomer };
