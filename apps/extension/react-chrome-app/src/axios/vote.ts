import axios from 'axios';
const serverUrl = process.env.SERVER_URL as string;

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
  const apiUrl = `${serverUrl}/vote/create`;
  axios
    .post(apiUrl, data)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      console.log('Error', error);
      onError(error);
    });
};
