import { ICheckPoint, IWorkflowVersion, IWorkflowVersionCosmetic } from './interface';

const rootCheckPoint: ICheckPoint = {
  id: 'root',
  position: {
    x: 0,
    y: 0,
  },
  isEnd: true,
  data: {},
};

export const emptyCosmetic: IWorkflowVersionCosmetic = {
  defaultLayout: {
    horizontal: '',
    vertical: '',
  },
  layouts: [],
};

export const emptyStage:IWorkflowVersion = {
  checkpoints: [
    rootCheckPoint,
  ],
  cosmetic: emptyCosmetic,
  start: 'root',
};

