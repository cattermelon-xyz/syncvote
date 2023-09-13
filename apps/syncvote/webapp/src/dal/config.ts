import {
  OrgFunctionClass,
  UserFunctionClass,
  WorkflowFunctionClass,
  PresetFunctionClass,
} from '@dal/data';

import { ConfigInfo } from 'utils';
import { TemplateFunctionClass } from './data/template';
import { TagFunctionClass } from './data/tag';

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
const templateFunction = new TemplateFunctionClass();
const tagFunction = new TagFunctionClass();

interface ConfigObject {
  [key: string]: ConfigInfo;
}

export const config: ConfigObject = {
  queryTag: {
    dalFunction: tagFunction.queryTag, // done
    reduxObjectPath: 'preset',
  },

  queryTemplate: {
    dalFunction: templateFunction.queryTemplate, // done
    reduxObjectPath: 'template',
  },

  searchTemplate: {
    dalFunction: templateFunction.searchTemplate,
  },

  queryPresetIcons: {
    dalFunction: presetFunction.queryPresetIcons, // done
    reduxObjectPath: 'preset',
  },

  queryPresetBanners: {
    dalFunction: presetFunction.queryPresetBanners, // done
    reduxObjectPath: 'preset',
  },

  queryUserById: {
    dalFunction: userFunction.queryUserById, // done
    reduxObjectPath: 'orginfo',
  },

  queryOrgs: {
    dalFunction: orgFunction.queryOrgs, // done
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
    dalFunction: workflowFunction.queryWorkflow,
    reduxObjectPath: 'workflow',
  },

  newOrg: {
    dalFunction: orgFunction.newOrg,
  },

  upsertTemplate: {
    dalFunction: templateFunction.upsertTemplate,
  },

  deleteTemplate: {
    dalFunction: templateFunction.deleteTemplate,
  },

  queryATemplate: {
    dalFunction: templateFunction.queryATemplate,
    reduxObjectPath: 'template',
  },

  updateAWorkflowTag: {
    dalFunction: workflowFunction.updateAWorkflowTag,
  },

  updateAWorkflowInfo: {
    dalFunction: workflowFunction.updateAWorkflowInfo,
  },

  upsertWorkflowVersion: {
    dalFunction: workflowFunction.upsertWorkflowVersion,
  },
};
