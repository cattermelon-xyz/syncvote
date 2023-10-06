import axios from 'axios';

export const vote = async ({
  data,
  onSuccess,
  onError = (e: any) => {
    console.error(e);
  },
}: {
  data: any;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/vote/create`, data)
    .then((response) => {
      console.log('Respone', response.data);
      onSuccess(response);
    })
    .catch((error) => {
      console.log('Error', error);
      onError(error);
    });
};
