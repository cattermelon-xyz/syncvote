import {
  setPresetBanners,
  setPresetIcons,
  setLastFetch,
} from '@dal/redux/reducers/preset.reducer';
import { supabase } from '@utils/supabaseClient';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export class PresetFunctionClass {
  [key: string]: any;

  async queryPresetIcons({
    dispatch,
    shouldCache,
    onSuccess,
    onError,
    reduxVar,
  }: {
    params?: any;
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxVar: any;
  }) {
    const { presetIcons } = reduxVar;

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
        onSuccess(data);
        dispatch(setPresetIcons(tmp));
        dispatch(setLastFetch({}));
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }

  async queryPresetBanner({
    dispatch,
    shouldCache,
    onSuccess,
    onError,
    reduxVar,
  }: {
    params?: any;
    dispatch: any;
    shouldCache: boolean;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    reduxVar: any;
  }) {
    const { presetBanners } = reduxVar;
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
        onSuccess(data);
        dispatch(setPresetBanners(tmp));
        dispatch(setLastFetch({}));
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }
}