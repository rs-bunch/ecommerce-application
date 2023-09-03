import { configureStore, combineReducers, bindActionCreators } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';
import productSlice from './productSlice';
import authSlice, { logout } from './authSlice';

const rootReducer = combineReducers({
  location: locationSlice.reducer,
  auth: authSlice.reducer,
  product: productSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export default store;

const logoutBindAction = bindActionCreators(logout, store.dispatch);
export { logoutBindAction };
