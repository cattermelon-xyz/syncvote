export type SelectBoxOption = {
  id: string;
  label: string | undefined;
  value?: string | number | undefined;
  disabled?: boolean | undefined;
  icon?: any;
};

export interface ValidateInterface {
  type: 'ERROR' | 'WARN' | 'SUCCESS';
  message?: string;
  pass?: boolean;
}
