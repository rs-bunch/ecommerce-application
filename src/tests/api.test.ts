import 'dotenv/config';
import { CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import { apiRoot } from '../components/Api/apiRoot';

describe('Testing API', () => {
  it('Try to recieve a customer', async () => {
    const customerResponse = (await apiRoot
      .customers()
      .get({
        queryArgs: {
          where: 'email="user@example.com"',
        },
      })
      .execute()
      .then((data) => data.body)
      .catch(console.error)) as CustomerPagedQueryResponse;

    expect(customerResponse.count).toEqual(1);
  });
});
