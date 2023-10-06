const { VotingMachine } = require('.');

class SingleVote extends VotingMachine {
  constructor(props) {
    super(props);
    const { thresholds, includedAbstain, quorum } = props;
    this.thresholds = thresholds;
    this.includedAbstain = includedAbstain;
    this.quorum = quorum;
  }

  initDataForCVD() {
    const options = this.options;
    if (options.length === 0) {
      return {
        initData: false,
        error: 'Cannot init data because options is empty',
      };
    }
    let result = {};
    options.map((_, index) => {
      result[index] = {
        count: 0,
        voting_power: 0,
      };
    });

    if (this.includedAbstain) {
      result['-1'] = {
        count: 0,
        voting_power: 0,
      };
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
    const { shouldTally } = this.shouldTally();
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

    // check if user is already vote
    if (this.who !== null && this.who.includes(voteData.identify)) {
      return { notRecorded: true, error: 'User is already voted' };
    }

    // check if abstain, dont increase the result, abstain send option [-1]'
    if (!this.includedAbstain && voteData.option[0] === -1) {
      return { notRecorded: true, error: 'Cannot vote abstain option' };
    }

    if (voteData.option[0] === -1) {
      if (!this.who || this.who.length === 0) {
        this.who = [voteData.identify];
      } else {
        this.who = this.who.concat(voteData.identify);
      }
      this.result['-1'].count += 1;
    } else {
      if (!this.who || this.who.length === 0) {
        this.who = [voteData.identify];
      } else {
        this.who = this.who.concat(voteData.identify);
      }
      if (this.participation.type === 'identity') {
        this.result[voteData.option[0]].count += 1;
        this.result[voteData.option[0]].voting_power += 1;
      } else {
        // Dont have vote by token
      }
    }
    return {};
  }

  shouldTally() {
    super.shouldTally();

    if (this.who && this.who.length !== 0) {
      // check if the number of voter is bigger than quorum
      let thresholdsNumber = 0;

      // check if thesholes is percentage
      if (this.thresholds > 1) {
        thresholdsNumber = this.thresholds;
      } else {
        if (this.thresholds * this.quorum <= this.who.length) {
          thresholdsNumber = this.thresholds * this.who.length;
        } else {
          thresholdsNumber = this.thresholds * this.quorum;
        }
      }

      for (let index in this.options) {
        if (this.includedAbstain) {
          if (this.result['-1'].count >= thresholdsNumber) {
            if (this.who.length >= this.quorum) {
              this.tallyResult = { option: this.result['-1'] };
              return { shouldTally: true };
            }
          }
        }

        if (this.result[index].count >= thresholdsNumber) {
          if (this.who.length >= this.quorum) {
            this.tallyResult = { option: this.result[index] };
            return { shouldTally: true };
          }
        }
      }
    }

    return { shouldTally: false };
  }

  
}

module.exports = {
  SingleVote,
};
