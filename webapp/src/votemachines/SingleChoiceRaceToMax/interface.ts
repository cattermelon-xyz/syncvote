import { DelayUnit } from '@components/DirectedGraph/interface';

export interface IData {
  //eslint-disable-line
  options: string[];
  max: number;
  quorum?: number;
  token: string;
  includedAbstain: boolean;
  delays: number[];
  delayUnits: DelayUnit[];
  delayNotes: string[];
  resultDescription: string;
}

export interface IOption {
  id: string;
  title: string;
  delay: number;
  delayUnit: DelayUnit;
  delayNote: string;
}
