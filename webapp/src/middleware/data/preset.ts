import {
  finishLoading,
  setPresetBanners,
  setPresetIcons,
  startLoading,
} from '@redux/reducers/ui.reducer';
import { supabase } from '@utils/supabaseClient';

export class GetterPresetFunction {
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
      } else {
        onError(error);
      }
      dispatch(finishLoading({}));
    }
  }
}

// TODO: should store the last time of update
export const queryPresetIcon = async ({
  dispatch,
  presetIcons,
}: {
  dispatch: any;
  presetIcons: any;
}) => {
  if (!presetIcons || presetIcons.length === 0) {
    dispatch(startLoading({}));
    const { data: iconData, error: iconError } = await supabase.storage
      .from('preset_images')
      .list('icon', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    if (!iconError) {
      const tmp: any[] = [];
      iconData.forEach((d) => {
        tmp.push(d.name);
      });
      dispatch(setPresetIcons(tmp));
    }
    dispatch(finishLoading({}));
  }
};

export const queryPresetBanner = async ({
  dispatch,
  presetBanners,
}: {
  dispatch: any;
  presetBanners: any;
}) => {
  if (!presetBanners || presetBanners.length === 0) {
    dispatch(startLoading({}));
    const { data: bannerData, error: bannerError } = await supabase.storage
      .from('preset_images')
      .list('banner', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    if (!bannerError) {
      const tmp: any[] = [];
      bannerData.forEach((d) => {
        tmp.push(d.name);
      });
      dispatch(setPresetBanners(tmp));
    }
    dispatch(finishLoading({}));
  }
};
