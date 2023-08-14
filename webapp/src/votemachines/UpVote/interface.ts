export namespace UpVote {
  export interface IData {
    //eslint-disable-line
    pass?: string;
    fallback?: string;
    token?: string;
    threshold?: number;
  }
  export const UpVoteIndex = {
    fallbackIdx: 0,
    passIdx: 1,
  };
}
