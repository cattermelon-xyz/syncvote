const { VotingMachine } = require('.');

class Pooling extends VotingMachine {
  constructor(props) {
    super(props);
  }

  recordVote() {
    console.log('SingleVote');
  }
<<<<<<< HEAD

  tally() {
    // should calculate voting power of pool vote
  }
=======
>>>>>>> main
}
module.exports = {
  Pooling,
};
