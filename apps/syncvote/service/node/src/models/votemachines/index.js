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
      endedAt,
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
    this.endedAt = endedAt;
    this.tallyResult = tallyResult;
    this.participation = JSON.parse(participation);
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
    for (const option of voteData.option) {
      if (option > this.options.length - 1) {
        return { notRecorded: true, error: `Invalid choice` };
      }
    }

    // check if user was allow to vote, check participation
    if (this.participation.type === 'identity') {
      // check if user was allow to vote, check participation
      if (!this.participation.data.includes(voteData.identify)) {
        return { notRecorded: true, error: `You don't have right to vote` };
      }
    }

    return {};
  }

  tally() {}

  shouldTally() {}
}

module.exports = {
  VotingMachine,
};
