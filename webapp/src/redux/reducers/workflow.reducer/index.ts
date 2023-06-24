/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IWorkflow } from './interface';

const initialState: {
  workflows: IWorkflow[],
  lastFetch: number,
} = {
  workflows: [],
  lastFetch: -1,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    setWorkflows: (state, action) => {
      state.workflows = action.payload;
    },
    changeWorkflow: (state, action) => {
      const index = state.workflows.findIndex((w:any) => w.id === action.payload.id);
      if (index === -1) {
        state.workflows.push({ ...structuredClone(action.payload) });
      } else {
        state.workflows[index] = {
          ...state.workflows[index],
          ...structuredClone(action.payload),
        };
      }
    },
    deleteWorkflow: (state, action) => {
      const index = state.workflows.findIndex((w:any) => w.id === action.payload.id);
      if (index !== -1) {
        state.workflows.splice(index, 1);
      }
    },
    deleteWorkflowVersion: (state, action) => {
      const index = state.workflows.findIndex((w:any) => w.workflowId === action.payload.id);
      if (index !== -1) {
        const vIndex = state.workflows[index].workflow_version.findIndex((v:any) => v.id === action.payload.versionId);
        if (vIndex !== undefined && vIndex !== -1) {
          state.workflows[index].workflow_version.splice(vIndex, 1);
        }
      }
    },
    changeWorkflowVersion: (state, action) => {
      const index = state.workflows.findIndex((w:any) => w.workflowId === action.payload.id);
      if (index !== -1) {
        if (action.payload.verionId) {
          const vIndex = state.workflows[index].workflow_version?.findIndex((v:any) => v.id === action.payload.versionId);
          if (vIndex !== undefined && vIndex !== -1) {
            state.workflows[index].workflow_version[vIndex] = { ...structuredClone(action.payload.versionData) };
          }
        } else {
          state.workflows[index].workflow_version.push({ ...structuredClone(action.payload.versionData) });
        }
      }
    },
    reset: (state, action) => {
      state.workflows = [];
      state.lastFetch = -1;
    },
  },
});

export const {
  setWorkflows,
  changeWorkflow,
  setLastFetch,
  changeWorkflowVersion,
} = workflowSlice.actions;
export default workflowSlice.reducer;
