const { VotingMachine } = require('.');

class DocInput extends VotingMachine {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    const { docs } = props;
    this.docs = docs;
=======
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
>>>>>>> main
  }

  recordVote(voteData) {
    // check recordVote of VotingMachine class
    const { notRecorded, error } = super.recordVote(voteData);
    if (notRecorded) {
      return { notRecorded, error };
    }

<<<<<<< HEAD
    // check if option not is a single vote
=======
    // check if options is single vote
>>>>>>> main
    if (voteData.option.length !== 1) {
      return { notRecorded: true, error: 'You need to pick one' };
    }

<<<<<<< HEAD
    // check if contain enough submit
    if (this.docs.length !== voteData.submission.length) {
      return { notRecorded: true, error: 'Your doc required is not enough' };
    }

    this.who = [voteData.identify];
    this.result = voteData.submission;
    this.tallyResult = [voteData.option];
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
=======
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
>>>>>>> main
  }
}

module.exports = {
  DocInput,
};
