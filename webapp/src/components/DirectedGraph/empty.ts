import { ICheckPoint, IWorkflowVersion, IWorkflowVersionCosmetic, IWorkflowVersionLayout } from './interface';

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

export const emptyLayout: IWorkflowVersionLayout = {
  id: '',
  title: '',
  screen: '',
  renderer: '',
  nodes: [],
  edges: [],
  markers: [],
};

export const emptyStage:IWorkflowVersion = {
  checkpoints: [
    rootCheckPoint,
  ],
  cosmetic: emptyCosmetic,
  start: 'root',
};

