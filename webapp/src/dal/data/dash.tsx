import { finishLoading, startLoading } from '../../redux/reducers/ui.reducer';

const BASE_URL = 'https://decisiontree.herokuapp.com';

// TODO: update redux
export const create = async ({
  json, title, desc, onSuccess, onError = (error:any) => {
    console.error(error);
  }, dispatch,
}:{
  json: any;
  title: string;
  desc: string;
  onSuccess: (data:any) => void;
  onError?: (error:any) => void;
  dispatch: any;
}) => {
  const toSend = {
    ...json,
    name: title,
    description: desc,
  };
  dispatch(startLoading({}));
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  });
  dispatch(finishLoading({}));
  if (response.status === 200) {
    const data = await response.json();
    onSuccess(data);
  } else {
    const data = await response.json();
    onError(data);
  }
};

// export const vote = () => {}
