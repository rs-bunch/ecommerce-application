import {
  type CustomerDraft,
  type ClientResponse,
  type CustomerSignInResult,
  type Customer,
  type CustomerUpdate,
  type CustomerChangePassword,
  type BaseAddress,
  CustomerToken,
} from '@commercetools/platform-sdk';
import { apiRoot } from './apiRoot';
import type { AuthPayload } from '../../dto/types';
import { credentialFlowCtpClientApiRoot } from './credentialFlowCtpClientApiRoot';

// Request Flow: request -> execute -> then -> catch
// Examples: https://docs.commercetools.com/sdk/sdk-example-code
// Customers: https://docs.commercetools.com/api/projects/customers#create-sign-up-customer

/* 
$curl https://{auth_host}/oauth/{projectKey}/customers/token -X POST \
--basic --user "{clientId}:{clientSecret}" \
-d "grant_type=password&username=alice@example.com&password=secret&scope=view_published_products:{projectKey} manage_my_orders:{projectKey} manage_my_profile:{projectKey}"
 */

const createCustomer = (payload: CustomerDraft): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.customers().post({ body: payload }).execute();
};

const loginCustomer = (payload: AuthPayload): Promise<ClientResponse<CustomerSignInResult>> => {
  return apiRoot.login().post({ body: payload }).execute();
};

const getCustomerByToken = (options: CustomerToken): Promise<ClientResponse<Customer>> => {
  // const apiRoot = credentialFlowCtpClientApiRoot(options);
  return apiRoot.customers().withPasswordToken({ passwordToken: options.value }).get().execute();
};

const getToken = (payload: AuthPayload): Promise<ClientResponse<CustomerToken>> => {
  return apiRoot.customers().passwordToken().post({ body: payload }).execute();
};

const updateCustomerById = (payload: { id: string; query: CustomerUpdate }): Promise<ClientResponse<Customer>> => {
  return apiRoot.customers().withId({ ID: payload.id }).post({ body: payload.query }).execute();
};

const updateCustomerPassword = (payload: CustomerChangePassword): Promise<ClientResponse<Customer>> => {
  return apiRoot.customers().password().post({ body: payload }).execute();
};

// const addAddress = (payload: { id: string; query: CustomerUpdate }): Promise<ClientResponse<Customer>> => {
//   return apiRoot.customers().withId({ ID: payload.id }).post({ body: payload.query }).execute();
// };

export { getCustomerByToken, getToken, createCustomer, loginCustomer, updateCustomerById, updateCustomerPassword };
