import { IWorkflowVersionData } from 'directed-graph';
import { ITag } from '@dal/redux/reducers/preset.reducer/interface';

export interface IWorkflowVersion {
  id?: number;
  title?: string;
  desc?: string;
  version?: '';
  created_at?: '';
  workflow_id?: number;
  data: IWorkflowVersionData;
  status?: string;
}

export interface IWorkflow {
  id?: number;
  title?: string;
  desc?: string;
  icon_url?: string;
  banner_url?: string;
  owner_org_id?: number;
  workflow_version: IWorkflowVersion[];
  tags?: ITag[];
}
