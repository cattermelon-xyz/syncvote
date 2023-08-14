export namespace Polling {
  export interface Option {
    title: string;
    description: string;
  }

  export interface IData {
    //eslint-disable-line
    options?: Option[];
    max?: number;
    next?: string;
    fallback?: string;
    upTo?: number;
    token?: string;
  }

  export const PollingIndex = {
    nextIdx: 0,
    fallbackIdx: 1,
  };
}
