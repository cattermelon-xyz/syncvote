import {
  finishLoading, startLoading,
} from '@redux/reducers/ui.reducer';
import {
  setWeb2Integrations,
  deleteWeb2Integration as deleteWeb2IntegrationReducer,
  setLastFetch,
} from '@redux/reducers/integration.reducer';
import { supabase } from '@utils/supabaseClient';

export const queryWeb2Integration = async ({
  orgId, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
}: {
  orgId: number;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('web2_key').select('*').eq('org_id', orgId).order('created_at', { ascending: false });
  dispatch(finishLoading({}));
  if (data) {
    const newData:any[] = [];
    data.forEach((d) => {
      const newd = structuredClone(d);
      newd.icon_url = d.preset_icon_url ? `preset:${d.preset_icon_url}` : d.icon_url;
      newd.banner_url = d.preset_banner_url ? `preset:${d.preset_banner_url}` : d.banner_url;
      delete newd.preset_icon_url;
      delete newd.preset_banner_url;
      newData.push(newd);
    });
    if (newData) {
      newData.push({
        id: '-1',
        username: ' ', // every integration come with a username aka user identifier
        provider: 'custom',
        integrationId: -1,
        params: {
          key: '',
          value: '',
        },
      });
    }
    // TODO: is newData follow the interface?
    dispatch(setWeb2Integrations(newData));
    dispatch(setLastFetch({}));
    onLoad(newData);
  } else if (error) {
    onError(error);
  }
};
export const deleteWeb2Integration = async ({
  id, onLoad, onError = (error) => {
    console.error(error); // eslint-disable-line
  }, dispatch,
}: {
  id: string;
  onLoad: (data: any) => void;
  onError?: (data: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  const { data, error } = await supabase.from('web2_key').delete().eq('id', id);
  dispatch(finishLoading({}));
  dispatch(deleteWeb2IntegrationReducer({ id }));
  if (!error) {
    onLoad(data);
  } else {
    onError(error);
  }
};
