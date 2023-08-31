export namespace Veto {
  // fallback is 1st child, pass is 2nd child
  export type IVeto = {
    pass?: string;
    fallback?: string;
    token?: string;
    threshold?: number;
  };
}
