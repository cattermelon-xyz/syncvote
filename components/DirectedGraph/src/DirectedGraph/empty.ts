import {
  ICheckPoint,
  IWorkflowVersionData,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
  IDoc,
} from './interface';

const rootCheckPoint: ICheckPoint = {
  id: 'root',
  position: {
    x: 0,
    y: 0,
  },
  isEnd: true,
  data: {},
};

export const defaultLayout: IWorkflowVersionLayout = {
  id: 'default',
  title: 'Default',
  screen: 'Horizontal',
  renderer: '',
  nodes: [],
  edges: [],
  markers: [],
};

export const emptyCosmetic: IWorkflowVersionCosmetic = {
  defaultLayout: {
    horizontal: 'default',
    vertical: 'default',
  },
  layouts: [defaultLayout],
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

export const emptyStage: IWorkflowVersionData = {
  checkpoints: [rootCheckPoint],
  cosmetic: emptyCosmetic,
  docs: [],
  variables: ['proposal'],
  start: 'root',
};

export const emptyDoc: IDoc = {
  id: '',
  title: '',
  description: '',
  template: '',
};
