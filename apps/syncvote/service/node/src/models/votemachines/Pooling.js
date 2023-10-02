const { VotingMachine } = require('.');

class Pooling extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    console.log('SingleVote');
  }
}
module.exports = {
  Pooling,
};
