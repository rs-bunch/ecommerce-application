import type { CustomerUpdateAction } from '@commercetools/platform-sdk';

export default (attrName: string, attrValue: string): CustomerUpdateAction | undefined => {
  let customerUpdateAction: CustomerUpdateAction | undefined;
  switch (attrName) {
    case 'firstName':
      customerUpdateAction = { action: 'setFirstName', firstName: attrValue };
      break;
    case 'lasttName':
      customerUpdateAction = { action: 'setLastName', lastName: attrValue };
      break;
    default:
      break;
  }

  return customerUpdateAction;
};
