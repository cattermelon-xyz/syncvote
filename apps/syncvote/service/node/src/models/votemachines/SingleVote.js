const { VotingMachine } = require('.');

class SingleVote extends VotingMachine {
  constructor(props) {
    super(props);
    const { thresholds } = props;
    this.thresholds = thresholds;
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

    // Are there enough conditions for tally?
    const shouldTally = this.shouldTally();
    if (shouldTally) {
      return { fallback: true, error: 'This checkpoint should tally' };
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

    // check if thesholes is percentage
    if (this.thresholds > 1) {
      for (const option of this.options) {
        if (this.result[option] === this.thresholds) {
          this.tallyResult = { option: this.result[option] };
          return { shouldTally: true };
        } else if (this.result[option] === this.thresholds) {
          return { shouldTally: false, error: 'fallback' };
        } else {
          return { shouldTally: false };
        }
      }
    } else {
      if (this.who && this.who.length !== 0) {
        let count_number_of_vote = this.who.length;
        // check if the number of voter is bigger than quorums
        let thresholdsNumber = 0;
        if (this.thresholds * this.quorums <= count_number_of_vote) {
          thresholdsNumber = this.thresholds * count_number_of_vote;
        } else {
          thresholdsNumber = this.thresholds * this.quorums;
        }

        for (const option of this.options) {
          if (this.result[option] === thresholdsNumber) {
            this.tallyResult = { option: this.result[option] };
            return { shouldTally: true };
          } else if (this.result[option] === this.thresholds) {
            return { shouldTally: false, error: 'fallback' };
          } else {
            return { shouldTally: false };
          }
        }
      }
    }
  }
}

module.exports = {
  SingleVote,
};
