export interface ICheckPoint {
  id?: string | undefined;
  data?: any | undefined;
  children?: string[];
  title?: string | undefined;
  description?: string | undefined;
  votingLocation?: string | undefined;
  position?: any;
  vote_machine_type?: string;
  isEnd?: boolean;
  duration?: number; // in seconds
  locked?: any;
  triggers?: any[];
  participation?: IParticipant;
  participationDescription?: string;
  note?: string;
  quorum?: number;
  includedAbstain?: boolean;
  delays?: number[];
  delayUnits?: DelayUnit[];
  delayNotes?: string[];
  resultDescription?: string;
  optionsDescription?: string;
  durationDescription?: string;
}

// TODO: add version
// TODO: separate between data & cosmetic options

export interface IParticipant {
  type?: 'token' | 'identity';
  data?: IToken | string[];
}

export interface IToken {
  network?: string;
  address?: string;
  min?: number;
}

export enum GraphViewMode {
  EDIT_WORKFLOW_VERSION,
  EDIT_MISSION,
  VIEW_ONLY,
}

// TODO: do we need this interface or the ICheckPoint interface is sufficient?
export interface IVoteMachineConfigProps extends ICheckPoint {
  viewMode: GraphViewMode;
  currentNodeId?: string;
  allNodes: any[];
  onChange: (data: any) => void;
  /**
   * Solana Address
   * - If Provider is an excutable program then CPI to get the data
   * - If Provider is a Solana Address then it will be a signer of the txn
   * - If null voting power is always 1
   */
  votingPowerProvider?: string;
  /**
   * List of Solana Addresses
   * - If whitelist is empty then anyone can vote and votingPowerProvider decide the voting power
   * - If whitelist is not empty then only whitelisted addresses can vote
   *   and votingPowerProvider decide the voting power.
   */
  whitelist?: string[];
}

export interface IVoteMachineGetLabelProps {
  source: any;
  target: any;
}

export interface IVoteMachine {
  ConfigPanel: (props: IVoteMachineConfigProps) => JSX.Element;
  getName: () => string;
  getProgramAddress: () => string;
  getType: () => string;
  deleteChildNode: (data: any, children: string[], childId: string) => void;
  getLabel: (props: IVoteMachineGetLabelProps) => JSX.Element;
  getIcon: () => JSX.Element;
  getInitialData: () => any;
  abstract: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => JSX.Element | null;
  explain: ({
    checkpoint,
    data,
    graphData,
  }: {
    checkpoint: ICheckPoint | undefined;
    data: any;
    graphData?: IWorkflowVersionData;
  }) => JSX.Element;
  validate: ({ checkpoint }: { checkpoint: ICheckPoint | undefined }) => {
    isValid: boolean;
    message: string[];
  };
}

export interface IWorkflowVersionLayoutMarker {
  title: string;
  color: string;
}

export interface IWorkflowVersionLayoutNode {
  position: {
    x: number;
    y: number;
  };
  style?: {
    header?: any;
    content?: any;
  };
}

export interface IWorkflowVersionLayoutEdge {
  style: {
    path: any;
    label: any;
    markerEnd: any;
  };
}

export interface IWorkflowVersionLayout {
  id: string;
  renderer: string;
  screen: 'horizontal' | 'vertical' | string;
  title: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
  markers?: IWorkflowVersionLayoutMarker[];
  background?: {};
}

export interface IWorkflowVersionCosmetic {
  defaultLayout?: {
    horizontal: string;
    vertical: string;
  };
  layouts: IWorkflowVersionLayout[];
}

export interface IDoc {
  id: string;
  title: string;
  description: string;
  template: string;
}

export interface IWorkflowVersionData {
  start: string;
  checkpoints: ICheckPoint[];
  docs?: IDoc[];
  cosmetic?: IWorkflowVersionCosmetic;
}

export interface IGraph {
  data: IWorkflowVersionData;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  selectedLayoutId?: string;
  cosmetic?: IWorkflowVersionCosmetic;
  viewMode?: GraphViewMode;
  navPanel?: JSX.Element;
  web2Integrations?: any[];
  shouldExportImage?: boolean;
  className?: string;
  setExportImage?: (value: boolean) => void;
  onNodeClick?: (event: any, data: any) => void;
  onEdgeClick?: (event: any, data: any) => void;
  onLayoutClick?: (data: any) => void;
  onPaneClick?: (event: any) => void;
  onNodeChanged?: (data: any) => void; // new name: onReactFlowNodeChanged
  onCosmeticChanged?: (changed: IWorkflowVersionCosmetic) => void;
  onResetPosition?: () => void;
  onViewPortChange?: (viewport: any) => void;
  onAddNewNode?: () => void;
  onChange?: (data: ICheckPoint) => void;
  onDeleteNode?: (ckpId: string) => void;
  onAddNewDoc?: (newdoc: IDoc) => void;
  onChangeDoc?: (doc: IDoc) => void;
  onDeleteDoc?: (docId: string) => void;
  onConfigPanelClose?: () => void;
  onConfigEdgePanelClose?: () => void;
  onChangeLayout?: (data: IWorkflowVersionLayout) => void;
  openCreateProposalModal?: () => void;
  shouldFitView?: boolean;
}

export interface IConfigPanel {
  data: IWorkflowVersionData;
  selectedNodeId?: string;
  selectedLayoutId?: string;
  web2Integrations?: any[];
  viewMode?: GraphViewMode;
  onChange: (data: ICheckPoint) => void;
  onDelete: (ckpId: string) => void;
  onClose: () => void;
  onChangeLayout: (data: IWorkflowVersionLayout) => void;
}

export interface IWeb2Integration {
  id: string;
  org_id: string;
  provider: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  created_at: string;
  username: string;
  refresh_token_expires_at: number;
  access_token_expires_at: number;
  updated_at: string;
}

export enum DelayUnit {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
