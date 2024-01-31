import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';
import { VM_TYPE } from '@utils/constants/votemachine';

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

  const apiUrl = `${import.meta.env.VITE_SERVER_URL}/vote/create`;
  axios
    .post(apiUrl, data)
    .then((response) => {
      onSuccess(response);
      dispatch(finishLoading({}));
    })
    .catch((error) => {
      console.log('Error', error);
      onError(error);
      dispatch(finishLoading({}));
    });
};
