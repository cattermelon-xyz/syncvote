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
  typeVote,
}: {
  data: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
  dispatch: any;
  typeVote?: any;
}) => {
  dispatch(startLoading({}));

  const apiUrl =
    typeVote === VM_TYPE.DOC_INPUT
      ? `${import.meta.env.VITE_SERVER_URL}/vote/submit-doc`
      : typeVote === VM_TYPE.DISCOURSE
      ? `${import.meta.env.VITE_SERVER_URL}/vote/create-topic`
      : `${import.meta.env.VITE_SERVER_URL}/vote/create`;
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
