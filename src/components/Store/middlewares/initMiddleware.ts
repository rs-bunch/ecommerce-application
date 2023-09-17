import type { Middleware, Dispatch } from 'redux';
import { anonymousSessionFlowApiRoot } from '../../Api/clients/anonymousSessionFlow';
import { tokenCache } from '../../Api/tokenCache/tokenCache';
import { getActiveCart, createCart, getCustomer } from '../../Api/rest/me';
import { notifyError } from '../../../utils/notify/notify';
import { initCart } from '../slices/cartSlice';
import { updateAuth } from '../slices/authSlice';

const initMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  if (action.type === 'auth/initAuth') {
    const cache = tokenCache.get();
    if (!cache) {
      anonymousSessionFlowApiRoot
        .get()
        .execute()
        .catch((err) => console.log(err))
        .then(() => createCart())
        .then((response) => response.body)
        .then((cart) => {
          const payload = {
            inProgress: false,
            error: '',
            cart,
          };
          store.dispatch(initCart(payload));
        })
        .catch((error) => {
          notifyError(String(error.message)).showToast();
        });
    }
    if (cache) {
      getActiveCart()
        .then((response) => response.body)
        .then((cart) => {
          const payload = {
            inProgress: false,
            error: '',
            cart,
          };
          store.dispatch(initCart(payload));
        })
        .catch((error) => {
          notifyError(String(error.message)).showToast();
        });

      getCustomer()
        .then((response) => {
          if (response.statusCode === 200) {
            store.dispatch(updateAuth(response.body));
          }
        })
        .catch(() => {
          console.log('*** Customer with provided token is not found. Maybe you using anonymous session ***');
        });
    }
  }
  return next(action);
};

export default initMiddleware;
