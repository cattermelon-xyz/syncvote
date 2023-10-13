import axios from 'axios';

export const createMission = async ({
  missionData,
  onSuccess = () => {},
  onError = () => {},
}: {
  missionData: any;
  onSuccess?: (msg: any) => void;
  onError?: (mgs: any) => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, missionData)
    .then((response) => {
      console.log('Respone', response.data);
      if (response.data.status === 'ERR') {
        onError(response.data.message);
      }
      onSuccess('');
    })
    .catch((error) => {
      console.log('Error', error);
      onError('Error to create a new proposal');
    });
};

export const updateMission = async ({
  missionId,
  missionData,
  onSuccess = () => {},
  onError = () => {},
}: {
  missionId: number;
  missionData: any;
  onSuccess?: (msg: any) => void;
  onError?: (mgs: any) => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/update`, {
      params: missionData,
      missionId: missionId,
    })
    .then((response) => {
      console.log('Respone', response.data);
      if (response.data.status === 'ERR') {
        onError(response.data.message);
      }
      onSuccess('');
    })
    .catch((error) => {
      console.log('Error', error);
      onError('Error to edit a proposal');
    });
};
