import { GetterUserFunction } from '@middleware/data';
import { GetterPresetFunction } from './middleware/data/preset';
export interface ConfigTypes {
  getDataOrgs: {
    userId?: string;
  };

  queryUserById: {
    userId: string;
  };
}

const getterPresetFunction = new GetterPresetFunction();
const getterUserFunction = new GetterUserFunction();

export const config = {
  queryPresetIcon: {
    getterFunction: getterPresetFunction.queryPresetIcon,
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
};
