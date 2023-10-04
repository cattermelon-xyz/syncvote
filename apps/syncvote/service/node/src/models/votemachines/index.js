const moment = require('moment');
const { isArraySubset } = require('../../functions/index');

class VotingMachine {
  constructor(props) {
    const {
      name,
      options,
      duration,
      cvd_created_at,
      who,
      delays,
      delayUnits,
      quorums,
      result,
    } = props;
    this.name = name;
    this.options = options;
    this.duration = duration;
    this.cvd_created_at = cvd_created_at;
    this.who = who;
    this.delays = delays;
    this.delayUnits = delayUnits;
    this.quorums = quorums;
    this.result = result;
  }

  fallBack() {
    // check if this checkpoint is outdate
    const createdAtMoment = moment(this.cvd_created_at);
    const now = moment();

    const differenceInSeconds = now.diff(createdAtMoment, 'seconds');
    if (differenceInSeconds >= this.duration) {
      return { fallback: true, error: 'This checkpoint is stopped' };
    }

    return {};
  }

  recordVote(voteData) {
    // check if user's choice is wrong
    const isSubset = isArraySubset(voteData.option, this.options);
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
