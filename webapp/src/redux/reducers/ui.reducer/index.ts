/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IPresetType } from './interface';

const initialState: {
  loading: boolean;
  presetIcons: IPresetType[];
  presetBanners: IPresetType[];
  templates: any[];
  initialized: boolean;
  tags: any[];
  // TODO: define Profile & fetch from server
} = {
  loading: false,
  presetIcons: [],
  presetBanners: [],
  templates: [],
  initialized: false,
  tags: [],
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
    setPresetIcons: (state, action) => {
      state.presetIcons = action.payload;
    },
    setPresetBanners: (state, action) => {
      state.presetBanners = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload.map((t: any) => ({
        value: t.id,
        label: t.label,
      }));
    },
    insertTag: (state, action) => {
      const idx = state.tags.findIndex(
        (t: any) => t.value === action.payload.id
      );
      if (idx !== -1) {
        state.tags.push({
          value: action.payload.id,
          label: action.payload.label,
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
  startLoading,
  finishLoading,
  setPresetIcons,
  setPresetBanners,
  setTags,
  insertTag,
  reset,
  resetAll,
  setTemplates,
  changeTemplate,
  initialize,
} = globalUISlice.actions;
export default globalUISlice.reducer;