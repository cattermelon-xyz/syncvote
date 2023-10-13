import React from 'react';
import { Session } from '@supabase/gotrue-js';
import {
  GraphViewMode,
  ICheckPoint,
  IConfigPanel,
  IDoc,
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
  onViewPortChange: () => {},
  onCosmeticChanged: (changed: IWorkflowVersionCosmetic) => {},
  onAddNewDoc: (newDoc: IDoc) => {},
  onChangeDoc: (data: IDoc) => {},
  onDeleteDoc: (docId: string) => {},
  onAddNewNode: () => {},
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
