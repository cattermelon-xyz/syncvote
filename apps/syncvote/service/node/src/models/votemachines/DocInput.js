const { VotingMachine } = require('.');

class DocInput extends VotingMachine {
  constructor(props) {
    super(props);
  }
  
  initDataForCVD(data) {
    const options = data.options;
    if (options.length === 0) {
      return {
        initData: false,
        error: 'Cannot init data because options is empty',
      };
    }
    let result = {};
    for (const option of options) {
      result[option] = 0;
    }

    return {
      initData: true,
      result: result,
    };
  }

  fallBack() {
    // check fallback of VotingMachine class
    const { fallback, error } = super.fallBack();
    if (fallback) {
      return { fallback, error };
    }

    return {};
  }

  recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if options is single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    // check if user is alreadyvote
    if (this.who !== null && this.who.includes(voteData.identify)) {
      return { notRecorded: true, error: 'User is already voted' };
    }

    // check if user was allow to vote, check participant

    // check if abstain, dont increase the result, abstain send option [255]
    this.who = this.who.concat(voteData.identify);
    this.result[voteData.option[0]] += 1;

    return {};
  }

  shouldTally() {
    super.shouldTally();
    const shouldTally = false;

    return shouldTally;
  }
}

module.exports = {
  DocInput,
};
