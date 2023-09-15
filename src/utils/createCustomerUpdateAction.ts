import type { CustomerUpdateAction } from '@commercetools/platform-sdk';

export default (attrName: string, attrValue: string): CustomerUpdateAction | undefined => {
  let customerUpdateAction: CustomerUpdateAction | undefined;
  switch (attrName) {
    case 'firstName':
      customerUpdateAction = { action: 'setFirstName', firstName: attrValue };
      break;
    case 'lastName':
      customerUpdateAction = { action: 'setLastName', lastName: attrValue };
      break;
    case 'dateOfBirth':
      customerUpdateAction = { action: 'setDateOfBirth', dateOfBirth: attrValue };
      break;
    case 'email':
      customerUpdateAction = { action: 'changeEmail', email: attrValue };
      break;
    default:
      break;
  }

  return customerUpdateAction;
};
