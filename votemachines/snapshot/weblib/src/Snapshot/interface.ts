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
    space: string;
    type: ProposalType;
    action: 'create-proposal' | 'sync-proposal';
    snapShotOption: string[];
    fallback?: string;
    next?: string;
    proposalId: string;
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
