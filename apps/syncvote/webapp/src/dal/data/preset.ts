import {
  setPresetBanners,
  setPresetIcons,
  setLastFetch,
} from '@dal/redux/reducers/preset.reducer';
import { supabase } from 'utils';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { deepEqual } from '@utils/helpers';

export class PresetFunctionClass {
  async queryPresetIcons({
    dispatch,
    shouldCache,
    onSuccess,
    onError,
    reduxDataReturn,
  }: {
    params?: any;
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxDataReturn: any;
  }) {
    const { presetIcons } = reduxDataReturn;

    if (shouldCache) {
      onSuccess(presetIcons);
    } else {
      dispatch(startLoading({}));
      const { data, error } = await supabase.storage
        .from('preset_images')
        .list('icon', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (!error) {
        const tmp: any[] = [];
        data.forEach((d) => {
          tmp.push(d.name);
        });
        if (deepEqual(tmp, presetIcons)) {
          onSuccess(presetIcons);
        } else {
          dispatch(setPresetIcons(tmp));
          dispatch(setLastFetch({}));
          onSuccess(data);
        }
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }

  async queryPresetBanners({
    dispatch,
    shouldCache,
    onSuccess,
    onError,
    reduxDataReturn,
  }: {
    params?: any;
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxDataReturn: any;
  }) {
    const { presetBanners } = reduxDataReturn;

    if (shouldCache) {
      onSuccess(presetBanners);
    } else {
      dispatch(startLoading({}));
      const { data, error } = await supabase.storage
        .from('preset_images')
        .list('banner', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (!error) {
        const tmp: any[] = [];
        data.forEach((d) => {
          tmp.push(d.name);
        });
        if (deepEqual(tmp, presetBanners)) {
          onSuccess(presetBanners);
        } else {
          dispatch(setPresetBanners(tmp));
          dispatch(setLastFetch({}));
          onSuccess(data);
        }
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }
}
