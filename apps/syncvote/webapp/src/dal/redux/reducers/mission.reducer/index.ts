/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IMission } from './interface';

const initialState: {
  missions: IMission[],
  lastFetch: number,
} = {
  missions: [],
  lastFetch: -1,
};

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    setMissions: (state, action) => {
      state.missions = { ...structuredClone(action.payload) };
    },
    changeMission: (state, action) => {
      const index = state.missions.findIndex((m:any) => m.id === action.payload.id);
      if (index === -1) {
        state.missions.push({ ...structuredClone(action.payload) });
      } else {
        state.missions[index] = { ...structuredClone(action.payload) };
      }
    },
    deleteMission: (state, action) => {
      const index = state.missions.findIndex((m:any) => m.id === action.payload.id);
      if (index !== -1) {
        state.missions.splice(index, 1);
      }
    },
    reset: (state, action) => {
      state.missions = [];
      state.lastFetch = -1;
    },
  },
});

export const {
  setMissions,
  changeMission,
  setLastFetch,
  deleteMission,
} = missionSlice.actions;
export default missionSlice.reducer;
