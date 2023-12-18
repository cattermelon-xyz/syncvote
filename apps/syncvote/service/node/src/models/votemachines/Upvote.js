const { VotingMachine } = require('.');

class UpVote extends VotingMachine {
  constructor(props) {
    super(props);
    const { thresholds, quorum } = props;
    this.thresholds = thresholds;
    this.quorum = quorum;
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }

    if (!checkpoint?.quorum) {
      isValid = false;
      message.push('Missing quorum');
    }

    if (!checkpoint?.data.pass || !checkpoint?.data.fallback) {
      isValid = false;
      message.push('Missing pass or fallback option');
    }
    return {
      isValid,
      message,
    };
  }

  initDataForCVD() {
    let result = {
      '-1': {
        count: 0,
      },
      0: {
        count: 0,
      },
    };

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

    // check if user's choice is wrong
    if (voteData.option[0] !== 0 && voteData.option[0] !== -1) {
      return { notRecorded: true, error: `Invalid choice` };
    }

    // check if options is single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    // check if user is already vote
    if (this.who !== null && this.who.includes(voteData.identify)) {
      return { notRecorded: true, error: 'User is already voted' };
    }

    if (!this.who || this.who.length === 0) {
      this.who = [voteData.identify];
    } else {
      this.who = this.who.concat(voteData.identify);
    }

    if (this.participation.type === 'identity') {
      this.result[voteData.option[0]].count += 1;
    } else {
      // Dont have vote by token
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
      const options = [0, -1];
      for (let index of options) {
        if (this.result[index].count >= thresholdsNumber) {
          if (this.who.length >= this.quorum) {
            this.tallyResult = { index: index, ...this.result[index] };
            return { shouldTally: true, tallyResult: this.tallyResult };
          }
        }
      }
    }

    return { shouldTally: false };
  }
}

module.exports = {
  UpVote,
};
