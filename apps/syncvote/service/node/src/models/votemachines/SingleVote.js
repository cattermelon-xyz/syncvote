const { VotingMachine } = require('.');

class SingleVote extends VotingMachine {
  constructor(props) {
    super(props);
  }

  initDataForCVD(data) {
    console.log('Haha', data);
  }

  fallBack(data) {
    // check fallback of VotingMachine class
    const { fallBack, error } = super.fallBack(data);
    if (fallBack) {
      return { fallBack, error };
    }

    // Are there enough conditions for tally?
    const shouldTally = this.shouldTally(data);
    if (shouldTally) {
      return { fallback: true, error: 'This checkpoint should tally' };
    }

    return {};
  }

  recordVote(data, voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded } = super.recordVote(data, voteData);
    if (notRecorded) {
      return super.recordVote(data, voteData);
    }

    // check if options is single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    // check if user is alreadyvote
    if (data.who !== null && data.who.includes(voteData.identify)) {
      return { notRecorded: true, error: 'User is already voted' };
    }

    return {};
  }

  shouldTally(data) {
    super.shouldTally();
    const shouldTally = false;

    console.log(data);

    return shouldTally;
  }
}

module.exports = {
  SingleVote,
};
