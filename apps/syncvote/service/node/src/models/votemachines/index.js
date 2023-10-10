const moment = require('moment');
const { isArraySubset } = require('../../functions/index');

class VotingMachine {
  constructor(props) {
    const {
<<<<<<< HEAD
=======
      name,
>>>>>>> main
      options,
      duration,
      cvd_created_at,
      who,
      delays,
      delayUnits,
<<<<<<< HEAD
      result,
      startToVote,
      endedAt,
      tallyResult,
      participation,
    } = props;
=======
      quorums,
      result,
    } = props;
    this.name = name;
>>>>>>> main
    this.options = options;
    this.duration = duration;
    this.cvd_created_at = cvd_created_at;
    this.who = who;
    this.delays = delays;
    this.delayUnits = delayUnits;
<<<<<<< HEAD
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

    // check if this checkpoint is ended
    if (this.endedAt) {
      return { fallback: true, error: 'This checkpoint is ended' };
    }

    // check if this checkpoint is outdate
    const createdAtMoment = moment(this.startToVote);
=======
    this.quorums = quorums;
    this.result = result;
  }

  fallBack() {
    // check if this checkpoint is outdate
    const createdAtMoment = moment(this.cvd_created_at);
>>>>>>> main
    const now = moment();

    const differenceInSeconds = now.diff(createdAtMoment, 'seconds');
    if (differenceInSeconds >= this.duration) {
      return { fallback: true, error: 'This checkpoint is stopped' };
    }

    return {};
  }

  recordVote(voteData) {
    // check if user's choice is wrong
<<<<<<< HEAD
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
=======
    const isSubset = isArraySubset(voteData.option, this.options);
    if (!isSubset) {
      return { notRecorded: true, error: 'Invalid choice' };
>>>>>>> main
    }

    return {};
  }

  tally() {}

  shouldTally() {}
}

module.exports = {
  VotingMachine,
};
