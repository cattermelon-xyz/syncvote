import { createSlice } from '@reduxjs/toolkit';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: {
    selectedWorkspace: null as string | null,
  },
  reducers: {
    setSelectedWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload;
    },
  },
});

export const { setSelectedWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
