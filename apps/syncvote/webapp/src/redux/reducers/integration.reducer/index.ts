/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IWeb2Integration } from './interface';

const initialState: {
  web2Integrations: IWeb2Integration[],
  lastFetch: number,
} = {
  web2Integrations: [],
  lastFetch: -1,
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    setWeb2Integrations: (state, action) => {
      state.web2Integrations = action.payload;
    },
    changeWeb2Integration: (state, action) => {
      const index = state.web2Integrations.findIndex((t:any) => t.id === action.payload.id);
      if (index === -1) {
        state.web2Integrations.push(action.payload);
      } else {
        state.web2Integrations[index] = action.payload;
      }
    },
    deleteWeb2Integration: (state, action) => {
      const index = state.web2Integrations.findIndex((t:any) => t.id === action.payload.id);
      if (index !== -1) {
        state.web2Integrations.splice(index, 1);
      }
    },
    reset: (state, action) => {
      state.web2Integrations = [];
      state.lastFetch = -1;
    },
  },
});

export const {
  reset,
  setWeb2Integrations,
  changeWeb2Integration,
  deleteWeb2Integration,
  setLastFetch,
} = integrationSlice.actions;
export default integrationSlice.reducer;
