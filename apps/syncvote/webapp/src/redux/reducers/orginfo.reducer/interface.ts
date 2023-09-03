export interface IOrgInfo {
  id: number;
  title: string;
  desc: string;
  icon_url: string;
  banner_url: string;
  preset_icon_url?: string;
  preset_banner_url?: string;
  org_type: string;
  org_size: string;
  role: string;
  profile: IProfile[];
  last_updated: any;
  workflows: any;
}

export interface IProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  about_me: string;
  role: string;
  confirm_email_at: string;
}

export interface IMember {
  id: number;
  nameTag: string;
  roleId: string;
  walletAddress: string;
}

export interface IRole {
  id: string | number;
  label: string;
  value?: string;
}

export interface IMemberType {
  id: string | number;
  name: string;
  walletAddress: string;
}

export interface IMemberRoles {
  id: string | number;
  member: IMemberType[];
}
