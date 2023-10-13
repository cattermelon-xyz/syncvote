import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
  dispatch,
}: {
  missionData: any;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, missionData)
    .then((response) => {
      console.log('Respone', response.data);
      if (response.data.status === 'ERR') {
        onError(response.data.message);
      } else {
        onSuccess(response.data);
      }
    })
    .catch((error) => {
      console.log('Error', error);
      onError(error);
    });
  dispatch(finishLoading({}));
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
