const moment = require('moment');
const { isArraySubset } = require('../../functions/index');

class VotingMachine {
  constructor(props) {
    const {
      options,
      duration,
      cvd_created_at,
      who,
      delays,
      delayUnits,
      result,
      startToVote,
      endToVote,
      tallyResult,
      participation,
    } = props;
    this.options = options;
    this.duration = duration;
    this.cvd_created_at = cvd_created_at;
    this.who = who;
    this.delays = delays;
    this.delayUnits = delayUnits;
    this.result = result;
    this.startToVote = startToVote;
    this.endToVote = endToVote;
    this.tallyResult = tallyResult;
    this.participation = participation;
  }

  isStarted() {
    if (this.startToVote) {
      return true;
    }
    return false;
  }

  start() {}

  fallBack() {
    // check if this checkpoint was not ready to vote
    if (!this.isStarted()) {
      return { fallback: true, error: 'This checkpoint was not ready to vote' };
    }

    // check if this checkpoint is outdate
    const createdAtMoment = moment(this.startToVote);
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
