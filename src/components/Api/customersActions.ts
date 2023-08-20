import { apiRoot } from './apiRoot';

const getCustomerNameById = async (id: string): Promise<string | null> => {
  const name: string | undefined = (await apiRoot.customers().withId({ ID: id }).get().execute()).body.firstName;
  return name || null;
};

export { getCustomerNameById };
