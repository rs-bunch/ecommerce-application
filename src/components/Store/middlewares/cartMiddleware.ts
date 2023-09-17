import type { Middleware, Dispatch } from 'redux';
import type { MyCartRemoveLineItemAction, MyCartAddLineItemAction, MyCartUpdate } from '@commercetools/platform-sdk';
import { updateCart } from '../../Api/rest/me';
import { LineItemPayload } from '../../../dto/types';
import type { RootState } from '../store';
import { notifyError, notifyInfo } from '../../../utils/notify/notify';
import { initCart } from '../slices/cartSlice';

const cartMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  const state = store.getState() as RootState;
  const { id, version } = state.cart.cart;

  if (action.type === 'cart/addLineItem') {
    const lineItemPayload = { ...action.payload } as LineItemPayload;

    const addLineItemAction: MyCartAddLineItemAction = {
      action: 'addLineItem',
      ...lineItemPayload,
    };

    const myCartUpdate: MyCartUpdate = {
      actions: [addLineItemAction],
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

  if (action.type === 'cart/removeLineItem') {
    const removeLineItemAction: MyCartRemoveLineItemAction = {
      action: 'removeLineItem',
      lineItemId: `${action.payload.lineItemId}`,
    };

    const myCartUpdate: MyCartUpdate = {
      actions: [removeLineItemAction],
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
        notifyInfo('Item Deleted!').showToast();
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
  return next(action);
};

export default cartMiddleware;
