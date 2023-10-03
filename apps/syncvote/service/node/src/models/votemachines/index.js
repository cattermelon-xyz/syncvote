const moment = require('moment');
const { isArraySubset } = require('../../functions/index');

class VotingMachine {
  constructor(props) {
    const { name, options, duration } = props;
    this.name = name;
    this.options = options;
    this.duration = duration;
  }

  fallBack(data) {
    // check if this checkpoint is outdate
    const createdAtMoment = moment(data.cvd_created_at);
    const now = moment();

    const differenceInMilliseconds = now.diff(createdAtMoment);

    if (differenceInMilliseconds >= data.duration) {
      return { fallback: true, error: 'This checkpoint is stopped' };
    }

    return {};
  }

  recordVote(data, voteData) {
    // check if user's choice is wrong
    const isSubset = isArraySubset(voteData.option, data.options);
    if (!isSubset) {
      return { notRecorded: true, error: 'Invalid choice' };
    }

    return {};
  }

  tally() {}

  shouldTally() {}
}

module.exports = {
  VotingMachine,
};
