const { VotingMachine } = require('.');

class SingleVote extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    super.recordVote();
    console.log('SingleVote');
  }
}

module.exports = {
  SingleVote,
};
