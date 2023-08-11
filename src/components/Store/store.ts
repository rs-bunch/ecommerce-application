import { configureStore } from '@reduxjs/toolkit';
import locationSlice from './locationSlice';

const store = configureStore({
  reducer: {
    location: locationSlice.reducer,
  },
});

export type StoreType = typeof store;
export default store;
