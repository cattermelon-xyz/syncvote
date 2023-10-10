const { VotingMachine } = require('.');

class Pooling extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    console.log('SingleVote');
  }

  tally() {
    // should calculate voting power of pool vote
  }
}
module.exports = {
  Pooling,
};
