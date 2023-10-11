import axios from 'axios';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
}: {
  missionData: any;
  onSuccess: () => void;
  onError: () => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, missionData)
    .then((response) => {
      console.log('Respone', response.data);
      onSuccess();
    })
    .catch((error) => {
      console.log('Error', error);
      onError();
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
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/update`, {
      params: missionData,
      missionId: missionId,
    })
    .then((response) => {
      console.log('Respone', response.data);
      onSuccess();
    })
    .catch((error) => {
      console.log('Error', error);
      onError();
    });
};
