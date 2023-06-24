/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IOrgInfo, IProfile } from './interface';

const initialState: {
  orgs: IOrgInfo[],
  lastFetch: number,
  user: IProfile,
} = {
  orgs: [],
  lastFetch: -1,
  user: {
    id: '',
    email: '',
    full_name: '',
    avatar_url: '',
  },
};

const orgInfoSlice = createSlice({
  name: 'orginfo',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    changeOrgInfo: (state, action) => {
      const index = state.orgs.findIndex((org:IOrgInfo) => org.id === action.payload.id);
      if (index === -1) {
        state.orgs.push({ ...structuredClone(action.payload) });
      } else {
        state.orgs[index] = { ...state.orgs[index], ...action.payload };
      }
    },
    setOrgsInfo: (state, action) => {
      state.orgs = [...action.payload];
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    reset: (state, action) => {
      state.orgs = [];
      state.lastFetch = -1;
    },
  },
});

export const {
  setLastFetch,
  changeOrgInfo,
  setOrgsInfo,
  reset,
  setUser,
} = orgInfoSlice.actions;
export default orgInfoSlice.reducer;
