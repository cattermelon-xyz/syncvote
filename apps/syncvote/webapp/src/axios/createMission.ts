import axios from 'axios';
import { startLoading, finishLoading } from '@redux/reducers/ui.reducer';

export const createMission = async ({
  missionData,
  onSuccess,
  onError,
  dispatch,
}: {
  missionData: any;
  onSuccess: (data:any) => void;
  onError: () => void;
  dispatch: any;
}) => {
  dispatch(startLoading({}));
  axios
    .post(`${import.meta.env.VITE_SERVER_URL}/mission/create`, missionData)
    .then((response) => {
      console.log('Respone', response.data);
      onSuccess(response.data);
      dispatch(finishLoading({}));
    })
    .catch((error) => {
      console.log('Error', error);
      onError();
      dispatch(finishLoading({}));
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
