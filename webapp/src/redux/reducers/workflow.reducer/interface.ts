export interface IWorkflowVersion {
  id?: number;
  title? : string,
  desc? : string,
  version? : '',
  created_at? : '',
  workflow_id? : number,
  data: any,
}

export interface IWorkflow {
  id?: number;
  title?: string;
  desc?:string;
  icon_url?: string;
  banner_url?: string;
  owner_org_id?: number;
  workflow_version: IWorkflowVersion[];
}
