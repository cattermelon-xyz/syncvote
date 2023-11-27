import { DelayUnit } from 'directed-graph';
export declare type ProposalType =
  | 'single-choice'
  | 'approval'
  | 'quadratic'
  | 'ranked-choice'
  | 'weighted'
  | 'basic';

export namespace AD1 {
  export interface IData {
    //eslint-disable-line
    options: string[];
    max: number;
    token: string;
    title: string;
    raw: string;
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
