import { DelayUnit } from 'directed-graph';

export namespace DocInput {
  export enum DocAction {
    NONE = '',
    UPSERT = 'Create new or Edit ',
    APPEND = 'Append ',
  }
  export interface IDoc {
    id: string;
    action: DocAction;
    description: string;
  }
  export interface IData {
    //eslint-disable-line
    options: string[];
    docs: IDoc[];
    variables: string[];
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
