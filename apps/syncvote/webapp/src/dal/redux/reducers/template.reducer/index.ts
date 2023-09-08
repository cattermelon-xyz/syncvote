import { createSlice } from '@reduxjs/toolkit';
import { ITemplate } from './interface';

const initialState: {
  templates: ITemplate[];
  lastFetch: number;
} = {
  templates: [],
  lastFetch: -1,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    addTemplate: (state, action) => {
      const idx = state.templates.findIndex(
        (tmpl) => tmpl.id === action.payload.id
      );
      if (idx === -1) {
        state.templates.push(action.payload);
      } else {
        state.templates[idx] = { ...state.templates[idx], ...action.payload };
      }
    },
    changeTemplate: (state, action) => {
      const idx = state.templates.findIndex(
        (tmpl) => tmpl.id === action.payload.id
      );
      if (idx !== -1) {
        state.templates[idx] = { ...state.templates[idx], ...action.payload };
      }
    },
    deleteTemplate: (state, action) => {
      const idx = state.templates.findIndex(
        (tmpl) => tmpl.id === action.payload.id
      );
      if (idx !== -1) {
        state.templates.splice(idx, 1);
      }
    },
  },
});

export const {
  setTemplates,
  addTemplate,
  changeTemplate,
  deleteTemplate,
  setLastFetch,
} = templateSlice.actions;
export default templateSlice.reducer;
