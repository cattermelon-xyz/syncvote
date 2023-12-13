import { DelayUnit } from 'directed-graph';

export namespace Discourse {
  export interface IData {
    //eslint-disable-line
    options: string[];
    max: number;
    token: string;
    action: string;
    variables: string[];
    start?: number;
    end?: number;
    title?: string;
    body?: string;
    discussion?: string;
    plugins?: string;
    next?: string;
    fallback?: string;
  }

  export interface IOption {
    id: string;
    title: string;
    delay: number;
    delayUnit: DelayUnit;
    delayNote: string;
  }
}
