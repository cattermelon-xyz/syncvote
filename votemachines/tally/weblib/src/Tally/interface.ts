import { DelayUnit } from 'directed-graph';

export namespace Tally {
  export interface IData {
    //eslint-disable-line
    options: string[];
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
