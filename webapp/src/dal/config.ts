import {
  GetterOrgFunction,
  GetterUserFunction,
  GetterWorkflowFunction,
  GetterPresetFunction,
} from '@middleware/data';
import { ConfigInfo } from './dal';
export interface ConfigTypes {
  getWorkflowByStatus: {
    status: string;
  };

  changeAWorkflowOrg: {
    orgId: string;
    workflow: any;
  };
}

const getterPresetFunction = new GetterPresetFunction();
const getterUserFunction = new GetterUserFunction();
const getterOrgFunction = new GetterOrgFunction();
const getterWorkflowFunction = new GetterWorkflowFunction();

interface ConfigObject {
  [key: string]: ConfigInfo;
}

export const config: ConfigObject = {
  queryPresetIcons: {
    dalFunction: getterPresetFunction.queryPresetIcons,
    reduxObjectPath: 'ui',
  },

  queryPresetBanner: {
    dalFunction: getterPresetFunction.queryPresetBanner,
    reduxObjectPath: 'ui',
  },

  queryUserById: {
    dalFunction: getterUserFunction.queryUserById,
    reduxObjectPath: 'orginfo',
  },

  queryOrgs: {
    dalFunction: getterOrgFunction.queryOrgs,
    reduxObjectPath: 'orginfo',
  },

  getWorkflowByStatus: {
    dalFunction: getterWorkflowFunction.getWorkflowByStatus,
    reduxObjectPath: 'workflow',
  },

  changeAWorkflowOrg: {
    dalFunction: getterWorkflowFunction.changeAWorkflowOrg,
  },
};
