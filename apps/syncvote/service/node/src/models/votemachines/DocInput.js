const { VotingMachine } = require('.');

class DocInput extends VotingMachine {
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
    return {
      isValid,
      message,
    };
  }

  validate(checkpoint) {
    let isValid = true;
    const message = [];
    if (!checkpoint?.children || checkpoint.children.length === 0) {
      isValid = false;
      message.push('Missing options');
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

    // check if option not is a single vote
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

    // // check if contain enough submit
    // if (this.docs.length !== voteData.submission.length) {
    //   return { notRecorded: true, error: 'Your doc required is not enough' };
    // }

    this.who = [voteData.identify];
    this.result = voteData.submission;
    this.tallyResult = {
      index: voteData.option[0],
      submission: voteData.submission,
    };
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
  DocInput,
};
