import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LocationState } from '../../../dto/types';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    location: null,
  },
  reducers: {
    initLocation(state: LocationState, action: PayloadAction<{ location: string }>) {
      Object.assign(state, { location: action.payload.location });
    },
    changeLocation(state: LocationState, action: PayloadAction<{ location: string }>) {
      Object.assign(state, { location: action.payload.location });
    },
  },
});

export const { initLocation, changeLocation } = locationSlice.actions;
export default locationSlice;
