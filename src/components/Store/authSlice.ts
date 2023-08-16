import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';
import { createCustomer } from '../Api/auth';
import { notifyInfo } from '../../utils/notify/notify';

const signup = createAsyncThunk('auth/signup', async (payload: { email: string; password: string }) => {
  return createCustomer(payload)
    .then((response) => {
      if (response.statusCode !== 201) {
        let message = '';
        if ('message' in response) message = String(response.message);
        throw new Error(message);
      }
      notifyInfo('New customer was created!').showToast();
      return response.body.customer.id;
    })
    .catch();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    inProgress: false,
  },
  reducers: {},
  extraReducers: {
    [signup.pending.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: true });
    },
    [signup.fulfilled.type]: (state: AuthState, { payload }: PayloadAction<string>) => {
      Object.assign(state, { inProgress: false, id: payload });
    },
    [signup.rejected.type]: (state: AuthState) => {
      Object.assign(state, { inProgress: false, id: null });
    },
  },
});

export { signup };
export default authSlice;
