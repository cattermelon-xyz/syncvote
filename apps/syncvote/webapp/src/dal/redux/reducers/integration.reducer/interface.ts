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
