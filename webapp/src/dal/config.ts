import {
  GetterOrgFunction,
  GetterUserFunction,
  GetterWorkflowFunction,
  getWorkflowByStatus,
} from '@middleware/data';
import { GetterPresetFunction } from './middleware/data/preset';
import { ConfigInfo } from './dal';
export interface ConfigTypes {
  getWorkflowByStatus: {
    status: string;
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
    getterFunction: getterPresetFunction.queryPresetIcons,
    reduxObjectPath: 'ui',
  },

  queryPresetBanner: {
    getterFunction: getterPresetFunction.queryPresetBanner,
    reduxObjectPath: 'ui',
  },

  queryUserById: {
    getterFunction: getterUserFunction.queryUserById,
    reduxObjectPath: 'orginfo',
  },

  queryOrgs: {
    getterFunction: getterOrgFunction.queryOrgs,
    reduxObjectPath: 'orginfo',
  },

  getWorkflowByStatus: {
    getterFunction: getterWorkflowFunction.getWorkflowByStatus,
    reduxObjectPath: 'workflow',
  },
};
