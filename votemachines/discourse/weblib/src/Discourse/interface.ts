import { DelayUnit } from 'directed-graph';

export namespace Discourse {
  export interface IData {
    //eslint-disable-line
    options: string[];
    action: string;
    variables: string[];
    categoryId?: number;
    // start?: number;
    // end?: number;
    // title?: string;
    // body?: string;
    // discussion?: string;
    // plugins?: string;
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

  export const SelectOptions = [
    {
      label: 'Create topic',
      value: 'create-topic',
    },
    {
      label: 'Update description',
      value: 'update-topic',
    },
    {
      label: 'Move Topic to other category',
      value: 'move-topic',
    },
    {
      label: 'Comment into topic',
      value: 'create-post',
    },
  ];
}
