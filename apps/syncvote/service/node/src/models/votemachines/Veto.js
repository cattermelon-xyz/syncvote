const { VotingMachine } = require('.');

class Veto extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    console.log('Veto');
  }
}

module.exports = {
  Veto,
};
