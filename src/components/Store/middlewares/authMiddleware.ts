import type { Middleware, Dispatch } from 'redux';
import { meLogin } from '../../Api/rest/me';
import { updateAuth } from '../slices/authSlice';
import { AuthPayload } from '../../../dto/types';
import type { RootState } from '../store';
import { notifyError, notifyInfo } from '../../../utils/notify/notify';
import { initCart } from '../slices/cartSlice';

const authMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  if (action.type === 'auth/login') {
    const authPayload = { ...action.payload } as AuthPayload;
    const state = store.getState() as RootState;
    Object.assign(authPayload, { anonymousCart: { id: state.cart.cart.id, typeId: 'cart' } });

    meLogin(authPayload)
      .then((response) => {
        if (response.statusCode !== 200) {
          let message = '';
          if ('message' in response) message = String(response.message);
          throw new Error(message);
        }
        notifyInfo('Successful login!').showToast();

        store.dispatch(updateAuth(response.body.customer));

        if (response.body.cart) {
          const payload = {
            inProgress: false,
            error: '',
            cart: response.body.cart,
          };
          store.dispatch(initCart(payload));
        }
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
  return next(action);
};

export default authMiddleware;
