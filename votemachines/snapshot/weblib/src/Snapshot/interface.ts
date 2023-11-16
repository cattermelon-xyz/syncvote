import { DelayUnit } from 'directed-graph';
export declare type ProposalType =
  | 'single-choice'
  | 'approval'
  | 'quadratic'
  | 'ranked-choice'
  | 'weighted'
  | 'basic';

export namespace Snapshot {
  export interface IData {
    //eslint-disable-line
    options: string[];
    max: number;
    token: string;
    space?: string;
    type?: ProposalType;
    start?: number;
    end?: number;
    title?: string;
    body?: string;
    discussion?: string;
    plugins?: string;
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
