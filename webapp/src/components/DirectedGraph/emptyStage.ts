import { ICheckPoint, IWorkflowVersion } from './interface';

const rootCheckPoint: ICheckPoint = {
  id: 'root',
  position: {
    x: 0,
    y: 0,
  },
  isEnd: true,
  data: {},
};
export const emptyStage:IWorkflowVersion = {
  checkpoints: [
    rootCheckPoint,
  ],
  start: 'root',
};
