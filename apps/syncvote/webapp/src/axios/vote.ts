import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { VM_TYPE } from '@utils/constants/votemachine';
import { supabase } from 'utils';

export const vote = async ({
  data,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
  dispatch,
}: {
  data: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));

  const response = await supabase.functions.invoke('voting', {
    body: data,
  });
  if (!response.error) {
    onSuccess(response);
  } else {
    console.log('Error', response.error);
    onError(response.error);
  }
  dispatch(finishLoading({}));
};
