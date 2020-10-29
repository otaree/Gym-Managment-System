import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: { authentic: false },
  reducers: {
    setAuthentic: (state, action) => {
      state.authentic = action.payload;
    },
  },
});

export const { setAuthentic } = authSlice.actions;

export default authSlice.reducer;

export const selectAuthentic = (state: RootState) => state.auth.authentic;
