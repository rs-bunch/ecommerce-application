import type { Middleware, Dispatch } from 'redux';

const authMiddleware: Middleware<Promise<Dispatch>> = (store) => (next) => (action) => {
  // if (action instanceof Promise) {
  //   console.log('async-logger: ', action, store.getState());
  //   action.then(store.dispatch);
  //   return action;
  // }
  console.log('logger: ', action);
  return next(action);
};

export default authMiddleware;
