import { ITag } from '@dal/redux/reducers/preset.reducer/interface';

export interface ITemplate {
  id: number;
  owner_org_id: number;
  current_version_id: number;
  title: string;
  desc: string;
  icon_url: string;
  banner_url: string;
  created_at: string;
  tags?: ITag[];
}
