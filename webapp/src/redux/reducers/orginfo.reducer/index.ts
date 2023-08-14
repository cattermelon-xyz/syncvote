/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IOrgInfo, IProfile } from './interface';

const initialState: {
  orgs: IOrgInfo[];
  lastFetch: number;
  user: IProfile;
} = {
  orgs: [],
  lastFetch: -1,
  user: {
    id: '',
    email: '',
    full_name: '',
    avatar_url: '',
    about_me: '',
    role: '',
    confirm_email_at: '',
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
      const index = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === action.payload.id
      );
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
    deleteOrgInfo: (state, action) => {
      const index = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === action.payload.id
      );
      if (index !== -1) {
        state.orgs.splice(index, 1);
      }
    },
    addUserToOrg: (state, action) => {
      const { orgId, user } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === orgId
      );
      if (orgIndex !== -1) {
        state.orgs[orgIndex].profile.push(user);
      }
    },
    addWorkflowToOrg: (state, action) => {
      console.log('Add workflow to Org');
      const { workflow } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: any) => org.id === workflow.owner_org_id
      );
      if (orgIndex !== -1) {
        state.orgs[orgIndex].workflows.push(workflow);
      }
    },
    changeWorkflowOrg: (state, action) => {
      const { orgIdFrom, workflow } = action.payload;

      const orgIndexFrom = state.orgs.findIndex(
        (org: any) => org.id === orgIdFrom
      );

      const orgIndexTo = state.orgs.findIndex(
        (org: any) => org.id === workflow.owner_org_id
      );

      // Remove workflow from previous org
      if (orgIndexFrom !== -1) {
        state.orgs[orgIndexFrom].workflows = state.orgs[
          orgIndexFrom
        ].workflows.filter((wf: any) => wf.id !== workflow.id);
      }

      // Add workflow from next org
      if (orgIndexTo !== -1) {
        state.orgs[orgIndexTo].workflows.push(workflow);
      }
    },

    changeWorkflowInfo: (state, action) => {
      const { workflow } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === workflow.owner_org_id
      );

      if (orgIndex !== -1) {
        const worfklowIndex = state.orgs[orgIndex].workflows.findIndex(
          (wf: any) => wf.id === workflow.id
        );

        if (worfklowIndex !== -1) {
          state.orgs[orgIndex].workflows[worfklowIndex] = {
            ...workflow,
          };
        }
      }
    },

    deleteWorkflow: (state, action) => {
      const { workflow } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === workflow.owner_org_id
      );

      if (orgIndex !== -1) {
        const worfklowIndex = state.orgs[orgIndex].workflows.findIndex(
          (wf: any) => wf.id === workflow.id
        );

        if (worfklowIndex !== -1) {
          state.orgs[orgIndex].workflows.splice(worfklowIndex, 1);
        }
      }
    },

    removeUserOfOrg: (state, action) => {
      const { orgId, userId } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === orgId
      );

      if (orgIndex !== -1) {
        const userIndex = state.orgs[orgIndex].profile.findIndex(
          (user) => user.id === userId
        );
        if (userIndex !== -1) {
          state.orgs[orgIndex].profile.splice(userIndex, 1);
        }
      }
    },
  },
});

export const {
  setLastFetch,
  changeOrgInfo,
  setOrgsInfo,
  reset,
  setUser,
  addUserToOrg,
  removeUserOfOrg,
  changeWorkflowOrg,
  changeWorkflowInfo,
  deleteWorkflow,
  addWorkflowToOrg,
  deleteOrgInfo,
} = orgInfoSlice.actions;
export default orgInfoSlice.reducer;
