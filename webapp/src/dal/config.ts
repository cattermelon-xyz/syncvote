import {
  OrgFunctionClass,
  UserFunctionClass,
  WorkflowFunctionClass,
  PresetFunctionClass,
} from '@dal/data';
import { ConfigInfo } from './dal';
export interface ConfigTypes {
  updateUserProfile: {
    userProfile: any;
  };

  getWorkflowByStatus: {
    status: string;
  };

  changeAWorkflowOrg: {
    orgId: string;
    workflow: any;
  };
}

const presetFunction = new PresetFunctionClass();
const userFunction = new UserFunctionClass();
const orgFunction = new OrgFunctionClass();
const workflowFunction = new WorkflowFunctionClass();

interface ConfigObject {
  [key: string]: ConfigInfo;
}

export const config: ConfigObject = {
  queryPresetIcons: {
    dalFunction: presetFunction.queryPresetIcons,
    reduxObjectPath: 'preset',
  },

  queryPresetBanners: {
    dalFunction: presetFunction.queryPresetBanners,
    reduxObjectPath: 'preset',
  },

  queryUserById: {
    dalFunction: userFunction.queryUserById,
    reduxObjectPath: 'orginfo',
  },

  queryOrgs: {
    dalFunction: orgFunction.queryOrgs,
    reduxObjectPath: 'orginfo',
  },

  getWorkflowByStatus: {
    dalFunction: workflowFunction.getWorkflowByStatus,
    reduxObjectPath: 'workflow',
  },

  changeAWorkflowOrg: {
    dalFunction: workflowFunction.changeAWorkflowOrg,
  },

  updateUserProfile: {
    dalFunction: userFunction.updateUserProfile,
  },

  deleteOrg: {
    dalFunction: orgFunction.deleteOrg,
  },

  queryUserByEmail: {
    dalFunction: userFunction.queryUserByEmail,
  },

  inviteExistingMember: {
    dalFunction: userFunction.inviteExistingMember,
  },

  inviteUserByEmail: {
    dalFunction: userFunction.inviteUserByEmail,
  },

  removeMemberOfOrg: {
    dalFunction: orgFunction.removeMemberOfOrg,
  },
  
  upsertAnOrg: {
    dalFunction: orgFunction.upsertAnOrg,
  },

  insertWorkflowAndVersion: {
    dalFunction: workflowFunction.insertWorkflowAndVersion,
  },

  deleteAWorkflow: {
    dalFunction: workflowFunction.deleteAWorkflow,
  },

  queryWorkflow: {
    dalFunction: workflowFunction,
    reduxObjectPath: 'workflow',
  },
};
