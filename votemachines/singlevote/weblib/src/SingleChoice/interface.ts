import { DelayUnit } from 'directed-graph';

export namespace SingleChoice {
  export interface IData {
    //eslint-disable-line
    options: string[];
    max: number;
    token: string;
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
