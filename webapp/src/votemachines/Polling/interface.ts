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
}
