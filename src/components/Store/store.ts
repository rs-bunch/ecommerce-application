import { configureStore, combineReducers, bindActionCreators } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import productSlice from './productSlice';
<<<<<<< HEAD
import authSlice, { logout, update } from './authSlice';
=======
import productListSlice from './productListSlice';
>>>>>>> 129ea45 (ECOMM-83 Implementing the product card component, implementing the product list)

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
  productList: productListSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;

const logoutBindAction = bindActionCreators(logout, store.dispatch);
const updateBindAction = bindActionCreators(update, store.dispatch);

export { logoutBindAction, updateBindAction };
