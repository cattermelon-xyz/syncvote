/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IPresetType } from './interface';

const initialState: {
  presetIcons: IPresetType[];
  presetBanners: IPresetType[];
  templates: any[];
  tags: any[];
  lastFetch: number;
} = {
  presetIcons: [],
  presetBanners: [],
  templates: [],
  tags: [],
  lastFetch: -1,
};

const presetSlice = createSlice({
  name: 'preset',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    setPresetIcons: (state, action) => {
      state.presetIcons = action.payload;
    },
    setPresetBanners: (state, action) => {
      state.presetBanners = action.payload;
    },
    insertTags: (state, action) => {
      action.payload.forEach((payloadTag: any) => {
        if (state.tags.findIndex((t) => t.value === payloadTag.id) === -1) {
          state.tags.push({
            value: payloadTag.id,
            label: payloadTag.label,
            count_template: payloadTag.count_template,
            count_workflow: payloadTag.count_workflow,
            count_mission: payloadTag.count_mission,
          });
        }
      });
    },
    newTag: (state, action) => {
      const idx = state.tags.findIndex(
        (t: any) => t.value === action.payload.id
      );
      if (idx !== -1) {
        state.tags.push({
          value: action.payload.id,
          label: action.payload.label,
          count_template: 0,
          count_workflow: 0,
          count_mission: 0,
        });
      }
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    changeTemplate: (state, action) => {
      const index = state.templates.findIndex(
        (t: any) => t.id === action.payload.id
      );
      if (index === -1) {
        state.templates.push(action.payload);
      } else {
        state.templates[index] = action.payload;
      }
    },
    reset: (state, action) => {
      state.templates = [];
    },
    resetAll: (state, action) => {
      state.presetIcons = [];
      state.presetBanners = [];
      state.templates = [];
    },
  },
});

export const {
  setLastFetch,
  setPresetIcons,
  setPresetBanners,
  insertTags,
  newTag,
  reset,
  resetAll,
  setTemplates,
  changeTemplate,
} = presetSlice.actions;
export default presetSlice.reducer;
