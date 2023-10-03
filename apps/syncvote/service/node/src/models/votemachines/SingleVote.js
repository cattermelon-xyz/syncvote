const { VotingMachine } = require('.');

class SingleVote extends VotingMachine {
  constructor(props) {
    super(props);
  }

  fallBack(data) {
    if (super.fallBack(data)) {
      return super.fallBack(data);
    } else if (this.shouldTally()) {
      return this.shouldTally();
    }

    return {};
  }

  recordVote(data, voteData) {
    const { notRecorded } = super.recordVote(data, voteData);
    if (notRecorded) {
      return super.recordVote(data, voteData);
    }

    // check if options is single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    //check if user is alreadyvote

    return {};
  }

  shouldTally() {
    super.shouldTally();
    const shouldTally = false;
    if (shouldTally) {
      return { fallback: true, error: 'This checkpoint should tally' };
    }
    return null;
  }
}

module.exports = {
  SingleVote,
};
