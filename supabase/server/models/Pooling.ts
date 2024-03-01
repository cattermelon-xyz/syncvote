import { VotingMachine } from './index.ts';

export class Pooling extends VotingMachine {
  constructor(props: any) {
    super(props);
  }

  tally() {
    // should calculate voting power of pool vote
  }
}
