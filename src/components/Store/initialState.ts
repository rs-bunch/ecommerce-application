import { StateI } from '../../types';

const initialState: StateI = {
  location: null,
  auth: {
    active: false,
    token: null,
  },
};

export default initialState;
