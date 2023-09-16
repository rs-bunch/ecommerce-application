import type { Middleware, Dispatch } from 'redux';
import { MyCartUpdate } from '@commercetools/platform-sdk';
import { updateCart } from '../../Api/rest/me';
import { LineItemPayload } from '../../../dto/types';
import type { RootState } from '../store';
import { notifyError } from '../../../utils/notify/notify';
import { initCart } from '../slices/cartSlice';

const cartMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  if (action.type === 'cart/addLineItem') {
    const lineItemPayload = { ...action.payload } as LineItemPayload;
    const state = store.getState() as RootState;

    const { id, version } = state.cart.cart;

    const myCartUpdate: MyCartUpdate = {
      actions: [
        {
          action: 'addLineItem',
          ...lineItemPayload,
        },
      ],
      version,
    };

    updateCart({ id, options: myCartUpdate })
      .then((response) => {
        const payload = {
          inProgress: false,
          error: '',
          cart: response.body,
        };
        store.dispatch(initCart(payload));
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
  return next(action);
};

export default cartMiddleware;
