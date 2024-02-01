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

  // const apiUrl = `${import.meta.env.VITE_SERVER_URL}/vote/create`;
  console.log('Voting');
  console.log(data);

  const response = await supabase.functions.invoke('voting', {
    body: data,
  });
  if (!response.error) {
    onSuccess(response);
    dispatch(finishLoading({}));
  } else {
    console.log('Error', response.error);
    onError(response.error);
    dispatch(finishLoading({}));
  }
  // .then((response) => {
  //   onSuccess(response);
  //   dispatch(finishLoading({}));
  // })
  // .catch((error) => {
  //   console.log('Error', error);
  //   onError(error);
  //   dispatch(finishLoading({}));
  // });
  // axios
  //   .post(apiUrl, data)
  //   .then((response) => {
  //     onSuccess(response);
  //     dispatch(finishLoading({}));
  //   })
  //   .catch((error) => {
  //     console.log('Error', error);
  //     onError(error);
  //     dispatch(finishLoading({}));
  //   });
};
