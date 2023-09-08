export interface IOrgType {
  id: string | number;
  title: string;
  desc: string;
  icon_url?: string;
  banner_url?: string;
  preset_icon_url?: string;
  preset_banner_url?: string;
  org_type?: string;
  org_size?: string;
  role?: string;
}

export interface IPresetType {
  url: string;
}

export interface ITag {
  value: number;
  label: string;
}
