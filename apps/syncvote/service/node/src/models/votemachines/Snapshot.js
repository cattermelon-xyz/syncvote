const { VotingMachine } = require('.');

class Snapshot extends VotingMachine {
  constructor(props) {
    super(props);
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
    }

    if (!checkpoint?.data.fallback || !checkpoint?.data.fallback) {
      isValid = false;
      message.push('Missiong fallback and next checkpoint');
    }

    if (!checkpoint?.data.space || !checkpoint?.data.type) {
      isValid = false;
      message.push('Missing attributes of snapshot');
    }

    return {
      isValid,
      message,
    };
  }

  recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

    // check if dont have action
    if (!voteData.submission.action) {
      return {
        notRecorded: true,
        error: 'Missing action with snapshot',
      };
    }

    return {};
  }

  tally() {
    this.options.map((option, index) => {
      if (option === this.tallyResult[0]) {
        return {
          who: this.who,
          result: this.result,
          tallyResult: this.tallyResult,
          index,
        };
      }
    });
  }
}

module.exports = {
  Snapshot,
};
