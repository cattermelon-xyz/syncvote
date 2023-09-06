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
  name: 'workflow',
  initialState,
  reducers: {
    setTemplate: (state, action) => {
      state.templates = action.payload;
    },
    addTemplate: (state, action) => {
      state.templates.push(action.payload);
    },
    changeTemplate: (state, action) => {
      const idx = state.templates.findIndex((tmpl) => {
        tmpl.id === action.payload.id;
      });
      state.templates[idx] = action.payload;
    },
  },
});

export const { setTemplate, addTemplate, changeTemplate } =
  templateSlice.actions;
export default templateSlice.reducer;
