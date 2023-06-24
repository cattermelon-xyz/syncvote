import { ICheckPoint } from '../../types';

const rootCheckPoint: ICheckPoint = {
  id: 'root',
  position: {
    x: 0,
    y: 0,
  },
  isEnd: true,
  data: {},
};
export const emptyStage = {
  checkpoints: [
    rootCheckPoint,
  ],
  start: 'root',
};
