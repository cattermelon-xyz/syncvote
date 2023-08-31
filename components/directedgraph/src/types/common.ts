export type AlertMessage = {
  type: 'ERROR' | 'WARN' | 'SUCCESS';
  message?: string;
};

export type SelectBoxOption = {
  id: string;
  label: string | undefined;
  value?: string | number | undefined;
  disabled?: boolean | undefined;
  member?: any[];
  cpId?: string;
};
