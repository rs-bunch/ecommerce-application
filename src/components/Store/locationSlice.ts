import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateI } from '../../types';
import initialState from './initialState';

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    initLocation(state: StateI, action: PayloadAction<{ location: string }>) {
      Object.assign(state, { location: action.payload.location });
    },
    changeLocation(state: StateI, action: PayloadAction<{ location: string }>) {
      Object.assign(state, { location: action.payload.location });
    },
  },
});

export const { initLocation, changeLocation } = locationSlice.actions;
export default locationSlice;
