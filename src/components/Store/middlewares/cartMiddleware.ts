import type { Middleware, Dispatch } from 'redux';
import type {
  MyCartRemoveLineItemAction,
  MyCartAddLineItemAction,
  MyCartUpdate,
  MyCartUpdateAction,
} from '@commercetools/platform-sdk';
import { updateCart, deleteCart, createCart } from '../../Api/rest/me';
import { LineItemPayload } from '../../../dto/types';
import type { RootState } from '../store';
import { notifyError, notifyInfo } from '../../../utils/notify/notify';
import { initCart, updateCartState } from '../slices/cartSlice';

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
        notifyInfo('Item added to Cart!').showToast();
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
        notifyInfo('Item deleted from Cart!').showToast();
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }

  if (action.type === 'cart/changeLineItemQuantity') {
    const changeLineItemQuantityAction: MyCartUpdateAction = {
      action: 'changeLineItemQuantity',
      quantity: Number(action.payload.quantity),
      lineItemId: `${action.payload.lineItemId}`,
    };

    const myCartUpdate: MyCartUpdate = {
      actions: [changeLineItemQuantityAction],
      version,
    };

    updateCart({ id, options: myCartUpdate })
      .then((response) => {
        const payload = {
          inProgress: false,
          error: '',
          cart: response.body,
        };
        store.dispatch(updateCartState(payload));
        notifyInfo('Item quantity changed!').showToast();
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }

  if (action.type === 'cart/deleteCart') {
    deleteCart({ id, version })
      .then(() => createCart())
      .then((response) => response.body)
      .then((cart) => {
        const payload = {
          inProgress: false,
          error: '',
          cart,
        };
        store.dispatch(updateCartState(payload));
        notifyInfo('Cart was deleted!').showToast();
      })
      .catch((error) => {
        notifyError(String(error.message)).showToast();
      });
  }
  return next(action);
};

export default cartMiddleware;
