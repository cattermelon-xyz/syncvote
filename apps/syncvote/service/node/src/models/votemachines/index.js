const moment = require('moment');

class VotingMachine {
  constructor(props) {
    const {
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
      children,
      props: data,
      mission_id,
      m_parent,
    } = props;
    this.duration = duration;
    this.cvd_created_at = cvd_created_at;
    this.mission_id = mission_id;
    this.who = who;
    this.delays = delays;
    this.delayUnits = delayUnits;
    this.result = result;
    this.startToVote = startToVote;
    this.endedAt = endedAt;
    this.tallyResult = tallyResult;
    this.participation = JSON.parse(participation || `{}`);
    this.children = children;
    this.data = data;
    this.m_parent = m_parent;
  }

  initDataForCVD() {
    return {};
  }

  fallBack() {
    // check if this checkpoint is outdate
    const startToVoteMoment = moment(this.startToVote).unix();
    const now = moment().unix();

    if (now > startToVoteMoment + this.duration) {
      return {
        fallback: true,
        error: 'This checkpoint suppose to be closed',
      };
    }

    return {};
  }

  recordVote(voteData) {
    if (!voteData.identify) {
      return {
        notRecorded: true,
        error: `VoteData missing identity`,
      };
    }

    if (this.endedAt) {
      return {
        notRecorded: true,
        error: `This checkpoint is ended`,
      };
    }

    const startToVoteMoment = moment(this.startToVote).unix();
    const now = moment().unix();
    // check if this checkpoint is not ready to vote
    if (now - startToVoteMoment < 0) {
      return {
        notRecorded: true,
        error: `This checkpoint was not ready to vote`,
      };
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
