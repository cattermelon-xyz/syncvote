import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export const uploadArweave = async ({
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

  console.log('chau beo', data);
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/arweave/upload`, { data: data })
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
