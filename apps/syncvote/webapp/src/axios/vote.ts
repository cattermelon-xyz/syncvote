import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

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

  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/vote/create`, data)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      console.log('Error', error);
      onError(error);
    });
  dispatch(finishLoading({}));
};
