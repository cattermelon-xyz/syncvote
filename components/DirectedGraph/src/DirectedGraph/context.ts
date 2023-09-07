import React from 'react';
import { Session } from '@supabase/gotrue-js';
import {
  GraphViewMode,
  ICheckPoint,
  IConfigPanel,
  IGraph,
  IWorkflowVersionCosmetic,
  IWorkflowVersionLayout,
} from './interface';
import { emptyStage } from './empty';

export const GraphContext = React.createContext<IGraph>({
  data: emptyStage,
  selectedNodeId: '',
  selectedLayoutId: '',
  selectedEdgeId: '',
  viewMode: GraphViewMode.VIEW_ONLY,
  navPanel: undefined,
  onNodeClick: () => {},
  onLayoutClick: () => {},
  onPaneClick: () => {},
  onNodeChanged: () => {},
  onResetPosition: () => {},
  onAddNewNode: () => {},
  onViewPortChange: () => {},
  onCosmeticChanged: (changed: IWorkflowVersionCosmetic) => {},
  onChange: (data: ICheckPoint) => {},
  onDeleteNode: (ckpId: string) => {},
  onConfigPanelClose: () => {},
  onChangeLayout: (data: IWorkflowVersionLayout) => {},
  onConfigEdgePanelClose: () => {},
});

export const GraphPanelContext = React.createContext<IConfigPanel>({
  data: emptyStage,
  selectedNodeId: '',
  selectedLayoutId: '',
  web2Integrations: [],
  onChange: (data: ICheckPoint) => {},
  onDelete: (ckpId: string) => {},
  onClose: () => {},
  viewMode: GraphViewMode.VIEW_ONLY,
  onChangeLayout: (data: IWorkflowVersionLayout) => {},
});
