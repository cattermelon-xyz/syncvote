import { supabase } from './src/function/supabaseClient';
import { getImageUrl } from './src/function/getImageUrl';
import { createIdString, extractIdFromIdString } from './src/function/idString';
import { subtractArray } from './src/function/subtractArray';
import { useGetDataHook, useSetData, ConfigInfo } from './src/dal/dal';

export {
  supabase,
  getImageUrl,
  createIdString,
  extractIdFromIdString,
  subtractArray,
  useGetDataHook,
  useSetData,
};

export type { ConfigInfo };
