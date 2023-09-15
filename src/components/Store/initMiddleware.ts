import type { Middleware, Dispatch } from 'redux';
import LocalStorage from '../LocalStorage/LocalStorage';
import { credentialFlowCtpClientApiRoot } from '../Api/credentialFlowCtpClientApiRoot';

const initMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  switch (action.type) {
    case 'auth/initAuth':
      console.log('initMiddleware: ', action.payload.tokenCache.token);
      break;
    default:
      break;
  }
  // if (action instanceof Promise) {
  //   console.log('async-logger: ', action, store.getState());
  //   action.then(store.dispatch);
  //   return action;
  // }
  return next(action);
};

export default initMiddleware;
