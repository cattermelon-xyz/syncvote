const { VotingMachine } = require('.');

class Upvote extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    console.log('Upvote');
  }
}

module.exports = {
  Upvote,
};
