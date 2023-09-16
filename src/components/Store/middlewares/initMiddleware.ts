import type { Middleware, Dispatch } from 'redux';
import { anonymousSessionFlowApiRoot } from '../../Api/anonymousSessionFlow';
import { tokenCache } from '../../Api/tokenCache';
import { getActiveCart, createCart } from '../../Api/rest/me';
import { notifyError } from '../../../utils/notify/notify';
import { initCart } from '../slices/cartSlice';

const initMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  if (action.type === 'auth/initAuth') {
    console.log('initMiddleware: auth/initAuth');
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
    }
  }
  return next(action);
};

export default initMiddleware;
