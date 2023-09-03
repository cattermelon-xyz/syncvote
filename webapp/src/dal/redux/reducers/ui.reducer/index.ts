/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IPresetType } from './interface';

const initialState: {
  loading: boolean;
  initialized: boolean;
  // TODO: define Profile & fetch from server
} = {
  loading: false,
  initialized: false,
};

const globalUISlice = createSlice({
  name: 'global_ui',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loading = true;
    },
    finishLoading: (state, action) => {
      state.loading = false;
    },
    initialize: (state, action) => {
      state.initialized = true;
    },
  },
});

export const { startLoading, finishLoading, initialize } =
  globalUISlice.actions;
export default globalUISlice.reducer;
